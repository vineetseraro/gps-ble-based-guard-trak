import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from 'app/themes/stryker/header/header.component';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'notification-box',
  templateUrl: './notification-box.component.html',
  styleUrls: ['./notification-box.component.scss']
})
export class NotificationBoxComponent implements OnInit {

  constructor(private router: Router, 
              private headerComponent: HeaderComponent, public dashboardService: DashboardService) { }

  @Input()
  notifications: Array<any>


  public redirectTo(obj){
    var redirectModule, redirectModuleId;
    if(obj.type.indexOf('Shipment') !== -1 || obj.type.indexOf('Issue') !== -1) {
      redirectModule = 'shipments';
      redirectModuleId = obj.params.shipmentId
      this.router.navigate([redirectModule+'/'+redirectModuleId+'/edit']);
    } else if (obj.type.indexOf('Order') !== -1) {
      redirectModule = 'orders';
      redirectModuleId = obj.params.orderId
      this.router.navigate([redirectModule+'/'+redirectModuleId+'/edit']);
    } else if (obj.type.indexOf('GPS') !== -1 || obj.type.indexOf('Bluetooth') !== -1) {
      redirectModule = 'reports/appstatus';
      this.router.navigate([redirectModule]);
    }
    this.headerComponent.toggleNotif();
 }

 gotToNotifications(){
  this.dashboardService.isNotifVisible = false;
  this.router.navigate(['notifications']);
 }

  public getNotificationType(obj) {
    let cssClass;
    switch (obj.type) {
      case 'GPSBluetoothDown':
        cssClass = 'notification-bluetooth';
        break;

      case 'ShipmentScheduledCR':
      case 'ShipmentScheduledSR':
      case 'ShipmentHardDeliveredCR':
        cssClass = 'notification-shipment-delivered';
        break;

      case 'IssueCreatedSR':
      case 'OrderCreation':
        cssClass = 'notification-issue-created';
        break;

      case 'GPSBluetoothDown':
      cssClass = 'notification-gps';  

      default:
        cssClass = 'notification-issue-responded';

    }
    return cssClass;

  }

  ngOnInit() {
  }

}
