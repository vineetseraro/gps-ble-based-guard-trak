import { Configuration } from '../../../core/ak.constants';
// import { AwsUtil } from '../../../core/aws/aws.service';
import { CognitoUtil, UserParametersService, UserLoginService } from '../../../core/aws/cognito.service';
import { GlobalService } from '../../../core/global.service';
import { HttpRestService } from '../../../core/http-rest.service';
import { ValidationModule } from '../../../core/validators/validation.module';
import { ValidationService } from '../../../core/validators/validation.service';
import { AddmoreModule } from '../../shared/addmore/addmore.module';
import { UserPoolUserService } from '../../userpools/shared/userpool.service';
import { WidgetModule } from './../../../core/widget/widget.module';
import { MyProfileComponent } from './myprofile.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeZoneModel } from '../../../core/global.model';
import { DynamoDBService } from '../../../core/aws/ddb.service';
import { ConfigurationService } from '../../../core/configuration/shared/configuration.service';
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


fdescribe('Edit User Profile : ', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;
  const testData = require('./myprofile.component.spec.json');
  const userObj = testData.userObj;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const mockActiveRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const mockAttributeService = {
    getDropdown: () => { }
  };

  const mockCognito = {
      getAwsCognito: () => { },
      getUserPool: () => { },
      getCurrentUser: () => { return { getSession: () => { } }; },
      accessToken: ''
  };

  const mockUserService = {
      getCurrentUser: () => { },
      isAuthenticated: () => { },
  };

  const mockUserPoolUser = {
      getUser : () => { }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyProfileComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of({ id: 123 })
          }
        },
        { provide: CognitoUtil, useValue: mockCognito },
        { provide: UserPoolUserService, useValue: mockUserPoolUser },
        { provide: UserLoginService, useValue: mockUserService },
        GlobalService,
        ValidationService,
        HttpRestService,
        Configuration,
        UserParametersService,
        // UserLoginService,
        // AwsUtil,
        UserPoolUserService,
        DynamoDBService,
        ConfigurationService
      ],
      imports: [
        ValidationModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        AddmoreModule,
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
        DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule
      ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.userFG.setValue(userObj);
  });

 it('first name required', () => {
    let errors: any = {};
    const given_name = component.userFG.controls['given_name'];
    errors = given_name.errors || {};
    expect(errors['required']).toBeFalsy();
  });

 it('last name required', () => {
    let errors: any = {};
    const family_name = component.userFG.controls['family_name'];
    errors = family_name.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is email id required ', () => {
      component.userFG.setValue(userObj);
      let errors = {};
      const email = component.userFG.controls['email'];
      errors = email.errors || {};
      expect(errors['required']).toBeFalsy();
  });

  it('Is email pattern required ', () => {
      component.userFG.setValue(userObj);
      let errors = {};
      const email = component.userFG.controls['email'];
      errors = email.errors || {};
      expect(errors['invalidEmailAddress']).toBeFalsy();
  });

  it('Is time zone required ', () => {
    let errors: any = {};
    const zoneinfo = component.userFG.controls['zoneinfo'];
    errors = zoneinfo.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is form valid ', () => {
      component.userFG.setValue(userObj);
      expect(component.userFG.valid).toBeTruthy();
      // component.loader = false;
  });


});

