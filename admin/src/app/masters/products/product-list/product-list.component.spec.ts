import { Configuration } from './../../../core/ak.constants';
import { HttpRestService } from './../../../core/http-rest.service';
import { HttpModule } from '@angular/http';
import { ProductListComponent } from './product-list.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    CalendarModule,
    GMapModule,
    DataTableModule,
    SharedModule,
    GrowlModule,
    MultiSelectModule,
    CheckboxModule,
    DropdownModule,
    InputSwitchModule,
    InputTextareaModule,
    InputMaskModule,
    SliderModule,
    SpinnerModule,
    ToggleButtonModule,
    ButtonModule,
    FileUploadModule,
    SplitButtonModule,
    AutoCompleteModule,
    PasswordModule,
    RadioButtonModule,
    FieldsetModule,
    PanelModule,
    TabViewModule
} from 'primeng/primeng';


describe('Product List Unit Cases', () => {
    let component: ProductListComponent;
    let fixture: ComponentFixture<ProductListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ProductListComponent],
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
        fixture = TestBed.createComponent(ProductListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

    });

    it('Check is status updateing ', () => {

        // call to add active status
        component.getActiveStatus();
        expect(component.activeStatus.length).toBe(3);

    });

});
