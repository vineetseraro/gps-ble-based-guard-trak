import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

import { environment } from '../../../../environments/environment';
import { HttpRestService } from '../../../core/http-rest.service';
import { AppsModel, BeaconModel, GatewayModel, SyncModel, TempTagsModel, NfcTagsModel } from './things.model';

@Injectable()
export class ThingsService {
  serviceUrl = 'things' + environment.serverEnv;
  syncServiceUrl = 'jobs' + environment.serverEnv;

  constructor(private akRestService: HttpRestService) {}

  /**
   * Get All Record Lists
   */
  getAllBeacons(query: string): Observable<BeaconModel> {
    return this.akRestService.get(this.serviceUrl + '/beacons' + query).map((res:any) => res.json());
  }

  /**
   * Read the collection api
   * @param id
   */
  getBeacon(id) {
    return this.akRestService.get(this.serviceUrl + '/beacons' + '/' + id).map((res:any) => res.json());
  }
  /**
   * Read the collection api
   * @param id
   */
  getTempTag(id) {
    return this.akRestService.get(this.serviceUrl + '/temptags' + '/' + id).map((res:any) => res.json());
  }

    /**
   * Read the collection api
   * @param id
   */
  getNfcTag(id) {
    return this.akRestService.get(this.serviceUrl + '/nfctags' + '/' + id).map((res:any) => res.json());
  }

  /**
   * Get All Record Lists
   */
  getAllTempTags(query: string): Observable<TempTagsModel> {
    return this.akRestService.get(this.serviceUrl + '/temptags' + query).map((res:any) => res.json());
  }

    /**
   * Get All Record Lists
   */
  getAllNfcTags(query: string): Observable<NfcTagsModel> {
    return this.akRestService.get(this.serviceUrl + '/nfctags' + query).map((res:any) => res.json());
  }
  /**
 * Get All Record Lists
 */
  getAllGateways(query: string): Observable<GatewayModel> {
    return this.akRestService.get(this.serviceUrl + '/gateways' + query).map((res:any) => res.json());
  }

  getApp(id) {
    return this.akRestService.get(this.serviceUrl + '/devices' + '/' + id).map((res:any) => res.json());
  }

  /**
   * Read the collection api
   * @param id
   */
  getGateway(id: any) {
    return this.akRestService.get(this.serviceUrl + '/gateways' + '/' + id).map((res:any) => res.json());
  }

  getAllApps(query: string): Observable<AppsModel> {
    return this.akRestService.get(this.serviceUrl + '/devices' + query).map((res:any) => res.json());
  }

  updateApp(request: any, id: any) {
    return this.akRestService
      .put(this.serviceUrl + '/devices' + '/' + id, request)
      .map((res:any) => <AppsModel>res.json());
  }

  /**
   * Read the collection api ( Public mode)
   * @param id
   */
  getGatewayPubic(id: any) {
    return this.akRestService
      .getPublic(this.serviceUrl + '/gateways' + '/' + id)
      .map((res:any) => res.json());
  }

  /**
   * Save Collection Services
   * @param request
   */
  add(request: any) {
    return this.akRestService
      .post('things', request, 'multipart/form-data;')
      .map((res:any) => res.json());
  }

  addGateway(request: any) {
    return this.akRestService
      .post(this.serviceUrl + '/gateways', request, 'multipart/form-data;')
      .map((res:any) => res.json());
  }
  addTempTag(request: any) {
    return this.akRestService
      .post(this.serviceUrl + '/temptags', request, 'multipart/form-data;')
      .map((res:any) => res.json());
  }

  addNfcTag(request: any) {
    return this.akRestService
      .post(this.serviceUrl + '/nfctags', request, 'multipart/form-data;')
      .map((res:any) => res.json());
  }

  /**
   * Update the collection
   * @param request
   * @param id
   */
  update(request: any, id: any) {
    return this.akRestService
      .put(this.serviceUrl + '/beacons' + '/' + id, request)
      .map((res:any) => <BeaconModel>res.json());
  }
  /**
   * Update the collection
   * @param request
   * @param id
   */
  updateTempTag(request: any, id: any) {
    return this.akRestService
      .put(this.serviceUrl + '/temptags' + '/' + id, request)
      .map((res:any) => <TempTagsModel>res.json());
  }

  /**
   * Update the collection
   * @param request
   * @param id
   */
  updateNfcTag(request: any, id: any) {
    return this.akRestService
      .put(this.serviceUrl + '/nfctags' + '/' + id, request)
      .map((res:any) => <TempTagsModel>res.json());
  }

  
  updateGateway(request: any, id: any) {
    return this.akRestService
      .put(this.serviceUrl + '/gateways' + '/' + id, request)
      .map((res:any) => <GatewayModel>res.json());
  }
  /**
   * Remove Collection
   * @param request
   */
  remove(request: any) {
    return this.akRestService.post(this.serviceUrl, request).map((res:any) => res.json());
  }

  sync(syncRequest: any): Observable<SyncModel> {
    return this.akRestService
      .post(this.syncServiceUrl + '/sync', syncRequest)
      .map((res:any) => res.json());
  }

  getProductTemperatureData(productId) {
    return this.akRestService
      .get(this.serviceUrl + '/temptags/scanhistory' + '/' + productId)
      .map((res:any) => res.json());
  }
}
