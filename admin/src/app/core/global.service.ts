import 'rxjs/add/operator/map';
import {
  Dropdown,
  DropdownModel,
  TimeZoneResponse,
  DateTimeResponse,
  DateResponse,
  CountryResponse
} from './global.model';
import { HttpRestService } from './http-rest.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LazyLoadEvent, SelectItem } from 'primeng/primeng';
import { Tag } from '../masters/attributes/shared/attribute.model';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import * as moment from 'moment';
import 'moment-timezone';

@Injectable()
export class GlobalService {
  dropDown: Dropdown[];
  attributes: SelectItem[];

  serviceUrl = 'common' + environment.serverEnv;

  constructor(private akRestService: HttpRestService, private location: Location) { }

  getTimeZones() {
    return this.akRestService
      .get(this.serviceUrl + '/timezones')
      .map((res: any) => <TimeZoneResponse>res.json());
  }

  getDateFormat() {
    return this.akRestService
      .get(this.serviceUrl + '/dateformat')
      .map((res: any) => <DateResponse>res.json());
  }

  getDateTimeFormat() {
    return this.akRestService
      .get(this.serviceUrl + '/datetimeformat')
      .map((res: any) => <DateTimeResponse>res.json());
  }

  getDropdown(moduleName: any, query = '') {
    query = '?' + query + '&dd=1';
    return this.akRestService.get(moduleName + query).map((res: any) => <DropdownModel>res.json());
  }

  getUserDropdown(moduleName: any) {
    return this.akRestService.get(moduleName + '?dd=1').map((res: any) => <any>res.json());
  }

  geSensors(moduleName: any) {
    return this.akRestService
      .get(moduleName + '?dd=1&allowAssociated=1')
      .map((res: any) => <DropdownModel>res.json());
  }

  getParentDropdown(moduleName: any, id: any) {
    if (id) {
      return this.akRestService
        .get(moduleName + '?dd=1&validParentFor=' + id)
        .map((res: any) => <DropdownModel>res.json());
    } else {
      return this.akRestService
        .get(moduleName + '?dd=1')
        .map((res: any) => <DropdownModel>res.json());
    }
  }
  getTagDropdown(query: any) {
    const serviceUrl = 'tags' + environment.serverEnv + '?name=' + (query || '');
    return this.akRestService
      .get(serviceUrl + '&dd=1')
      .map((res: any) => <DropdownModel>res.json());
  }

  export(format = 'csv', entity = '', queryParams = {}, pathParams = {}, entityDisplayName = '') {
    const url = `exports${environment.serverEnv}/${format}`;
    const postData = { entity, queryParams, pathParams, entityDisplayName };
    return this.akRestService.post(url, postData).map((res: any) => res.json());
  }

  getParameter(route: ActivatedRoute) {
    return route.params;
  }
  getTags(tagKeywords: string[], tags: Tag[]) {
    const newTagList: Tag[] = [];
    if (tagKeywords.length === 0) {
      return newTagList;
    }
    for (let i = 0; i < tagKeywords.length; i++) {
      if (tags === undefined || tags.length === 0) {
        console.log('create Keywords');
        const tag = { tagName: tagKeywords[i], tagId: '' };
        console.log('Keywords with name' + tag);
        newTagList.push(tag);
      } else {
        let tag = this.getTag(tagKeywords[i], tags);
        if (tag !== null) {
          newTagList.push(tag);
        } else {
          tag = { tagName: tagKeywords[i], tagId: '' };
          newTagList.push(tag);
        }
      }
    }
    return newTagList;
  }

  getSelectedId(tagKeywords: string[], list: Dropdown[]) {
    const ids: any = [];
    if (tagKeywords.length === 0) {
      return ids;
    }
    if (list === undefined || list === null) {
      return ids;
    }
    for (let i = 0; i < tagKeywords.length; i++) {
      const id = this.getId(tagKeywords[i], list);
      if (id !== undefined && id !== null) {
        ids.push(id);
      }
    }
    return ids;
  }
  getTagKeywords(tags: any[]) {
    const tagKeyWords = [];
    if (tags !== undefined) {
      for (let i = 0; i < tags.length; i++) {
        tagKeyWords.push(tags[i].name);
      }
    }
    return tagKeyWords;
  }

