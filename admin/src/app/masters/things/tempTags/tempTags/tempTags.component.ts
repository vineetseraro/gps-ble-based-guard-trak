import { TempTags } from './../../shared/things.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../../core/global.service';
import { ThingsService } from '../../shared/things.service';
import { environment } from '../../../../../environments/environment';
import { ValidationService } from '../../../../core/validators/validation.service';
import { Attribute as TempTagsAttribute } from '../../shared/things.model';

@Component({
  selector: 'app-tempTags-add',
  templateUrl: './tempTags.component.html',
  providers: [ValidationService]
})
export class TempTagComponent implements OnInit {
  tempTagsData = <TempTags>{};
  loader = false;
  tempTagsFG: FormGroup;
  msgs: Message[] = [];
  tags: any = [];
  attributeNameOptionList: SelectItem[];
  title = '';
  attributeOptionList: SelectItem[];
  displayDialog = false;
  blankAttribute: TempTagsAttribute;
  selectedAttribute: TempTagsAttribute;
  showDelete = false;
  dialogTitle: String = '';
  id: String = '';
  temperatureUnit = window.localStorage.getItem('temperatureUnit');
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private thingsService: ThingsService,
    private router: Router,
    private globalService: GlobalService,
    private validationService: ValidationService
  ) {}

  onCancel() {
    this.router.navigate(['/things/temptags']);
  }
  ngOnInit(): void {
    this.fetchDropDown();
    this.tempTagsFG = this.fb.group({
      id: ['', []],
      name: ['', [Validators.required, Validators.maxLength(environment.nameMaxLength)]],
      code: ['', []],
      status: [1, [Validators.required]],
      minTemp: [0, [Validators.required]],
      uid: ['', [Validators.required]],
      maxTemp: [0, [Validators.required]],
      measurementCycle: [0, [Validators.required]],
      tags: [this.tags],
      attributes: this.fb.array([])
    });
    this.tempTagsFG.controls.attributes = this.fb.group({
      attributeType: [''],
      attributeValue: ['']
    });
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.setEditDefaultStatus();
        this.id = params['id'];
        console.log(this.id);
        this.loader = true;
        this.thingsService.getTempTag(this.id).subscribe((data: any) => {
          console.log(data);
          this.tempTagsData = data.data;
          this.updatetempTags();
          /*this.tempTagsData.attributes.push({
                    name: 'Select Attribute',
                    id: 'Seleect Attribute', value: '', status: 0, sysDefined: 0
                });*/
          this.loader = false;
        });
        this.title = 'Edit Temperature Tag';
      } else {
        this.tempTagsData.attributes = [];
        this.title = 'Add Temperature Tag';
      }
    });
  }

  updatetempTags() {
    this.tags = this.globalService.getTagKeywords(this.tempTagsData.tags);

    if (this.temperatureUnit === 'fahrenheit') {
      this.tempTagsData.minTemp = this.globalService.convertCelsiusToFahrenheit(
        this.tempTagsData.minTemp
      );
      this.tempTagsData.maxTemp = this.globalService.convertCelsiusToFahrenheit(
        this.tempTagsData.maxTemp
      );
    }
    this.tempTagsFG.patchValue({
      name: this.tempTagsData.name,
      code: this.tempTagsData.code,
      status: this.tempTagsData.status,
      uid: this.tempTagsData.uid,
      minTemp: this.tempTagsData.minTemp,
      maxTemp: this.tempTagsData.maxTemp,
      measurementCycle: this.tempTagsData.measurementCycle,
      attributes: this.tempTagsData.attributes,
      tags: this.tags
    });
  }
  onTagUpdate(event: any) {
    return event;
  }

  fetchDropDown() {
    /// Get the Attribites List from API ////
    this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data: any) => {
      this.attributeOptionList = this.globalService.prepareDropDown(data.data, 'Select');
      this.attributeNameOptionList = this.globalService.prepareHandlerNameList(data.data);
    });
  }

  deleteRow(data: any) {
    data;
    this.tempTagsData.attributes = this.tempTagsData.attributes.filter(
      obj => obj !== this.selectedAttribute
    );
    this.displayDialog = false;
  }

  /*addMoreAttribute() {
        const attributes = [...this.tempTagsData.attributes];
        const blankAttribute = { name: 'Select Attribute', id: 'Seleect Attribute', value: 'Enter Value', status: 0, sysDefined: 0 };
        attributes.push(blankAttribute);
        this.tempTagsData.attributes = attributes;
    }*/

  onSubmit(value: any) {
    value.attributes = [];
    if (typeof this.attributeOptionList !== 'undefined') {
      for (let i = 0; i < this.tempTagsData.attributes.length; i++) {
        const optionss = this.attributeOptionList.filter(
          (x: any) => x.label === this.tempTagsData.attributes[i].name
        );
        if (optionss.length > 0) {
          value.attributes.push({
            value: this.tempTagsData.attributes[i].value,
            id: optionss[0].value
          });
        }
      }
    }
    if (this.temperatureUnit === 'fahrenheit') {
      value.minTemp = this.globalService.convertFahrenheitToCelsius(value.minTemp);
      value.maxTemp = this.globalService.convertFahrenheitToCelsius(value.maxTemp);
    }
    console.log(value);
    value.status = value.status ? 1 : 0;
    if (this.id === '') {
      delete value.code;
      this.addTempTag(value);
    } else {
      this.editTempTag(value);
    }
  }

  public editTempTag(value: any) {
    this.loader = true;
    this.thingsService.updateTempTag(value, this.tempTagsData.id).subscribe(
      () => {
        this.showSuccess('TempTag updated successfully');
      },
      (error: any) => this.showError(error)
    );
  }
  public addTempTag(value: any) {
    this.loader = true;
    this.thingsService.addTempTag(value).subscribe(
      () => {
        this.showSuccess('TempTag created successfully');
      },
      (error: any) => this.showError(error)
    );
  }
  public showError(error: any) {
    this.loader = false;
    this.validationService.showError(this.tempTagsFG, error);
  }

  public showSuccess(message: string) {
    this.loader = false;
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Success', detail: message });
    setTimeout(() => {
      this.onCancel();
    }, environment.successMsgTime);
  }

  /**
     * To add Attribute
     * @memberof tempTagsComponent
     */
  addMoreAttribute() {
    this.dialogTitle = 'Add Attribute';
    this.showDelete = false;
    this.displayDialog = true;
    this.tempTagsFG.controls.attributes = this.fb.group({
      attributeType: ['', [Validators.required]],
      attributeValue: ['', [Validators.required]]
    });
    this.tempTagsFG.controls.attributes.reset({
      attributeType: '',
      attributeValue: ''
    });
  }

  onRowSelect(event) {
    this.dialogTitle = 'Edit Attribute';
    this.showDelete = true;
    this.tempTagsFG.controls.attributes.patchValue({
      attributeType: event.data.name,
      attributeValue: event.data.value
    });
    this.displayDialog = true;
  }

  /**
     * To save Attribute of tempTags
     * @memberof tempTagsComponent
     */
  saveAttributes(data: any) {
    const attributes = [...this.tempTagsData.attributes];
    if (this.tempTagsData.attributes.indexOf(this.selectedAttribute) < 0) {
      this.blankAttribute = {
        name: data.attributeType,
        id: '',
        value: data.attributeValue,
        status: 0,
        sysDefined: 0
      };
      attributes.push(this.blankAttribute);
    } else {
      this.blankAttribute = {
        name: data.attributeType,
        id: data.id,
        value: data.attributeValue,
        status: 0,
        sysDefined: 0
      };
      attributes[
        this.tempTagsData.attributes.indexOf(this.selectedAttribute)
      ] = this.blankAttribute;
    }
    this.tempTagsData.attributes = attributes;
    this.displayDialog = false;
    this.tempTagsFG.controls.attributes.patchValue({
      attributeType: '',
      attributeValue: ''
    });
  }

  /**
     * To close Attribute Dialog
     * @memberof tempTagsComponent
     */
  closeDialog() {
    this.displayDialog = false;
  }
  setEditDefaultStatus() {
    this.tempTagsFG.patchValue({
      status: 0
    });
  }
}
