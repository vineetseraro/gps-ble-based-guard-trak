import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import * as moment from 'moment';
import {Observable} from 'rxjs/Rx';

import { environment } from '../../../../environments/environment';
import { HttpRestService } from '../../../core/http-rest.service';
import { Notification, NotificationModel } from './notification.model';

@Injectable()
export class NotificationService {
  serviceUrl = 'notifications' + environment.serverEnv;

  constructor(private akRestService: HttpRestService) {}

  /**
   * Get All Record Lists
   */
  getAll(query: string): Observable<NotificationModel> {
    return this.akRestService.get(this.serviceUrl + query + '&web=1')
      .map((res:any) => res.json());
  }

  /**
   * Read the Notification api
   * @param id
   */
  get(id:any) {
    return this.akRestService.get(this.serviceUrl + '/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Read the Notification api
   * @param id
   */
  getPublic(id) {
    return this.akRestService.get(this.serviceUrl + '/detail/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Update the Notification
   * @param request
   * @param id
   */
  archive(request) {
    return this.akRestService.put(this.serviceUrl + '/archive', request)
      .map((res:any) => <Notification>res.json());
  }

  /**
   * Remove Notification
   * @param request
   */
  remove(request:any) {
    return this.akRestService.post(this.serviceUrl, request)
      .map((res:any) => res.json());
  }

  /**
   * Format Date
   * @param isodate
   */
  formatDate(isodate) {
    return (isodate = moment(isodate)
      .tz(window.localStorage.getItem('userTimeZone'))
      .format('MM/DD/Y HH:mm'));
  }

  /**
   * Process Date to save
   * @param date
   */
  processDate(date) {
    if (date === '' || date === null) {
      return null;
    } else {
      if (!moment(date, moment.ISO_8601).isValid()) {
        date = moment(date, 'MM/DD/Y HH:mm');
      }
      const dateObj = moment(date);
      dateObj.format();

      const newDateObj = moment.tz(
        dateObj.format('YYYY-MM-DDTHH:mm:ss.SSS'),
        moment.ISO_8601,
        window.localStorage.getItem('userTimeZone')
      );

      return newDateObj.format();
    }
  }

  /**
   * Read the Notification Orchestration
   * @param id
   */
  getNotificationOrchestration(id) {
    return this.akRestService.get(this.serviceUrl + '/orchestrations/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Deliver shipment
   * @param request
   * @param id
   */
  deliver(request, id) {
    return this.akRestService
      .put(this.serviceUrl + '/deliver/' + id, request)
      .map(res => res.json());
  }

  /**
   * load shipment's issue comments
   * @param request
   * @param id
   */
  issueComments(id) {
    return this.akRestService.get('issues' + environment.serverEnv + '/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Create shipment note
   * @param request
   * @param id
   */
  createNote(request) {
    return this.akRestService.post('issues' + environment.serverEnv, request)
      .map((res:any) => res.json());
  }

  /**
   * Bulk action on shipments
   * @param request
   */
  bulkAction(request) {
    return this.akRestService.put(this.serviceUrl + '/bulk', request)
          .map((res:any) => <Notification>res.json());
  }

  /**
   * Cancel shipment
   * @param request
   * @param id
   */
  cancel(id) {
    return this.akRestService.delete(this.serviceUrl + '/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Read the Item Orchestration
   * @param id
   */
  getNotificationItemOrchestration(shipmentId, id) {
    return this.akRestService.get(this.serviceUrl + '/orchestrations/' + shipmentId + '/' + id)
      .map((res:any) => res.json());
   
  }

  testNotify(deviceCode) {
    return this.akRestService
      .post(this.serviceUrl + '/test/' + deviceCode, {})
      .map(res => res.json());
  }
}
