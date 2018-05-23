import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { HttpRestService } from '../../../core/http-rest.service';
import { Report, ReportModel } from './report.model';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';

@Injectable()
export class ReportService {

  serviceUrl = 'report' + environment.serverEnv;

  constructor(private akRestService: HttpRestService) { }

  /**
   * Get All Record Lists
   */
  getGraphData(type:any): Observable<ReportModel> {
    return this.akRestService.get(this.serviceUrl + '/get-graph-report?type='+type)
      .map((res:any) => res.json());
  }
  /**
   * Get All Record Lists
   */
  getAll(): Observable<ReportModel> {
    return this.akRestService.get(this.serviceUrl + '/widgets')
      .map((res:any) => res.json());
  }

  /**
   * Save Report Services
   * @param request
   */
  add(request:any) {
    return this.akRestService.post(this.serviceUrl + '/widgets', request, 'multipart/form-data;')
      .map((res:any) => res.json());
  }

  /**
   * Update the collection
   * @param request
   * @param id
   */
  update(request:any , id:any) {
    return this.akRestService.put(this.serviceUrl + '/widgets/' + id, request)
      .map((res:any) => <Report>res.json());
  }

  /**
   * Remove Report
   * @param request
   */
  remove(request:any) {
    return this.akRestService.post(this.serviceUrl + '/widgets', request)
      .map((res:any) => res.json());
  }
}
