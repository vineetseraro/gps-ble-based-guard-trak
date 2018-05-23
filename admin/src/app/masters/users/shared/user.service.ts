import 'rxjs/add/operator/map';
import { HttpRestService } from '../../../core/http-rest.service';
import { UserListModel } from './user.model';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { SelectItem } from 'primeng/primeng';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class UserService {
  // serviceUrl = 'categories' + environment.serverEnv;
  serviceUrl = 'users' + environment.serverEnv;

  constructor(private akRestService: HttpRestService) { }

  listUsers(query: string): Observable<UserListModel> {
    return this.akRestService.get(this.serviceUrl + query).map((res: any) => <UserListModel>res.json());
  }

  listUsersDropDown(): Observable<SelectItem> {
    return this.akRestService.get(this.serviceUrl + '?dd=1')
      .map((res: any) => res.json())
      .map((x: any) => x.data)
      .map(x => {
        return {
          value: x.sub,
          label: x.name
        }
      });
  }

  get(id: any) {
    return this.akRestService.get(this.serviceUrl + '/' + id)
      .map((res: any) => res.json());
  }

  addUser(request: any) {
    return this.akRestService.post(this.serviceUrl, request).map((res: any) => <any>res.json());
  }

  editUser(request: any, sub: String) {
    return this.akRestService.put(this.serviceUrl + '/' + sub, request).map((res: any) => <any>res.json());
  }
  register(request: any) {
    return this.akRestService
      .post(this.serviceUrl + '/register', request)
      .map((res: any) => <any>res.json());
  }

  editProfile(request: any) {
    return this.akRestService
      .put(this.serviceUrl + '/profile', request)
      .map((res: any) => <any>res.json());
  }
}
