import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { HttpRestService } from '../../../core/http-rest.service';
import { AddRequestModel, TagDetailsModel, TagModel } from './tag.model';
import { environment } from '../../../../environments/environment';

@Injectable()
export class TagService {

  serviceUrl = 'tags' + environment.serverEnv;

  /**
   * Creates an instance of TagService.
   * @param {HttpRestService} akRestService
   * @memberof TagService
   */
  constructor(private akRestService: HttpRestService) {

  }
  /**
   * Function for getting attributes
   * @param {string} query
   * @returns
   * @memberof TagService
   */
  getTags(query: string) {
    return this.akRestService.get(this.serviceUrl + query).map((res:any) => <TagModel>res.json());
  }
  /**
   * Function for adding the attributes
   * @param {AddRequestModel} request
   * @returns
   * @memberof TagService
   */
  addTag(request: AddRequestModel) {
    return this.akRestService.post(this.serviceUrl, request).map((res:any) => <TagDetailsModel>res.json());
  }
  /**
   * Function for editing the attributes
   * @param {AddRequestModel} request
   * @param {string} id
   * @returns
   * @memberof TagService
   */
  editTag(request: AddRequestModel, id: string) {
    return this.akRestService.put(this.serviceUrl + '/' + id, request).map((res:any) => <TagDetailsModel>res.json());
  }
  /**
   * Function for get the attribute details
   * @param {string} id
   * @returns
   * @memberof TagService
   */
  getTagDetails(id: string) {
    return this.akRestService.get(this.serviceUrl + '/' + id).map((res:any) => <TagDetailsModel>res.json());
  }
}
