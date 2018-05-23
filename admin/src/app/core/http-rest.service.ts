import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { environment } from '../../environments/environment';
// import { Configuration } from './ak.constants';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class HttpRestService {
  constructor(private http: Http) {}

  /**
   * Generic function for setting up the headers
   * @param headers
   */
  createAuthorizationHeader(headers: Headers) {
    // headers.append('Content-Type', this.config.content_type);
    // headers.append('Accept', this.config.accept);
    headers.append('Authorization', window.localStorage.getItem('apitoken'));

    return headers;
  }

  /**
   * API function for listing and getting details
   * @param url
   */
  get(url) {
    const headers = new Headers();
    headers.append('Content-Type', 'text/plain');
    headers.append('Accept', 'application/json');
    this.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers });

    return this.http.get(environment.server + url, options).catch(this.handleError);
  }

  /**
   * API function for listing and getting details ( No AUTH MODE )
   * @param url
   */
  getPublic(url) {
    const headers = new Headers();
    headers.append('Content-Type', 'text/plain');
    headers.append('Accept', 'application/json');
    headers.append('Authorization', 'noauth');
    const options = new RequestOptions({ headers: headers });

    return this.http.get(environment.server + url, options).catch(this.handleError);
  }

  private handleError(error: Response | any) {
    console.log('in catch--');
    // console.log(error);
    let errorResponse: ErrorResponse;
    if (error.status === 403) {
      return Observable.throw(error);
    } else if (error instanceof Response) {
      errorResponse = error.json() || '';
      // console.log(errorResponse);
      // const err = body.error || JSON.stringify(body);
      // errMsg = `${errorResponse.data[0].message}`;
      return Observable.throw(errorResponse);
    }
    return null;
  }

  /**
   * API function for saving data
   * @param url
   * @param data
   * @param conteType
   */
  post(url, data, conteType: string = 'application/json;') {
    let headers = new Headers();
    headers.append('Content-Type', conteType);
    headers.append('Accept', 'application/json;');
    this.createAuthorizationHeader(headers);
    console.log(environment.server + url + JSON.stringify(data));
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(environment.server + url, JSON.stringify(data), options)
      .catch(this.handleError);
  }
  /**
   * API function for update the data
   * @param url
   * @param data
   */
  put(url, data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json;');
    headers.append('Accept', 'application/json;');
    this.createAuthorizationHeader(headers);
    console.log(environment.server + url + JSON.stringify(data));
    let options = new RequestOptions({ headers: headers });
    return this.http
      .put(environment.server + url, JSON.stringify(data), options)
      .catch(this.handleError);
  }

  /**
   * API function to delete the record
   * @param url
   * @param id
   */
  delete(url) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json;');
    headers.append('Accept', 'application/json;');
    this.createAuthorizationHeader(headers);
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(environment.server + url, options).catch(this.handleError);
  }
}

export class ErrorResponse {
  code: number;
  message: string;
  data: Error[];
}

export class Error {
  errorCode: number;
  message: string;
}
