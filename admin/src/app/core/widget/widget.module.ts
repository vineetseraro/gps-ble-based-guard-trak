import { AgmCoreModule } from '@agm/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RlTagInputModule } from 'angular2-tag-input';
import { UserService } from 'app/masters/users/shared/user.service';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { FileUploadModule } from 'ng2-file-upload';
import {
    AutoCompleteModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    DataTableModule,
    DialogModule,
    DropdownModule,
    FieldsetModule,
    GMapModule,
    GrowlModule,
    InputMaskModule,
    InputSwitchModule,
    InputTextareaModule,
    MultiSelectModule,
    PanelModule,
    PasswordModule,
    RadioButtonModule,
    SharedModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    TabViewModule,
    ToggleButtonModule,
} from 'primeng/primeng';
import { LightboxModule } from 'primeng/primeng';

import { ValidationModule } from '../../core/validators/validation.module';
import { AKCategoryComponent } from './category/ak-category.component';
import { AkDateFormatorComponent } from './date-format/ak-date-formator.component';
import { ImageUploadComponent } from './imageupload/imageupload/imageupload.component';
import { FloormapComponent } from './location/floormap/floormap.component';
import { LocationComponent } from './location/location/location.component';
import { LocatormapComponent } from './maps/locatormap/locatormap.component';
import { RoutemapComponent } from './maps/routemap/routemap.component';
import { SigV4Utils } from './maps/shared/sigv4utils.service';
import { UserRouteMapComponent } from './maps/userroutemap/user-route-map.component';
import { ProductOrchestrationComponent } from './orchestration/product/productorchestration.component';
import { ShipmentOrchestrationComponent } from './orchestration/shipment/shipmentorchestration.component';
import { AkPhoneCodeComponent } from './phonecode/ak-phonecode.component';
import { ReportsComponent } from './reports/reports.component';
import { AppGatewaySearchComponent } from './search/app-gateway-search/app-gateway-search.component';
import { AppSearchComponent } from './search/app-search/app-search.component';
import { AppstatusComponent } from './search/appstatus/appstatus.component';
import { CasesnotclosedComponent } from './search/casesnotclosed/casesnotclosed.component';
import { CasespercityComponent } from './search/casespercity/casespercity.component';
import { CasesperhospitalComponent } from './search/casesperhospital/casesperhospital.component';
import { CasespersurgeonComponent } from './search/casespersurgeon/casespersurgeon.component';
import { CasespersurgeryComponent } from './search/casespersurgery/casespersurgery.component';
import { DeviceLocatorComponent } from './search/devicelocator/devicelocator.component';
import { DeviceLocatorHistoryComponent } from './search/devicelocatorhistory/devicelocatorhistory.component';
import {
    DiagnPointLocationTrackingComponent,
} from './search/diagn_pointlocationtracking/diagn_pointlocationtracking.component';
import { DiagnPointSensorTrackingComponent } from './search/diagn_pointsensortracking/diagn_pointsensortracking.component';
import { GroupListSearchComponent } from './search/group-list/group-list.component';
import { ItemsnotdeliveredComponent } from './search/itemsnotdelivered/itemsnotdelivered.component';
import { LocationsearchComponent } from './search/locationsearch/locationsearch.component';
import { LocationzonesComponent } from './search/locationzones/locationzones.component';
import { MobileLogsComponent } from './search/mobilelogs/mobilelogs.component';
import {
    MostusedequipmentpersurgeonComponent,
} from './search/mostusedequipmentpersurgeon/mostusedequipmentpersurgeon.component';
import { NotificationsComponent } from './search/notifications/notifications.component';
import { OrderComponent } from './search/order/order.component';
import { PartialshipmentsComponent } from './search/partialshipments/partialshipments.component';
import { ProductComponent } from './search/product/product.component';
import { ProductLocatorComponent } from './search/productlocator/productlocator.component';
import { ProductLocatorHistoryComponent } from './search/productlocatorhistory/productlocatorhistory.component';
import { ProductsorderedComponent } from './search/productsordered/productsordered.component';
import { ProductsreadytodispatchComponent } from './search/productsreadytodispatch/productsreadytodispatch.component';
import { SearchComponent } from './search/search.component';
import { SensorstatusComponent } from './search/sensorstatus/sensorstatus.component';
import { ShipmentComponent } from './search/shipment/shipment.component';
import { ShipmentdeliverytimeComponent } from './search/shipmentdeliverytime/shipmentdeliverytime.component';
import {
    ShipmentdeliverytimecarrierComponent,
} from './search/shipmentdeliverytimecarrier/shipmentdeliverytimecarrier.component';
import { ShipmentharddeliveredComponent } from './search/shipmentharddelivered/shipmentharddelivered.component';
import { ShipmentscountbylocationComponent } from './search/shipmentscountbylocation/shipmentscountbylocation.component';
import { ShipmentsdueComponent } from './search/shipmentsdue/shipmentsdue.component';
import { ShipmentsinjeopardyComponent } from './search/shipmentsinjeopardy/shipmentsinjeopardy.component';
import { SimplesearchComponent } from './search/simplesearch/simplesearch.component';
import { SkusensorComponent } from './search/skusensor/skusensor.component';
import { SkusensorhistoryComponent } from './search/skusensorhistory/skusensorhistory.component';
import { StationaryshipmentComponent } from './search/stationaryshipment/stationaryshipment.component';
import { TempTagSearchComponent } from './search/tempTag/tempTag.component';
import { UnshippedproductsComponent } from './search/unshippedproducts/unshippedproducts.component';
import { UserListSearchComponent } from './search/user-list/user-list.component';
import { AKTagComponent } from './tag/ak-tag.component';
import { AKThingsComponent } from './things/ak-things.component';
import { AKUsersComponent } from './users/ak-users.component';
import { UserLocatorComponent } from './search/userlocator/userlocator.component';
import { UserLocatorHistoryComponent } from './search/userlocatorhistory/userlocatorhistory.component';
import { LoginHistoryComponent } from './search/loginhistory/loginhistory.component';
import { UserEntranceComponent } from './search/userentrance/userentrance.component';
import { UserEntranceHistoryComponent } from './search/userentrancehistory/userentrancehistory.component';
import { TaskComponent } from './search/task/task.component';
import { SensorLocatorComponent } from './search/sensorlocator/sensorlocator.component';
import { SensorLocatorHistoryComponent } from './search/sensorlocatorhistory/sensorlocatorhistory.component';
import { ToursComponent } from './search/tours/tours.component';
import { ToureventsComponent } from './search/tourevents/tourevents.component';
import { TourincidentsComponent } from './search/tourincidents/tourincidents.component';
import { AKDevicesComponent } from './devices/ak-devices.component';
import { DeviceTourStatsComponent } from './search/devicetourstats/devicetourstats.component';
import { TitleCasePipe } from '../pipes/titlecase.pipe';
import { GuardTourStatsComponent } from './search/guardtourstats/guardtourstats.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    RlTagInputModule,
    FieldsetModule,
    PanelModule,
    FileUploadModule,
    SplitButtonModule,
    AutoCompleteModule,
    PasswordModule,
    RadioButtonModule,
    TabViewModule,
    GMapModule,
    InputSwitchModule,
    InputTextareaModule,
    InputMaskModule,
    SliderModule,
    SpinnerModule,
    ToggleButtonModule,
    ButtonModule,
    DataTableModule,
    SharedModule,
    GrowlModule,
    MultiSelectModule,
    CheckboxModule,
    DropdownModule,
    DialogModule,
    DragulaModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAQvXMZY_1l5uHWAGn1a60hoj9Pech1Qf4',
      libraries: ['places']
    }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
   // NgProgressModule,
    LightboxModule,
    ValidationModule
  ],
  declarations: [
    LocationComponent,
    AKTagComponent,
    AKThingsComponent,
    AKUsersComponent,
    AKCategoryComponent,
    FloormapComponent,
    ImageUploadComponent,
    AkDateFormatorComponent,
    AkPhoneCodeComponent,
    LocatormapComponent,
    RoutemapComponent,
    UserRouteMapComponent,
    SearchComponent,
    ProductComponent,
    SimplesearchComponent,
    LocationsearchComponent,
    OrderComponent,
    ShipmentComponent,
    ReportsComponent,
    CasespersurgeryComponent,
    CasespercityComponent,
    CasesperhospitalComponent,
    CasesnotclosedComponent,
    CasespersurgeonComponent,
    UnshippedproductsComponent,
    ItemsnotdeliveredComponent,
    DiagnPointSensorTrackingComponent,
    DiagnPointLocationTrackingComponent,
    ShipmentsdueComponent,
    ShipmentdeliverytimecarrierComponent,
    LocationzonesComponent,
    ShipmentharddeliveredComponent,
    ShipmentsinjeopardyComponent,
    UserListSearchComponent,
    GroupListSearchComponent,
    ProductsorderedComponent,
    StationaryshipmentComponent,
    PartialshipmentsComponent,
    ProductLocatorComponent,
    ProductLocatorHistoryComponent,
    ShipmentOrchestrationComponent,
    ProductOrchestrationComponent,
    SensorstatusComponent,
    AppstatusComponent,
    DeviceLocatorComponent,
    DeviceLocatorHistoryComponent,
    AppGatewaySearchComponent,
    ProductsreadytodispatchComponent,
    SkusensorComponent,
    SkusensorhistoryComponent,
    ShipmentdeliverytimeComponent,
    ShipmentscountbylocationComponent,
    MobileLogsComponent,
    AppSearchComponent,
    MostusedequipmentpersurgeonComponent,
    NotificationsComponent,
    TempTagSearchComponent,
    UserLocatorComponent,
    UserLocatorHistoryComponent,
    LoginHistoryComponent,
    UserEntranceComponent,
    UserEntranceHistoryComponent,
    TaskComponent,
    SensorLocatorComponent,
    SensorLocatorHistoryComponent,
    ToursComponent,
    ToureventsComponent,
    TourincidentsComponent,
    AKDevicesComponent,
    DeviceTourStatsComponent,
    TitleCasePipe,
    GuardTourStatsComponent
  ],
  exports: [
    LocationComponent,
    FloormapComponent,
    ImageUploadComponent,
    AKTagComponent,
    AKCategoryComponent,
    AKThingsComponent,
    AKUsersComponent,
    AkDateFormatorComponent,
    AkPhoneCodeComponent,
    LocatormapComponent,
    RoutemapComponent,
    UserRouteMapComponent,
    SearchComponent,
    ProductComponent,
    SimplesearchComponent,
    LocationsearchComponent,
    OrderComponent,
    ShipmentComponent,
    ReportsComponent,
    CasespersurgeryComponent,
    CasespercityComponent,
    CasesperhospitalComponent,
    CasesnotclosedComponent,
    CasespersurgeonComponent,
    UnshippedproductsComponent,
    ItemsnotdeliveredComponent,
    DiagnPointSensorTrackingComponent,
    DiagnPointLocationTrackingComponent,
    ShipmentsdueComponent,
    ShipmentdeliverytimecarrierComponent,
    LocationzonesComponent,
    ShipmentharddeliveredComponent,
    ShipmentsinjeopardyComponent,
    UserListSearchComponent,
    GroupListSearchComponent,
    ProductsorderedComponent,
    StationaryshipmentComponent,
    PartialshipmentsComponent,
    ProductLocatorComponent,
    ProductLocatorHistoryComponent,
    ShipmentOrchestrationComponent,
    ProductOrchestrationComponent,
    SensorstatusComponent,
    AppstatusComponent,
    DeviceLocatorComponent,
    DeviceLocatorHistoryComponent,
    AppGatewaySearchComponent,
    ProductsreadytodispatchComponent,
    SkusensorComponent,
    SkusensorhistoryComponent,
    ShipmentdeliverytimeComponent,
    ShipmentscountbylocationComponent,
    MobileLogsComponent,
    AppSearchComponent,
    MostusedequipmentpersurgeonComponent,
    NotificationsComponent,
    TempTagSearchComponent,
    UserLocatorComponent,
    UserLocatorHistoryComponent,
    LoginHistoryComponent,
    UserEntranceComponent,
    UserEntranceHistoryComponent,
    TaskComponent,
    SensorLocatorComponent,
    SensorLocatorHistoryComponent,
    ToursComponent,
    ToureventsComponent,
    TourincidentsComponent,
    AKDevicesComponent,
    DeviceTourStatsComponent,
    TitleCasePipe,
    GuardTourStatsComponent
  ],
  providers: [SigV4Utils, UserService]
})
export class WidgetModule {}
