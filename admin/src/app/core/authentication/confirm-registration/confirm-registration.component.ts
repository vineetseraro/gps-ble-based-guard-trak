import { UserRegistrationService, UserLoginService } from '../../aws/cognito.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../core/validators/validation.service';
import { Message } from 'primeng/primeng';
import { environment } from '../../../../environments/environment';

@Component({
    selector: 'app-confirm-registration',
    templateUrl: './confirm-registration.component.html',
    styleUrls: ['./confirm-registration.component.scss']
})

export class ConfirmRegistrationComponent implements OnInit, OnDestroy {
    confirmationCode: string;
    email: string;
    private sub: any;
    confirmform: FormGroup;
    msgs: Message[] = [];
    loader = false;

    constructor(
        public regService: UserRegistrationService,
        public router: Router,
        public route: ActivatedRoute,
        public userLoginService: UserLoginService
    ) {
        this.userLoginService.isAuthenticated(this);
        this.confirmform = new FormGroup({
            email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
            confirmationCode: new FormControl('', [Validators.required]),
        });
    }

    /**
     * Function called on nginit
     * 
     * @memberof ConfirmRegistrationComponent
     */
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.email = params['username'];
        });
    }

    /**
     * Function called when user resend code
     * 
     * @memberof ConfirmRegistrationComponent
     */
    resendCode() {
        // this.router.navigate(['/resend-code', this.email]);
        // this.router.navigate(['/resend-code']);
        this.loader = true;
        this.regService.resendCode(this.email, this);
    }

    /**
     * Call back of resendCode
     * 
     * @memberof ConfirmRegistrationComponent
     */
    resendCodeCallback(error: any, result: any) {
        result;
        this.loader = false;
        if (error !== null) {
            // error
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: environment.growlErrorHeadingMessage, detail: error });
        } else {
            // success
            this.msgs = [];
            this.msgs.push({ severity: 'success', summary: 'Success', detail: 'Confirmation code sent suscessfully.' });
            const self = this;
            setTimeout(function() {
                self.router.navigate(['/confirm-registration', self.email]);
            }, 3000);
        }
    }

    /**
     * Function called on ngdestroy
     * 
     * @memberof ConfirmRegistrationComponent
     */
    ngOnDestroy() {
        if ( this.sub ) {
            this.sub.unsubscribe();
        }
    }

    /**
     * Function called on confirm registration.
     * 
     * @memberof ConfirmRegistrationComponent
     */
    onConfirmRegistration() {
        this.loader = true;
        this.regService.confirmRegistration(this.email, this.confirmationCode, this);
    }

    /**
     * Call back of confirmRegistration.
     * 
     * @memberof ConfirmRegistrationComponent
     */
    cognitoCallback(message: string, result: any) {
        result;
        this.loader = false;
        if (message !== null) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: environment.growlErrorHeadingMessage, detail: message });
        } else {
            this.msgs = [];
            this.msgs.push({
                severity: 'success',
                summary: 'Success',
                detail: 'You have successfully confirmed your account. Wait till admin approves your account.'
            });
            setTimeout(() => {
                this.router.navigate(['/login']);
            }, 3000);
        }
    }

    /**
     * Call back of isAuthenticated. Check to see if user is logged in
     * 
     * @memberof ConfirmRegistrationComponent
     */
    isLoggedIn(message: any, isLoggedIn: boolean) {
        message;
        if (isLoggedIn) {
            this.router.navigate(['/dashboard']);
        }
    }
}