  getKeywords(list: any[]) {
    const tagKeyWords: any = [];
    if (list === undefined || list === null) {
      return tagKeyWords;
    }
    for (let i = 0; i < list.length; i++) {
      tagKeyWords.push(list[i].name);
    }
    return tagKeyWords;
  }

  getTag(keywords: string, tags: Tag[]) {
    for (let i = 0; i < tags.length; i++) {
      if (keywords === tags[i].tagName) {
        return tags[i];
      }
    }
    return null;
  }

  getSelectedItemId(list: any[]) {
    const items = [];
    for (let num = 0; num < list.length; num++) {
      items.push(list[num].id);
    }
    return items;
  }
  getId(keywords: string, list: Dropdown[]) {
    for (let i = 0; i < list.length; i++) {
      if (keywords === list[i].name) {
        return list[i].id;
      }
    }
    return null;
  }

  prepareDropDown(dropDown: Dropdown[], defaultValue: string) {
    let num = 0;
    this.attributes = [];
    if (defaultValue === '') {
    } else {
      this.attributes.push({ label: defaultValue, value: null });
    }

    for (num = 0; num < dropDown.length; num++) {
      this.attributes.push({ label: dropDown[num].name, value: dropDown[num].id });
    }
    return this.attributes;
  }

  prepareUserDropDown(dropDown: any[], defaultValue: string, sub = true) {
    let num = 0;
    this.attributes = [];
    if (defaultValue === '') {
    } else {
      this.attributes.push({ label: defaultValue, value: null });
    }

    for (num = 0; num < dropDown.length; num++) {
      if (sub) {
        this.attributes.push({ label: dropDown[num].name, value: dropDown[num].sub });
      } else {
        this.attributes.push({ label: dropDown[num].name, value: dropDown[num].id });
      }
    }
    return this.attributes;
  }

  // setEmptyMessage(field: any, totalRecords: number) {
  //   if (totalRecords === 0) { field = 'No Records'; }
  //   else { field = ''; }
  // }

  setEmptyMessage(field: any) {
    field = 'No Record';
    field;
  }
  prepareOptionList(dropDown: Dropdown[]) {
    const optionlist = [];
    for (let num = 0; num < dropDown.length; num++) {
      optionlist.push(dropDown[num].name);
    }
    return optionlist;
  }

  prepareHandlerNameList(dropDown: Dropdown[]) {
    let num = 0;

    this.attributes = [];
    for (num = 0; num < dropDown.length; num++) {
      this.attributes.push({ label: dropDown[num].name, value: dropDown[num].name });
    }
    return this.attributes;
  }

  prepareHandlerNameListAddMore(dropDown: Dropdown[]) {
    let num = 0;

    this.attributes = [];
    for (num = 0; num < dropDown.length; num++) {
      this.attributes.push({ label: dropDown[num].name, value: dropDown[num].id });
    }
    return this.attributes;
  }

  public prepareQuery(data: LazyLoadEvent) {
    let num = 0;
    let query: string;
    // query= '?offset=0&limit=1000';
    query = '?offset=' + data.first + '&limit=' + data.rows;

    const sortElement: string[] = [];

    // perepare sort parameter
    if (data.multiSortMeta !== undefined && data.multiSortMeta !== null) {
      for (num = 0; num < data.multiSortMeta.length; num++) {
        // check if parameter contain speceal charater
        const index = data.multiSortMeta[num].field.indexOf('.');
        if (data.multiSortMeta[num].order === -1) {
          if (index > 0) {
            sortElement.push('-' + data.multiSortMeta[num].field.substring(0, index));
          } else {
            sortElement.push('-' + data.multiSortMeta[num].field);
          }
        } else {
          if (index > 0) {
            sortElement.push(data.multiSortMeta[num].field.substring(0, index));
          } else {
            sortElement.push(data.multiSortMeta[num].field);
          }
        }
      }

      // add sorting parameter to url if any apply
      if (sortElement.length > 0) {
        query = query + '&sort=' + sortElement.join(',');
      }
    } else {
      if (data.sortField !== undefined && data.sortField !== null) {
        let sortQuery = '';
        if (data.sortOrder.toString() === '-1') {
          sortQuery = '-' + data.sortField;
        } else {
          sortQuery = data.sortField;
        }
        // const sortQuery = data.sortOrder + data.sortField;
        query = query + '&sort=' + sortQuery;
      }
    }

    // add global filer if apply
    if (data.globalFilter != null) {
      if (data.globalFilter.length > 0) {
        query = query + '&filter=' + data.globalFilter;
      }
    }

    // individual fileter apply if any
    console.log('Add Filter Screen');
    if (data.filters != null) {
      const keyArr: any[] = Object.keys(data.filters);
      keyArr.forEach((key: any) => {
        const index = key.indexOf('.');
        console.log('Key' + key);
        if (index > 0) {
          query = query + '&' + key.substring(0, index) + '=' + data.filters[key].value;
        } else {
          query = query + '&' + key + '=' + data.filters[key].value;
        }
      });
    }
    // data.rows;
    console.log('Add Filter Screen with ' + query);
    return query;
  }

