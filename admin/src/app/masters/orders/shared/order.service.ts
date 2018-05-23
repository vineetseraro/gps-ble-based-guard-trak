import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { HttpRestService } from '../../../core/http-rest.service';
import { Order, OrderModel } from './order.model';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';

@Injectable()
export class OrderService {

  serviceUrl = 'orders' + environment.serverEnv;

  constructor(private akRestService: HttpRestService) { }

  /**
   * Get All Record Lists
   */
  getAll(query: string): Observable<OrderModel> {
    return this.akRestService.get(this.serviceUrl + query)
      .map((res:any) => res.json());
  }

  /**
   * Read the Order api
   * @param id
   */
  get(id:any) {
    return this.akRestService.get(this.serviceUrl + '/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Save Order Services
   * @param request
   */
  add(request:any) {
    return this.akRestService.post(this.serviceUrl, request, 'multipart/form-data;')
      .map((res:any) => res.json());
  }

  /**
   * Update the Order
   * @param request
   * @param id
   */
  update(request:any , id:any) {
    return this.akRestService.put(this.serviceUrl + '/' + id, request)
      .map((res:any) => <Order>res.json());
  }

  /**
   * Remove Order
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
      return isodate = moment(isodate).tz(window.localStorage.getItem('userTimeZone')).format('MM/DD/Y HH:mm');
  }

  /**
   * Process Date to save
   * @param date
   */
  processDate(date) {
    if ( date === '' || date === null ) {
      return null;
    } else {
        if ( !moment(date, moment.ISO_8601).isValid() ) {
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
   * Read the Order Orchestration
   * @param id
   */
  getOrderOrchestration(id) {
    return this.akRestService.get(this.serviceUrl + '/orchestrations/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Get order shipments
   * @param id
   */
  getShipments(id) {
    return this.akRestService.get(this.serviceUrl + '/salesrep/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Read the Item Orchestration
   * @param id
   */
  getOrderItemOrchestration(orderId, id) {
    return this.akRestService.get(this.serviceUrl + '/itemorchestrations/' + orderId + '/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Cancel Order
   * @param request
   * @param id
   */
  cancel(id) {
    return this.akRestService.delete(this.serviceUrl + '/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Close Order
   * @param request
   * @param id
   */
  close(id) {
    return this.akRestService.put(this.serviceUrl + '/close/' + id, {})
      .map((res:any) => res.json());
  }

}
