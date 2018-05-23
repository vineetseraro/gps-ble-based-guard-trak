import { WidgetModule } from './../../../core/widget/widget.module';
import { DashboardService } from './../../../themes/stryker/services/dashboard.service';
import { Configuration } from '../../../core/ak.constants';
import { GlobalService } from '../../../core/global.service';
import { HttpRestService } from '../../../core/http-rest.service';
import { ValidationModule } from '../../../core/validators/validation.module';
import { ValidationService } from '../../../core/validators/validation.service';
import { AttributesService } from './../shared/attributes.service';
import { AttributeComponent } from './attribute.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';

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
import {Observable} from 'rxjs/Rx';

describe('Add/Edit Attribute', () => {
  let component: AttributeComponent;
  let fixture: ComponentFixture<AttributeComponent>;
  const testData = require('./attribute_component.spec.json');
  const attribute = testData.attribute;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttributeComponent],
      providers: [{ provide: Router, useValue: mockRouter }, {
        provide: ActivatedRoute,

        useValue: {
          params: Observable.of({ id: 123 })
        }
      }
        , GlobalService, ValidationService, HttpRestService,
        AttributesService, Configuration, DashboardService],
      imports: [ValidationModule, BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        WidgetModule,
        ReactiveFormsModule,
        DropdownModule,
        CalendarModule, FieldsetModule, PanelModule,
        FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
        GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
        DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule

      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.attributeForm.setValue(attribute);

  });


  it('Name requiered', () => {
    let errors: any = {};
    const name = component.attributeForm.controls['name'];
    errors = name.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Code Required', () => {
    let errors: any = {};
    const code = component.attributeForm.controls['code'];
    errors = code.errors || {};
    expect(errors['code']).toBeFalsy();
  });

  it('Status Required', () => {
    let errors: any = {};
    const status = component.attributeForm.controls['status'];
    errors = status.errors || {};
    expect(errors['required']).toBeFalsy();
  });


   it('SystemDefined is disabled', () => {
    const systemDefined = component.attributeForm.controls['sysDefined'];
    expect(systemDefined.disabled).toBeTruthy();
  });

it('Code Disabled when Edit', () => {
    component.setAttributeDetails(attribute);
    const name = component.attributeForm.controls['name'];
    expect(name.enabled).toBeFalsy();
  });

  it('Code Enable when Add', () => {
    const name = component.attributeForm.controls['name'];
    expect(name.enabled).toBeTruthy();
  });

it('Name is enable when not System Defined', () => {
    component.setAttributeDetails(attribute);
    const name = component.attributeForm.controls['name'];
    expect(name.enabled).toBeFalsy();
  });

it('status is enable when not System Defined', () => {
    component.setAttributeDetails(attribute);
    const code = component.attributeForm.controls['status'];
    expect(code.enabled).toBeFalsy();
  });

  it('is form valid', () => {
    expect(component.attributeForm.valid).toBeTruthy();
  });
});