  getCountryPhoneCode() {
    return this.akRestService
      .get(this.serviceUrl + '/countries')
      .map((res: any) => <CountryResponse>res.json());
  }

  // image resize using cloudinary
  processImage(imageObj: any) {
    let imgLarge = '';
    let imgThumb = '';

    if (imageObj && imageObj.url) {
      const profImgObj = imageObj.url.split('/');
      const strToReplace = profImgObj[profImgObj.length - 2];

      if (strToReplace) {
        imgLarge = imageObj.url.replace(
          strToReplace,
          environment.cloudinaryImageOptions.largeImageSize
        );
        imgThumb = imageObj.url.replace(
          strToReplace,
          environment.cloudinaryImageOptions.thumbImageSize
        );
      }
    }

    return [
      {
        source: imgLarge,
        thumbnail: imgThumb,
        original: imageObj.url,
        title: ' '
      }
    ];
  }

  /**
   * Get Order Status from Global Variable
   * @param {any} lists
   * @returns
   * @memberof GlobalService
   */
  getOrderStatusDropDown() {
    const lists: any = {
      'Select Order Status': '',
      Draft: 5,
      Open: 10,
      'Partial Shipped': 25,
      'In Transit': 40,
      'Partial Delivered': 45,
      Delivered: 60,
      Canceled: 70,
      Closed: 90
    };
    const attributes = [];
    for (const key in lists) {
      if ( lists[key] ) {
        attributes.push({ label: key, value: lists[key] });
      }
    }
    return attributes;
  }
  /**
   * Get Order Status from Global Variable
   * @param {any} lists
   * @returns
   * @memberof GlobalService
   */
  getOrderRiskLevelDropDown() {
    const lists: any = {
      'Select Risk Level': '',
      Low: '15-10000',
      Medium: '10-14.99',
      High: '0-9.99'
    };
    const riskLevel = [];
    for (const key in lists) {
      if ( lists[key] ) {
        riskLevel.push({ label: key, value: lists[key] });
      }
    }
    return riskLevel;
  }
  /**
   * Get Order Status from Global Variable
   * @param {any} lists
   * @returns
   * @memberof GlobalService
   */
  timeLapsed() {
    const lists: any = {
      'Select Time Elapsed': '',
      'Over 14 Hours': '14',
      '0 to 3 Hours': '0-3',
      '4 to 7 Hours': '3-7',
      '8 to 14 Hours': '7-14'
    };
    const riskLevel = [];
    for (const key in lists) {
      if ( lists[key] ) {
        riskLevel.push({ label: key, value: lists[key] });
      }
    }
    return riskLevel;
  }
  /**
   * Get Shipment Status Dropdown
   * @param {any} lists
   * @returns
   * @memberof GlobalService
   */
  getShipmentStatusDropDown() {
    const lists: any = {
      Open: 10,
      Scheduled: 20,
      'Partial Shipped': 25,
      'Soft Shipped': 30,
      'In Transit': 40,
      'Partial Delivered': 45,
      'Soft Delivered': 50,
      Delivered: 60,
      Canceled: 70,
      Closed: 90
    };

    const attributes = [{ label: 'Select Shipment Status', value: null }];
    for (const key in lists) {
      if ( lists[key] ) {
        attributes.push({ label: key, value: lists[key] });
      }
    }
    return attributes;
  }

