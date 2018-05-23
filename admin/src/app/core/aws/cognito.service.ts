import { environment } from '../../../environments/environment';
import { UserModel } from '../../masters/users/shared/user.model';
import { DynamoDBService } from './ddb.service';
import { Inject, Injectable } from '@angular/core';
import { LazyLoadEvent } from 'primeng/primeng';
import {Observable} from 'rxjs/Rx';
import { AwsUtil } from '../../core/aws/aws.service';
import { JwtHelper } from 'angular2-jwt/angular2-jwt';
import { ConfigurationService } from '../configuration/shared/configuration.service';
import { Router } from '@angular/router';
import * as moment from 'moment';

/**
 * Created by Vladimir Budilov
 */

declare var AWSCognito: any;
declare var AWS: any;

export interface CognitoCallback {
  cognitoCallback(message: string, result: any): void;
}

export interface LoggedInCallback {
  isLoggedIn(message: string, loggedIn: boolean): void;
}

export interface Callback {
  callback(): void;
  callbackWithParam(result: any): void;
}

@Injectable()
export class CognitoUtil {
  public static _REGION = environment.region;

  public static _IDENTITY_POOL_ID = environment.identityPoolId;
  public static _USER_POOL_ID = environment.projectId;
  public static _CLIENT_ID = environment.userPoolClientId;
  public static _POOL_DATA = {
    UserPoolId: CognitoUtil._USER_POOL_ID,
    ClientId: CognitoUtil._CLIENT_ID
  };
  public idToken = '';
  public accessToken = '';
  public refToken = '';
  public roles = Array;
  jwtHelper: JwtHelper = new JwtHelper();

  public static getAwsCognito(): any {
    return AWSCognito;
  }

  public static getAws(): any {
    return AWS;
  }

  constructor(public awsUtil: AwsUtil) {
    // get last auth user
    const lastUserKey =
      'CognitoIdentityServiceProvider.' + environment.userPoolClientId + '.LastAuthUser';
    const lastAuthUser = window.localStorage.getItem(lastUserKey);
    if (lastAuthUser) {
      const idTokenKey =
        'CognitoIdentityServiceProvider.' +
        environment.userPoolClientId +
        '.' +
        lastAuthUser +
        '.idToken';
      const idTokenFromStore = window.localStorage.getItem(idTokenKey);
      if (idTokenFromStore) {
        if (this.jwtHelper.isTokenExpired(idTokenFromStore)) {
          window.localStorage.setItem('userData', '');
          window.localStorage.setItem('apitoken', '');
          window.localStorage.setItem('permissions', '');
          this.getCurrentUser().signOut();
        }
      }
    }

    // set up aws here
    AWS.config.region = CognitoUtil._REGION;
    const self = this;

    this.getIdToken({
      callback() {},
      callbackWithParam(token: any) {
        let loginStatus = false;
        if (token !== null) {
          self.idToken = token;
          loginStatus = true;
        }
        awsUtil.initAwsService(null, loginStatus, token);
      }
    });

    this.getAccessToken({
      callback() {},
      callbackWithParam(token: any) {
        if (token !== null) {
          self.accessToken = token;
        }
      }
    });

    this.getRefreshToken({
      callback() {},
      callbackWithParam(token: any) {
        if (token !== null) {
          self.refToken = token.token;
        }
      }
    });
  }

  getUserPool() {
    return new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(CognitoUtil._POOL_DATA);
  }

  getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }

  getCognitoIdentity(): string {
    return AWS.config.credentials.identityId;
  }

  getAccessToken(callback: Callback): void {
    if (callback === null) {
      // throw ('CognitoUtil: callback in getAccessToken is null...returning');
    }
    if (this.getCurrentUser() != null) {
      this.getCurrentUser().getSession(function(err: any, session: any) {
        if (err) {
          // console.log('CognitoUtil: Can\'t set the credentials:' + err);
          callback.callbackWithParam(null);
        } else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getAccessToken().getJwtToken());
          }
        }
      });
    } else {
      callback.callbackWithParam(null);
    }
  }

  getIdToken(callback: Callback): void {
    if (callback === null) {
      // throw ('CognitoUtil: callback in getIdToken is null...returning');
    }
    if (this.getCurrentUser() != null) {
      this.getCurrentUser().getSession(function(err: any, session: any) {
        if (err) {
          // console.log('CognitoUtil: Can\'t set the credentials:' + err);
          callback.callbackWithParam(null);
        } else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getIdToken().getJwtToken());
          } else {
            // console.log('CognitoUtil: Got the id token, but the session isn\'t valid');
          }
        }
      });
    } else {
      callback.callbackWithParam(null);
    }
  }

  getRefreshToken(callback: Callback): void {
    if (callback === null) {
      throw 'CognitoUtil: callback in getRefreshToken is null...returning';
    }
    if (this.getCurrentUser() != null) {
      this.getCurrentUser().getSession(function(err: any, session: any) {
        if (err) {
          // console.log('CognitoUtil: Can\'t set the credentials:' + err);
          callback.callbackWithParam(null);
        } else {
          if (session.isValid()) {
            callback.callbackWithParam(session.getRefreshToken());
          }
        }
      });
    } else {
      callback.callbackWithParam(null);
    }
  }

  checkSession(callback: any): void {
    const idToken = this.idToken;
    if (this.jwtHelper.isTokenExpired(idToken)) {
      callback(true);
    } else {
      callback(false);
    }
  }

  /**
     * Function to get session state
     * @memberof CognitoUtil
     */
  getSessionState(): Observable<number> {
    let state = 1; // session is valid
    // need to work on refresh token
    const canGenerateNewToken = true; // session is valid

    if (canGenerateNewToken) {
      // validate id token first start

      // get last auth user
      let idTokenFromStore: any = '';
      const lastUserKey =
        'CognitoIdentityServiceProvider.' + environment.userPoolClientId + '.LastAuthUser';
      const lastAuthUser = window.localStorage.getItem(lastUserKey);
      if (lastAuthUser) {
        const idTokenKey =
          'CognitoIdentityServiceProvider.' +
          environment.userPoolClientId +
          '.' +
          lastAuthUser +
          '.idToken';
        idTokenFromStore = window.localStorage.getItem(idTokenKey);
      }

      let idToken = '';
      if (idTokenFromStore) {
        idToken = idTokenFromStore;
      } else {
        idToken = this.idToken;
      }
      // let state = 1; // session is valid
      const idExpirationDate = this.jwtHelper.getTokenExpirationDate(idToken);
      // console.log( 'session expiration date-time' );
      // console.log( moment(idExpirationDate) );

      const timeStampIDTokenExpiry = moment(idExpirationDate)
        .subtract(environment.refreshSession, 'm')
        .valueOf();
      const currTimeStamp = moment().valueOf();

      // console.log( 'current time' );
      // console.log(moment());

      // console.log( 'timeStampIDTokenExpiry' );
      // console.log(moment(timeStampIDTokenExpiry));

      if (this.jwtHelper.isTokenExpired(idToken)) {
        // ID token expired
        state = 0;
      } else if (currTimeStamp >= timeStampIDTokenExpiry) {
        // ID token is about to expire
        state = 2;
      }
      // validate id token first end
    }

    return Observable.of(state);
  }

  refresh(): void {
    const idToken = this.idToken;
    const accessToken = this.accessToken;
    // console.log( idToken );
    if (this.jwtHelper.isTokenExpired(idToken)) {
      this.getCurrentUser().getSession(function(err: any, session: any) {
        if (err) {
          console.log("CognitoUtil: Can't set the credentials:" + err);
        } else {
          if (session.isValid()) {
            AWS.config.credentials.get(function(error: any) {
              if (!error) {
                // set api token to access AWS resources here
                let apitoken = '';
                window.localStorage.setItem('apitoken', '');

                if (typeof AWS.config.credentials.accessKeyId !== 'undefined') {
                  apitoken += AWS.config.credentials.accessKeyId + '::';
                }
                if (typeof AWS.config.credentials.secretAccessKey !== 'undefined') {
                  apitoken += AWS.config.credentials.secretAccessKey + '::';
                }
                if (typeof AWS.config.credentials.sessionToken !== 'undefined') {
                  apitoken += AWS.config.credentials.sessionToken + '::';
                }
                apitoken += idToken;
                apitoken = apitoken + '::' + accessToken;
                window.localStorage.setItem('apitoken', apitoken);
              }
            });
            // console.log('CognitoUtil: refreshed successfully');
          } else {
            // console.log('CognitoUtil: refreshed but session is still not valid');
          }
        }
      });
    }
  }

  /**
     * Function to forcefully refresh session tokens
     * @memberof CognitoUtil
     */
  refreshToken(): void {
    // refresh tokens forcefully
    const refToken = this.refToken;
    const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
      apiVersion: '2016-04-18'
    });
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH' /* required */,
      ClientId: environment.userPoolClientId /* required */,
      AuthParameters: {
        // 'SECRET_HASH': 'STRING_VALUE',
        REFRESH_TOKEN: refToken
        // 'DEVICE_KEY': 'STRING_VALUE',
      }
    };

    const authJwtHelper = this.jwtHelper;
    const cgUtil = this;
    cognitoidentityserviceprovider.initiateAuth(params, function(err: any, data: any) {
      if (!err) {
        const logins = {};
        logins[
          'cognito-idp.' + CognitoUtil._REGION + '.amazonaws.com/' + CognitoUtil._USER_POOL_ID
        ] =
          data.AuthenticationResult.IdToken;

        const cognitoIdToken = data.AuthenticationResult.IdToken;

        cgUtil.idToken = cognitoIdToken;

        cgUtil.accessToken = data.AuthenticationResult.AccessToken;

        AWS.config.region = environment.region;

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID,
          Logins: logins
        });

        AWS.config.credentials.clearCachedId();
        window.localStorage.setItem(
          'userData',
          JSON.stringify(authJwtHelper.decodeToken(cognitoIdToken))
        );

        AWS.config.credentials.refresh(function() {});

        // write tokens in local storage
        const lastUserKey =
          'CognitoIdentityServiceProvider.' + environment.userPoolClientId + '.LastAuthUser';
        const lastAuthUser = window.localStorage.getItem(lastUserKey);
        if (lastAuthUser) {
          const idTokenKey =
            'CognitoIdentityServiceProvider.' +
            environment.userPoolClientId +
            '.' +
            lastAuthUser +
            '.idToken';
          const accessTokenKey =
            'CognitoIdentityServiceProvider.' +
            environment.userPoolClientId +
            '.' +
            lastAuthUser +
            '.accessToken';
          window.localStorage.setItem(idTokenKey, cognitoIdToken);
          window.localStorage.setItem(accessTokenKey, data.AuthenticationResult.AccessToken);
        }

        AWS.config.credentials.get(function(refreshErr: any) {
          if (!refreshErr) {
            // set iot policy here
            const IoT = new AWS.Iot();
            IoT.attachPrincipalPolicy(
              {
                policyName: 'Default',
                principal: AWS.config.credentials.identityId
              },
              (error: any, res: any) => {
                res;
                if (error) {
                  // console.error(err);
                } else {
                  // console.log('IOT policy attached. No error');
                }
                // Connect to AWS IoT MQTT
              }
            );

            // set api token to access AWS resources here
            let apitoken = '';
            window.localStorage.setItem('apitoken', '');
            window.localStorage.setItem('usertype', '');

            if (typeof AWS.config.credentials.accessKeyId !== 'undefined') {
              apitoken += AWS.config.credentials.accessKeyId + '::';
            }
            if (typeof AWS.config.credentials.secretAccessKey !== 'undefined') {
              apitoken += AWS.config.credentials.secretAccessKey + '::';
            }
            if (typeof AWS.config.credentials.sessionToken !== 'undefined') {
              apitoken += AWS.config.credentials.sessionToken + '::';
            }
            apitoken += cognitoIdToken;
            apitoken = apitoken + '::' + cgUtil.accessToken;
            window.localStorage.setItem('apitoken', apitoken);
            window.localStorage.setItem('usertype', 'cognito');
          }
        });
      }
    });
  }
}

