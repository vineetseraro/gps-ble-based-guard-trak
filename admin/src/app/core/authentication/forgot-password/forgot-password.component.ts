import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/primeng';

import { environment } from '../../../../environments/environment';
import { ValidationService } from '../../../core/validators/validation.service';
import { CognitoCallback, UserLoginService } from '../../aws/cognito.service';
import { GlobalService } from '../../../core/global.service';


@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password-step1.component.html',
    styleUrls: ['./forgot-password.component.scss'],
    providers: [GlobalService]
})
export class ForgotPasswordStep1Component implements CognitoCallback, OnInit, OnDestroy {
    email: string;
    // errorMessage: string;
    myform: FormGroup;
    msgs: Message[] = [];
    loader = false;
    private sub: any;

    constructor(
        public router: Router,
        public userService: UserLoginService,
        public route: ActivatedRoute,
        private globalService: GlobalService
    ) {
        this.userService.isAuthenticated(this);
        this.myform = new FormGroup({
            email: new FormControl('', [Validators.required, ValidationService.emailValidator])
        });
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            if ( params.hasOwnProperty('email') ) {
                this.email = this.globalService.trimSpaces(params['email']);
            }
        });
    }

    ngOnDestroy() {
        if ( this.sub ) {
            this.sub.unsubscribe();
        }
    }

    /**
     * Function called on forgot password
     *
     * @memberof ForgotPasswordStep1Component
     */
    onNext() {
        this.loader = true;
        this.email = this.globalService.trimSpaces(this.email);
        this.userService.forgotPassword(this.email, this);
    }

    /**
     * Call back of forgotPassword.
     * 
     * @memberof ForgotPasswordStep1Component
     */
    cognitoCallback(message: string, result: any) {
        result;
        this.loader = false;
        if (message !== null) { // error
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: environment.growlErrorHeadingMessage, detail: message });
        } else {
            // success
            this.msgs = [];
            this.msgs.push({
                severity: 'success',
                summary: 'Success',
                detail: 'A verification code to reset your password is sent on your email.'
            });
            const self = this;
            setTimeout(function() {
                self.router.navigate(['/forgot-password-step2', self.email]);
            }, 3000);
        }
    }

    /**
     * Call back of isAuthenticated. Check to see if user is logged in
     * 
     * @memberof ForgotPasswordStep1Component
     */
    isLoggedIn(message: string, isLoggedIn: boolean) {
        message;
        if (isLoggedIn) {
            this.router.navigate(['/dashboard']);
        }
    }
}


@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password-step2.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordStep2Component implements CognitoCallback, OnInit, OnDestroy {

    verificationCode: string;
    email: string;
    newPassword: string;
    private sub: any;
    msgs: Message[] = [];
    loader = false;
    myform: FormGroup;

    constructor(
        public router: Router,
        public route: ActivatedRoute,
        public userService: UserLoginService,
        private globalService: GlobalService
    ) {
        this.userService.isAuthenticated(this);
        this.myform = new FormGroup({
            verificationCode: new FormControl('', [Validators.required]),
            newPassword: new FormControl('', [Validators.required])
        });
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.email = this.globalService.trimSpaces(params['email']);
        });
    }

    ngOnDestroy() {
        if ( this.sub ) {
            this.sub.unsubscribe();
        }
    }

    /**
     * Function called on forgot password
     * 
     * @memberof ForgotPasswordStep2Component
     */
    onNext() {
        this.loader = true;
        this.email = this.globalService.trimSpaces(this.email);
        this.userService.confirmNewPassword(this.email, this.verificationCode, this.newPassword, this);
    }

    /**
     * Call back of forgot password step2
     * 
     * @param {string} message
     * 
     * @memberof ForgotPasswordStep2Component
     */
    cognitoCallback(message: string) {
        this.loader = false;
        if (message !== null) {
            // error
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: environment.growlErrorHeadingMessage, detail: message });
        } else {
            // success
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success', detail: 'Password updated suscessfully.' });
            const self = this;
            setTimeout(function() {
                self.router.navigate(['/login']);
            }, 3000);
        }
    }

    /**
     * Call back of isAuthenticated. Check to see if user is logged in
     * 
     * @memberof ForgotPasswordStep2Component
     */
    isLoggedIn(message: any, isLoggedIn: boolean) {
        message;
        if (isLoggedIn) {
            this.router.navigate(['/dashboard']);
        }
    }

}
