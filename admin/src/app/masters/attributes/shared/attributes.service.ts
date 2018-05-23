import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpRestService } from '../../../core/http-rest.service';
import { environment } from '../../../../environments/environment';
import { AddRequestModel, AttributeDetailsModel, AttributeModel, AttributeTypeModel } from './attribute.model';

@Injectable()
export class AttributesService {

  serviceUrl = 'attributes' + environment.serverEnv;

  /**
   * Creates an instance of AttributesService.
   * @param {HttpRestService} akRestService
   * @memberof AttributesService
   */
  constructor(private akRestService: HttpRestService) {

  }
  /**
   * Function for getting attributes
   * @param {string} query
   * @returns
   * @memberof AttributesService
   */
  getAttributes(query: string) {
    return this.akRestService.get(this.serviceUrl + query).map((res:any) => <AttributeModel>res.json());
  }
  /**
   * Function for adding the attributes
   * @param {AddRequestModel} request
   * @returns
   * @memberof AttributesService
   */
  addAttribute(request: AddRequestModel) {
    return this.akRestService.post(this.serviceUrl, request).map((res:any) => <AttributeTypeModel>res.json());
  }
  /**
   * Function for editing the attributes
   * @param {AddRequestModel} request
   * @param {string} id
   * @returns
   * @memberof AttributesService
   */
  editAttribute(request: AddRequestModel, id: string) {
    return this.akRestService.put(this.serviceUrl + '/' + id, request).map((res:any) => <AttributeTypeModel>res.json());
  }
  /**
   * Function for get the attribute details
   * @param {string} id
   * @returns
   * @memberof AttributesService
   */
  getAttributeDetails(id: string) {
    return this.akRestService.get(this.serviceUrl + '/' + id).map((res:any) => <AttributeDetailsModel>res.json());
  }
}
