import { Configuration } from '../../ak.constants';
import { CognitoUtil, UserLoginService, UserRegistrationService } from '../../aws/cognito.service';
import { GlobalService } from '../../global.service';
import { HttpRestService } from '../../http-rest.service';
import { ValidationModule } from '../../validators/validation.module';
import { ValidationService } from '../../validators/validation.service';
import { RegisterComponent } from '../registration/registration.component';
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
import { GeneratePasswordComponent } from '../generate-password/generate-password.component';
import { UserPoolNoAuthService } from '../../../masters/userpools/shared/userpool.service';


describe('Generate Password Test Case : ', () => {
    let component: GeneratePasswordComponent;
    let fixture: ComponentFixture<GeneratePasswordComponent>;
    let submitEl: DebugElement;
    const testData = require('./generate-password.component.spec.json');
    const generatePasswordObj = testData.generatePasswordObj;
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
                GeneratePasswordComponent
            ],
            providers: [
                { provide: CognitoUtil, useValue: mockCognito },
                { provide: UserLoginService, useValue: mockUserService },
                GlobalService,
                ValidationService,
                HttpRestService,
                Configuration,
                UserRegistrationService,
                UserPoolNoAuthService
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
        fixture = TestBed.createComponent(GeneratePasswordComponent);
        component = fixture.componentInstance;
        submitEl = fixture.debugElement.query(By.css('button'));
    });

    it('Is email id required ', () => {
        component.generatepasswordform.setValue(generatePasswordObj);
        let errors = {};
        const email = component.generatepasswordform.controls['email'];
        errors = email.errors || {};
        expect(errors['required']).toBeFalsy();
    });

    it('Is email pattern required ', () => {
        component.generatepasswordform.setValue(generatePasswordObj);
        let errors = {};
        const email = component.generatepasswordform.controls['email'];
        errors = email.errors || {};
        expect(errors['invalidEmailAddress']).toBeFalsy();
    });

    it('Is old password required ', () => {
        component.generatepasswordform.setValue(generatePasswordObj);
        let errors = {};
        const oldPassword = component.generatepasswordform.controls['password'];
        errors = oldPassword.errors || {};
        expect(errors['required']).toBeFalsy();
    });

    it('Is new password required ', () => {
        component.generatepasswordform.setValue(generatePasswordObj);
        let errors = {};
        const newPassword = component.generatepasswordform.controls['newpassword'];
        errors = newPassword.errors || {};
        expect(errors['required']).toBeFalsy();
    });

    it('Is Form Valid ', () => {
        component.generatepasswordform.setValue(generatePasswordObj);
        expect(component.generatepasswordform.valid).toBeTruthy();
    });


});



