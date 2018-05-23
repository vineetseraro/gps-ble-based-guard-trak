import { Component } from '@angular/core';

import { ValidationService } from './validation.service';



@Component({
    selector: 'app-ak-server-validation',
    template: `
        <ul *ngIf="validationMessage !== null" class="server-error">
        <div>
        <li *ngFor="let validation of validationList">
            <div style="padding: 0px" [innerHtml]="validation"></div>
        </li>
        </div>
        </ul>
    `
})
export class AkServerValidationComponent {
    validationList: any = [];
    constructor(private validationService: ValidationService) {
        this.validationList = [];
    }

    get validationMessage() {
        this.validationList = this.validationService.serverValidation;
        if (this.validationList.length > 0) {
            return this.validationList;
        } else {
            return null;
        }

    }
}
