import { AttributeComponent } from './attribute/attribute.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/primeng';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    ReactiveFormsModule
  ],
  declarations: [AttributeComponent],
  exports: [AttributeComponent]
})
export class AddmoreModule { }
