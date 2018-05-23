import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { CognitoUtil, LoggedInCallback, UserLoginService } from '../../../../core/aws/cognito.service';
import { LocatortypeFactory } from '../../../../core/widget/maps/locatormap/locators/locatortype.factory';
import { Paho } from '../../../../core/widget/maps/shared/mqtt';
import { SigV4Utils } from '../../../../core/widget/maps/shared/sigv4utils.service';
import { environment } from './../../../../../environments/environment';
import { GlobalService } from './../../../../core/global.service';

declare var AWS: any;

/**
 * leafletmap Service for locator type maps data processing
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
    client: any;
userId:any;

    /**
     * Creates an instance of LocatormapService.
     * @param {CognitoUtil} cognitoUtil
     * @param {SigV4Utils} sigV4Utils
     * @param {LocatortypeFactory} locatorTypeFactory
     * @param {MapService} mapService
     * @memberof LocatormapService
     */
    constructor(
        public cognitoUtil: CognitoUtil,
        public userService: UserLoginService,
        private sigV4Utils: SigV4Utils,
        private locatorTypeFactory: LocatortypeFactory,
        private globalService: GlobalService 
    ) {
        this.knownLocations = [];
        this.unknownLocations = [];
        this.tLocations = [];
        let iconFor = '';
        if ( this.locatorType == 'user' ) {
            iconFor = 'empTrack';
        }
        this.icons = this.globalService.getIconList(iconFor);
    }

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
    initQueue(locatorType: string, locations: any, callback: any, userId = null) {
        this.callback = callback;
        this.locatorType = locatorType;
        this.locations = locations;
        this.knownLocations = locations;
        this.tLocations = locations;
        this.itemsMap = {};
        this.userId = userId;

        this.locatorTypeFactory.init(this.locatorType);
        this.locatorTypeObj = this.locatorTypeFactory.getLocator();

        this.userService.isAuthenticated(this);
    }

    authenticateCognito(auth: boolean) {
        const self = this;
        AWS.config.region = environment.region;

        if (auth === true) {
            AWS.config.credentials.get(function (err:any) {
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

            credentials.get(function (err:any) {
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
     * @memberof LocatormapService
     */
    initClient(requestUrl: string) {
        console.log('IN INIT CLIENT');
        const clientId = String(Math.random()).replace('.', '');

        this.client = new Paho.MQTT.Client(requestUrl, clientId);

        const that = this;
        const connectOptions = {
            onSuccess: function () {
                console.log('connected');
                // subscribe to the topic
                console.log(that.locatorTypeObj.getDataSource())
                that.client.subscribe(that.locatorTypeObj.getDataSource(), {});
            },
            useSSL: true,
            keepAliveInterval: 60 * 60,
            timeout: 10,
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

        this.client.onMessageArrived = (message:any) => {
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

        console.log(this.locations);

        try {

            const locatorTypeObj = this.locatorTypeObj;

            console.log('msg arrived: ' + message.payloadString);
            const arrivedData = JSON.parse(message.payloadString);
            const timeStampSince = moment().subtract(5, 'm').valueOf();

            // console.log( moment().subtract(5, 'm') );
            console.log('timeStampSince' + timeStampSince);
            console.log('arrivedData.ts' + arrivedData.ts);

            if (Number(arrivedData.location.addresses.pointCoordinates.coordinates[0]) !== 0
                && Number(arrivedData.location.addresses.pointCoordinates.coordinates[1]) !== 0) {
                if (arrivedData.ts >= timeStampSince) {
                    let idFieldValue = locatorTypeObj.getIdField(arrivedData);
                    // check if userId passed to filter user data only
                    if ( this.userId !== null ) {
                        if ( this.userId === idFieldValue ) {
                            this.prepareLocation(arrivedData);
                        }
                    } else {
                        this.prepareLocation(arrivedData);
                    }

                    this.locations = this.tLocations;
                    this.callback(this.locations);
                }
            }
        } catch (e) {
            this.isError = true;
            console.log(e);
            console.log('error! ' + e);
        }
    }

    prepareLocation (arrivedData) {
        const self = this;
        const locatorTypeObj = this.locatorTypeObj;
        let location = '';
        if (arrivedData.location.addresses.name !== null) {
            console.log('KNOWN LOCATION');
            this.tLocations = this.processLocation(this.tLocations, arrivedData, locatorTypeObj);
        } else {
            console.log('IN UNKNOWN LOCATION');
            location = [
                arrivedData.location.addresses.address[0].value,
                arrivedData.location.addresses.address[1].value,
                arrivedData.location.addresses.address[2].value,
                arrivedData.location.addresses.address[3].value
            ].join(', ');
            if (location.trim() === '') {
                location = 'NA';
            }

            const rlat = Number(arrivedData.location.addresses.pointCoordinates.coordinates[1]).toFixed(4);
            const rlon = Number(arrivedData.location.addresses.pointCoordinates.coordinates[0]).toFixed(4);

            let unknownLocationExists = false;
            this.tLocations.forEach((row: any, idx: any) => {
                idx;
                const tlat = Number(row.lat).toFixed(4);
                const tlon = Number(row.lng).toFixed(4);
                if (tlat === rlat && tlon === rlon) {
                    unknownLocationExists = true;
                }
            });

            if (unknownLocationExists === false) {
                this.tLocations.push({
                    id: null,
                    key: Number(rlat) + '/' + Number(rlon),
                    lat: Number(rlat),
                    lng: Number(rlon),
                    location: location,
                    items: [],
                    lastTracked: 0,
                    icon: self.icons.unknown_items
                });
            }

            this.tLocations = this.processLocation(this.tLocations, arrivedData, locatorTypeObj);
        }        
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

        const rlat = Number(arrivedData.location.addresses.pointCoordinates.coordinates[1]).toFixed(4);
        const rlon = Number(arrivedData.location.addresses.pointCoordinates.coordinates[0]).toFixed(4);

        let cLocKey:any = null;
        if (arrivedData.location.addresses.id == null) {
            cLocKey = Number(rlat) + '/' + Number(rlon);
        } else {
            cLocKey = arrivedData.location.addresses.id;
        }

        let cLocIdx = -1;
        tLocations.forEach((row: any, idx: any) => {
            if (row.key === cLocKey) {
                cLocIdx = idx;
            }
        });

        let lastLocIdx = -1;
        tLocations.forEach((row: any, idx: any) => {
            if (row.key === lastLocKey) {
                lastLocIdx = idx;
            }
        });

        // If Product comes at different location
        if (lastLocKey !== cLocKey) {
            // If product previous location exists
            if (lastLocKey !== null && lastLocKey !== undefined) {
                if (tLocations[lastLocIdx] !== undefined) {
                    // Remove product from previous location
                    if (tLocations[lastLocIdx].items !== undefined) {
                        let removeItemIdx = -1;

                        tLocations[lastLocIdx].items.forEach((prow, pidx) => {
                            prow;
                            if (tLocations[lastLocIdx].items[pidx].itemId === idFieldValue) {
                                removeItemIdx = pidx;
                            }
                            if (removeItemIdx !== -1) {
                                tLocations[lastLocIdx].items.splice(removeItemIdx, 1);
                            }
                        });
                        if (tLocations[lastLocIdx].items.length > 0) {
                            // this.mapService.getIconText(tLocations[lastLocIdx].items.length.toString());
                        } else {
                            // tLocations[lastLocIdx].itemCount = this.mapService.getIconText('');
                        }
                        if (tLocations[lastLocIdx].items.length === 0) {
                            if (tLocations[lastLocIdx].id === null) {
                                tLocations.splice(lastLocIdx, 1);
                            } else {
                                tLocations[lastLocIdx].icon = this.icons.known_noitems;
                            }
                        }
                    }
                }
            }
            tLocations.forEach((row: any, idx: any) => {
                if (row.key === cLocKey) {
                    cLocIdx = idx;
                }
            });
            // Add product at latest location
            tLocations[cLocIdx].items.push({
                itemId: idFieldValue,
                detailsUrl: locatorTypeObj.getDetailsUrl(),
                fields: locatorTypeObj.getFields(arrivedData)
            });

            if (tLocations[cLocIdx].id !== null) {
                tLocations[cLocIdx].icon = this.icons.known_items;
            } else {
                tLocations[cLocIdx].icon = this.icons.unknown_items;
            }

            that.itemsMap[idFieldValue] = cLocKey;
        }

        if(typeof tLocations[cLocIdx].items !== 'undefined') {
            tLocations[cLocIdx].items.forEach((prow, pidx) => {
                if (prow.itemId === idFieldValue) {
                    tLocations[cLocIdx].items[pidx].fields.forEach((irow:any, iidx:any) => {
                        if (irow.name === 'dt') {
                            tLocations[cLocIdx].items[pidx].fields[iidx].value = this.globalService.formatUserDate(arrivedData.ts);
                        }
                    });
                }
            });
        }

        return tLocations;
    }

    /**
     * Get icons list [ DEPCRECATED : MOVED IN GLOBAL SERVICE ]
     *
     * @returns {*}
     * @memberof LocatormapService
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

