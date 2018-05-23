import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { environment } from '../../../../../environments/environment';
import { CognitoUtil, LoggedInCallback, UserLoginService } from '../../../../core/aws/cognito.service';
import { LocatortypeFactory } from '../../../../core/widget/maps/locatormap/locators/locatortype.factory';
import { Paho } from '../../../../core/widget/maps/shared/mqtt';
import { SigV4Utils } from '../../../../core/widget/maps/shared/sigv4utils.service';
import { GlobalService } from './../../../../core/global.service';

declare var AWS: any;
// declare var google: any;

/**
 * Routemap Service for route type maps data processing
 *
 * @export
 * @class RoutemapService
 */
@Injectable()
export class RoutemapService implements LoggedInCallback {
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
    itemid: string;
    callback: (string) => void;
    icons: any;
    auth: boolean;
    locatorTypeObj: any;
    client: any;

    /**
     * Creates an instance of RoutemapService.
     * @param {CognitoUtil} cognitoUtil
     * @param {SigV4Utils} sigV4Utils
     * @param {MapsAPILoader} mapsAPILoader
     * @param {LocatortypeFactory} locatorTypeFactory
     * @param {MapService} mapService
     * @memberof RoutemapService
     */
    constructor(
        public cognitoUtil: CognitoUtil,
        public userService: UserLoginService,
        private sigV4Utils: SigV4Utils,
        private locatorTypeFactory: LocatortypeFactory,
        private globalService: GlobalService
        // private mapService: MapService
    ) {
        this.knownLocations = [];
        this.unknownLocations = [];
        this.tLocations = [];
        this.icons = this.globalService.getIconList();
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        message;
        this.auth = isLoggedIn;
        this.authenticateCognito(isLoggedIn);
    }

    /**
     * initQueue method authenticate with cognito for using AWS Services
     *
     * @param {string} itemid
     * @param {string} locatorType
     * @param {*} locations
     * @param {*} callback
     * @memberof RoutemapService
     */
    initQueue(itemid: string, locatorType: string, locations: any, callback: any) {
        this.itemid = itemid;
        this.callback = callback;
        this.locatorType = locatorType;
        // this.locations = locations;
        this.knownLocations = locations;
        this.tLocations = locations;
        this.itemsMap = {};

        this.locatorTypeFactory.init(this.locatorType);
        this.locatorTypeObj = this.locatorTypeFactory.getLocator();

        this.userService.isAuthenticated(this);
    }

