import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { EditorModule } from 'primeng/primeng';
import { WidgetModule } from '../../../core/widget/widget.module';

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
import { CollectionComponent } from './collection.component';

describe('Add Collection Test Case', () => {
 let component: CollectionComponent;
  let fixture: ComponentFixture<CollectionComponent>;
  const testData = require('./collection.component.spec.json');
  const collection = testData.collection;

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
      declarations: [CollectionComponent],
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
        CalendarModule, FieldsetModule, PanelModule,
        FileUploadModule, SplitButtonModule, AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
        GMapModule, InputSwitchModule, InputTextareaModule, InputMaskModule, SliderModule, SpinnerModule, ToggleButtonModule, ButtonModule,
        DataTableModule, SharedModule, GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule,
        WidgetModule

      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.collectionForm.setValue(collection);

  });

  it('Is name  required ', () => {
    let errors = {};
    const name = component.collectionForm.controls['name'];
    errors = name.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is code  required ', () => {
    let errors = {};
    const code = component.collectionForm.controls['code'];
    errors = code.errors || {};
    expect(errors['required']).toBeFalsy();
  });

 it('Is collections type required ', () => {
    let errors = {};
    const collectionTypeId = component.collectionForm.controls['type'];
    errors = collectionTypeId.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is collections tag required ', () => {
    let errors = {};
    const collectionTypeId = component.collectionForm.controls['tags'];
    errors = collectionTypeId.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Is collections parent required ', () => {
    let errors = {};
    const collectionTypeId = component.collectionForm.controls['parent'];
    errors = collectionTypeId.errors || {};
    expect(errors['required']).toBeFalsy();
  });

  it('Submit button Enable', () => {
    expect(component.collectionForm.valid).toBeTruthy();
  });

});
