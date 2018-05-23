import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';


declare var AWS: any;
// declare var AMA: any;

export interface Callback {
    callback(): void;
    callbackWithParam(result: any): void;
}

@Injectable()
export class AwsUtil {
    public static firstLogin = false;
    public static runningInit = false;
    public static _REGION = environment.region;
    public static _IDENTITY_POOL_ID = environment.identityPoolId;
    public static _USER_POOL_ID = environment.projectId;
    public static _CLIENT_ID = environment.userPoolClientId;
    

    static getCognitoParametersForIdConsolidation(idTokenJwt: string): {} {
        // console.log('AwsUtil: enter getCognitoParametersForIdConsolidation()');
        const url:any = 'cognito-idp.' + AwsUtil._REGION.toLowerCase() + '.amazonaws.com/' + AwsUtil._USER_POOL_ID;
        const logins: Array<string> = [];
        logins[url] = idTokenJwt;
        const params = {
            IdentityPoolId: AwsUtil._IDENTITY_POOL_ID, /* required */
            Logins: logins
        };

        return params;
    }

    constructor() {
        AWS.config.region = AwsUtil._REGION;
    }

    /**
     * This is the method that needs to be called in order to init the aws global creds
     */
    initAwsService(callback: Callback, isLoggedIn: boolean, idToken: string) {

        if (AwsUtil.runningInit) {
            // Need to make sure I don't get into an infinite loop here, so need to exit if this method is running already
            // console.log('AwsUtil: Aborting running initAwsService()...it\'s running already.');
            // instead of aborting here, it's best to put a timer
            if (callback != null) {
                callback.callback();
                callback.callbackWithParam(null);
            }
            return;
        }

        // console.log('AwsUtil: Running initAwsService()');
        AwsUtil.runningInit = true;

        // First check if the users is authenticated already
        if (isLoggedIn) {
            this.setupAWS(isLoggedIn, callback, idToken);
        }

    }


    /**
     * Sets up the AWS global params
     *
     * @param isLoggedIn
     * @param callback
     */
    setupAWS(isLoggedIn: boolean, callback: Callback, idToken: string): void {
        // console.log('AwsUtil: in setupAWS()');
        if (isLoggedIn) {
            // console.log('AwsUtil: User is logged in');
            // Setup mobile analytics
            // const options = {
            //     appId: AwsUtil._CLIENT_ID,
            //     appTitle: 'Stryker - Trackit Rep'
            // };
            // const mobileAnalyticsClient = new AMA.Manager(options);
            // mobileAnalyticsClient.submitEvents();
            this.addCognitoCredentials(idToken);
        } else {
            // console.log('AwsUtil: User is not logged in');
        }

        if (callback != null) {
            callback.callback();
            callback.callbackWithParam(null);
        }
        AwsUtil.runningInit = false;
    }

    addCognitoCredentials(idTokenJwt: string): void {
        const params = AwsUtil.getCognitoParametersForIdConsolidation(idTokenJwt);

        AWS.config.credentials = new AWS.CognitoIdentityCredentials(params);
        AWS.config.credentials.get(function (err:any) {
            if (!err) {
                if (AwsUtil.firstLogin) {
                    AwsUtil.firstLogin = false;
                }
            }
        });
    }

}
