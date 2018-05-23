import { Injectable, OnInit } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { HttpRestService } from '../../../core/http-rest.service';
import { NotificationService } from '../../../masters/notifications/shared/notification.service';


@Injectable()
export class DashboardService implements OnInit {
  serviceUrl = 'notifications' + environment.serverEnv;

  isMenuExpanded: boolean = false;
  isMask = false
  isMenuVisible: boolean = false;
  showProductSearch: boolean = false;
  showInlineLoader: boolean = false;
  akRestService: HttpRestService;
  notificationCount: number;
  notifications: Array<any> = [];
  isNotifVisible = false;
  urbanAirShipWebDevice: any;

  constructor(private notificationService: NotificationService
  ) {

  }

  /**
* Init Method
* @memberof UserLocatorComponent
*/
  public ngOnInit() {
    this.getNotificationList();
  }

  public getNotificationList() {
    this.notificationService.getAll('?web=1&read=0&markAsRead=0').subscribe(
      (data: any) => {

        this.notifications = data.data.map(x => {

          return x
        });
        this.notificationCount = data.totalRecords;

        //   this.loader = false;
      },
      (error: any) => {
        //   this.emptyMessage = StringUtil.emptyMessage;
        if (error.code === 210 || error.code === 404) {
          this.notifications = [];
          this.notificationCount = 0;
        }
        //   this.loader = false;
      }
    );
  }
}