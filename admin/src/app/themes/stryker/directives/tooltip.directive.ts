import { Directive, ElementRef, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appTooltip]'
})
export class TooltipDirective implements OnInit {
    @Input('titleObj') titleObj: any;
    element: any;
    constructor(element: ElementRef) {
        this.element = element;
    }

    ngOnInit() {
        this.getTitle();
    }

    getTitle() {
        let title = 'Attendees :';
        if ( this.titleObj ) {
            let cnt = 0;
            this.titleObj.forEach(element => {
                cnt++;
                let separatorStr = '';
                if ( this.titleObj.length !== cnt ) {
                    separatorStr = ',';
                }
                title += ' ' + element.firstName + ' ' + element.lastName + separatorStr;
            });
        }
        this.element.nativeElement.title = title;
    }
}
