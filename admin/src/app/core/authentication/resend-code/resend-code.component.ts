import { CognitoCallback, UserRegistrationService, UserLoginService } from '../../aws/cognito.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'primeng/primeng';
import { environment } from '../../../../environments/environment';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ValidationService } from '../../../core/validators/validation.service';

@Component({
    selector: 'app-login',
    templateUrl: './resend-code.component.html',
    styleUrls: ['./resend-code.component.scss']
})
export class ResendCodeComponent implements CognitoCallback, OnInit, OnDestroy {

    email: string;
    private sub:any;
    msgs: Message[] = [];
    myform: FormGroup;
    loader = false;

    constructor(
        public registrationService: UserRegistrationService,
        public router: Router,
        public route: ActivatedRoute,
        public userLoginService: UserLoginService
    ) {
        this.userLoginService.isAuthenticated(this);
    }

    /**
     * Function called on nginit
     * 
     * @memberof ResendCodeComponent
     */
    ngOnInit() {
        this.myform = new FormGroup({
            email: new FormControl('', [Validators.required, ValidationService.emailValidator])
        });
        this.sub = this.route.params.subscribe(params => {
            this.email = params['email'];
        });
    }

    /**
     * Function called on ngdestroy
     * 
     * @memberof ResendCodeComponent
     */
    ngOnDestroy() {
        if ( this.sub ) {
            this.sub.unsubscribe();
        }
    }

    /**
     * Function called on resend code
     * 
     * @memberof ResendCodeComponent
     */
    resendCode() {
        this.loader = true;
        this.registrationService.resendCode(this.email, this);
    }

    /**
     * Call back of resendCode
     * 
     * @memberof ResendCodeComponent
     */
    cognitoCallback(error: any, result: any) {
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
     * Call back of isAuthenticated. Check to see if user is logged in
     * 
     * @memberof ResendCodeComponent
     */
    isLoggedIn(message: any, isLoggedIn: boolean) {
        message;
        if (isLoggedIn) {
            this.router.navigate(['/dashboard']);
        }
    }
}
