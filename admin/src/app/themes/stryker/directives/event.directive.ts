import { Directive, OnInit, ElementRef, Input } from '@angular/core';


@Directive({
    selector: '[appEventDirective]'
})

export class EventDirective implements OnInit {
    @Input('actions') actions: any;
    @Input('incident') incident: boolean;
    @Input('scan') scan: boolean;
    element: ElementRef;
    constructor(element: ElementRef) {
        this.element = element;
    }
    ngOnInit() {
        let cnt = 0;
        let actionType = '';
        if ( this.actions ) {
            if ( this.incident ) {
                actionType = 'Incident'
            } else if ( this.scan  ) {
                actionType = 'Scan'
            }
            this.actions.forEach(element => {
                if ( element.action ) {
                    if ( element.action.actionType === actionType ) {
                        cnt++;
                    }
                }
            });
        }

        if ( this.incident ) {
            if ( cnt ) {
                this.element.nativeElement.innerHTML = cnt + ' ' + '<i class=\'fa fa-exclamation-triangle aria-hidden=\'true\'></i>';
            } else {
                this.element.nativeElement.innerHTML = cnt;
            }
        } else {
            this.element.nativeElement.innerHTML = cnt;
        }
    }
}