@Injectable()
export class UserRegistrationService {
  constructor(@Inject(CognitoUtil) public cognitoUtil: CognitoUtil) {}

  /**
     * 
     * 
     * @param {UserModel} userData 
     * @param {CognitoCallback} callback 
     * 
     * @memberof UserRegistrationService
     */
  register(userData: UserModel, callback: CognitoCallback): void {
    // console.log('UserRegistrationService: users is ' + user);

    userData.email = userData.email.toLowerCase();

    const userAttributes = [];
    const validAttributes = [
      'title',
      'email',
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
      'picture'
    ];
    const customAttributes = [
      'city',
      'state',
      'country',
      'MobileNumber',
      'zipcode',
      'latitude',
      'longitude',
      'title'
    ];
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
        if (ckey === 'email') {
          userData[key] = userData[key].toLowerCase();
        }
        userAttributes.push({ Name: ckey, Value: String(userData[key]).trim() });
      }
    }
    // verify email from admin end
    userAttributes.push({ Name: 'custom:isAdminApproved', Value: 'no' });

    this.cognitoUtil
      .getUserPool()
      .signUp(userData.email, userData.password, userAttributes, null, function(err, result) {
        if (err) {
          callback.cognitoCallback(err.message, null);
        } else {
          callback.cognitoCallback(null, result);
        }
      });
  }

  confirmRegistration(username: string, confirmationCode: string, callback: CognitoCallback): void {
    const userData = {
      Username: username,
      Pool: this.cognitoUtil.getUserPool()
    };

    const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.confirmRegistration(confirmationCode, true, function(err, result) {
      if (err) {
        callback.cognitoCallback(err.message, null);
      } else {
        callback.cognitoCallback(null, result);
      }
    });
  }

  resendCode(username: string, callback: any): void {
    const userData = {
      Username: username,
      Pool: this.cognitoUtil.getUserPool()
    };

    const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.resendConfirmationCode(function(err: any, result: any) {
      if (err) {
        callback.resendCodeCallback(err.message, null);
      } else {
        callback.resendCodeCallback(null, result);
      }
    });
  }
}

