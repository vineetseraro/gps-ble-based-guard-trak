import { Configuration } from '../../../core/ak.constants';
import { AwsUtil } from '../../../core/aws/aws.service';
import { CognitoUtil, UserParametersService } from '../../../core/aws/cognito.service';
import { GlobalService } from '../../../core/global.service';
import { HttpRestService } from '../../../core/http-rest.service';
import { ValidationModule } from '../../../core/validators/validation.module';
import { ValidationService } from '../../../core/validators/validation.service';
import { AddmoreModule } from '../../shared/addmore/addmore.module';
import { UserPoolGroupService, UserPoolUserService } from '../../userpools/shared/userpool.service';
import { WidgetModule } from './../../../core/widget/widget.module';
import { UserComponent } from './user.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeZoneModel } from '../../../core/global.model';
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


describe('Add/Edit User', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  const testData = require('./user.component.spec.json');
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

  const mockUserService = {
      getCurrentUser: () => { },
      isAuthenticated: () => { },
  };

  const mockCognito = {
      getAwsCognito: () => { },
      getUserPool: () => { },
  };

  const mockUserPoolGroup = {
      userPoolId: '',
      listGroups: () => { return { subscribe: () => { } }; }
  };


  const serviceStub = {
    getParameter: () => { return { subscribe: () => { } }; },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of({ id: 123 })
          }
        },
        { provide: CognitoUtil, useValue: mockCognito },
        { provide: UserPoolGroupService, useValue: mockUserPoolGroup },
        // { provide: UserLoginService, useValue: mockUserService },
        GlobalService,
        ValidationService,
        HttpRestService,
        Configuration,
        UserParametersService,
        // CognitoUtil,
        AwsUtil,
        // UserPoolGroupService,
        UserPoolUserService
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
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.userForm.setValue(userObj);
  });

 it('first name required', () => {
    let errors: any = {};
    const given_name = component.userForm.controls['given_name'];
    errors = given_name.errors || {};
    expect(errors['required']).toBeFalsy();
  });

 it('last name required', () => {
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

  it('Is time zone required ', () => {
    let errors: any = {};
    const zoneinfo = component.userForm.controls['zoneinfo'];
    errors = zoneinfo.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is form valid ', () => {
      component.userForm.setValue(userObj);
      component.userForm.setValue(userObj);
      // com
      expect(component.userForm.valid).toBeTruthy();
  });


});

