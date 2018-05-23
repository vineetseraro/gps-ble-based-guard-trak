import { WidgetModule } from './../../../core/widget/widget.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorModule } from 'primeng/primeng';
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

import { Configuration } from '../../../core/ak.constants';
import { GlobalService } from '../../../core/global.service';
import { HttpRestService } from '../../../core/http-rest.service';
import { ValidationModule } from '../../../core/validators/validation.module';
import { ValidationService } from '../../../core/validators/validation.service';
import { AddmoreModule } from '../../shared/addmore/addmore.module';
import { DashboardService } from './../../../themes/stryker/services/dashboard.service';
import { ProductComponent } from './product.component';




describe('Add/Edit Product', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;
  const testData = require('./product.component.spec.json');
  const product = testData.product;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const mockActiveRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const mockAttributeService = {
    getDropdown: () => { }
  };


  const serviceStub = {
    getParameter: () => { return { subscribe: () => { } }; },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductComponent],
      providers: [{ provide: Router, useValue: mockRouter }, {
        provide: ActivatedRoute,
        useValue: {
          params: Observable.of({ id: 123 })
        }
      }
        , GlobalService, ValidationService, HttpRestService, Configuration, DashboardService],
      imports: [ValidationModule, BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        ReactiveFormsModule,
        AddmoreModule,
        EditorModule,
        DropdownModule,
        WidgetModule,
        CalendarModule, FieldsetModule, PanelModule,
        FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
        GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
        DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule

      ]

    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.productForm.setValue(product);
  });

  it('Name requiered', () => {
    let errors: any = {};
    const name = component.productForm.controls['name'];
    errors = name.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is Name max length', () => {
    let errors: any = {};
    const name = component.productForm.controls['name'];
    errors = name.errors || {};
    expect(errors['maxlength']).toBeFalsy();
  });

  it('Code Required', () => {
    let errors: any = {};
    const code = component.productForm.controls['code'];
    errors = code.errors || {};
    expect(errors['code']).toBeFalsy();
  });


  it('Is Code Max length', () => {
    let errors: any = {};
    const code = component.productForm.controls['code'];
    errors = code.errors || {};
    expect(errors['maxlength']).toBeFalsy();
  });

  it('Is Price valid', () => {
    const code = component.productForm.controls['price'];
    expect(code.valid).toBeTruthy();
  });
  it('Tag Required', () => {
    let errors: any = {};
    const code = component.productForm.controls['tags'];
    errors = code.errors || {};
    console.log(errors);
    expect(errors['required']).toBeFalsy();
  });

  it('Location Required', () => {
    let errors: any = {};
    const code = component.productForm.controls['location'];
    errors = code.errors || {};
    console.log(errors);
    expect(errors['required']).toBeFalsy();
  });


  it('Categories Required', () => {
    let errors: any = {};
    const code = component.productForm.controls['categories'];
    errors = code.errors || {};
    console.log(errors);
    expect(errors['required']).toBeFalsy();
  });


  it('Categories Required', () => {
    let errors: any = {};
    const code = component.productForm.controls['categories'];
    errors = code.errors || {};
    console.log(errors);
    expect(errors['required']).toBeFalsy();
  });

  it('Floor Required', () => {
    let errors: any = {};
    const code = component.productForm.controls['floor'];
    errors = code.errors || {};
    console.log(errors);
    expect(errors['required']).toBeFalsy();
  });

  it('Zone Required', () => {
    let errors: any = {};
    const code = component.productForm.controls['zone'];
    errors = code.errors || {};
    console.log(errors);
    expect(errors['required']).toBeFalsy();
  });

  it('videoUrl Required', () => {
    let errors: any = {};
    const code = component.productForm.controls['videoUrl'];
    errors = code.errors || {};
    console.log(errors);
    expect(errors['required']).toBeFalsy();
  });

  it('Is Video Url  Valid', () => {
    const code = component.productForm.controls['videoUrl'];
    expect(code.valid).toBeTruthy();
  });


  it('url Required', () => {
    let errors: any = {};
    const code = component.productForm.controls['url'];
    errors = code.errors || {};
    console.log(errors);
    expect(errors['required']).toBeFalsy();
  });

  it('Is  Url  Valid', () => {
    const code = component.productForm.controls['url'];
    expect(code.valid).toBeTruthy();
  })

  it('Is  images  Required', () => {
    let errors: any = {};
    const code = component.productForm.controls['images'];
    errors = code.errors || {};
    expect(errors['required']).toBeFalsy();
  })


  it('Status Required', () => {
    let errors: any = {};
    const status = component.productForm.controls['status'];
    errors = status.errors || {};
    expect(errors['required']).toBeFalsy();
  });


  it('Code Disabled when Edit', () => {
    component.updateProduct(product);
    const name = component.productForm.controls['code'];
    expect(name.enabled).toBeFalsy();
  });

  it('Code Enable when Add', () => {
    const name = component.productForm.controls['code'];
    expect(name.enabled).toBeTruthy();
  });

  it('Is Product form valid', () => {
    component.isProductInit = true;
    component.isLocationInit = true;
    component.isThingInit = true;
     component.updateProduct(product);
    expect(component.productForm.valid).toBeTruthy();
  });


});

