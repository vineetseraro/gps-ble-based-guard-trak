import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
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

import { Configuration } from './../../../core/ak.constants';
import { HttpRestService } from './../../../core/http-rest.service';
import { AttributeListComponent } from './attribute-list.component';


describe('Product List Unit Cases', () => {
    let component: AttributeListComponent;
    let fixture: ComponentFixture<AttributeListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AttributeListComponent],
            imports: [BrowserAnimationsModule,
                FormsModule, ReactiveFormsModule,
                RouterModule, RouterTestingModule,
                FormsModule,
                ReactiveFormsModule,
                DropdownModule,
                CalendarModule, FieldsetModule, PanelModule,
                FileUploadModule, SplitButtonModule,
                AutoCompleteModule, PasswordModule, RadioButtonModule, TabViewModule,
                GMapModule, InputSwitchModule, HttpModule,
                InputTextareaModule, InputMaskModule,
                SliderModule, SpinnerModule,
                ToggleButtonModule, ButtonModule,
                DataTableModule, SharedModule,
                GrowlModule, MultiSelectModule, CheckboxModule, DropdownModule],
            providers: [HttpRestService, Configuration]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AttributeListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    it('Check is status updateing ', () => {

        // call to add active status
        component.getActiveStatus();
        expect(component.activeStatus.length).toBe(3);

    });

});