  /**
   * Format Date into ISO Format
   * @param {any} date
   * @returns
   * @memberof GlobalService
   */
  formatDate(date) {
    return moment(date)
      .tz(window.localStorage.getItem('userTimeZone'))
      .utc()
      .format();
    // var datePipe = new DatePipe(date);
    // return datePipe.transform(date, 'yyyy-MM-dd 00:00:00')
  }

  getCalenderDateFormat() {
    const cdateFormat = window.localStorage.getItem('dateFormat');
    return environment.calDtFormatsMapping[cdateFormat];
  }

  /**
   * Get Points Status from Global Variable
   * @param {any} lists
   * @returns
   * @memberof GlobalService
   */
  getPointStatusDropDown() {
    const lists: any = {
      '': 'All',
      false: 'Accepted',
      true: 'Discarded'
    };

    const statuses = [];

    Object.keys(lists).forEach(key => {
      statuses.push({ label: lists[key], value: key });
    });

    return statuses;
  }

  /**
   * Get Discard Reason from Global Variable
   * @param {any} lists
   * @returns
   * @memberof GlobalService
   */
  getDiscardReasonDropDown() {
    const lists = environment.discardReasons;
    const statuses = [];

    Object.keys(lists).forEach(key => {
      statuses.push({ label: lists[key], value: key });
    });

    return statuses;
  }

  /**
   * Go back to previous screen
   * @export
   * @class GlobalService
   */
  goBack() {
    // go back to previous location on cancel. Need to inhance
    this.location.back();
  }

  /**
   * Format Date into User Format
   * @param {any} date
   * @returns
   * @memberof GlobalService
   */
  formatUserDate(date, format = null) {
    if (format === null) {
      format = window.localStorage.getItem('dateTimeFormat');
    }
    return moment(date)
      .tz(window.localStorage.getItem('userTimeZone'))
      .format(format);
  }

  /**
     * Get maps icons list
     *
     * @returns {*}
     * @memberof LocatormapService
     */
  getIconList(iconType = null): any {
    let icons = {};
    switch (iconType) {
      case 'empTrack':
        icons = {
          known_employees: 'assets/warehouse-check.png',
          known_noemployees: 'assets/warehouse.png',
          unknown_employees: 'assets/icon-location.png',
          unknown_noemployees: 'assets/icon-location.png',
          employees: 'assets/icon-location.png', // 'https://png.icons8.com/?id=37170&size=1x',
          employees_multiple: 'assets/icon-multiple.png'
        };
        break;
      default:
        icons = {
          from_location: 'assets/warehouse.png',
          to_location: 'assets/hospital.png',
          known_items: 'assets/warehouse-check.png',
          known_noitems: 'assets/warehouse.png',
          unknown_items: 'assets/icon-location.png',
          unknown_noitems: 'assets/icon-location.png',
          shipment_multiple: 'assets/icon-multiple.png',
          shipment_scheduled: 'assets/schedule-icon.png',
          shipment_softshipped: 'assets/soft-shipped.png',
          shipment_partialshipped: 'assets/partial-shipped.png',
          shipment_shipped: 'assets/icon-intransit.png',
          shipment_softdelivered: 'assets/soft-delivered.png',
          shipment_partialdelivered: 'assets/partial-delivered.png',
          shipment_delivered: 'assets/icon-delivered.png'
        };
    }
    return icons;
  }

  cleanFormatResponse(object) {
    // timezone = "Asia/Kolkata";
    object = JSON.parse(JSON.stringify(object));
    if (typeof object === 'string' || object == null) {
      if ((object || '').trim() === '') {
        return '--';
      }
      return object.trim();
    } else if (typeof object === 'object') {
      for (const key in object) {
        if ( object[key] ) {
          object[key] = this.cleanFormatResponse(object[key]);
        }
      }
    }
    return object;
  }

