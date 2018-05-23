import { Configuration } from '../../../core/ak.constants';
import { AwsUtil } from '../../../core/aws/aws.service';
import { UserRegistrationService, LoggedInCallback, UserLoginService, CognitoUtil } from '../../../core/aws/cognito.service';
import { GlobalService } from '../../../core/global.service';
import { HttpRestService } from '../../../core/http-rest.service';
import { ValidationModule } from '../../../core/validators/validation.module';
import { ValidationService } from '../../../core/validators/validation.service';
import { WidgetModule } from './../../../core/widget/widget.module';
import { RegisterComponent } from './registration.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { Router } from '@angular/router';
import { TimeZoneModel } from '../../../core/global.model';
import { UserPoolNoAuthService } from './../../../masters/userpools/shared/userpool.service';
import { RouterTestingModule } from '@angular/router/testing';
import { DynamoDBService } from '../../aws/ddb.service';
import { ConfigurationService } from '../../configuration/shared/configuration.service';
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
import { Observable, Subscription } from 'rxjs/Rx';
import { NO_ERRORS_SCHEMA } from '@angular/core';


describe('Register User', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  const testData = require('./registration.component.spec.json');
  const userObj = testData.userObj;

  const mockActiveRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const mockAttributeService = {
    getDropdown: () => { }
  };

  const mockUserService = {
      getCurrentUser: () => { },
      isAuthenticated: () => { },
  };

  const mockCognito = {
      getAwsCognito: () => { },
      getUserPool: () => { },
  };

  const globalService = {
      getTimeZones: () => { return { subscribe: () => { } }; }
  };


  const serviceStub = {
    getParameter: () => { return { subscribe: () => { } }; },
  };

  const userPoolNoAuthMock = {
    describeUserPool: () => { return { subscribe: () => { } }; },
    listSalutations: () => {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: UserLoginService, useValue: mockUserService },
        { provide: GlobalService, useValue: globalService },
        { provide: UserPoolNoAuthService, useValue: userPoolNoAuthMock },
        ValidationService,
        HttpRestService,
        Configuration,
        AwsUtil,
        UserRegistrationService,
        CognitoUtil,
        DynamoDBService,
        ConfigurationService
      ],
      imports: [
        ValidationModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        DropdownModule,
        WidgetModule,
        CalendarModule,
        FieldsetModule,
        PanelModule,
        FileUploadModule,
        SplitButtonModule,
        AutoCompleteModule,
        PasswordModule,
        RadioButtonModule,
        TabViewModule,
        GMapModule,
        InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
        DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule,
        RouterTestingModule.withRoutes([
            { path: 'settings/:collection/edit/:item', component: RegisterComponent }
        ]),
      ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.userForm.setValue(userObj);
  });

 it('Is first name required', () => {
    let errors: any = {};
    const given_name = component.userForm.controls['given_name'];
    errors = given_name.errors || {};
    expect(errors['required']).toBeFalsy();
  });

 it('Is last name required', () => {
    let errors: any = {};
    const family_name = component.userForm.controls['family_name'];
    errors = family_name.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is email id required ', () => {
      component.userForm.setValue(userObj);
      let errors = {};
      const email = component.userForm.controls['email'];
      errors = email.errors || {};
      expect(errors['required']).toBeFalsy();
  });

  it('Is email pattern required ', () => {
      component.userForm.setValue(userObj);
      let errors = {};
      const email = component.userForm.controls['email'];
      errors = email.errors || {};
      expect(errors['invalidEmailAddress']).toBeFalsy();
  });

 it('Is password required', () => {
    let errors: any = {};
    const password = component.userForm.controls['password'];
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is time zone required ', () => {
    let errors: any = {};
    const zoneinfo = component.userForm.controls['zoneinfo'];
    errors = zoneinfo.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is form valid ', () => {
      component.userForm.setValue(userObj);
      component.userForm.setValue(userObj);
      expect(component.userForm.valid).toBeTruthy();
  });


});

