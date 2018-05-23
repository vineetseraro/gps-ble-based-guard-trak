import { GlobalService } from './../global.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

import { environment } from '../../../environments/environment';
import { TimeZoneModel } from '../../core/global.model';
import { DateModel } from '../../core/global.model';
import { DateTimeModel } from '../../core/global.model';
import { Configuration, TimeZone as ConfigurationAttribute } from './shared/configuration.model';
import { ConfigurationService } from './shared/configuration.service';

@Component({
  selector: 'app-userpool',
  templateUrl: './configuration.component.html',
  providers: [ConfigurationService]
})
export class ConfigurationComponent implements OnInit {
  loader = false;
  configurationForm: FormGroup;
  msgs: Message[] = [];
  timezoneList: SelectItem[] = [];
  dateList: SelectItem[] = [];
  dateTimeList: SelectItem[] = [];
  paginationList: SelectItem[] = [];
  measurementList: SelectItem[] = [];
  timeZoneModelList: TimeZoneModel[];
  dateModelList: DateModel[];
  dateTimeModelList: DateTimeModel[];
  shipyemperatureOptionList: SelectItem[] = [];
  data: any;
  blankAttribute: ConfigurationAttribute;
  configuration = <Configuration>{};
  moment: any;
  shipAutoOptionList: SelectItem[] = [];
  openHelpText = false;
  openHelpText1 = false;
  openHelpText2 = false;
  openHelpText3 = false;
  openHelpText4 = false;
  openHelpText5 = false;
  openHelpText6 = false;
  openHelpText7 = false;
  openHelpText8 = false;
  openHelpText9 = false;
  openHelpText14 = false;

  constructor(
    private fb: FormBuilder,
    private globalService: GlobalService,
    private configurationService: ConfigurationService
  ) {
    // this.loader = true;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.loader = true;
    this.globalService.getTimeZones().subscribe(
      (data: any) => {
        const timezones = data.data;
        const timezoneList = [];
        timezoneList.push({ label: 'Select Time Zone', value: null });
        timezones.forEach(timeZone => {
          timezoneList.push({
            label: timeZone.name + ' ( ' + timeZone.offset + ' ) ',
            value: timeZone.id
          });
        });
        this.timezoneList = timezoneList;
        this.loader = false;
      },
      (error: any) => this.showError(error)
    );

    this.globalService.getDateFormat().subscribe(
      (data: any) => {
        /*this.dateModelList = data.data;
                this.dateModelList.forEach(dateFormat => {
                    this.dateList.push({ label: dateFormat.name + ' ( ' + dateFormat.example + ' ) ', value: dateFormat.id });
                });*/
        this.dateList = this.globalService.prepareDropDown(data.data, 'Select Date Format');
      },
      (error: any) => this.showError(error)
    );

    this.globalService.getDateTimeFormat().subscribe(
      (data: any) => {
        /*this.dateTimeModelList = data.data;
                this.dateTimeModelList.forEach(dateTimeFormat => {
                    this.dateTimeList.push({ label: dateTimeFormat.name + ' ( ' + dateTimeFormat.example + ' ) ',
                    value: dateTimeFormat.id });
                });*/
        this.dateTimeList = this.globalService.prepareDropDown(
          data.data,
          'Select Date Time Format'
        );
      },
      (error: any) => this.showError(error)
    );

    this.paginationList = [
      { label: '5', value: 5 },
      { label: '10', value: 10 },
      { label: '20', value: 20 },
      { label: '50', value: 50 },
      { label: '100', value: 100 }
    ];
    this.measurementList = [
      { label: 'Imperial', value: 'Imperial' },
      { label: 'Metric', value: 'Metric' }
    ];

    this.shipAutoOptionList = [{ label: 'Yes', value: true }, { label: 'No', value: false }];

    this.shipyemperatureOptionList = [
      { label: 'Celsius', value: 'celsius' },
      { label: 'Fahrenheit', value: 'fahrenheit' }
    ];

    this.configurationService.get().subscribe((data: any) => {
      this.configuration = data.data;
      // this.configuration.stationaryShipmentTimeSeconds = this.procesStationaryShipmentTime(
      //   'view',
      //   this.configuration.stationaryShipmentTimeSeconds
      // );
      this.configuration.kontaktSyncTimeSeconds = this.procesTime(
        'view',
        this.configuration.kontaktSyncTimeSeconds
      );      
      this.configurationForm.patchValue({
        date: this.configuration.date.id,
        dateTime: this.configuration.dateTime.id,
        measurement: this.configuration.measurement,
        timezone: this.configuration.timezone.id,
        pagination: this.configuration.pagination,
        // isAutoShipMode: this.configuration.isAutoShipMode,
        // isAutoDeliveryMode: this.configuration.isAutoDeliveryMode,
        // stationaryShipmentTimeSeconds: this.configuration.stationaryShipmentTimeSeconds,
        kontaktApiKey: this.configuration.kontaktApiKey,
        temperatureUnit: this.configuration.temperatureUnit,
        kontaktSyncTimeSeconds: this.configuration.kontaktSyncTimeSeconds
      });
    });
  }

