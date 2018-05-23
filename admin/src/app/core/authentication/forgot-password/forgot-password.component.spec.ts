import { Configuration } from '../../ak.constants';
import { CognitoUtil, UserLoginService } from '../../aws/cognito.service';
import { DynamoDBService } from '../../aws/ddb.service';
import { GlobalService } from '../../global.service';
import { HttpRestService } from '../../http-rest.service';
import { ValidationModule } from '../../validators/validation.module';
import { ValidationService } from '../../validators/validation.service';
import { RegisterComponent } from '../registration/registration.component';
import {
  ForgotPasswordStep1Component,
  ForgotPasswordStep2Component
} from '../forgot-password/forgot-password.component';

import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DataTableModule,
    DropdownModule,
    FieldsetModule,
    FileUploadModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextareaModule,
    MultiSelectModule,
    PanelModule,
    PasswordModule,
    RadioButtonModule,
    SharedModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    TabViewModule,
    ToggleButtonModule
} from 'primeng/primeng';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '../../../themes/stryker/stryker-theme.module';
import { WidgetModule } from '../../../core/widget/widget.module';
import { LogoutComponent } from '../logout/logout.component';
import { ConfirmRegistrationComponent } from '../confirm-registration/confirm-registration.component';
import { ResendCodeComponent } from '../resend-code/resend-code.component';
import { GeneratePasswordComponent } from '../generate-password/generate-password.component';



describe('ForgotPassword Step 1 Test Case : ', () => {
    let component: ForgotPasswordStep1Component;
    let fixture: ComponentFixture<ForgotPasswordStep1Component>;
    let submitEl: DebugElement;
    const testData = require('./forgot-password_component.spec.json');
    const forgotPasswordObj = testData.forgotPasswordObj;
    const mockUserService = {
        getCurrentUser: () => { },
        isAuthenticated: () => { },
    };

    const mockCognito = {
        getAwsCognito: () => { },
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                RegisterComponent,
                ForgotPasswordStep1Component,
                ForgotPasswordStep2Component,
                LogoutComponent,
                ConfirmRegistrationComponent,
                ResendCodeComponent,
                GeneratePasswordComponent
            ],
            providers: [
                { provide: CognitoUtil, useValue: mockCognito },
                { provide: UserLoginService, useValue: mockUserService },
                GlobalService,
                ValidationService,
                HttpRestService,
                Configuration,
                DynamoDBService
            ],
            imports: [
                ValidationModule,
                BrowserAnimationsModule,
                FormsModule,
                HttpModule,
                ReactiveFormsModule,
                RouterTestingModule.withRoutes([
                    { path: 'settings/:collection/edit/:item', component: RegisterComponent }
                ]),
                DropdownModule,
                CalendarModule, FieldsetModule, PanelModule,
                FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
                GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule,
                ToggleButtonModule, ButtonModule,
                DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule,
                LayoutModule,
                WidgetModule
            ]

        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ForgotPasswordStep1Component);
        component = fixture.componentInstance;
        submitEl = fixture.debugElement.query(By.css('button'));
    });

    it('Is email id required ', () => {
        component.myform.setValue(forgotPasswordObj);
        let errors = {};
        const email = component.myform.controls['email'];
        errors = email.errors || {};
        expect(errors['required']).toBeFalsy();
    });

    it('Is email pattern required ', () => {
        component.myform.setValue(forgotPasswordObj);
        let errors = {};
        const email = component.myform.controls['email'];
        errors = email.errors || {};
        expect(errors['invalidEmailAddress']).toBeFalsy();
    });

    it('Is Form Valid ', () => {
        component.myform.setValue(forgotPasswordObj);
        expect(component.myform.valid).toBeTruthy();
    });


});


describe('ForgotPassword Step 2 Test Case : ', () => {
    let component: ForgotPasswordStep2Component;
    let fixture: ComponentFixture<ForgotPasswordStep2Component>;
    let submitEl: DebugElement;
    const testData = require('./forgot-password_component.spec.json');
    const resetPasswordObj = testData.resetPasswordObj;
    const mockUserService = {
        getCurrentUser: () => { },
        isAuthenticated: () => { },
    };

    const mockCognito = {
        getAwsCognito: () => { },
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                RegisterComponent,
                ForgotPasswordStep1Component,
                ForgotPasswordStep2Component,
                LogoutComponent,
                ConfirmRegistrationComponent,
                ResendCodeComponent,
                GeneratePasswordComponent
            ],
            providers: [
                { provide: CognitoUtil, useValue: mockCognito },
                { provide: UserLoginService, useValue: mockUserService },
                GlobalService,
                ValidationService,
                HttpRestService,
                Configuration,
                DynamoDBService
            ],
            imports: [
                ValidationModule,
                BrowserAnimationsModule,
                FormsModule,
                HttpModule,
                ReactiveFormsModule,
                RouterTestingModule.withRoutes([
                    { path: 'settings/:collection/edit/:item', component: RegisterComponent }
                ]),
                DropdownModule,
                CalendarModule, FieldsetModule, PanelModule,
                FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
                GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule,
                ToggleButtonModule, ButtonModule,
                DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule,
                LayoutModule,
                WidgetModule,
            ]

        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ForgotPasswordStep2Component);
        component = fixture.componentInstance;
        submitEl = fixture.debugElement.query(By.css('button'));
    });

    it('Is verification code required ', () => {
        component.myform.setValue(resetPasswordObj);
        let errors = {};
        const verificationCode = component.myform.controls['verificationCode'];
        errors = verificationCode.errors || {};
        expect(errors['required']).toBeFalsy();
    });

    it('Is new password required ', () => {
        component.myform.setValue(resetPasswordObj);
        let errors = {};
        const newPassword = component.myform.controls['newPassword'];
        errors = newPassword.errors || {};
        expect(errors['required']).toBeFalsy();
    });

    it('Is Form Valid ', () => {
        component.myform.setValue(resetPasswordObj);
        expect(component.myform.valid).toBeTruthy();
    });


});