@Injectable()
export class UserLoginService {
  date: '';
  dateTime: '';
  pagination: '';
  timezone: '';
  measurement: '';
  temperatureUnit = '';

  constructor(
    public ddb: DynamoDBService,
    public cognitoUtil: CognitoUtil,
    private configurationService: ConfigurationService,
    private router: Router
  ) {}

  authenticate(username: string, password: string, newpassword: string, callback: CognitoCallback) {
    // console.log('UserLoginService: starting the authentication');
    // Need to provide placeholder keys unless unauthorised users access is enabled for users pool

    const authenticationData = {
      Username: username,
      Password: password
    };
    const authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider
      .AuthenticationDetails(authenticationData);

    const userData = {
      Username: username,
      Pool: this.cognitoUtil.getUserPool()
    };
    const cgUtil = this.cognitoUtil;
    const authJwtHelper = this.cognitoUtil.jwtHelper;

    const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function(result) {
        const logins: any = {};
        logins[
          'cognito-idp.' + CognitoUtil._REGION + '.amazonaws.com/' + CognitoUtil._USER_POOL_ID
        ] = result.getIdToken().getJwtToken();

        const cognitoIdToken = result.getIdToken().getJwtToken();

        cgUtil.idToken = cognitoIdToken;

        cgUtil.accessToken = result.getAccessToken().getJwtToken();
        cgUtil.refToken = result.getRefreshToken().token;

        AWS.config.region = environment.region;

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID,
          Logins: logins
        });

        AWS.config.credentials.clearCachedId();
        window.localStorage.setItem(
          'userData',
          JSON.stringify(authJwtHelper.decodeToken(cognitoIdToken))
        );

        AWS.config.credentials.refresh(function(err: any) {
          if (err) {
            callback.cognitoCallback(err.message, null);
          }
        });

