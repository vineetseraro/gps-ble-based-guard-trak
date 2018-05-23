import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';

import { environment } from '../../../environments/environment';
import { HttpRestService } from '../../core/http-rest.service';
import { EmployeeLocatorHistoryModel, UserEntranceModel, 
  LoginHistoryModel, TourEventModel, 
  DeviceTourStatsModel, GuardTourStatsModel } from './employee.model';
import {
    DeviceLocatorHistoryMapModel,
    DeviceLocatorMapModel,
    DeviceLocatorModel,
    ProductLocatorHistoryMapModel,
    ProductLocatorMapModel,
    ProductLocatorModel,
    ProductModel,
    ShipmentLocatorMapModel,
} from './product.model';

@Injectable()
export class ReportService {
  
  serviceUrl = 'products' + environment.serverEnv;

  constructor(private akRestService: HttpRestService) {
    console.log(environment.serverEnv);
   }

  /**
   * Get All Record Lists
   */
  getAll(query: string): Observable<ProductModel> {
    return this.akRestService.get(this.serviceUrl + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Product Locator API
   */
  productLocator(query: string): Observable<ProductLocatorModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/product-locator' + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Product Locator History API
   */
  productLocatorHistory(productId: string, query: string): Observable<ProductLocatorModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/product-locator-history/' + productId + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Product Locator Map API
   */
  productLocatorMap(query: string): Observable<ProductLocatorMapModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/product-locator-map' + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Product Locator History Map API
   */
  productLocatorHistoryMap(productId: string, query: string): Observable<ProductLocatorHistoryMapModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/product-locator-history-map/' + productId + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Product Locator API
   */
  deviceLocator(query: string): Observable<DeviceLocatorModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/device-locator' + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Device Locator Map API
   */
  deviceLocatorMap(query: string): Observable<DeviceLocatorMapModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/device-locator-map' + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Device Locator History API
   */
  deviceLocatorHistory(deviceId: string, query: string): Observable<DeviceLocatorModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/device-locator-history/' + deviceId + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Device Locator History Map API
   */
  deviceLocatorHistoryMap(deviceId: string, query: string): Observable<DeviceLocatorHistoryMapModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/device-locator-history-map/' + deviceId + query)
      .map((res:any) => res.json());
  }


    /**
   * Get Product Locator API
   */
  employeeLocator(query: string): Observable<any> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/user-locator-list' + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Shipment Locator Map API
   */
  shipmentLocatorMap(query: string): Observable<ShipmentLocatorMapModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/shipment-locator-map' + query)
      .map((res:any) => res.json());
  }


  /**
   * Get Employee Locator Map API
   */
  employeeLocatorMap(query: string): Observable<any> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/user-locator-map' + query)
      .map((res:any) => res.json());
  }  


  /**
   * Get Employee Locator History API
   */
  getEmployeeLocatorList(employeeId: string, query: string): Observable<EmployeeLocatorHistoryModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/user-locator-history/' + employeeId + query)
      .map((res:any) => res.json());
  }
  

  /**
   * Get Employee Locator History Map API
   */
  employeeLocatorHistoryMap(employeeId: string, query: string): Observable<any> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/user-locator-history-map/' + employeeId + query)
      .map((res: any) => res.json());
  }

  /**
   * Get User Entrance  API
   */
  userEntrance(query: string): Observable<UserEntranceModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/user-entrance' + query)
      .map((res: any) => res.json());
  }

  /**
   * Get User Entrance History API
   */
  userEntranceHistory(userId: string, locationType:string, location:string, dt: string, query: string): Observable<UserEntranceModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv 
      + '/user-entrance-history/' + userId + '/' 
      + locationType + '/' + location + '/' + dt + query)
      .map((res: any) => res.json());
  }

  /**
   * Get Login History
   */
  loginHistory(query: string): Observable<LoginHistoryModel> {
    return this.akRestService.get('report' + environment.serverEnv + '/login-history' + query)
      .map((res: any) => res.json());
  }

  /**
   * Get Product Locator API
   */
  sensorLocator(query: string): Observable<ProductLocatorModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/sensor-locator' + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Product Locator History API
   */
  sensorLocatorHistory(productId: string, query: string): Observable<ProductLocatorModel> {
    return this.akRestService.get('trackingreports' + environment.serverEnv + '/sensor-locator-history/' + productId + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Event List API
   */
  eventList(query: string): Observable<TourEventModel> {
    return this.akRestService.get('report' + environment.serverEnv + '/tour/events' + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Event Details API
   */
  eventDetails(eventId: string, query: string): Observable<TourEventModel> {
    return this.akRestService.get('report' + environment.serverEnv + '/tour/event/' + eventId + query)
      .map((res:any) => res.json());
  }

  /**
   * Get Event List API
   */
  deviceTourStatsList(query: string): Observable<DeviceTourStatsModel> {
    console.log('222')
    return this.akRestService.get('report' + environment.serverEnv + '/deviceTourStats' + query)
      .map((res:any) => res.json());
  }

    /**
   * Get Event List API
   */
  
  guardTourStatsList(query: string): Observable<GuardTourStatsModel> {
    console.log('1111')
    return this.akRestService.get('report' + environment.serverEnv + '/guardTourStats' + query)
      .map((res:any) => res.json());
  }

}
