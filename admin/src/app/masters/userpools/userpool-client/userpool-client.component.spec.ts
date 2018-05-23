import { CognitoUtil } from '../../../core/aws/cognito.service';
import { GlobalService } from '../../../core/global.service';
import { HttpRestService } from '../../../core/http-rest.service';
import { ValidationModule } from '../../../core/validators/validation.module';
import { ValidationService } from '../../../core/validators/validation.service';
import { UserPoolClientComponent } from './userpool-client.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { UserPoolClientService } from '../shared/userpool.service';;
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

describe('Edit Client', () => {
  let component: UserPoolClientComponent;
  let fixture: ComponentFixture<UserPoolClientComponent>;
  const testData = require('./userpool-client.component.spec.json');
  const clientObj = testData.clientObj;

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserPoolClientComponent],
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
        UserPoolClientService
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
    fixture = TestBed.createComponent(UserPoolClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.userpoolClientForm.setValue(clientObj);
  });

 it('App client name required', () => {
    let errors: any = {};
    const ClientName = component.userpoolClientForm.controls['ClientName'];
    errors = ClientName.errors || {};
    expect(errors['required']).toBeFalsy();
  });

 it('Refresh token expiration required', () => {
    let errors: any = {};
    const RefreshTokenValidity = component.userpoolClientForm.controls['RefreshTokenValidity'];
    errors = RefreshTokenValidity.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is form valid ', () => {
      component.userpoolClientForm.setValue(clientObj);
      expect(component.userpoolClientForm.valid).toBeTruthy();
  });


});

