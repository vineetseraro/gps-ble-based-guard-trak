import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { HttpRestService } from '../../../core/http-rest.service';

@Injectable()
export class ConfigurationService {

  serviceUrl = 'configuration' + environment.serverEnv;
  constructor(private akRestService: HttpRestService) { }

  /**
   * Get Configuration Values
   * @param id
   */
  get() {
    return this.akRestService.get(this.serviceUrl)
      .map((res:any) => res.json());
  }

  /**
   * Save Configuration Services
   * @param request
   */
  add(request:any) {
    return this.akRestService.put(this.serviceUrl, request)
      .map((res:any) => res.json());
  }
}