        AWS.config.credentials.get(function(err: any) {
          if (err) {
            callback.cognitoCallback(err.message, null);
          } else {
            // console.log(AWS.config.credentials.identityId);
            // set iot policy here
            const IoT = new AWS.Iot();
            IoT.attachPrincipalPolicy(
              {
                policyName: 'Default',
                principal: AWS.config.credentials.identityId
              },
              (error: any, res: any) => {
                res;
                if (error) {
                  // console.error(err);
                } else {
                  // console.log('IOT policy attached. No error');
                }
                // Connect to AWS IoT MQTT
              }
            );

            // set api token to access AWS resources here
            let apitoken = '';
            window.localStorage.setItem('apitoken', '');
            window.localStorage.setItem('usertype', '');

            if (typeof AWS.config.credentials.accessKeyId !== 'undefined') {
              apitoken += AWS.config.credentials.accessKeyId + '::';
            }
            if (typeof AWS.config.credentials.secretAccessKey !== 'undefined') {
              apitoken += AWS.config.credentials.secretAccessKey + '::';
            }
            if (typeof AWS.config.credentials.sessionToken !== 'undefined') {
              apitoken += AWS.config.credentials.sessionToken + '::';
            }
            apitoken += cognitoIdToken;
            apitoken = apitoken + '::' + cgUtil.accessToken;
            window.localStorage.setItem('apitoken', apitoken);
            window.localStorage.setItem('usertype', 'cognito');
            callback.cognitoCallback(null, result);
          }
        });
      },
      onFailure: function(err: any) {
        callback.cognitoCallback(err.message, null);
      },
      newPasswordRequired: function(userAttributes: any, requiredAttributes: any) {
        requiredAttributes;
        // User was signed up by an admin and must provide new
        // password and required attributes, if any, to complete
        // authentication.

        // the api doesn't accept this field back
        delete userAttributes.family_name;
        delete userAttributes.given_name;
        delete userAttributes.email;
        delete userAttributes.email_verified;
        delete userAttributes.phone_number_verified;

        if (newpassword) {
          cognitoUser.completeNewPasswordChallenge(newpassword, userAttributes, this);
        } else {
          callback.cognitoCallback('newPasswordRequired', null);
        }
      }
    });
  }

  // authenticateSocialUser(socialtype: string, event: any, callback: CognitoCallback) {

  //     // if( socialtype === 'google' ) {
  //     //     let googleUser: gapi.auth2.GoogleUser = event.googleUser;
  //     //     if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
  //     //         // let auth2 = gapi.auth2.getAuthInstance();
  //     //         // var profile = auth2.currentUser.get().getBasicProfile();
  //     //         // let userNameObj = profile.getName().split(' ');
  //     //         // // sign up user if not already in userpool
  //     //         // let userProfile = {
  //     //         //     'email': profile.getEmail(),
  //     //         //     'profileid': profile.getId(),
  //     //         //     'given_name': userNameObj[0],
  //     //         //     'family_name': userNameObj[1],
  //     //         //     'zoneinfo': 'Asia/Kolkata'
  //     //         // };

  //     //         // const attributeList = [];

  //     //         // const dataEmail = {
  //     //         //     Name: 'email',
  //     //         //     Value: userProfile.email
  //     //         // };
  //     //         // const family_name = {
  //     //         //     Name: 'family_name',
  //     //         //     Value: userProfile.family_name
  //     //         // };
  //     //         // const given_name = {
  //     //         //     Name: 'given_name',
  //     //         //     Value: userProfile.given_name
  //     //         // };
  //     //         // const zoneinfo = {
  //     //         //     Name: 'zoneinfo',
  //     //         //     Value: userProfile.zoneinfo
  //     //         // };

  //     //         // attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail));
  //     //         // attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(family_name));
  //     //         // attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(given_name));
  //     //         // attributeList.push(new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(zoneinfo));

  //     //         // this.cognitoUtil.getUserPool().signUp(userProfile.email, 'Welcome@123', attributeList, null, function (err, result) {
  //     //         //     if (err) {
  //     //         //         callback.cognitoCallback(err.message, null);
  //     //         //     }
  //     //         // });

  //     //         // Add the Google access token to the Cognito credentials login map.
  //     //         AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  //     //             IdentityPoolId: CognitoUtil._IDENTITY_POOL_ID,
  //     //             Logins: {
  //     //                 'accounts.google.com': googleUser.getAuthResponse().id_token
  //     //             }
  //     //         });

  //     //         console.log(googleUser.getAuthResponse().access_token);

  //     //         AWS.config.credentials.clearCachedId();

  //     //         AWS.config.credentials.refresh(function(err){
  //     //             if (err) {
  //     //                 callback.cognitoCallback(err.message, null);
  //     //             }
  //     //         });

  //     //         // Obtain AWS credentials
  //     //         AWS.config.credentials.get(function(err){
  //     //             if (err) {
  //     //                 callback.cognitoCallback(err.message, null);
  //     //             } else {
  //     //                 // console.log(AWS.config.credentials);
  //     //                 // set api token to access AWS resources here
  //     //                 let creds = AWS.config.credentials;
  //     //                 console.log(creds);
  //     //                 let apitoken = '';
  //     //                 window.localStorage.setItem('apitoken', '');
  //     //                 window.localStorage.setItem('usertype', '');

  //     //                 if( typeof creds.accessKeyId !== 'undefined' ) {
  //     //                     apitoken += creds.accessKeyId + '::';
  //     //                 }
  //     //                 if( typeof creds.secretAccessKey !== 'undefined' ) {
  //     //                     apitoken += creds.secretAccessKey + '::';
  //     //                 }
  //     //                 if( typeof creds.sessionToken !== 'undefined' ) {
  //     //                     apitoken += creds.sessionToken;
  //     //                 }

  //     //                 // console.log(apitoken);
  //     //                 window.localStorage.setItem('apitoken', apitoken);
  //     //                 window.localStorage.setItem('usertype', 'google');
  //     //                 callback.cognitoCallback(null, '');
  //     //             }
  //     //         });
  //     //     }
  //     // } else {
  //     //     callback.cognitoCallback('Some error occurred', null);
  //     // }

  // }

  forgotPassword(username: string, callback: CognitoCallback) {
    const userData = {
      Username: username,
      Pool: this.cognitoUtil.getUserPool()
    };

    const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: function(result: any) {
        result;
      },
      onFailure: function(err: any) {
        callback.cognitoCallback(err.message, null);
      },
      inputVerificationCode() {
        callback.cognitoCallback(null, null);
      }
    });
  }

  confirmNewPassword(
    email: string,
    verificationCode: string,
    password: string,
    callback: CognitoCallback
  ) {
    const userData = {
      Username: email,
      Pool: this.cognitoUtil.getUserPool()
    };

    const cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.confirmPassword(verificationCode, password, {
      onSuccess: function(result) {
        callback.cognitoCallback(null, result);
      },
      onFailure: function(err: any) {
        callback.cognitoCallback(err.message, null);
      }
    });
  }

  logout() {
    // console.log('UserLoginService: Logging out');
    // this.ddb.writeLogEntry('logout');
    window.localStorage.removeItem('userData');
    window.localStorage.removeItem('apitoken');
    window.localStorage.removeItem('permissions');
    window.localStorage.removeItem('timeOutFlag');
    window.localStorage.removeItem('permissionsAuth');

    AWS.config.credentials.clearCachedId();
    if (this.cognitoUtil.getCurrentUser()) {
      this.cognitoUtil.getCurrentUser().signOut();
    }
  }

  redirectToLogin(redirect = false, redirectUrl = null) {
    if (redirect) {
      let url: any = '';
      if (redirectUrl !== null) {
        url = redirectUrl;
      } else {
        url = this.router.routerState.snapshot.url;
      }
      if (url.indexOf('returnUrl=') === -1) {
        // if not already redirected
        this.router.navigate(['/login'], { queryParams: { returnUrl: url } });
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  isAuthenticated(callback: LoggedInCallback) {
    if (callback === null) {
      throw 'UserLoginService: Callback in isAuthenticated() cannot be null';
    }

    const cognitoUser = this.cognitoUtil.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function(err: any, session: any) {
        if (err) {
          // console.log('UserLoginService: Couldn\'t get the session: ' + err, err.stack);
          callback.isLoggedIn(err, false);
        } else {
          // console.log('UserLoginService: Session is ' + session.isValid());
          callback.isLoggedIn(err, session.isValid());
        }
      });
    } else {
      // console.log('UserLoginService: can\'t retrieve the current users');
      callback.isLoggedIn("Can't retrieve the CurrentUser", false);
    }
  }

  isLogIn(): Observable<boolean> {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    // let result : Observable<boolean>;
    let result = false;

    if (cognitoUser != null) {
      cognitoUser.getSession(function(err: any, session: any) {
        session;
        if (err) {
          // console.log('UserLoginService: Couldn\'t get the session: ' + err, err.stack);
          result = false;
        } else {
          // console.log('UserLoginService: Session is ' + session.isValid());
          result = true;
        }
      });
    } else {
      // console.log('UserLoginService: can\'t retrieve the current users');
      result = false;
    }
    return Observable.of(result);
  }

  setConfig() {
    this.configurationService.get().subscribe((data: any) => {
      const configuration = data.data;
      this.date = configuration.date.name;
      this.dateTime = configuration.dateTime.code;
      this.measurement = configuration.measurement;
      this.timezone = configuration.timezone.name;
      this.pagination = configuration.pagination;
      this.temperatureUnit = configuration.temperatureUnit;

      if (this.pagination === '' || this.pagination === undefined) {
        window.localStorage.setItem('numRows', environment.defaultConfig.numRows);
      } else {
        window.localStorage.setItem('numRows', this.pagination);
      }
      if (this.timezone === '' || this.timezone === undefined) {
        window.localStorage.setItem('systemTimeZone', environment.defaultConfig.timeZone);
      } else {
        window.localStorage.setItem('systemTimeZone', this.timezone);
      }
      if (this.date === '' || this.date === undefined) {
        window.localStorage.setItem('dateFormat', environment.defaultConfig.dateFormat);
      } else {
        window.localStorage.setItem('dateFormat', this.date);
      }
      if (this.dateTime === '' || this.dateTime === undefined) {
        window.localStorage.setItem('dateTimeFormat', environment.defaultConfig.dateTimeFormat);
      } else {
        window.localStorage.setItem('dateTimeFormat', this.dateTime);
      }
      if (this.measurement === '' || this.measurement === undefined) {
        window.localStorage.setItem('measurement', environment.defaultConfig.measurementUnit);
      } else {
        window.localStorage.setItem('measurement', this.measurement);
      }
      if (this.temperatureUnit === '' || this.temperatureUnit === undefined) {
        window.localStorage.setItem('temperatureUnit', environment.defaultConfig.temperatureUnit);
      } else {
        window.localStorage.setItem('temperatureUnit', this.temperatureUnit);
      }
    });
  }
}