    authenticateCognito(auth: boolean) {

        const self = this;
        AWS.config.region = environment.region;

        if (auth === true) {
            AWS.config.credentials.get(function (err: any) {
                if (err) {
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

            // AWS.config.credentials.get(function(err) {
            credentials.get(function (err: any) {
                if (err) {
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
     * @memberof RoutemapService
     */
    initClient(requestUrl: string) {

        console.log('IN INIT CLIENT');
        const clientId = String(Math.random()).replace('.', '');
        this.client = new Paho.MQTT.Client(requestUrl, clientId);
        const that = this;
        const connectOptions = {
            onSuccess: function () {
                console.log('connected');
                // subscribe to the drawing
                that.client.subscribe(that.locatorTypeObj.getDataSource(), {});
            },
            useSSL: true,
            timeout: 10,
            keepAliveInterval: 60 * 60,
            mqttVersion: 4,
            onFailure: function (err: any) {
                that.isError = true;
                console.log(err);
                console.error('connect failed' + err);
            }
        };

        this.client.onConnectionLost = (responseObject: any) => {
            if (responseObject.errorCode !== 0) {
                console.log(' onConnectionLost:' + responseObject.errorCode + ' -- ' + responseObject.errorMessage);
                that.authenticateCognito(this.auth);
            }
        }
        this.client.connect(connectOptions);

        this.client.onMessageArrived = (message: any) => {
            this.processMessage(message);
        };

    }


    closeQueue() {
        console.log('Disconnecting from MQTT');
        if (typeof this.client !== 'undefined' && this.client.isConnected()) {
            this.client.disconnect();
        }
    }


    /**
     * Utility method for convert string to number
     *
     * @param {string} value
     * @returns {number}
     * @memberof RoutemapService
     */
    convertStringToNumber(value: string): number {
        return +value;
    }

    /**
     * Process JSON message came from IOT MQTT & send results to google map
     *
     * @param {*} message
     * @memberof RoutemapService
     */
    processMessage(message: any) {
        // console.log(this.locations);
        const that = this;
        let dtvalue;
        let rlat: any;
        let rlon: any;
        // let tlat;
        // let tlon;
        let latestLocation;

        try {
            // // this.locatorTypeFactory.init(this.locatorType);
            // const locatorTypeObj = this.locatorTypeObj;

            // console.log('msg arrived: ' + message.payloadString);
            // const arrivedData = JSON.parse(message.payloadString);
            // const timeStampSince = moment().subtract(5, 'm').valueOf();
            // // console.log( moment().subtract(5, 'm') );
            // console.log('timeStampSince' + timeStampSince);
            // console.log('arrivedData.ts' + arrivedData.ts);
            // const datePipe = new DatePipe('en-US');

            // rlat = Number(arrivedData.location.addresses.pointCoordinates.coordinates[1]).toFixed(4);
            // rlon = Number(arrivedData.location.addresses.pointCoordinates.coordinates[0]).toFixed(4);
            // let lName = arrivedData.location.addresses.name;
            // if (lName !== null) {
            //     console.log('KNOWN LOCATION');
            //     let knownLocationExists = false;
            //     this.tLocations.forEach((row: any, idx: any) => {
            //         idx;
            //         if (row.id === arrivedData.location.addresses.id) {
            //             knownLocationExists = true;
            //         }
            //     });

            //     if (knownLocationExists === false) {
            //         dtvalue = datePipe.transform(arrivedData.ts, environment.mapDateTimeFormat);
            //         this.tLocations.push({
            //             id: arrivedData.location.addresses.id,
            //             key: arrivedData.location.addresses.id,
            //             lat: Number(rlat),
            //             lng: Number(rlon),
            //             location: arrivedData.location.addresses.name,
            //             dt: dtvalue,
            //             items: {},
            //             lastTracked: 0
            //         });
            //     }

            //     this.tLocations = this.processLocation(this.tLocations, arrivedData, locatorTypeObj);

            // } else {
            //     console.log('IN UNKNOWN LOCATION');
            //     lName = '';
            //     lName = [
            //         arrivedData.location.addresses.address[0].value,
            //         arrivedData.location.addresses.address[1].value,
            //         arrivedData.location.addresses.address[2].value,
            //         arrivedData.location.addresses.address[3].value
            //     ].join(', ');
            //     if (lName.trim() === '') {
            //         lName = 'NA';
            //     }
            //     let unknownLocationExists = false;
            //     this.tLocations.forEach((row: any, idx: any) => {
            //         idx;
            //         tlat = Number(row.lat).toFixed(4);
            //         tlon = Number(row.lng).toFixed(4);

            //         if (tlat === rlat && tlon === rlon) {
            //             unknownLocationExists = true;
            //         }
            //     });

            //     if (unknownLocationExists === false) {
            //         dtvalue = datePipe.transform(arrivedData.ts, environment.mapDateTimeFormat);

            //         this.tLocations.push({
            //             id: null,
            //             key: Number(rlat) + '/' + Number(rlon),
            //             lat: Number(rlat),
            //             lng: Number(rlon),
            //             location: lName,
            //             dt: dtvalue,
            //             items: {},
            //             lastTracked: 0,
            //             icon: that.icons.unknown_noitems
            //         });
            //     }

            //     this.tLocations = this.processLocation(this.tLocations, arrivedData, locatorTypeObj);
            // }
            // this.locations = this.tLocations;
            // this.callback(this.locations);

            const locatorTypeObj = this.locatorTypeObj;
            console.log('msg arrived: ' + message.payloadString);
            const arrivedData = JSON.parse(message.payloadString);
            const timeStampSince = moment().subtract(5, 'm').valueOf();

            const idFieldValue = locatorTypeObj.getIdField(arrivedData);

            console.log('timeStampSince' + timeStampSince);
            console.log('arrivedData.ts' + arrivedData.ts);
            const datePipe = new DatePipe('en-US');

            rlat = Number(arrivedData.location.addresses.pointCoordinates.coordinates[1]).toFixed(4);
            rlon = Number(arrivedData.location.addresses.pointCoordinates.coordinates[0]).toFixed(4);
            let lName = arrivedData.location.addresses.name;
            dtvalue = datePipe.transform(arrivedData.ts, environment.mapDateTimeFormat);
            console.log('LatestLocation >>>>>>>>>>>>>');

            if ( this.itemid ===  idFieldValue ) {
                if (lName !== null) {
                    console.log('KNOWN LOCATION');
                    latestLocation = {
                        id: arrivedData.location.addresses.id,
                        key : arrivedData.location.addresses.id,
                        lat: Number(rlat),
                        lng: Number(rlon),
                        location: arrivedData.location.addresses.name,
                        dt: dtvalue,
                        lastTracked: 0,
                        icon: that.icons.unknown_noitems
                    }
                } else {
                    console.log('IN UNKNOWN LOCATION');
                    lName = '';
                    lName = [
                        arrivedData.location.addresses.address[0].value,
                        arrivedData.location.addresses.address[1].value,
                        arrivedData.location.addresses.address[2].value,
                        arrivedData.location.addresses.address[3].value
                    ].join(', ');
                    if (lName.trim() === '') {
                        lName = 'NA';
                    }
                    dtvalue = datePipe.transform(arrivedData.ts, environment.mapDateTimeFormat);
                    latestLocation = {
                        id: null,
                        key : Number(rlat) + '/' + Number(rlon),
                        lat: Number(rlat),
                        lng: Number(rlon),
                        location: lName,
                        dt: dtvalue,
                        lastTracked: 0,
                        icon: that.icons.unknown_noitems
                    }
                }
                console.log(latestLocation);
            }
            this.callback(latestLocation);
        } catch (e) {
            this.isError = true;
            console.log('error! ');
            console.log(e);
        }
    }


    /**
     * Process location data
     *
     * @param {*} tLocations
     * @param {*} arrivedData
     * @param {*} locatorTypeObj
     * @returns
     * @memberof RoutemapService
     */
    // processLocation(tLocations: any, arrivedData: any, locatorTypeObj: any) {
    //     const idFieldValue = locatorTypeObj.getIdField(arrivedData);
    //     const lastLocKey = this.itemsMap[idFieldValue];
    //     // const addNew = true;
    //     const that = this;

    //     const rlat = Number(arrivedData.location.addresses.pointCoordinates.coordinates[1]).toFixed(4);
    //     const rlon = Number(arrivedData.location.addresses.pointCoordinates.coordinates[0]).toFixed(4);

    //     let cLocKey: any = null;
    //     if (arrivedData.location.addresses.id == null) {
    //         cLocKey = Number(rlat) + '/' + Number(rlon);
    //     } else {
    //         cLocKey = arrivedData.location.addresses.id;
    //     }

    //     let cLocIdx = -1;
    //     tLocations.forEach((row: any, idx: any) => {
    //         if (row.key === cLocKey) {
    //             cLocIdx = idx;
    //         }
    //     });

    //     let lastLocIdx = -1;
    //     tLocations.forEach((row: any, idx: any) => {
    //         if (row.key === lastLocKey) {
    //             lastLocIdx = idx;
    //         }
    //     });

    //     // If Product comes at different location
    //     if (lastLocKey !== cLocKey) {

    //         // If product previous location exists
    //         if (lastLocKey !== null && lastLocKey !== undefined) {
    //             if (tLocations[lastLocIdx] !== undefined) {
    //                 // Remove product from previous location
    //                 if (tLocations[lastLocIdx].items !== undefined) {
    //                     if (tLocations[lastLocIdx].items.itemId === idFieldValue) {
    //                         tLocations[lastLocIdx].items = {};
    //                         if (tLocations[lastLocIdx].id === null) {
    //                             tLocations[lastLocIdx].icon = this.icons.unknown_noitems;
    //                         } else {
    //                             tLocations[lastLocIdx].icon = this.icons.known_noitems;
    //                         }
    //                     }
    //                 }
    //             }
    //         }

    //         tLocations.forEach((row: any, idx: any) => {
    //             if (row.key === cLocKey) {
    //                 cLocIdx = idx;
    //             }
    //         });

    //         // Add product at latest location
    //         tLocations[cLocIdx].items = {
    //             itemId: idFieldValue,
    //             detailsUrl: locatorTypeObj.getDetailsUrl(),
    //             fields: locatorTypeObj.getFields(arrivedData)
    //         };

    //         that.itemsMap[idFieldValue] = cLocKey;
    //     }

    //     if (tLocations[cLocIdx].id === null) {
    //         tLocations[cLocIdx].icon = this.icons.unknown_items;
    //     } else {
    //         tLocations[cLocIdx].icon = this.icons.known_items;
    //     }

    //     if (tLocations[cLocIdx].items.itemId === idFieldValue) {
    //         tLocations[cLocIdx].items.fields.forEach((irow: any, iidx: any) => {
    //             iidx;
    //             if (irow.name === 'dt') {
    //                 tLocations[cLocIdx].dt = this.globalService.formatUserDate(arrivedData.ts);
    //             }
    //         });
    //     }

    //     return tLocations;
    // }

    /**
     * Get icons list
     *
     * @returns {*}
     * @memberof RoutemapService
     */
    getIconList(): any {
        return {
            'known_items': '../../../../../assets/ic_local_pharmacy_black_24px.svg',
            'known_noitems': '../../../../assets/ic_local_hospital_black_24px.svg',
            'unknown_items': '../../../../assets/ic_add_location_black_24px.svg',
            'unknown_noitems': '../../../../assets/ic_place_black_24px.svg'
        }
    }

}
