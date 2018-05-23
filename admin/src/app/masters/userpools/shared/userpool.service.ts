import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

import { environment } from '../../../../environments/environment';
import { CognitoUtil } from '../../../core/aws/cognito.service';
import { UserPoolModel } from './userpool.model';

// import { UserProfileSaveRequest } from '../../users/shared/user.model';

declare var AWS: any;
@Injectable()
export class UserPoolService {

    constructor(public cognitoUtil: CognitoUtil) {
    }

    addCustomAttributes(userData: any) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {};
        params['CustomAttributes'] = userData;
        params['UserPoolId'] = this.cognitoUtil.getUserPool().userPoolId;
        // console.log(params);
        const createCustomAttribute = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.addCustomAttributes(param, callback));
        return createCustomAttribute(params);
    }

    describeUserPool(): Observable<UserPoolModel> {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId
        };

        const poolDetails = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.describeUserPool(param, callback));
        return poolDetails(params)
            .map((res:any) => <UserPoolModel>res['UserPool']);
    }

    updateUserPool(userData) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        userData.UserPoolId = this.cognitoUtil.getUserPool().userPoolId;
        const poolUpdate = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.updateUserPool(param, callback));
        return poolUpdate(userData);
    }

    getCsvHeader() {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.getCSVHeader(param,
                callback));
        return observableFunction(params);
    }
}

@Injectable()
export class UserPoolGroupService {

    constructor(public cognitoUtil: CognitoUtil) {
    }

    /**
     * Create a new group
     * @param {object} groupData
     */
    createGroup(groupData: any) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        groupData.UserPoolId = this.cognitoUtil.getUserPool().userPoolId;
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.createGroup(param, callback));
        return observableFunction(groupData);
    }

    /**
     * Get all groups count
     * @param
     */
    groupsCount(event: any) {
        event;
         const params = {
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId,
        };
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.listGroups(param,
                callback));
        return observableFunction(params).map((res: any) => res['Groups'].length);
    }

    /**
     * Get all groups from a userpool
     * @param
     */
    listGroups(event: any, nextToken) {
         const params = {
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId,
        };
        if ( event.rows !== '' ) {
            params['Limit'] = event.rows;
        }
        if ( nextToken !== '' ) {
            params['NextToken'] = nextToken;
        }
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.listGroups(param,
                callback));
        return observableFunction(params).map((res: any) => res);
    }

    /**
     * Update group details
     * @param {object} groupName
     */
    updateGroup(groupData: any) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        groupData.UserPoolId = this.cognitoUtil.getUserPool().userPoolId;
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.updateGroup(param, callback));
        return observableFunction(groupData);
    }

    /**
     * Delete group
     * @param {string} groupName
     */
    deleteGroup(groupName: string) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            GroupName: groupName,
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.deleteGroup(param, callback));
        return observableFunction(params);
    }

    /**
     * Get group details
     * @param {string} groupName
     */
    getGroup(groupName: string) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            GroupName: groupName,
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.getGroup(param, callback));
        return observableFunction(params);
    }

    /**
     * List users from a userpool's group
     * @param {string} groupName
     */
    listUsersInGroup(groupName: string) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            GroupName: groupName, /* required */
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId, /* required */
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.listUsersInGroup(param, callback));
        return observableFunction(params);
    }

    /**
     * Add user to group
     * @param {object} groupData
     */
    adminAddUserToGroup(groupData: any) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        groupData.UserPoolId = this.cognitoUtil.getUserPool().userPoolId;
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.adminAddUserToGroup(param, callback));
        return observableFunction(groupData);
    }

    /**
     * Remove user from group
     * @param {object} groupData
     */
    adminRemoveUserFromGroup(groupData: any) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        groupData.UserPoolId = this.cognitoUtil.getUserPool().userPoolId;
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.adminRemoveUserFromGroup(param,
                callback));
        return observableFunction(groupData);
    }
}

@Injectable()
export class UserPoolUserService {

    constructor(public cognitoUtil: CognitoUtil) {
    }

