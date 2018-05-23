import { CognitoUtil, UserParametersService } from '../../../core/aws/cognito.service';
import { GlobalService } from '../../../core/global.service';
import { HttpRestService } from '../../../core/http-rest.service';
import { ValidationModule } from '../../../core/validators/validation.module';
import { ValidationService } from '../../../core/validators/validation.service';
import { UserPoolGroupService } from '../../userpools/shared/userpool.service';
import { UserPoolGroupComponent } from './userpool-group.component';
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


describe('Add/Edit Group', () => {
  let component: UserPoolGroupComponent;
  let fixture: ComponentFixture<UserPoolGroupComponent>;
  const testData = require('./userpool-group.component.spec.json');
  const groupObj = testData.groupObj;

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

  const mockUserPoolGroup = {
      userPoolId: '',
      listGroups: () => { return { subscribe: () => { } }; }
  };


  const serviceStub = {
    getParameter: () => { return { subscribe: () => { } }; },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserPoolGroupComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {params: Observable.of({ id: 123 })}
          }
        },
        { provide: CognitoUtil, useValue: mockCognito },
        { provide: UserPoolGroupService, useValue: mockUserPoolGroup },
        GlobalService,
        HttpRestService,
        UserParametersService
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
    fixture = TestBed.createComponent(UserPoolGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.userpoolGroupForm.setValue(groupObj);
  });

 it('Group name required', () => {
    let errors: any = {};
    const groupName = component.userpoolGroupForm.controls['groupName'];
    errors = groupName.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is form valid ', () => {
      component.userpoolGroupForm.setValue(groupObj);
      expect(component.userpoolGroupForm.valid).toBeTruthy();
  });


});

