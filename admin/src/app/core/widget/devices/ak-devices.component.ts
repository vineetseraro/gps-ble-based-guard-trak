import { setTimeout } from 'timers';
import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { GlobalService } from '../../../core/global.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ak-devices',
  templateUrl: './ak-devices.component.html'
})
export class AKDevicesComponent implements OnInit {
  @Input('isMultiSelect') isMultiSelect;
  @Input('parentFormGroup') parentFormGroup: FormGroup;
  @Input('selectedDevice') selectedDevice: string[];
  @Output() onDeviceUpdate: EventEmitter<any> = new EventEmitter();
  @Output() onDeviceInit: EventEmitter<any> = new EventEmitter();
  deviceOptionList: SelectItem[] = [];
  deviceOptions = [];

  constructor(private globalService: GlobalService) {}

  ngOnInit() {
    this.getOptionList();
  }

  updateDevice (value) {
    const selDeviceObj = this.deviceOptions.filter( (device) => {
      return device.id === value;
    });
    this.onDeviceUpdate.emit(selDeviceObj);
  }

  getOptionList() {
    this.globalService
      .getDropdown('report' + environment.serverEnv + '/app-status')
      .subscribe(
        (data: any) => {
          let defaultText = '';
          if ( !this.isMultiSelect ) {
            defaultText = 'Select Device';
          }

          const devices = data.data.map(device => {
            return {
              name: device.devicename,
              id: device.deviceid
            }
          });

          this.deviceOptions = data.data.map(device => {
            return {
              name: device.devicename,
              code: device.devicecode,
              id: device.deviceid
            }
          });

          const list = this.globalService.prepareUserDropDown(devices,  defaultText, false);
          this.deviceOptionList.push.apply(this.deviceOptionList, list);
          setTimeout( () => {
            this.updateDevice(this.selectedDevice);
          }, 800);
          if (this.deviceOptionList.length > 0) {
            this.onDeviceInit.emit(true);
          } else {
            this.onDeviceInit.emit(false);
          }
        },
        (error: any) => this.onDeviceInit.emit(error)
      );
  }
}
