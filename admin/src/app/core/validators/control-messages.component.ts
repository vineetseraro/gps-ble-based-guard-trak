import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { ValidationService } from './validation.service';

@Component({
  selector: 'validation-messages',
  templateUrl: './validation-messages.component.html',
  // template: `
  // <div *ngIf="validationMessage !== null" class="alert alert-danger">{{validationMessage}}</div>
  // `
})
export class ControlMessagesComponent {
  @Input() control: FormControl;
  @Input() key: string = '';
  constructor() { }

  get validationMessage() {
    for (let propertyName in this.control.errors) {
      if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched && this.control.dirty) {
        return ValidationService.getValidatorErrorMessage(this.key, propertyName, this.control.errors[propertyName]);
      }
    }

    return null;
  }
}