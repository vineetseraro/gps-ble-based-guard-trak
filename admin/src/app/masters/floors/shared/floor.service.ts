import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

import { environment } from '../../../../environments/environment';
import { HttpRestService } from '../../../core/http-rest.service';
import { FloorModel } from './floor.model';

@Injectable()
export class FloorService {
  serviceUrl = 'locations' + environment.serverEnv + '/floors';
  serviceUrlFloor = 'locations' + environment.serverEnv;
  constructor(private akRestService: HttpRestService) { }

  /**
   * Get All Record Lists
   */
  getAll(query: string): Observable<FloorModel> {
    return this.akRestService.get(this.serviceUrl + query)
      .map((res:any) => res.json());
  }

  /**
   * Get All Record Lists ( No AUTH MODE )
   */
  getAllPublic(query: string): Observable<FloorModel> {
    return this.akRestService.getPublic(this.serviceUrl + query)
      .map((res:any) => res.json());
  }

  /**
   * Read the floor api
   * @param id
   */
  get(id: any) {
    return this.akRestService.get(this.serviceUrl + '/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Save floor Services
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

  /**
   * Get Floor By Location
   * @param request
   */
  getFloor(id: any) {
    return this.akRestService.get(this.serviceUrlFloor + '/' + id + '/floors?dd=1')
      .map((res:any) => res.json());
  }
}
