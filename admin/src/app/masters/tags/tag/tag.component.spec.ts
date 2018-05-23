import { TagService } from './../shared/tag.service';
import { TagComponent } from './tag.component';
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
    ToggleButtonModule,
} from 'primeng/primeng';
import {Observable} from 'rxjs/Rx';
import { Configuration } from '../../../core/ak.constants';
import { GlobalService } from '../../../core/global.service';
import { HttpRestService } from '../../../core/http-rest.service';
import { ValidationModule } from '../../../core/validators/validation.module';
import { ValidationService } from '../../../core/validators/validation.service';
import { DashboardService } from './../../../themes/stryker/services/dashboard.service';
import {Tag } from './../shared/tag.model';



describe('Add/Edit Tag', () => {
  let component: TagComponent;
  let fixture: ComponentFixture<TagComponent>;
  const testData = require('./tag-component.spec.json');
  const attribute = testData.attribute;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TagComponent],
      providers: [{ provide: Router, useValue: mockRouter }, {
        provide: ActivatedRoute,
        useValue: {
          params: Observable.of({ id: 123 })
        }
      }
        , GlobalService, ValidationService, HttpRestService,
        Configuration, DashboardService],
      imports: [ValidationModule, BrowserAnimationsModule,
        FormsModule,
        HttpModule,
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
    fixture = TestBed.createComponent(TagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.tagForm.setValue(attribute);

  });

  it('Tag Name Requried', () => {
    let errors: any = {};
    const name = component.tagForm.controls['name'];
    errors = name.errors || {};
    expect(errors['required']).toBeFalsy();
  });

   it('SystemDefined is disabled', () => {
    const systemDefined = component.tagForm.controls['sysDefined'];
    expect(systemDefined.disabled).toBeTruthy();
  });

   it('Name is disabled when System Defined', () => {
    component.setTagDetails(attribute);
    const name = component.tagForm.controls['name'];
    expect(name.disabled).toBeTruthy();
  });

 it('Name is enable when not System Defined', () => {
    component.setTagDetails(attribute);
    const name = component.tagForm.controls['name'];
    expect(name.enabled).toBeFalsy();
  });





});

