import { BlankComponent } from './blank/blank.component';
import { ScreenBelowLarge } from './directives/screen-below-large.directive';
import { ScreenLarge } from './directives/screen-large.directive';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { NotificationBoxComponent } from './notification-box/notification-box.component';
import { PageComponent } from './page/page.component';
import { DashboardService } from './services/dashboard.service';
import { ScreenService } from './services/screen.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EditorModule } from 'primeng/primeng';
import { WidgetModule } from '../../core/widget/widget.module';

import {
  CalendarModule,
  DataTableModule,
  DialogModule,
  DropdownModule,
  GMapModule,
  OverlayPanelModule,
  SharedModule,
  TabViewModule,
  ConfirmDialogModule,
  ConfirmationService
} from 'primeng/primeng';
import { TooltipModule } from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DropdownModule,
    CommonModule,
    HttpModule,
    DataTableModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TabViewModule,
    GMapModule,
    EditorModule,
    TooltipModule,
    DialogModule,
    CalendarModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    WidgetModule
  ],
  declarations: [
    HeaderComponent,
    BlankComponent,
    PageComponent,
    FooterComponent,
    SidebarComponent,
    ScreenBelowLarge,
    NotificationBoxComponent,
    ScreenLarge
  ],
  exports: [
    HeaderComponent,
    BlankComponent,
    PageComponent
  ],
  providers: [
    DashboardService,
    ScreenService,
    ConfirmDialogModule,
    ConfirmationService
  ]
})
export class LayoutModule { }
