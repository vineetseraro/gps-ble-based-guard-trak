import { Configuration } from '../../ak.constants';
import { CognitoUtil, UserLoginService } from '../../aws/cognito.service';
import { DynamoDBService } from '../../aws/ddb.service';
import { GlobalService } from '../../global.service';
import { HttpRestService } from '../../http-rest.service';
import { ValidationModule } from '../../validators/validation.module';
import { ValidationService } from '../../validators/validation.service';
import { RegisterComponent } from '../registration/registration.component';
import { LoginComponent } from './login.component';
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
import { LayoutModule } from '../../../themes/stryker/stryker-theme.module';
import { LoginRoutingModule } from './login-routing.module';
import { WidgetModule } from '../../../core/widget/widget.module';
import {
  ForgotPasswordStep2Component,
  ForgotPasswordStep1Component
} from '../forgot-password/forgot-password.component';
import { LogoutComponent } from '../logout/logout.component';
import { ConfirmRegistrationComponent } from '../confirm-registration/confirm-registration.component';
import { ResendCodeComponent } from '../resend-code/resend-code.component';
import { GeneratePasswordComponent } from '../generate-password/generate-password.component';



describe('Login Test Case', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let submitEl: DebugElement;
    const testData = require('./login_component.spec.json');
    const user = testData.user;
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
                LoginComponent,
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
                LoginRoutingModule,
                WidgetModule,
            ]

        })
            .compileComponents();

    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        submitEl = fixture.debugElement.query(By.css('button'));

    });

    it('Is email id required ', () => {
        component.loginform.setValue(user);
        let errors = {};
        const email = component.loginform.controls['email'];
        errors = email.errors || {};
        expect(errors['required']).toBeFalsy();
    });

    it('Is email pattern required ', () => {
        component.loginform.setValue(user);
        let errors = {};
        const email = component.loginform.controls['email'];
        errors = email.errors || {};
        // expect(errors['pattern']).toBeFalsy();
        expect(errors['invalidEmailAddress']).toBeFalsy();
    });

    // it('Is email valid after change ', () => {
    //     component.loginform.setValue(user);
    //     const email = component.loginform.controls['email'];
    //     expect(email.valid).toBeTruthy();
    // });


    it('Is Password  required ', () => {
        component.loginform.setValue(user);
        let errors = {};
        const password = component.loginform.controls['password'];
        errors = password.errors || {};
        expect(errors['required']).toBeFalsy();
    });

    // it('Is password minlength required ', () => {
    //     component.loginform.setValue(user);
    //     let errors = {};
    //     const password = component.loginform.controls['password'];
    //     errors = password.errors || {};
    //     expect(errors['minlength']).toBeFalsy();
    // });

    // it('Is password Valid ', () => {
    //     component.loginform.setValue(user);
    //     const password = component.loginform.controls['password'];
    //     expect(password.valid).toBeTruthy();
    // });

    it('Is Form Valid ', () => {
        component.loginform.setValue(user);
        expect(component.loginform.valid).toBeTruthy();
    });


});

