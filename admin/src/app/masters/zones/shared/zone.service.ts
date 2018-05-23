import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { environment } from '../../../../environments/environment';
import { HttpRestService } from '../../../core/http-rest.service';
import { ZoneModel } from './zone.model';

@Injectable()
export class ZoneService {
  serviceUrl = 'locations' + environment.serverEnv + '/zones';
  serviceUrlZone = 'locations' + environment.serverEnv + '/floors';
  constructor(private akRestService: HttpRestService) {}

  /**
   * Get All Record Lists
   */
  getAll(query: string): Observable<ZoneModel> {
    return this.akRestService.get(this.serviceUrl + query).map((res: any) => res.json());
  }

  /**
   * Get All Record Lists ( No AUTH MODE )
   */
  getAllPublic(query: string): Observable<ZoneModel> {
    return this.akRestService.getPublic(this.serviceUrl + query).map((res: any) => res.json());
  }

  /**
   * Read the location api
   * @param id
   */
  get(id: any) {
    return this.akRestService.get(this.serviceUrl + '/' + id).map((res: any) => res.json());
  }

  /**
   * Save Location Services
   * @param request
   */
  add(request: any) {
    return this.akRestService
      .post(this.serviceUrl, request, 'multipart/form-data;')
      .map((res: any) => res.json());
  }

  /**
   * Update the location
   * @param request
   * @param id
   */
  update(request: any, id: any) {
    return this.akRestService
      .put(this.serviceUrl + '/' + id, request)
      .map((res: any) => <Location>res.json());
  }

  /**
   * Remove Location
   * @param request
   */
  remove(request: any) {
    return this.akRestService.post(this.serviceUrl, request).map((res: any) => res.json());
  }

  /**
   * Get Zone By Floor
   * @param request
   */
  getZone(id: any) {
    return this.akRestService
      .get(this.serviceUrlZone + '/' + id + '/zones?dd=1')
      .map((res: any) => res.json());
  }
  /**
   * Get Zone By Floor
   * @param request
   */
  getProductsinZone(id: any) {
    return this.akRestService
      .get(this.serviceUrl + '/' + id + '/products')
      .map((res: any) => res.json());
  }
}
