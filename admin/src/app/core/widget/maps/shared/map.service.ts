// import { any } from 'codelyzer/util/function';
import { Injectable } from '@angular/core';
// import {Observable} from 'rxjs/Rx';

declare var google: any;

/**
 * Map Service Class have the common functionalities for maps.
 *
 * @export
 * @class MapService
 */
@Injectable()
export class MapService {

  /**
   * Creates an instance of MapService.
   * @memberof MapService
   */
  constructor() { }

  /**
   * Prepare google map icon object
   *
   * @param {string} url
   * @returns {*}
   * @memberof MapService
   */
  getIcon(url: string): any  {
    return {
        url: url,
        size: new google.maps.Size(45, 45),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 20),
        scaledSize: new google.maps.Size(35, 35),
        labelOrigin: new google.maps.Point(20, 5)
    };
  }

  /**
   * Preapre google map marker label object
   *
   * @param {string} text
   * @returns {*}
   * @memberof MapService
   */
  getIconText(text: string): any {
    if (text === '') {
        return text;
    }
    return {
        text: text,
        color: 'red',
        fontSize: '18px',
        fontWeight: 'bold',
        class : 'marker-label'
    }
  }

  /**
   * Get icons list
   *
   * @returns {*}
   * @memberof MapService
   */
  getIconList(): any {
    return {
        'known_items' : '../../../../../assets/ic_local_pharmacy_black_24px.svg',
        'known_noitems' : '../../../../assets/ic_local_hospital_black_24px.svg',
        'unknown_items' : '../../../../assets/ic_add_location_black_24px.svg',
        'unknown_noitems' : '../../../../assets/ic_place_black_24px.svg'
    }
  }

}
