import { MapsAPILoader } from '@agm/core';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { environment } from '../../../../../environments/environment';
import { CognitoUtil, LoggedInCallback, UserLoginService } from '../../../../core/aws/cognito.service';
import { MapService } from './../shared/map.service';
import { Paho } from './../shared/mqtt';
import { SigV4Utils } from './../shared/sigv4utils.service';
import { LocatortypeFactory } from './locators/locatortype.factory';

declare var AWS: any;
declare var google: any;

/**
 * Locationmap Service for locator type maps data processing
 *
 * @export
 * @class LocatormapService
 */
@Injectable()
export class LocatormapService implements LoggedInCallback {
  credentials: any;
  isError = false;
  lat = 28.7041;
  lng = 77.1025;
  zoom = 10;
  locations: any;
  latlngbounds: any;
  knownLocations: any;
  unknownLocations: any;
  tLocations: any;
  itemsMap: any;
  locatorType: string;
  callback: (string) => void;
  inter = 0;
  icons: any;
  auth: boolean;
  locatorTypeObj: any;

  /**
   * Creates an instance of LocatormapService.
   * @param {CognitoUtil} cognitoUtil
   * @param {SigV4Utils} sigV4Utils
   * @param {MapsAPILoader} mapsAPILoader
   * @param {LocatortypeFactory} locatorTypeFactory
   * @param {MapService} mapService
   * @memberof LocatormapService
   */
  constructor(public cognitoUtil: CognitoUtil, public userService: UserLoginService, private sigV4Utils: SigV4Utils,
        private mapsAPILoader: MapsAPILoader, private locatorTypeFactory: LocatortypeFactory,
    private mapService: MapService ) {
      this.knownLocations = [];
      this.unknownLocations = [];
      this.tLocations = [];
      this.icons = this.mapService.getIconList();

  }

  /**
   * Callback method for authtnetication check
   *
   * @param {string} message
   * @param {boolean} isLoggedIn
   * @memberof RoutemapService
   */
  isLoggedIn(message: string, isLoggedIn: boolean) {
    message;
    this.auth = isLoggedIn;
    this.authenticateCognito(isLoggedIn);
  }

  /**
   * initQueue method authenticate with cognito for using AWS Services
   *
   * @param {string} locatorType
   * @param {*} locations
   * @param {*} callback
   * @memberof LocatormapService
   */
  initQueue(locatorType: string, locations: any, callback: any ) {
    this.callback = callback;
    this.locatorType = locatorType;
    this.locations = locations;
    this.knownLocations = locations;
    this.tLocations = locations;
    this.itemsMap = {};

    this.locatorTypeFactory.init(this.locatorType);
    this.locatorTypeObj = this.locatorTypeFactory.getLocator();


    this.userService.isAuthenticated(this);

  }

  /**
   * Authenticate with cognito & get session token
   *
   * @param {boolean} auth
   * @memberof RoutemapService
   */
  authenticateCognito(auth: boolean) {

    const self = this;
    AWS.config.region = environment.region;

    if (auth === true) {
        AWS.config.credentials.get(function(err) {
            if ( err ) {
                console.log(err);
                // return;
            } else {
                const requestUrl = self.sigV4Utils.getSignedUrl(
                    'wss',
                    'data.iot.' + environment.region + '.amazonaws.com',
                    '/mqtt',
                    'iotdevicegateway',
                    environment.region,
                    AWS.config.credentials.accessKeyId,
                    AWS.config.credentials.secretAccessKey,
                    AWS.config.credentials.sessionToken
                );
                self.initClient(requestUrl);
            }
        });
    } else {
        const credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: environment.identityPoolId,
        });