@Injectable()
export class UserParametersService {
  constructor(public cognitoUtil: CognitoUtil) {}

  getParameters(callback: Callback) {
    const cognitoUser = this.cognitoUtil.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession(function(err: any, session: any) {
        if (err) {
          // console.log('UserParametersService: Couldn\'t retrieve the users');
        } else if (session) {
          cognitoUser.getUserAttributes(function(error: any, result: any) {
            error;
            // console.log(result);
            if (err) {
              // console.log('serParametersService: in getParameters: ' + error);
            } else {
              callback.callbackWithParam(result);
            }
          });
        }
      });
    } else {
      callback.callbackWithParam(null);
    }
  }

  listUsers(callback: any, event: LazyLoadEvent, paginationToken: String, totalRecords: number) {
    let filter: any = '';
    // console.log( event );
    if (typeof event.filters.given_name === 'object') {
      filter = "given_name ^= '" + event.filters.given_name.value + "'";
    }
    if (typeof event.filters.family_name === 'object') {
      filter = "family_name ^= '" + event.filters.family_name.value + "'";
    }
    if (typeof event.filters.email === 'object') {
      filter = "email ^= '" + event.filters.email.value + "'";
    }
    if (typeof event.filters.isActive === 'object') {
      let status = '';
      if (event.filters.isActive.value === '1') {
        status = 'Enabled';
      } else if (event.filters.isActive.value === '0') {
        status = 'Disabled';
      }

      if (status !== '') {
        filter = 'status = "' + status + '"';
      } else {
        paginationToken = '';
      }
    }

    if (typeof event.filters.status === 'object') {
      if (event.filters.status.value) {
        filter = 'cognito:user_status = "' + event.filters.status.value + '"';
      }
    }

    if (filter === '') {
      filter = "given_name ^= ''";
    } else {
      paginationToken = '';
    }
    // console.log(filter);
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    if (cognitoUser != null) {
      const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18'
      });
      const userPoolId = this.cognitoUtil.getUserPool().userPoolId;
      // const paramsCount = {
      //     UserPoolId: userPoolId, /* required */
      //     AttributesToGet: [],
      //     Filter: filter,
      //     Limit: 0
      // };
      // get total records
      /*cognitoidentityserviceprovider.listUsers(paramsCount, function (err, data) {
                if (err) {
                    callback(err, true);
                } else {*/
      /* console.log('users count'); */
      // const totalRecords = data.Users.length;  /* successful response */
      const paramsList = {
        UserPoolId: userPoolId /* required */,
        AttributesToGet: ['given_name', 'family_name', 'email', 'custom:isAdminApproved'],
        Filter: filter,
        Limit: event.rows
      };
      /* console.log('paginationToken '+ paginationToken); */
      if (paginationToken && event.rows < totalRecords) {
        paramsList['PaginationToken'] = paginationToken;
      }
      cognitoidentityserviceprovider.listUsers(paramsList, function(error, res) {
        if (error) {
          // console.log(error, error.stack); /* an error occurred */
          callback(error, true);
        } else {
          // res.Users.totalRecords = totalRecords;
          callback(res, false);
        }
      });
    }
    /*});
        } else {
            callback(null, true);
        }*/
  }

  getUser(callback, userName: String) {
    // console.log(userName);
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    if (cognitoUser != null && userName != null) {
      const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18'
      });
      const params = {
        UserPoolId: this.cognitoUtil.getUserPool().userPoolId /* required */,
        Username: userName /* required */
      };
      cognitoidentityserviceprovider.adminGetUser(params, function(err, data) {
        if (err) {
          // console.log(err, err.stack); // an error occurred
          callback(null);
        } else {
          // console.log(data);
          callback(data);
        }
      });
    } else {
      callback(null);
    }
  }

  // update attributes by admin
  updateUserAttributes(callback: any, userData: any) {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    if (cognitoUser != null && userData.Username != null) {
      // console.log(userData.UserAttributes);
      const userAttributes = [];
      const validAttributes = [
        'title',
        'email',
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
        'picture'
      ];
      const customAttributes = [
        'city',
        'state',
        'country',
        'MobileNumber',
        'zipcode',
        'latitude',
        'longitude',
        'isAdminApproved',
        'title'
      ];
      let ckey = '';
      for (const key in userData.UserAttributes) {
        if (validAttributes.indexOf(key) >= 0) {
          if (userData.UserAttributes[key] === null || userData.UserAttributes[key] === undefined) {
            userData.UserAttributes[key] = '';
          }
          // check if custom attribute
          if (customAttributes.indexOf(key) >= 0) {
            ckey = 'custom:' + key;
          } else {
            ckey = key;
          }
          userAttributes.push({ Name: ckey, Value: String(userData.UserAttributes[key]).trim() });
        }
      }
      // console.log(userAttributes);

      const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18'
      });
      const params = {
        UserAttributes: userAttributes /* required */,
        UserPoolId: this.cognitoUtil.getUserPool().userPoolId /* required */,
        Username: userData.Username /* required */
      };
      cognitoidentityserviceprovider.adminUpdateUserAttributes(params, function(err, data) {
        if (err) {
          callback(err.message, null);
        } else {
          // console.log(data);
          callback(null, data);
        }
      });
    } else {
      callback(null);
    }
  }

  saveUserStatus(callback, userData: any) {
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    if (cognitoUser != null && userData.Username != null) {
      const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18'
      });
      const userPoolId = this.cognitoUtil.getUserPool().userPoolId;
      const params = {
        UserPoolId: userPoolId /* required */,
        Username: userData.Username /* required */
      };
      if (userData.Status) {
        // enable users
        cognitoidentityserviceprovider.adminEnableUser(params, function(err, data) {
          if (err) {
            callback(err.message, null);
          } else {
            callback(null, data);
          }
        });
      } else {
        // disable users
        cognitoidentityserviceprovider.adminDisableUser(params, function(err, data) {
          if (err) {
            callback(err.message, null);
          } else {
            callback(null, data);
          }
        });
      }
    } else {
      callback(null);
    }
  }

  adminListGroupsForUser(callback, userName: String, index) {
    //console.log(index);
    const cognitoUser = this.cognitoUtil.getCurrentUser();
    if (cognitoUser != null && userName != null) {
      const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({
        apiVersion: '2016-04-18'
      });
      const params = {
        UserPoolId: this.cognitoUtil.getUserPool().userPoolId /* required */,
        Username: userName /* required */
      };
      cognitoidentityserviceprovider.adminListGroupsForUser(params, function(err, data) {
        if (err) {
          // console.log(err, err.stack); // an error occurred
        } else {
          callback(data, false, index);
        }
      });
    } else {
      //callback(null);
    }
  }
}
