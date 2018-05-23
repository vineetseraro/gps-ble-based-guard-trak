import { ConfirmRegistrationComponent } from '../confirm-registration/confirm-registration.component';
import {
    ForgotPasswordStep1Component,
    ForgotPasswordStep2Component
} from '../forgot-password/forgot-password.component';
import { LogoutComponent } from '../logout/logout.component';
import { RegisterComponent } from '../registration/registration.component';
import { BlankComponent } from './../../../themes/stryker/blank/blank.component';
import { Configuration } from './../../ak.constants';
import { CognitoUtil, UserLoginService, UserRegistrationService } from './../../aws/cognito.service';
import { DynamoDBService } from './../../aws/ddb.service';
import { GlobalService } from './../../global.service';
import { HttpRestService } from './../../http-rest.service';
import { ValidationService } from './../../validators/validation.service';
import { ResendCodeComponent } from './../resend-code/resend-code.component';
import { loginRoutes } from './login-routing.module';
import { LoginComponent } from './login.component';
import { Location } from '@angular/common';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('Router: App', () => {
    let location: Location;
    let router: Router;
    let fixture;
    const mockUserService = {
        getCurrentUser: () => { },
        isAuthenticated: () => { },
    };

    const mockCognito = {
        getAwsCognito: () => { },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(loginRoutes), FormsModule,
                ReactiveFormsModule],
            declarations: [
                BlankComponent, LoginComponent, RegisterComponent, ConfirmRegistrationComponent,
                ForgotPasswordStep2Component, ForgotPasswordStep1Component, ResendCodeComponent, LogoutComponent
            ],

            providers: [{ provide: CognitoUtil, useValue: mockCognito },
            { provide: UserLoginService, useValue: mockUserService }
                , GlobalService, ValidationService, HttpRestService,
                Configuration, DynamoDBService, UserRegistrationService],

        });
        router = TestBed.get(Router);
        location = TestBed.get(Location);
        fixture = TestBed.createComponent(BlankComponent);

        router.initialNavigation();
    });
    it('should go on login screen when we use blank on login', async(() => {
        router.navigate(['']).then(() => {
            expect(location.path()).toBe('/login');
            console.log('after expect');
        });
    }));


    it('should go on login screen when we use /login on login', async(() => {
        router.navigate(['/login']).then(() => {
            expect(location.path()).toBe('/login');
            console.log('after expect');
        });
    }));
    it('should go on register screen when we use /register ', async(() => {
        router.navigate(['/register']).then(() => {
            expect(location.path()).toBe('/register');
            console.log('after expect');
        });
    }));
    it('should go on forgotpassword screen when we use /forgot-password: ', async(() => {
        router.navigate(['/forgot-password']).then(() => {
            expect(location.path()).toBe('/forgot-password');
            console.log('after expect');
        });
    }));
});