        credentials.get(function(err) {
            if ( err ) {
                console.log(err);
                // return;
            } else {
                const requestUrl = self.sigV4Utils.getSignedUrl(
                    'wss',
                    'data.iot.' + environment.region + '.amazonaws.com',
                    '/mqtt',
                    'iotdevicegateway',
                    environment.region,
                    credentials.accessKeyId,
                    credentials.secretAccessKey,
                    credentials.sessionToken
                );
                self.initClient(requestUrl);
            }
        });
    }
  }

  /**
   * Initiate AWS IOT mqtt queue for subscribe
   *
   * @param {string} requestUrl
   * @memberof LocatormapService
   */
  initClient(requestUrl: string) {
    console.log('IN INIT CLIENT');

    const clientId = String(Math.random()).replace('.', '');

    const client = new Paho.MQTT.Client(requestUrl, clientId);

    const that = this;
    const connectOptions = {
        onSuccess: function () {
            console.log('connected');
            // subscribe to the topic
            //
            console.log(that.locatorTypeObj.getDataSource())
            client.subscribe(that.locatorTypeObj.getDataSource(), {});
        },
        useSSL: true,
        keepAliveInterval: 60 * 60,
        timeout: 10,
        mqttVersion: 4,
        reconnect: true,
        onFailure: function (err: any) {
            that.isError = true;
            console.log(err);
            console.error('connect failed' + err);
        }
    };

    client.onConnectionLost = (responseObject: any) => {
        if (responseObject.errorCode !== 0) {
            console.log(' onConnectionLost:' + responseObject.errorCode + ' -- ' + responseObject.errorMessage);
            that.authenticateCognito(this.auth);
        }
    };

    client.connect(connectOptions);
    // this.locations = [];

    // let i = 0;
    // setInterval(() => this.processMessage({ "payloadString" : this.testdata(i++)}), 10000);
    client.onMessageArrived = (message:any) => {
        this.processMessage(message);
    };

  }

  /**
   * Utility method for convert string to number
   *
   * @param {string} value
   * @returns {number}
   * @memberof LocatormapService
   */
  convertStringToNumber(value: string): number {
    return +value;
  }

  /**
   * Process JSON message came from IOT MQTT & send results to google map
   *
   * @param {*} message
   * @memberof LocatormapService
   */
  processMessage(message: any) {

    console.log( this.locations );

    const that = this;
    let rlat:any;
    let rlon:any;
    let tlat;
    let tlon;
    let location;

    try {
        this.locatorTypeFactory.init(this.locatorType);
        const locatorTypeObj = this.locatorTypeFactory.getLocator();

        console.log('msg arrived: ' +  message.payloadString);
        const arrivedData = JSON.parse(message.payloadString);
        const timeStampSince = moment().subtract(5, 'm').valueOf();
        // console.log( moment().subtract(5, 'm') );
        console.log( 'timeStampSince' + timeStampSince );
        console.log( 'arrivedData.ts' + arrivedData.ts );
        // const datePipe = new DatePipe('en-US');
        if ( Number(arrivedData.location.addresses.pointCoordinates.coordinates[0]) !== 0
            && Number(arrivedData.location.addresses.pointCoordinates.coordinates[1]) !== 0 ) {
            if ( arrivedData.ts >= timeStampSince ) {

                location = '';
                // let idFieldValue = locatorTypeObj.getIdField(arrivedData);

                if ( arrivedData.location.addresses.name !== null ) {
                    console.log('KNOWN LOCATION');

                    this.tLocations = this.processLocation(this.tLocations, arrivedData, locatorTypeObj);

                } else {
                    console.log('IN UNKNOWN LOCATION');

                    if ( arrivedData.location.addresses.address[0] !== null ) {
                        location += arrivedData.location.addresses.address[0].value + ', ';
                    }
                    if ( arrivedData.location.addresses.address[1] !== null ) {
                        location += arrivedData.location.addresses.address[1].value + ', ';
                    }
                    if ( arrivedData.location.addresses.address[2] !== null ) {
                        location += arrivedData.location.addresses.address[2].value + ', ';
                    }
                    if ( arrivedData.location.addresses.address[3] !== null ) {
                        location += arrivedData.location.addresses.address[3].value + ', ';
                    }
                    location = location.substring(0, location.length - 2);
                    /*if ( arrivedData.location.addresses.country !== null ) {
                        location += ',' + arrivedData.location.addresses[0].country;
                    }*/

                    rlat = Number(arrivedData.location.addresses.pointCoordinates.coordinates[1]).toFixed(4);
                    rlon = Number(arrivedData.location.addresses.pointCoordinates.coordinates[0]).toFixed(4);

                    let unknownLocationExists = false;
                    this.tLocations.forEach((row: any, idx: any) => {
                        idx;
                        tlat = Number(row.lat).toFixed(4);
                        tlon = Number(row.lng).toFixed(4);
                        if (tlat === rlat && tlon === rlon ) {
                            unknownLocationExists = true;
                        }
                    });

                    if (unknownLocationExists === false) {
                        this.tLocations.push({
                            id: null,
                            key : Number(rlat) + '/' + Number(rlon),
                            lat: Number(rlat),
                            lng: Number(rlon),
                            location: location,
                            animation: google.maps.Animation.DROP,
                            itemCount : this.mapService.getIconText(''),
                            items: [],
                            lastTracked: 0,
                            icon: this.mapService.getIcon(that.icons.unknown_items)
                        });
                    }

                    this.tLocations = this.processLocation( this.tLocations, arrivedData, locatorTypeObj);
                }
                this.locations = this.tLocations;

                this.callback(this.locations);
                // console.log(this.locations);
                // this.refreshMap();
            }
        }
    } catch (e) {
        this.isError = true;
        console.log('error! ' + e);
    }
  }

  /**
   * Refresh map after change in map data
   *
   * @memberof LocatormapService
   */
  refreshMap( ) {
    // set fitBounds here
    const that = this;
    console.log(this.locations);
    this.mapsAPILoader.load().then(() => {
        that.latlngbounds = new google.maps.LatLngBounds();
        that.locations.forEach(( loc ) => {
            that.latlngbounds.extend(new google.maps.LatLng(loc.lat, loc.lng));
        });
    });
  }


  /**
   * Process location data
   *
   * @param {*} tLocations
   * @param {*} arrivedData
   * @param {*} locatorTypeObj
   * @returns
   * @memberof LocatormapService
   */
  processLocation(tLocations: any, arrivedData: any, locatorTypeObj: any) {
    const idFieldValue = locatorTypeObj.getIdField(arrivedData);
    const lastLocKey = this.itemsMap[idFieldValue];
    const that = this;
    let rlat:any;
    let rlon:any;
    let dtvalue;

    rlat = Number(arrivedData.location.addresses.pointCoordinates.coordinates[1]).toFixed(4);
    rlon = Number(arrivedData.location.addresses.pointCoordinates.coordinates[0]).toFixed(4);

    let cLocKey:any = null;
    if (arrivedData.location.addresses.id == null) {
        cLocKey = Number(rlat) + '/' + Number(rlon);
    } else {
        cLocKey = arrivedData.location.addresses.id;
    }

    const datePipe = new DatePipe('en-US');

    let cLocIdx = -1;
    tLocations.forEach((row: any, idx: any) => {
        if (row.key === cLocKey ) {
            cLocIdx = idx;
        }
    });

    let lastLocIdx = -1;
    tLocations.forEach((row: any, idx: any) => {
        if (row.key === lastLocKey ) {
            lastLocIdx = idx;
        }
    });

    // If Product comes at different location
    if (lastLocKey !== cLocKey) {
        // If product previous location exists
        if (lastLocKey !== null && lastLocKey !== undefined) {
            if ( tLocations[lastLocIdx] !== undefined) {
                // Remove product from previous location
                if ( tLocations[lastLocIdx].items !== undefined) {
                    let removeItemIdx = -1;

                    tLocations[lastLocIdx].items.forEach((prow, pidx) => {
                        prow;
                        if ( tLocations[lastLocIdx].items[pidx].itemId === idFieldValue ) {
                            removeItemIdx = pidx;
                        }

                        if (removeItemIdx !== -1 ) {
                            tLocations[lastLocIdx].items.splice(removeItemIdx, 1);
                        }
                    });
                    if (tLocations[lastLocIdx].items.length > 0) {
                        tLocations[lastLocIdx].itemCount =
                            this.mapService.getIconText(tLocations[lastLocIdx].items.length.toString());
                    } else {
                        tLocations[lastLocIdx].itemCount = this.mapService.getIconText('');
                    }
                    if ( tLocations[lastLocIdx].items.length === 0) {
                        if (tLocations[lastLocIdx].id === null) {
                            tLocations.splice(lastLocIdx, 1);
                        } else {
                            tLocations[lastLocIdx].icon = this.mapService.getIcon(this.icons.known_noitems);
                        }
                    }
                }
            }
        }
        tLocations.forEach((row: any, idx: any) => {
            if (row.key === cLocKey ) {
                cLocIdx = idx;
            }
        });
        // Add product at latest location
        tLocations[cLocIdx].items.push( {
            itemId : idFieldValue,
            detailsUrl : locatorTypeObj.getDetailsUrl(),
            fields : locatorTypeObj.getFields(arrivedData)
        });

        // this.locations[idx].productCount = this.locations[idx].products.length.toString();
        if (tLocations[cLocIdx].items.length > 0) {
            tLocations[cLocIdx].itemCount = this.mapService.getIconText(tLocations[cLocIdx].items.length.toString());
        }

        if (tLocations[cLocIdx].id !== null) {
            tLocations[cLocIdx].icon = this.mapService.getIcon(this.icons.known_items);
        } else {
            tLocations[cLocIdx].icon = this.mapService.getIcon(this.icons.unknown_items);
        }

        that.itemsMap[idFieldValue] = cLocKey;
    }

    tLocations[cLocIdx].items.forEach( (prow, pidx) => {
        if ( prow.itemId ===  idFieldValue) {
            tLocations[cLocIdx].items[pidx].fields.forEach((irow:any, iidx:any) => {
                if (irow.name === 'dt') {
                    dtvalue = datePipe.transform(arrivedData.ts, environment.mapDateTimeFormat);
                    tLocations[cLocIdx].items[pidx].fields[iidx].value = dtvalue;
                }
            });
        }
    });

    return tLocations;
  }

}

