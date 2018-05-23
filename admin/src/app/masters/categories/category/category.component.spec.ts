import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
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
  ToggleButtonModule,
} from 'primeng/primeng';
import { Observable } from 'rxjs';
import { WidgetModule } from './../../../core/widget/widget.module';


import { Configuration } from '../../../core/ak.constants';
import { GlobalService } from '../../../core/global.service';
import { HttpRestService } from '../../../core/http-rest.service';
import { ValidationModule } from '../../../core/validators/validation.module';
import { ValidationService } from '../../../core/validators/validation.service';
import { AddmoreModule } from '../../shared/addmore/addmore.module';
import { CategoryApiService } from '../shared/categoryapiservice';
import { CategoryComponent } from './category.component';
import { DashboardService } from './../../../themes/stryker/services/dashboard.service';


describe('Add/Edit Category ', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  const testData = require('./category_component.json');
  const category = testData.category;

  let mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryComponent],
      providers: [{ provide: Router, useValue: mockRouter }, {
        provide: ActivatedRoute,
        useValue: {
          params: Observable.of({ id: 123 })
        }
      }
        , GlobalService, ValidationService, HttpRestService, CategoryApiService, Configuration, DashboardService],
      imports: [ValidationModule, BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        DropdownModule,
        WidgetModule,
        CalendarModule, FieldsetModule, PanelModule,
        FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
        GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
        DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule, AddmoreModule

      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.categoryForm.setValue(category);

  });

  it('Name requiered', () => {
    let errors: any = {};
    const name = component.categoryForm.controls['name'];
    errors = name.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Code Required', () => {
    let errors: any = {};
    const code = component.categoryForm.controls['code'];
    errors = code.errors || {};
    expect(errors['code']).toBeFalsy();
  });

  it('Status Required', () => {
    let errors: any = {};
    const status = component.categoryForm.controls['status'];
    errors = status.errors || {};
    expect(errors['required']).toBeFalsy();
  });


  it('SystemDefined is disabled', () => {
    const systemDefined = component.categoryForm.controls['sysDefined'];
    expect(systemDefined.disabled).toBeTruthy();
  });

  it('Code Disabled when Edit', () => {
    component.updateCategory(category);
    const name = component.categoryForm.controls['name'];
    expect(name.enabled).toBeFalsy();
  });

  it('Code Enable when Add', () => {
    const name = component.categoryForm.controls['name'];
    expect(name.enabled).toBeTruthy();
  });

  it('Name is enable when not System Defined', () => {
    component.updateCategory(category);
    const name = component.categoryForm.controls['name'];
    expect(name.enabled).toBeFalsy();
  });

  it('status is enable when not System Defined', () => {
    component.updateCategory(category);
    const code = component.categoryForm.controls['status'];
    expect(code.enabled).toBeFalsy();
  });


});

