import { CognitoUtil, UserParametersService } from '../../../core/aws/cognito.service';
import { GlobalService } from '../../../core/global.service';
import { HttpRestService } from '../../../core/http-rest.service';
import { ValidationModule } from '../../../core/validators/validation.module';
import { ValidationService } from '../../../core/validators/validation.service';
import { UserPoolPoliciesComponent } from './userpool-policies.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import {
    AutoCompleteModule,
    ButtonModule,
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
import { UserPoolService } from '../shared/userpool.service';

describe('Edit Policies', () => {
  let component: UserPoolPoliciesComponent;
  let fixture: ComponentFixture<UserPoolPoliciesComponent>;
  const testData = require('.//userpool-policies.component.spec.json');
  const policyObj = testData.policyObj;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const mockActiveRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const mockCognito = {
      getAwsCognito: () => { },
      getUserPool: () => { },
  };

  const serviceStub = {
    getParameter: () => { return { subscribe: () => { } }; },
  };

  const userPoolServiceMock = {
    describeUserPool: () => { return { subscribe: () => { } }; },
    userPoolId: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserPoolPoliciesComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params: Observable.of({ id: 123 })}
          }
        },
        { provide: CognitoUtil, useValue: mockCognito },
        GlobalService,
        HttpRestService,
        UserParametersService,
        { provide: UserPoolService, useValue: userPoolServiceMock },
      ],
      imports: [
        ValidationModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        DropdownModule,
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
    fixture = TestBed.createComponent(UserPoolPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.userpoolPolicyForm.setValue(policyObj);
  });

 it('Password min length  required', () => {
    let errors: any = {};
    const minLength = component.userpoolPolicyForm.controls['minLength'];
    errors = minLength.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is form valid ', () => {
      component.userpoolPolicyForm.setValue(policyObj);
      expect(component.userpoolPolicyForm.valid).toBeTruthy();
  });


});

