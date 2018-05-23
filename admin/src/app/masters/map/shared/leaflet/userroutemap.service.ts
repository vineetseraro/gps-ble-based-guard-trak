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
export class UserroutemapService implements LoggedInCallback {
    credentials: any;
    isError = false;
    lat = 28.7041;
    lng = 77.1025;
    zoom = 10;
    locations: any;
    latlngbounds: any;
    userMap: any;
    locatorType: string;
    userId: string;
    callback: (string) => void;
    icons: any;
    auth: boolean;
    locatorTypeObj: any;
    client: any;

    /**
     * Creates an instance of UserroutemapService.
     * @param {CognitoUtil} cognitoUtil
     * @param {SigV4Utils} sigV4Utils
     * @param {LocatortypeFactory} locatorTypeFactory
     * @param {MapService} mapService
     * @memberof UserroutemapService
     */
    constructor(
        public cognitoUtil: CognitoUtil,
        public userService: UserLoginService,
        private sigV4Utils: SigV4Utils,
        private locatorTypeFactory: LocatortypeFactory,
        private globalService: GlobalService
    ) {
        this.icons = this.globalService.getIconList('empTrack');
    }

    isLoggedIn(message: string, isLoggedIn: boolean) {
        message;
        this.auth = isLoggedIn;
        this.authenticateCognito(isLoggedIn);
    }

    /**
     * initQueue method authenticate with cognito for using AWS Services
     *
     * @param {string} userId
     * @param {string} locatorType
     * @param {*} locations
     * @param {*} callback
     * @memberof UserroutemapService
     */
    initQueue(userId: string, locatorType: string, locations: any, callback: any) {
        locations;
        this.userId = userId;
        this.callback = callback;
        this.locatorType = locatorType;

        this.userMap = {};

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
     * @memberof UserroutemapService
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
     * @memberof UserroutemapService
     */
    convertStringToNumber(value: string): number {
        return +value;
    }

    /**
     * Process JSON message came from IOT MQTT & send results to google map
     *
     * @param {*} message
     * @memberof UserroutemapService
     */
    processMessage(message: any) {
        const that = this;
        let dtvalue;
        let rlat: any;
        let rlon: any;
        let userLatestLocation;

        try {
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

            if ( this.userId ===  idFieldValue ) {
                if (lName !== null) {
                    console.log('User KNOWN LOCATION');
                    userLatestLocation = {
                        id: arrivedData.location.addresses.id,
                        key : arrivedData.location.addresses.id,
                        lat: Number(rlat),
                        lng: Number(rlon),
                        location: arrivedData.location.addresses.name,
                        dt: dtvalue,
                        lastTracked: 0,
                        icon: that.icons.employees
                    }
                } else {
                    console.log('User IN UNKNOWN LOCATION');
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
                    userLatestLocation = {
                        id: null,
                        key : Number(rlat) + '/' + Number(rlon),
                        lat: Number(rlat),
                        lng: Number(rlon),
                        location: lName,
                        dt: dtvalue,
                        lastTracked: 0,
                        icon: that.icons.employees
                    }
                }
            }
            console.log('userLatestLocation >>>>>>>>>>>>>');
            console.log(userLatestLocation);
            this.callback(userLatestLocation);
        } catch (e) {
            this.isError = true;
            console.log('error! ');
            console.log(e);
        }
    }

}