    /**
     * Delete a user
     * @param {string} accessToken
     */
    deleteUser(accessToken: string) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            AccessToken: accessToken
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.deleteUser(param, callback));
        return observableFunction(params);
    }

    /**
     * Get user details
     * @param {string} accessToken
     */
    getUser(accessToken: string) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            AccessToken: accessToken
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.getUser(param, callback));
        return observableFunction(params);
    }

    /**
     * Delete user as an admin
     * @param {string} username
     */
    adminDeleteUser(username: string) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId,
            Username: username
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.adminDeleteUser(param, callback));
        return observableFunction(params);
    }

    /**
     * Get user details as an admin
     * @param {string} username
     */
    adminGetUser(username: string) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId,
            Username: username
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.adminGetUser(param, callback));
        return observableFunction(params);
    }

    /**
     * Get all groups a user belong to
     * @param {string} username
     */
    adminListGroupsForUser(username: string) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
       const params = {
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId,
            Username: username
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.adminListGroupsForUser(param,
                callback));
        return observableFunction(params);
    }

    /**
     * Create a user as an admin user
     * @param {object} userData
     */
    adminCreateUser(userData: any) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });

        const userAttributes = [];
        const validAttributes = ['email',
                                // 'password',
                                'given_name',
                                'family_name',
                                'zoneinfo',
                                'phone_number',
                                'address',
                                'city',
                                'state',
                                'country',
                                'MobileNumber',
                                'zipcode',
                                'latitude',
                                'longitude',
                                'isAdminApproved',
                                'picture'];
        const customAttributes = ['city', 'state', 'country', 'MobileNumber', 'zipcode', 'latitude', 'longitude', 'isAdminApproved'];
        let ckey = '';
        for (const key in userData) {
            if (validAttributes.indexOf(key) >= 0) {
                if (userData[key] === null || userData[key] === undefined) {
                    userData[key] = '';
                }
                // check if custom attribute
                if (customAttributes.indexOf(key) >= 0) {
                    ckey = 'custom:' + key;
                } else {
                    ckey = key;
                }
                if ( ckey === 'email' ) {
                    userData[key] = userData[key].toLowerCase();
                }
                userAttributes.push({ Name: ckey, Value: String(userData[key]).trim() });
            }
        }
        // verify email from admin end
        userAttributes.push({ Name: 'email_verified', Value: 'true' });

        const params = {
            DesiredDeliveryMediums: [ 'EMAIL' ],
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId,
            Username: userData.username.toLowerCase(),
            UserAttributes: userAttributes
        };
        console.log(params);
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.adminCreateUser(param, callback));
        return observableFunction(params);
    }

    // update own attributes. Profile details update
    /**
     * Update attribute as a normal user
     * @param {object} userProfileSaveRequest
     */
    updateUserAttributes(userProfileSaveRequest: any) {
        // console.log(userProfileSaveRequest);
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const userAttributestoUpdate = [];
        const validAttributes = [
            'title',
            'email',
            'password',
            'given_name',
            'family_name',
            'zoneinfo',
            'phone_number',
            'address',
            'city',
            'state',
            'country',
            'MobileNumber',
            'zipcode',
            'latitude',
            'longitude',
            'picture'
            ];
        const customAttributes = ['city', 'state', 'country', 'MobileNumber', 'zipcode', 'latitude', 'longitude', 'title'];
        let ckey = '';
        const userAttributes = userProfileSaveRequest.UserAttributes;
        for (const key in userAttributes) {
            if (validAttributes.indexOf(key) >= 0) {
                if ( userAttributes[key] === null || userAttributes[key] === undefined) {
                    userAttributes[key] = '';
                }
                // check if custom attribute
                if (customAttributes.indexOf(key) >= 0) {
                    ckey = 'custom:' + key;
                } else {
                    ckey = key;
                }
                if ( ckey === 'email' ) {
                    userAttributes[key] = userAttributes[key].toLowerCase();
                }
                userAttributestoUpdate.push({ Name: ckey, Value: userAttributes[key] });
            }
        }

        const params = {
            AccessToken: userProfileSaveRequest.AccessToken,
            UserAttributes: userAttributestoUpdate
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.updateUserAttributes(param, callback));
        return observableFunction(params);
    }

    /**
     * Get user details
     * @param {string} key
     */
    userDetails(key = null) {
        let userData = null;
        if ( window.localStorage.getItem('userData') ) {
            userData = JSON.parse(window.localStorage.getItem('userData'));
            if ( key !== null && userData[key] !== null && userData[key] !== undefined ) {
                if ( key === 'cognito:roles' ) {
                    const roleArr = [];
                    for ( let i = 0; i < userData[key].length; i++ ) {
                        const tmpRoleArr = userData[key][i].split('/');
                        roleArr.push(tmpRoleArr[tmpRoleArr.length - 1]);
                    }
                    return roleArr;
                } else if ( key === 'cognito:preferred_role' ) {
                    const prefRoleArr = userData[key].split('/');
                    return prefRoleArr[prefRoleArr.length - 1];
                } else {
                    return userData[key];
                }
            } else {
                return userData;
            }
        }
        return userData;
    }

    /**
     * List users in a userpool
     * @param
     */
    listUsers() {
       const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
       const params = {
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId,
            AttributesToGet: [
                'sub',
                'given_name',
                'family_name'
            ]
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.listUsers(param, callback));
        return observableFunction(params);
    }


    /**
     * List user salutations
     * @param
     */
    listSalutations() {
        const salutations = [];
        salutations.push({ label: 'Select Title', value: ''});
        salutations.push({ label: 'Dr.', value: 'Dr.'});
        salutations.push({ label: 'Miss', value: 'Miss'});
        salutations.push({ label: 'Mr.', value: 'Mr.'});
        salutations.push({ label: 'Mrs.', value: 'Mrs.'});
        salutations.push({ label: 'Ms.', value: 'Ms.'});
        salutations.push({ label: 'Rev.', value: 'Rev.'});
        return salutations;
    }

}