  formatCommaSeperatedData(dataArray) {
    return dataArray
      .filter(crow => {
        return crow.trim() !== '';
      })
      .join(', ');
  }

  queryStringToObject(queryString) {
    if (!queryString) {
      return {};
    }
    if (queryString.indexOf('?') > -1) {
      queryString = queryString.split('?')[1];
    }
    const pairs = queryString.split('&');
    const result = {};
    pairs.forEach(function (pair) {
      pair = pair.split('=');
      result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    return result;
  }

  checkDateValidation(fromDate, toDate) {
    if (fromDate > toDate) {
      return false;
    }
    return true;
  }

  getLocalStorageNumRows() {
    return window.localStorage.getItem('numRows');
  }

  convertCelsiusToFahrenheit(temp: number) {
    return parseFloat((32 + temp * 1.8).toFixed(2));
  }
  convertFahrenheitToCelsius(temp: number) {
    return parseFloat(((temp - 32) * 5 / 9).toFixed(2));
  }

  ifKeyExist(obj, key) {
    return obj.hasOwnProperty(key);
  }

  getLocalStorageCognitoData() {
    const lastUserKey = 'CognitoIdentityServiceProvider.' + environment.userPoolClientId + '.LastAuthUser';
    return window.localStorage.getItem(lastUserKey);
  }

  getLocalStorageUserpermissionsData() {
    const lastUserKey = 'permissions';
    return window.localStorage.getItem(lastUserKey);
  }

  // trim leading and trailing spaces
  trimSpaces(str) {
    return str.replace(/^\s+|\s+$/g, '');
  }

  /**
    * Format Date
    * @param isodate
    */
  calendarformatDate(isodate) {
    return isodate = moment(isodate).tz(window.localStorage.getItem('userTimeZone')).format('MM/DD/Y HH:mm');
  }

  /**
  * Format Date
  * @param isodate
  */
  searchcalendarformatDate(isodate, showTime = false) {
    let cdateFormat = window.localStorage.getItem('dateFormat');
    if (showTime) {
      cdateFormat += ' HH:mm';
    }
    return isodate = moment(isodate).format(cdateFormat);
  }


  /**
    * Process Date to save
    * @param date
    */
  processDate(date, startofDay = false) {
    if (date === '' || date === null) {
      return null;
    } else {
      if (!moment(date, moment.ISO_8601).isValid()) {
        date = moment(date, 'MM/DD/Y HH:mm');
      }
      let dateObj = <any>'';
      if (startofDay) {
        dateObj = moment(date).startOf('day');
      } else {
        dateObj = moment(date);
      }
      dateObj.format();

      const newDateObj = moment.tz(
        dateObj.format('YYYY-MM-DDTHH:mm:ss.SSS'),
        moment.ISO_8601,
        window.localStorage.getItem('userTimeZone')
      );

      return newDateObj.format();
    }
  }

  getBooleanLabel() {
    const lists: any = {
      'All': '',
      'Yes': 1,
      'No': 0,
    };
    const attributes = [];
    for (const key in lists) {
      if (key) {
        attributes.push({ label: key, value: lists[key] });
      }
    }
    console.log(attributes);
    return attributes;
  }

  /**
    * Process time to save
    * @param date
    */
  processTime(date) {
    if (date === '' || date === null) {
      return null;
    } else {
      let dateObj = moment.utc().startOf('day');
      if (date.length === 5) {
        const dt = date.split(':');
        dateObj.add(dt[0], 'hours');
        dateObj.add(dt[1], 'minutes');
      } else {
        const dt = new Date(date);
        dateObj = moment(dt);
      }
      const newDateObj = moment.tz(
        dateObj.format('YYYY-MM-DDTHH:mm:ss.SSS'),
        moment.ISO_8601,
        window.localStorage.getItem('userTimeZone')
      );

      return newDateObj.format();
    }
  }

  /**
    * Format Time
    * @param isodate
    */
  calendarformatTime(isodate) {
    return isodate = moment(isodate).tz(window.localStorage.getItem('userTimeZone')).format('HH:mm');
  }

  formatLatLong(latLng) {
    return ' ( ' + latLng.join(', ') + ' )';
  }

}
