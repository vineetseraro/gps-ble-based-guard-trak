import { Component, Input } from '@angular/core';
import { Message } from 'primeng/primeng';



@Component({
    selector: 'app-ak-growl',
    template: `
  <p-growl [value]="messages" [sticky]="false" [life]="4000" [immutable]= "false"></p-growl>
  `
})
export class AkGrowlComponent {
    @Input() messages: Message[] = [];
    constructor() { }
}