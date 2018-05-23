import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { HttpRestService } from '../../../core/http-rest.service';
import { environment } from '../../../../environments/environment';
import { Product, ProductModel } from './product.model';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class ProductService {
  serviceUrl = 'products' + environment.serverEnv;

  constructor(private akRestService: HttpRestService) {
    console.log(environment.serverEnv);
  }

  /**
   * Get All Record Lists
   */
  getAll(query: string): Observable<ProductModel> {
    return this.akRestService.get(this.serviceUrl + query).map((res:any) => res.json());
  }

  /**
   * Read the product api
   * @param id
   */
  get(id:any) {
    return this.akRestService.get(this.serviceUrl + '/' + id).map((res:any) => res.json());
  }

  /**
   * Read the product api ( Public mode )
   * @param id
   */
  getPublic(id) {
    return this.akRestService.getPublic(this.serviceUrl + '/detail/' + id).map((res:any) => res.json());
  }

  /**
   * Save Product Services
   * @param request
   */
  add(request:any) {
    return this.akRestService
      .post(this.serviceUrl, request, 'multipart/form-data;')
      .map((res:any) => res.json());
  }

  /**
   * Update the product
   * @param request
   * @param id
   */
  update(request:any , id:any) {
    return this.akRestService
      .put(this.serviceUrl + '/' + id, request)
      .map((res:any) => <Product>res.json());
  }

  /**
   * Remove Product
   * @param request
   */
  remove(request:any) {
    return this.akRestService.post(this.serviceUrl, request).map((res:any) => res.json());
  }
}
