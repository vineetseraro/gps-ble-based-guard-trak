import { CognitoUtil } from '../../../core/aws/cognito.service';
import { GlobalService } from '../../../core/global.service';
import { HttpRestService } from '../../../core/http-rest.service';
import { ValidationModule } from '../../../core/validators/validation.module';
import { ValidationService } from '../../../core/validators/validation.service';
import { UserPoolMessageComponent } from './userpool-message.component';
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

describe('Edit Message : ', () => {
  let component: UserPoolMessageComponent;
  let fixture: ComponentFixture<UserPoolMessageComponent>;
  const testData = require('./userpool-message.component.spec.json');
  const messageObj = testData.messageObj;

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
  const userPoolServiceMock = {
    describeUserPool: () => { return { subscribe: () => { } }; },
    userPoolId: ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserPoolMessageComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of({ id: 123 })
          }
        },
        { provide: CognitoUtil, useValue: mockCognito },
        GlobalService,
        HttpRestService,
        { provide: UserPoolService, useValue: userPoolServiceMock }
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
    fixture = TestBed.createComponent(UserPoolMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.userpoolMessageForm.setValue(messageObj);
  });

 it('sms message required', () => {
    let errors: any = {};
    const smsMessage = component.userpoolMessageForm.controls['smsMessage'];
    errors = smsMessage.errors || {};
    expect(errors['required']).toBeFalsy();
  });

 it('email subject required', () => {
    let errors: any = {};
    const emailSubject = component.userpoolMessageForm.controls['emailSubject'];
    errors = emailSubject.errors || {};
    expect(errors['required']).toBeFalsy();
  });

 it('email message required', () => {
    let errors: any = {};
    const emailMessage = component.userpoolMessageForm.controls['emailMessage'];
    errors = emailMessage.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is form valid ', () => {
      component.userpoolMessageForm.setValue(messageObj);
      expect(component.userpoolMessageForm.valid).toBeTruthy();
  });


});

