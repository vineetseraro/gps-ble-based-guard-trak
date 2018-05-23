import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { HttpRestService } from '../../../core/http-rest.service';
import { AudittrailDetailsModel, AudittrailList } from './audittrail.model';

@Injectable()
export class AudittrailService {

  serviceUrl = 'audittrail' + environment.serverEnv;

  /**
   * Creates an instance of AudittrailService.
   * @param {HttpRestService} akRestService
   * @memberof AudittrailService
   */
  constructor(private akRestService: HttpRestService) {

  }
  /**
   * Function for getting attributes
   * @param {string} query
   * @returns
   * @memberof AudittrailService
   */
  getAudittrails(query: string) {
    return this.akRestService.get(this.serviceUrl + query).map((res:any) => <AudittrailList>res.json());
  }

  /**
   * Function for get the attribute details
   * @param {string} id
   * @returns
   * @memberof AudittrailService
   */
  getAudittrailDetails(id: string) {
    return this.akRestService.get(this.serviceUrl + '/' + id).map((res:any) => <AudittrailDetailsModel>res.json());
  }
}