  /**
     * Function for preparing the form
     * @memberof ProductComponent
     */
  prepareForm() {
    this.configurationForm = this.fb.group({
      date: [''],
      dateTime: [''],
      measurement: [''],
      timezone: [''],
      pagination: [''],
      // isAutoShipMode: [''],
      // isAutoDeliveryMode: [''],
      // stationaryShipmentTimeSeconds: [0, Validators.min(0)],
      kontaktApiKey: [''],
      temperatureUnit: [''],
      kontaktSyncTimeSeconds: [0, Validators.min(0)],
    });
  }

  /**
     * Function for showing the error
     * @param {*} error
     * @memberof MyProfileComponent
     */
  public showError(error: any) {
    // console.log(error);
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.message });
    this.loader = false;
  }

  /**
     * Submit Action
     * @param {string} value
     * @memberof ProductComponent
     */
  onSubmit(value: any) {
    this.loader = true;
    // value.stationaryShipmentTimeSeconds = value.stationaryShipmentTimeSeconds
    //   ? value.stationaryShipmentTimeSeconds
    //   : 0;
    // value.stationaryShipmentTimeSeconds = this.procesStationaryShipmentTime(
    //   'save',
    //   value.stationaryShipmentTimeSeconds
    // );
    value.kontaktSyncTimeSeconds = value.kontaktSyncTimeSeconds
    ? value.kontaktSyncTimeSeconds
    : 0;    
    value.kontaktSyncTimeSeconds = this.procesTime(
      'save',
      value.kontaktSyncTimeSeconds
    );    
    this.configurationService.add(value).subscribe(
      (data: any) => {
        this.loader = false;
        this.msgs.push({
          severity: 'success',
          summary: 'Success',
          detail: 'Configuration Saved Successfully'
        });
        this.data = data.data;

        if (this.data.pagination === '' || this.data.pagination === undefined) {
          window.localStorage.setItem('numRows', environment.defaultConfig.numRows);
        } else {
          window.localStorage.setItem('numRows', this.data.pagination);
        }
        if (this.data.timezone.name === '' || this.data.timezone.name === undefined) {
          window.localStorage.setItem('systemTimeZone', environment.defaultConfig.timeZone);
        } else {
          window.localStorage.setItem('systemTimeZone', this.data.timezone.name);
        }
        if (this.data.date.name === '' || this.data.date.name === undefined) {
          window.localStorage.setItem('dateFormat', environment.defaultConfig.dateFormat);
        } else {
          window.localStorage.setItem('dateFormat', this.data.date.name);
        }
        if (this.data.dateTime.code === '' || this.data.dateTime.code === undefined) {
          window.localStorage.setItem('dateTimeFormat', environment.defaultConfig.dateTimeFormat);
        } else {
          window.localStorage.setItem('dateTimeFormat', this.data.dateTime.code);
        }
        if (this.data.measurement === '' || this.data.measurement === undefined) {
          window.localStorage.setItem('measurement', environment.defaultConfig.measurementUnit);
        } else {
          window.localStorage.setItem('measurement', this.data.measurement);
        }
        if (this.data.temperatureUnit === '' || this.data.temperatureUnit === undefined) {
          window.localStorage.setItem('temperatureUnit', environment.defaultConfig.temperatureUnit);
        } else {
          window.localStorage.setItem('temperatureUnit', this.data.temperatureUnit);
        }
      },
      (error: any) => this.showError(error)
    );
  }

  procesTime(action, value) {
    const unit = 60; // seconds. later can be changed
    switch (action) {
      case 'save':
        value = value * unit;
        break;
      case 'view':
        value = value / unit;
        break;
    }
    return value;
  }

  setFlagForHelptext(flag: boolean) {
    this.openHelpText = flag;
  }
  setFlagForHelptext1(flag: boolean) {
    this.openHelpText1 = flag;
  }
  setFlagForHelptext2(flag: boolean) {
    this.openHelpText2 = flag;
  }
  setFlagForHelptext3(flag: boolean) {
    this.openHelpText3 = flag;
  }
  setFlagForHelptext4(flag: boolean) {
    this.openHelpText4 = flag;
  }
  setFlagForHelptext5(flag: boolean) {
    this.openHelpText5 = flag;
  }
  setFlagForHelptext6(flag: boolean) {
    this.openHelpText6 = flag;
  }
  setFlagForHelptext7(flag: boolean) {
    this.openHelpText7 = flag;
  }
  setFlagForHelptext8(flag: boolean) {
    this.openHelpText8 = flag;
  }

  setFlagForHelptext9(flag: boolean) {
    this.openHelpText9 = flag;
  }

  setFlagForHelptext14(flag: boolean) {
    this.openHelpText14 = flag;
  }  
}
