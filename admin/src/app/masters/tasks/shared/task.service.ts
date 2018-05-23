import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { HttpRestService } from '../../../core/http-rest.service';
import { environment } from '../../../../environments/environment';
import { Task, TaskModel } from './task.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class TaskService {
  
  serviceUrl = 'tasks' + environment.serverEnv;

  constructor(private akRestService: HttpRestService) {
    console.log(environment.serverEnv);
   }

  /**
   * Get All Record Lists
   */
  getAll(query: string): Observable<TaskModel> {
    query += '&u=admin';
    return this.akRestService.get(this.serviceUrl + query)
      .map(res => res.json());
  }

  /**
   * Read the task api
   * @param id
   */
  get(id) {
    return this.akRestService.get(this.serviceUrl + '/' + id)
      .map(res => res.json());
  }

  /**
   * Read the task api ( Public mode )
   * @param id
   */
  getPublic(id) {
    return this.akRestService.getPublic(this.serviceUrl + '/detail/' + id)
      .map(res => res.json());
  }

  /**
   * Save Task Services
   * @param request
   */
  add(request) {
    return this.akRestService.post(this.serviceUrl, request, 'multipart/form-data;')
      .map(res => res.json());
  }

  /**
   * Update the task
   * @param request
   * @param id
   */
  update(request, id) {
    return this.akRestService.put(this.serviceUrl + '/' + id, request)
      .map(res => <Task>res.json());
  }

  /**
   * Remove Task
   * @param request
   */
  remove(request) {
    return this.akRestService.post(this.serviceUrl, request)
      .map(res => res.json());
  }

  /**
   * Read the tour api ( Public mode )
   * @param id
   */
  getPublicTourById(id) {
    return this.akRestService.getPublic(this.serviceUrl + '/tours/' + id)
      .map(res => res.json());
  }

  /**
   * Read the tour api ( Public mode )
   * @param id
   */
  getPublicTourByDeviceAndTime(deviceId, timestamp) {
    return this.akRestService.getPublic(this.serviceUrl + '/tours/device?deviceId=' + deviceId + '&ts=' + timestamp )
      .map(res => res.json());
  }
}
