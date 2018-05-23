import { UserLoginService } from '../../aws/cognito.service';
import { DynamoDBService } from '../../aws/ddb.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ValidationService } from '../../../core/validators/validation.service';
import { Message } from 'primeng/primeng';
import { HttpRestService } from '../../../core/http-rest.service';
import { PermissionResponse } from '../../authorization/shared/authorization.model';
import { UserPoolUserService } from '../../../masters/userpools/shared/userpool.service';
import { GlobalService } from '../../../core/global.service';



// declare var AWS: any;

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [GlobalService]
})
export class LoginComponent implements OnInit {
    email = '';
    password: string;
    loader = false;
    busy: Promise<any>;
    loginform: FormGroup;
    msgs: Message[] = [];
    returnUrl: string;
    constructor(public router: Router,
        public ddb: DynamoDBService,
        public userService: UserLoginService,
        private httpRestService: HttpRestService,
        public userPoolUserService: UserPoolUserService,
        private route: ActivatedRoute,
        private globalService: GlobalService

    ) {
        this.loginform = new FormGroup({
            email: new FormControl('', [Validators.required, ValidationService.emailValidator]),
            password: new FormControl('', [Validators.required]),
        });
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        if ( this.returnUrl !== '/dashboard' ) {
            const urlArr = this.returnUrl.split('returnUrl=');
            if ( urlArr.length > 1 ) {
                // forfeited url
                this.returnUrl = '/dashboard';
            }
        }
        this.userService.isAuthenticated(this);
    }

    /**
     * Function called on login
     * 
     * 
     * @memberof LoginComponent
     */
    onLogin() {
        this.loader = true;
        this.email = this.globalService.trimSpaces(this.email);
        this.email = this.email.toLowerCase();
        this.userService.authenticate(this.email, this.password, '', this);
        // this.userService.setConfig();
    }

    /**
     * Call back of login
     * 
     * 
     * @memberof LoginComponent
     */
    cognitoCallback(message: string, result: any) {
        result;
        this.loader = false;
        if (message !== null) {
            if (message === 'User is not confirmed.') {
                this.router.navigate(['/confirm-registration', this.email]);
            } else if (message === 'newPasswordRequired') {
                this.router.navigate(['/generate-password', this.email]);
            } else {
                this.showError(message);
            }
        } else {
            this.userService.setConfig();
            this.getGroupPolicy();
        }
    }

    getGroupPolicy() {
        this.loader = true;
        const role = this.userPoolUserService.userDetails('cognito:preferred_role');
        this.httpRestService.get('iam' + environment.serverEnv + '/group/policy?role=' + role)
            .map((res:any) => <PermissionResponse>res.json())
            .subscribe((response:any) => {
                const moduleMapping = response.data.modules.map((element:any) => {
                    const resourceObj = {};
                    for (let i = 0; i < (element.resources || []).length; i++) {
                        resourceObj[element.resources[i].componentName] = element.resources[i];
                    }
                    return {
                        resources: resourceObj
                    }
                }).reduce((result:any, element:any) => {
                    return Object.assign({}, result, element.resources)
                }, {});

                // console.log(moduleMapping);
                // console.log(response);
                window.localStorage.setItem('permissionsAuth', JSON.stringify(moduleMapping));
                window.localStorage.setItem('permissions', JSON.stringify(response));
                this.loader = false;
                this.router.navigate([ this.returnUrl ]);
                // this.router.navigate(['/dashboard']);
                // this.modules = response.data.modules;
                // this.menuConf = this.createMenu();
            }, (err:any) => {
                err;
                this.showError('Some error occurred');
      });

    }

    /**
     * Show Error
     * @param {*} error
     * @memberof LoginComponent
     */
    public showError(error: any) {
        this.loader = false;
        this.msgs = [];
        this.msgs.push({ severity: 'error', summary: environment.growlErrorHeadingMessage, detail: error });
    }

    /**
     * Call back of isAuthenticated. Check to see if user is logged in
     * 
     * @memberof LoginComponent
     */
    isLoggedIn(message: any, isLoggedIn: boolean) {
        message;
        if (isLoggedIn) {
            // this.router.navigate(['/dashboard']);
            this.router.navigate([this.returnUrl]);
        }
    }

    // onGoogleSignInSuccess(event: GoogleSignInSuccess) {
    //     this.userService.authenticateSocialUser('google', event, this);
    // }
}
