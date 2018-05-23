// import { ResourceList } from 'aws-sdk/clients/cloudtrail';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { UserPoolUserService } from '../../../masters/userpools/shared/userpool.service';
import { UserLoginService } from '../../aws/cognito.service';
// import { GlobalService } from '../../../core/global.service';
// import { environment } from '../../../../environments/environment';
import { DashboardService } from './../../../themes/stryker/services/dashboard.service';

// declare var UA: any;
// declare function registerWebDevice(message: any): any;
// import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  currentUserPreferresRole: string;

  constructor(
    public userService: UserLoginService,
    private router: Router,
    public userPoolUserService: UserPoolUserService,
    private DashboardService: DashboardService // private globalService : GlobalService
  ) {
    // let userData = null;
    //let permissionsModel;
    if (window.localStorage.getItem('permissionsAuth')) {
      //permissionsModel = JSON.parse(window.localStorage.getItem('permissionsAuth'));
    }
  }

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('AuthGuard#canActivate called');
    // const url: string = state.url;
    this.userService.isLogIn().subscribe(value => {
      console.log('islogin' + value);
      this.DashboardService.getNotificationList();
      // this.registerWebDeviceToUrbanAirShip();
      if (!value) {
        window.localStorage.removeItem('permissionsAuth');
        this.userService.redirectToLogin(true, state.url);
        return false;
      } else {
        this.DashboardService.getNotificationList();
        // this.registerWebDeviceToUrbanAirShip();
      }
    });
    if (!window.localStorage.getItem('userData')) {
      // session expired
      window.localStorage.removeItem('permissionsAuth');
      this.userService.redirectToLogin(true, state.url);
      return false;
    }

    const data = JSON.parse(window.localStorage.getItem('permissionsAuth'));

    const resource = data[route.data.resource] ? data[route.data.resource] : '';
    // console.log(data);
    // console.log(route);
    let hasRight = false;
    switch (route.data.type) {
      case 'list': {
        if (resource.get) {
          hasRight = true;
        }
        break;
      }
      case 'add': {
        if (resource.post) {
          hasRight = true;
        }
        break;
      }
      case 'edit': {
        if (resource.put) {
          hasRight = true;
        }
        break;
      }
    }
    if (!hasRight) {
      // console.log('No Rights-------')
      // alert("Access denied");
      this.router.navigate(['/403']);
      return false;
    }

    return true;
  }

  // registerWebDeviceToUrbanAirShip(){
  //     let userEmail =  this.globalService.getLocalStorageCognitoData();

  //     if(registerWebDevice != undefined) {
  //         let userPermissions:any =  JSON.parse(this.globalService.getLocalStorageUserpermissionsData());
  //         let roleName = userPermissions.data.roleName;
  //         console.log(userPermissions.data.roleName , 'roleName');
  //         registerWebDevice(environment.UAKeys[roleName]);
  //       }

  //     UA.then(function(sdk) {
  //       console.log(sdk, 'you here', UA)
  //           sdk.register();
  //           sdk.channel.namedUser.set(userEmail);
  //           console.log(sdk, 'you registered');
  //     }).catch(function(err) {
  //       console.log(err)
  //     })
  //    }

  // hasRight(roles: any | any[]): Observable<boolean> | boolean {
  //     //  let cognitoUser = this.cognitoUtil.getCurrentUser();
  //     var roleArray = ['admin', 'test'];
  //     // if (cognitoUser == null) {
  //     // return false;
  //     // }

  //     if (!Array.isArray(roles)) {
  //         roles = [roles];
  //     }
  //     return roles.some(role => roleArray.indexOf(role) !== -1);

  //     // return this.currentUser.roles && roles.some(role => this.currentUser.roles.indexOf(role) !== -1);
  // }
}
