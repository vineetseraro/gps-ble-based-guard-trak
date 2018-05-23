import 'rxjs/add/operator/map';
import { HttpRestService } from '../../../core/http-rest.service';
import { AttributeModel } from '../../attributes/shared/attribute.model';
import { CategoryAddRequest, CategoryListModel } from './category.model';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';

@Injectable()
export class CategoryApiService {

  serviceUrl = 'categories' + environment.serverEnv;

  constructor(private akRestService: HttpRestService) { }

  getCategories(query: string): Observable<CategoryListModel> {
    return this.akRestService.get(this.serviceUrl + query).map((res:any) => <CategoryListModel>res.json());
  }

  // why this method is in category service
  getAttributes() {
    return this.akRestService.get('attributes' + environment.serverEnv).map((res:any) => <AttributeModel>res.json());
  }

  addCategory(request: CategoryAddRequest) {
    return this.akRestService.post(this.serviceUrl, request).map((res:any) => <CategoryAddRequest>res.json());
  }

  get(id: any) {
    return this.akRestService.get(this.serviceUrl + '/' + id)
      .map((res:any) => res.json());
  }

  remove(request: any) {
    return this.akRestService.post(this.serviceUrl, request).map((res:any) => res.json());
  }
  editCategory(request: CategoryAddRequest, id: string) {
    return this.akRestService.put(this.serviceUrl + '/' + id, request).map((res:any) => <CategoryAddRequest>res.json());
  }
}
