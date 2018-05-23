import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { environment } from '../../../../../environments/environment';
import { CognitoUtil, LoggedInCallback, UserLoginService } from '../../../../core/aws/cognito.service';
import { GlobalService } from '../../../../core/global.service';
import { LocatortypeFactory } from '../../../../core/widget/maps/locatormap/locators/locatortype.factory';
import { Paho } from '../../../../core/widget/maps/shared/mqtt';
import { SigV4Utils } from '../../../../core/widget/maps/shared/sigv4utils.service';

declare var AWS: any;
// declare var google: any;

/**
 * Routemap Service for route type maps data processing
 *
 * @export
 * @class ShippingmapService
 */
@Injectable()
export class ShippingmapService implements LoggedInCallback {
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
    fromAddress: any;
    toAddress: any;
    fromLocationCoords: any;
    toLocationCoords: any;
    client: any;

    /**
     * Creates an instance of ShippingmapService.
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

    setFromAddress(fromAddress: any) {
        this.fromAddress = fromAddress;
    }

    setToAddress(toAddress: any) {
        this.toAddress = toAddress;
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
    initQueue(itemid: string, locatorType: string, fromLocation: any, toLocation: any, locations: any, callback: any) {
        this.itemid = itemid;
        this.callback = callback;
        this.locatorType = locatorType;
        // this.locations = locations;
        this.knownLocations = locations;
        this.tLocations = locations;
        this.itemsMap = {};

        this.fromAddress = fromLocation;
        this.toAddress = toLocation;

        this.fromLocationCoords = fromLocation.coordinate;
        this.toLocationCoords = toLocation.coordinate;

        this.locatorTypeFactory.init(this.locatorType);
        this.locatorTypeObj = this.locatorTypeFactory.getLocator();

        this.userService.isAuthenticated(this);
    }

    closeQueue() {
        console.log('Disconnecting from MQTT');
        if (typeof this.client !== 'undefined' && this.client.isConnected()) {
            this.client.disconnect();
        }
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
        console.log(this.locations);
        const that = this;
        try {
            // this.locatorTypeFactory.init(this.locatorType);
            const locatorTypeObj = this.locatorTypeObj;

            console.log('msg arrived: ' + message.payloadString);
            const arrivedData = JSON.parse(message.payloadString);
            const timeStampSince = moment().subtract(15, 'm').valueOf();
            // console.log( moment().subtract(5, 'm') );
            console.log('timeStampSince' + timeStampSince);
            console.log('arrivedData.ts' + arrivedData.ts);
            const datePipe = new DatePipe('en-US');

            if (locatorTypeObj.isExists(this.itemid, arrivedData)) {
                if (Number(arrivedData.location.addresses.pointCoordinates.coordinates[0]) !== 0
                    && Number(arrivedData.location.addresses.pointCoordinates.coordinates[1]) !== 0) {
                    if (arrivedData.ts >= timeStampSince) {

                        const rlat = Number(arrivedData.location.addresses.pointCoordinates.coordinates[1]).toFixed(4);
                        const rlon = Number(arrivedData.location.addresses.pointCoordinates.coordinates[0]).toFixed(4);
                        let lName = arrivedData.location.addresses.name;
                        const lTracked = datePipe.transform(arrivedData.dt, environment.mapDateTimeFormat);

                        if (lName !== null) {
                            console.log('KNOWN LOCATION');
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
                        }

                        this.callback(this.getFeatures(
                            {
                                'id': that.fromAddress.id,
                                'name': 'From Location',
                                'lat': that.fromAddress.coordinates.latitude,
                                'lon': that.fromAddress.coordinates.longitude,
                                'tracked': '--'
                            },
                            {
                                'id': that.toAddress.id,
                                'name': 'To Location',
                                'lat': that.toAddress.coordinates.latitude,
                                'lon': that.toAddress.coordinates.longitude,
                                'tracked': '--'
                            },
                            {
                                'id': arrivedData.location.addresses.id,
                                'name': lName,
                                'lat': rlat,
                                'lon': rlon,
                                'tracked': lTracked,
                                'status': arrivedData.sensors.shipment.status,
                                'statusLabel': arrivedData.sensors.shipment.statusLabel
                            }
                        ));
                    }
                }
            }
        } catch (e) {
            this.isError = true;
            console.log('error! ' + e);
        }
    }

    getFeatures(fromAddress, toAddress, currAddress) {
        const fcollection = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'geometry': {
                        'type': 'Point', 'coordinates':
                            [fromAddress.lon, fromAddress.lat]
                    },
                    'type': 'Feature',
                    'properties': {
                        'lName': 'From Location', 'lId': 'FromLocation',
                        'lLocId': fromAddress.id, 'lTracked': '--',
                        'shipmentExists': false,
                        'lStatus': -1,
                        'lStatusLabel': -1
                    }
                },
                {
                    'geometry': {
                        'type': 'Point', 'coordinates':
                            [toAddress.lon, toAddress.lat]
                    },
                    'type': 'Feature',
                    'properties': {
                        'lName': 'To Location', 'lId': 'ToLocation',
                        'lLocId': toAddress.id, 'lTracked': '--',
                        'shipmentExists': false,
                        'lStatus': -1,
                        'lStatusLabel': -1
                    }
                }
            ]
        };

        if (fromAddress.id === currAddress.id) {
            fcollection.features[0].properties.shipmentExists = true;
            fcollection.features[0].properties.lStatus = currAddress.status;
            fcollection.features[0].properties.lStatusLabel = currAddress.statusLabel;
            fcollection.features[0].properties.lTracked = currAddress.tracked;
        } else if (toAddress.id === currAddress.id) {
            fcollection.features[1].properties.shipmentExists = true;
            fcollection.features[1].properties.lStatus = currAddress.status;
            fcollection.features[1].properties.lStatusLabel = currAddress.statusLabel;
            fcollection.features[1].properties.lTracked = currAddress.tracked;
        } else {
            fcollection.features.splice(1, 0, {
                'geometry': { 'type': 'Point', 'coordinates': [currAddress.lon, currAddress.lat] },
                'type': 'Feature',
                'properties': {
                    'lName': currAddress.name, 'lId': 'CurrLocation',
                    'lLocId': currAddress.id, 'lTracked': currAddress.tracked,
                    'shipmentExists': true, lStatus: currAddress.status,
                    'lStatusLabel': currAddress.statusLabel
                }
            });
        }

        return fcollection;
    }

}