@Injectable()
export class UserPoolClientService {

    constructor(public cognitoUtil: CognitoUtil) {
    }

    /**
     * Get all client count
     * @param
     */
    clientsCount() {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId,
            MaxResults: 60
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.listUserPoolClients(param, callback));
        return observableFunction(params).map((res: any) => res['UserPoolClients'].length);
    }

    listUserPoolClients(event: any, nextToken) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId,
            MaxResults: 60
        };
        if ( event.rows && event.rows !== '' ) {
            params['MaxResults'] = event.rows;
        }
        if ( nextToken !== '' ) {
            params['NextToken'] = nextToken;
        }
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.listUserPoolClients(param, callback));
        return observableFunction(params).map((res:any) => res);
    }


    describeUserPoolClient(userpoolid: any, clientId: any) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            UserPoolId: userpoolid,
            ClientId: clientId
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.describeUserPoolClient(param, callback));
        return observableFunction(params).map((res: any) => res['UserPoolClient']);
    }

    updateUserPoolClient(userPoolData: any) {
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId,
            ClientId: userPoolData.ClientId,
            RefreshTokenValidity: userPoolData.RefreshTokenValidity,
            ClientName: userPoolData.ClientName
        };
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.updateUserPoolClient(param, callback));
        return observableFunction(params).map((res: any) => res['UserPoolClient']);
    }

}

@Injectable()
export class UserPoolApiService {

    constructor(public cognitoUtil: CognitoUtil) {
    }

    getRestApis() {
        const apigateway = new AWS.APIGateway({ apiVersion: '2015-07-09' });
        console.log(apigateway);
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => apigateway.getRestApis(param, callback));
        return observableFunction({});
    }
    getResources(id: string) {
        const apigateway = new AWS.APIGateway({ apiVersion: '2015-07-09' });
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => apigateway.getResources(param, callback));
        return observableFunction({
            restApiId: id,
            embed: [
                'methods'
            ]
        });
    }
    getResource(params: any) {
        const apigateway = new AWS.APIGateway({ apiVersion: '2015-07-09' });
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => apigateway.getResource(param, callback));
        return observableFunction(params);
    }
    getIntegration(params: any) {
        const apigateway = new AWS.APIGateway({ apiVersion: '2015-07-09' });
        const observableFunction = Observable.bindNodeCallback((param,
            callback) => apigateway.getIntegration(param, callback));
        return observableFunction(params);
    }
}


@Injectable()
export class UserPoolNoAuthService {

    constructor(public cognitoUtil: CognitoUtil) {

    }

    getAWSInstance() {
        AWS.config.region = environment.region;
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: environment.identityPoolId,
        });
        AWS.config.credentials.get(function(err) {
            if ( err ) {
                // console.log(err);
            }
        });
    }

    describeUserPool(): Observable<UserPoolModel> {
        this.getAWSInstance();
        const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
        const params = {
            UserPoolId: this.cognitoUtil.getUserPool().userPoolId
        };

        const poolDetails = Observable.bindNodeCallback((param,
            callback) => cognitoidentityserviceprovider.describeUserPool(param, callback));
        return poolDetails(params)
            .map((res: any) => <UserPoolModel>res['UserPool']);
    }

    /**
     * List user salutations
     * @param
     */
    listSalutations() {
        const salutations = [];
        salutations.push({ label: 'Select Title', value: ''});
        salutations.push({ label: 'Dr.', value: 'Dr.'});
        salutations.push({ label: 'Miss', value: 'Miss'});
        salutations.push({ label: 'Mr.', value: 'Mr.'});
        salutations.push({ label: 'Mrs.', value: 'Mrs.'});
        salutations.push({ label: 'Ms.', value: 'Ms.'});
        salutations.push({ label: 'Rev.', value: 'Rev.'});
        return salutations;
    }
}
