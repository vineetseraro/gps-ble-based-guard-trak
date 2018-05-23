import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { HttpRestService } from '../../../core/http-rest.service';
import { UserGadgetModel,UserGadget } from './user-gadget.model';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';

@Injectable()
export class UserGadgetService {

  serviceUrl = 'dashboard' + environment.serverEnv;

  constructor(private akRestService: HttpRestService) { }

  /**
   * Get All Record Lists
   */
  getAll(): Observable<UserGadget> {
    return this.akRestService.get(this.serviceUrl + '/gadgets/user')
      .map((res:any) => res.json());
  }

  /**
   * Read the collection api
   * @param id
   */
  get(id:any) {
    return this.akRestService.get(this.serviceUrl + '/gadgets/user/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Save UserGadget Services
   * @param request
   */
  add(request:any) {
    return this.akRestService.post(this.serviceUrl + '/gadgets/user', request, 'multipart/form-data;')
      .map((res:any) => res.json());
  }

  /**
   * Update the collection
   * @param request
   * @param id
   */
  update(request:any) {
    return this.akRestService.put(this.serviceUrl + '/gadgets/user/', request)
      .map((res:any) => <UserGadgetModel>res.json());
  }

  /**
   * Remove UserGadget
   * @param request
   */
  remove(request:any) {
    return this.akRestService.post(this.serviceUrl + '/gadgets/user', request)
      .map((res:any) => res.json());
  }
}
