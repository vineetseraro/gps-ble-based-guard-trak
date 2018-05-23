import { ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../global.service';

@Component({
  selector: 'app-floormap-widget',
  templateUrl: './floormap.component.html',
  styleUrls: ['./floormap.component.css'],
  providers: [GlobalService]
})
export class FloormapComponent implements OnInit {
  @Input('parentFormGroup') parentFormGroup: FormGroup;
  @Input('zoneData') zoneData: any;
  @Input('thingOptionList') thingOptionList: SelectItem[] = [];

  @Output() zoneUpdatedData: EventEmitter<FormGroup> = new EventEmitter();
  displayDialog = false;
  zonesForm: FormGroup;
  //thingOptionList: SelectItem[] = [];
  selectedThings:any = [];
  save = true;
  update = false;
  updateIndex: number;
  // get the element with the #chessCanvas on it
  @ViewChild('zoneCanvas') chessCanvas: ElementRef;

  constructor(private fb: FormBuilder) {
    //this._size = 150;
  }

  ngOnInit() {
    console.log("Zone Data");
    console.log(this.zoneData);
    this.prepareForm();
  }
  prepareForm() {
    this.zonesForm = this.fb.group({
      'name': ['', [Validators.required]],
      'code': ['', [Validators.required]],
      'floorMapDetails': this.fb.group({
        'xCoord': [0],
        'yCoord': [0]
      }),
      'status': [1],
      'radius': [, [Validators.required]],
      'things': [this.selectedThings]
    });
  }

  addZoneDialog() {
    this.save = true;
    this.update = false;
    this.displayDialog = true;
  }

  saveZone(value: any) {
    this.zonesForm.reset();
    if (value.status === true) {
      value.status = 1;
    } else if (value.status === false) {
      value.status = 0;
    }
    this.displayDialog = false;
    const zones = [...this.zoneData.zones];
    zones.push(value);
    this.zoneData.zones = zones;
    this.parentFormGroup.controls.zones.value.push(value);
    this.zoneUpdatedData.emit(this.parentFormGroup);
  }

  updateData(value: any) {
    this.zonesForm.reset();
    if (value.status === true) {
      value.status = 1;
    } else if (value.status === false) {
      value.status = 0;
    }
    this.displayDialog = false;
    const zones = [...this.zoneData.zones];
    zones[this.updateIndex] = value;
    this.zoneData.zones = zones;
    console.log(this.zoneData.zones);
    this.parentFormGroup.controls.zones = this.zoneData.zones;
    this.zoneUpdatedData.emit(this.parentFormGroup);
  }

  editZones(data: any) {
    this.updateIndex = this.zoneData.zones.indexOf(data);
    this.save = false;
    this.update = true;
    console.log(this.updateIndex);
    this.updateZone(data);
    this.displayDialog = true;
  }

  updateZone(data: any) {
    this.zonesForm.reset({
      code: data.code,
      name: data.name,
      status: data.status,
      radius: data.radius,
      things: this.thingOptionList.length > 0 ? data.things : [],
      floorMapDetails: {
        xCoord: data.floorMapDetails.xCoord,
        yCoord: data.floorMapDetails.yCoord,
      }
    });
  }
  /**
    * delete Attribute row
    * @param {*} data
    * @memberof ProductComponent
    */
    deleteRow(data: any) {
        const index =  this.zoneData.zones.indexOf(data);
        this.zoneData.zones =  this.zoneData.zones.filter((val: any, i: any) => { val = val; return i !== index; });
    }

  onCancel() {
    return;

  }
}
