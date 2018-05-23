import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

import { environment } from '../../../environments/environment';
import { HttpRestService } from '../../core/http-rest.service';
import { OrderModel } from './order.model';

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
   * Get Reports Datalist API
   */
  getReports(apiName: string, query: string): Observable<OrderModel> {
    return this.akRestService.get('report'+environment.serverEnv+'/'+ apiName + query)
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
}
