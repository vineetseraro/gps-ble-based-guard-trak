import { LoggedInCallback, UserLoginService } from '../../aws/cognito.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-logout',
    template: ''
})
export class LogoutComponent implements LoggedInCallback {

    constructor(public router: Router,
        public userService: UserLoginService) {
        this.userService.isAuthenticated(this);
    }

    isLoggedIn(message: any, isLoggedIn: boolean) {
        message;

        const router = this.router;
        // let usertype = window.localStorage.getItem('usertype');
        window.localStorage.setItem('userData', '');

        if (isLoggedIn) {
                this.userService.logout();
                router.navigate(['/login']);
            } else {
                // default handler
                router.navigate(['/login']);
            }

        // if ( usertype === 'google' && typeof gapi === 'object' ) {
        //     if ( typeof gapi.auth2 === 'object' ) {
        //         let auth2 = gapi.auth2.getAuthInstance();
        //         auth2.signOut().then(function () {
        //             router.navigate(['/login']);
        //         });
        //     }
        // } else if ( usertype === 'cognito' ) {
        //     if (isLoggedIn) {
        //         this.userService.logout();
        //         router.navigate(['/login']);
        //     } else {
        //         // default handler
        //         router.navigate(['/login']);
        //     }
        // } else {
        // }
    }
}
