import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { environment } from '../../../../environments/environment';

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

import { HttpRestService } from '../../../core/http-rest.service';
import { Location, LocationModel } from './location.model';

@Injectable()
export class LocationService {
  serviceUrl = 'locations' + environment.serverEnv;
  constructor(private akRestService: HttpRestService) { }

  /**
   * Get All Record Lists
   */
  getAll(query: string): Observable<LocationModel> {
    return this.akRestService.get(this.serviceUrl + query)
      .map((res:any) => res.json());
  }

  /**
   * Get All Record Lists ( No AUTH MODE )
   */
  getAllPublic(query: string): Observable<LocationModel> {
    return this.akRestService.getPublic(this.serviceUrl + query)
      .map((res:any) => res.json());
  }

  /**
   * Read the location api
   * @param id
   */
  get(id: any) {
    return this.akRestService.get(this.serviceUrl + '/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Read the location api ( No Auth Mode)
   * @param id
   */
  getPublic(id: any) {
    return this.akRestService.get(this.serviceUrl + '/locations/detail/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Save Location Services
   * @param request
   */
  add(request: any) {
    return this.akRestService.post(this.serviceUrl, request, 'multipart/form-data;')
      .map((res:any) => res.json());
  }

  /**
   * Update the location
   * @param request
   * @param id
   */
  update(request: any, id: any) {
    return this.akRestService.put(this.serviceUrl + '/' + id, request)
      .map((res:any) => <Location>res.json());
  }

  /**
   * Remove Location
   * @param request
   */
  remove(request: any) {
    return this.akRestService.post(this.serviceUrl, request)
      .map((res:any) => res.json());
  }
}
