import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import 'moment-timezone';

@Component({
    selector: 'app-ak-dateformator',
    template: `
			<span *ngIf="date">{{date}}</span>
            <span *ngIf="!date">--</span>
  `
})
/*
<span *ngIf="date">{{date  | amTz:timeZone | amDateFormat:timeFormat }}</span>
<span *ngIf="!date">--</span>
*/
export class AkDateFormatorComponent implements OnInit {
    @Input() date = '';
    timeZone: any = '';
    timeFormat: any = '';
    constructor() {
        this.timeZone = window.localStorage.getItem('userTimeZone');
    }

    ngOnInit() {
        this.formatDate();
    }
    @Input()
    set format(format: string) {
        if (format === 'dateTime') {
            this.timeFormat = window.localStorage.getItem('dateTimeFormat');
        } else if (format === 'dateTimeFull') {
            this.timeFormat = 'DD MMM Y HH:mm:ss';
        } else {
            this.timeFormat = window.localStorage.getItem('dateFormat');
        }
    }

    formatDate() {
        if ( moment(this.date).isValid() ) {
            const format = window.localStorage.getItem('dateTimeFormat');
            this.date = moment(this.date)
            .tz(window.localStorage.getItem('userTimeZone'))
            .format(format);
        }
    }
}
