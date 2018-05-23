import { UserLoginService } from '../../aws/cognito.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/primeng';
import { environment } from '../../../../environments/environment';
import { UserPoolNoAuthService } from './../../../masters/userpools/shared/userpool.service';
import { UserPoolModel } from '../../../masters/userpools/shared/userpool.model';
import { ValidationService } from '../../../core/validators/validation.service';
@Component({
    selector: 'app-generate-password',
    templateUrl: './generate-password.component.html',
    styleUrls: ['./generate-password.component.scss']
})

export class GeneratePasswordComponent implements OnInit, OnDestroy {
    email: string;
    password: string;
    newpassword: string;
    errorMessage: any;
    loginFailed: boolean;
    generatepasswordform: FormGroup;
    private sub: any;
    loader = false;
    msgs: Message[] = [];
    userPoolModel: UserPoolModel;
    passwordPolicy = '';
    openHelpText = false;

    constructor(
        public userService: UserLoginService,
        public router: Router,
        public route: ActivatedRoute,
        private userPoolNoAuthService: UserPoolNoAuthService,
    ) {
        this.generatepasswordform = new FormGroup({
            email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
            password: new FormControl('', [Validators.required, Validators.minLength(6)]),
            newpassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        });
    }

    /**
     * Function called on oninit
     * 
     * @memberof GeneratePasswordComponent
     */
    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.email = params['username'];
        });

        this.errorMessage = null;
        this.loginFailed = false;
        this.userService.isAuthenticated(this);
        // get password policy
        this.userPoolNoAuthService.describeUserPool().subscribe(res => {
            this.userPoolModel = res;
            const passwordMinLength = this.userPoolModel.Policies.PasswordPolicy.MinimumLength;

            if ( passwordMinLength ) {
                this.passwordPolicy = 'Password must have at least ' + passwordMinLength + ' characters.\n';
            }

            const passPolicyArr = [];
            let lastPolicy = '';
            if (this.userPoolModel.Policies.PasswordPolicy.RequireLowercase) {
                passPolicyArr.push(' lowercase letters');
                lastPolicy = ' lowercase letters';
            }
            if (this.userPoolModel.Policies.PasswordPolicy.RequireUppercase) {
                passPolicyArr.push(' uppercase letters');
                lastPolicy = ' uppercase letters';
            }
            if (this.userPoolModel.Policies.PasswordPolicy.RequireNumbers) {
                passPolicyArr.push(' numbers');
                lastPolicy = ' numbers';
            }
            if (this.userPoolModel.Policies.PasswordPolicy.RequireSymbols) {
                passPolicyArr.push(' 1 special character');
                lastPolicy = ' 1 special character';
            }
            if ( passPolicyArr.length ) {
                this.passwordPolicy = this.passwordPolicy.concat('Password must require' + passPolicyArr.join(',')) + '.';
                if ( passPolicyArr.length >= 2 ) {
                    this.passwordPolicy = this.passwordPolicy.replace(',' + lastPolicy, ' and ' + lastPolicy);
                }
            }
        }, (err:any) => {
            this.showError(err);
        });
    }

    /**
     * Function called on ngdestroy
     * 
     * @memberof GeneratePasswordComponent
     */
    ngOnDestroy() {
        if ( this.sub ) {
            this.sub.unsubscribe();
        }
    }

    /**
     * Function called on generate password
     * 
     * @memberof GeneratePasswordComponent
     */
    onGeneratePassword() {
        this.loader = true;
        this.userService.authenticate(this.email, this.password, this.newpassword, this);
    }

    /**
     * Call back of authenticate
     * 
     * @memberof GeneratePasswordComponent
     */
    cognitoCallback(message: string, result: any) {
        result;
        this.loader = false;
        this.msgs = [];
        if (message !== null) {
            this.msgs.push({ severity: 'error', summary: environment.growlErrorHeadingMessage, detail: message });
        } else {
            this.msgs.push({
                severity: 'success',
                summary: 'Success',
                detail: 'You have successfully generated your password.'
            });
            const self = this;
            setTimeout(() => {
                self.router.navigate(['/login']);
            }, 3000);
        }
    }
    /**
     * Call back of isAuthenticated. Check to see if user is logged in
     * 
     * @memberof GeneratePasswordComponent
     */
    isLoggedIn(message: any, isLoggedIn: boolean) {
        message;
        if (isLoggedIn) {
            this.router.navigate(['/dashboard']);
        }
    }

    /**
     * Function to show error
     * @param {any}
     * @memberof GeneratePasswordComponent
     */
    public showError(error: any) {
        this.loader = false;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error });
    }

    /**
     * Set flag to show/hide password helptext
     * @param {any}
     * @memberof GeneratePasswordComponent
     */
     setFlagForHelptext(flag: boolean) {
        this.openHelpText = flag;
     }

}
