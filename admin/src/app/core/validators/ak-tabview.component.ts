import { AfterContentInit, Component, ContentChildren, QueryList, ViewChild } from '@angular/core';
import { TabPanel, TabView } from 'primeng/components/tabview/tabview';

import { ValidationService } from './validation.service';

@Component({
    selector: 'app-ak-tab-view',
    template: `
    <p-tabView #tabview [ngClass]="tabError">
    <ng-content></ng-content>
    </p-tabView>
  `
})
export class AkTabViewComponent implements AfterContentInit {
    @ViewChild('tabview') tabview: TabView;
    @ContentChildren(TabPanel) tabPanels: QueryList<TabPanel>;

    constructor(private validationService: ValidationService) {
    }

    ngAfterContentInit() {
        const originalDatatableNgAfterContentInit = this.tabview.ngAfterContentInit;
        this.tabview.ngAfterContentInit = () => {
            this.tabview.tabPanels = this.tabPanels;
            originalDatatableNgAfterContentInit.call(this.tabview);
        };
    }

    get tabError() {
        const taberror = this.validationService.tabError;
        return taberror;
    }
}

