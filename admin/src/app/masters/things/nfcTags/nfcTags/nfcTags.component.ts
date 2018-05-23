import { NfcTags } from './../../shared/things.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../../core/global.service';
import { ThingsService } from '../../shared/things.service';
import { environment } from '../../../../../environments/environment';
import { ValidationService } from '../../../../core/validators/validation.service';
import { Attribute as NfcTagsAttribute } from '../../shared/things.model';

@Component({
  selector: 'app-nfcTags-add',
  templateUrl: './nfcTags.component.html',
  providers: [ValidationService]
})
export class NfcTagComponent implements OnInit {
  nfcTagsData = <NfcTags>{};
  loader = false;
  nfcTagsFG: FormGroup;
  msgs: Message[] = [];
  tags: any = [];
  attributeNameOptionList: SelectItem[];
  title = '';
  attributeOptionList: SelectItem[];
  displayDialog = false;
  blankAttribute: NfcTagsAttribute;
  selectedAttribute: NfcTagsAttribute;
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
    this.router.navigate(['/things/nfctags']);
  }
  ngOnInit(): void {
    let time = new Date();
    this.fetchDropDown();
    this.nfcTagsFG = this.fb.group({
      id: ['', []],
      name: ['', [Validators.required, Validators.maxLength(environment.nameMaxLength)]],
      code: ['', []],
      status: [1, [Validators.required]],
      
      uid: [time.getTime(), [Validators.required]],
      // minTemp: [0, [Validators.required]],
      // maxTemp: [0, [Validators.required]],
      // measurementCycle: [0, [Validators.required]],
      tags: [this.tags],
      attributes: this.fb.array([])
    });
    this.nfcTagsFG.controls.attributes = this.fb.group({
      attributeType: [''],
      attributeValue: ['']
    });
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.setEditDefaultStatus();
        this.id = params['id'];
        console.log(this.id);
        this.loader = true;
        this.thingsService.getNfcTag(this.id).subscribe((data: any) => {
          console.log(data);
          this.nfcTagsData = data.data;
          this.updatetempTags();
          /*this.nfcTagsData.attributes.push({
                    name: 'Select Attribute',
                    id: 'Seleect Attribute', value: '', status: 0, sysDefined: 0
                });*/
          this.loader = false;
        });
        this.title = 'Edit Tag';
      } else {
        this.nfcTagsData.attributes = [];
        this.title = 'Add Tag';
      }
    });
  }

  updatetempTags() {
    this.tags = this.globalService.getTagKeywords(this.nfcTagsData.tags);

    if (this.temperatureUnit === 'fahrenheit') {
      this.nfcTagsData.minTemp = this.globalService.convertCelsiusToFahrenheit(
        this.nfcTagsData.minTemp
      );
      this.nfcTagsData.maxTemp = this.globalService.convertCelsiusToFahrenheit(
        this.nfcTagsData.maxTemp
      );
    }
    this.nfcTagsFG.patchValue({
      name: this.nfcTagsData.name,
      code: this.nfcTagsData.code,
      status: this.nfcTagsData.status,
      uid: this.nfcTagsData.uid,
      minTemp: this.nfcTagsData.minTemp,
      maxTemp: this.nfcTagsData.maxTemp,
      measurementCycle: this.nfcTagsData.measurementCycle,
      attributes: this.nfcTagsData.attributes,
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
    this.nfcTagsData.attributes = this.nfcTagsData.attributes.filter(
      obj => obj !== this.selectedAttribute
    );
    this.displayDialog = false;
  }

  /*addMoreAttribute() {
        const attributes = [...this.nfcTagsData.attributes];
        const blankAttribute = { name: 'Select Attribute', id: 'Seleect Attribute', value: 'Enter Value', status: 0, sysDefined: 0 };
        attributes.push(blankAttribute);
        this.nfcTagsData.attributes = attributes;
    }*/

  onSubmit(value: any) {
    value.attributes = [];
    if (typeof this.attributeOptionList !== 'undefined') {
      for (let i = 0; i < this.nfcTagsData.attributes.length; i++) {
        const optionss = this.attributeOptionList.filter(
          (x: any) => x.label === this.nfcTagsData.attributes[i].name
        );
        if (optionss.length > 0) {
          value.attributes.push({
            value: this.nfcTagsData.attributes[i].value,
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
      this.addNfcTag(value);
    } else {
      this.editNfcTag(value);
    }
  }

  public editNfcTag(value: any) {
    this.loader = true;
    this.thingsService.updateNfcTag(value, this.nfcTagsData.id).subscribe(
      () => {
        this.showSuccess('NfcTag updated successfully');
      },
      (error: any) => this.showError(error)
    );
  }
  public addNfcTag(value: any) {
    this.loader = true;
    this.thingsService.addNfcTag(value).subscribe(
      () => {
        this.showSuccess('NfcTag created successfully');
      },
      (error: any) => this.showError(error)
    );
  }
  public showError(error: any) {
    this.loader = false;
    this.validationService.showError(this.nfcTagsFG, error);
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
    this.nfcTagsFG.controls.attributes = this.fb.group({
      attributeType: ['', [Validators.required]],
      attributeValue: ['', [Validators.required]]
    });
    this.nfcTagsFG.controls.attributes.reset({
      attributeType: '',
      attributeValue: ''
    });
  }

  onRowSelect(event) {
    this.dialogTitle = 'Edit Attribute';
    this.showDelete = true;
    this.nfcTagsFG.controls.attributes.patchValue({
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
    const attributes = [...this.nfcTagsData.attributes];
    if (this.nfcTagsData.attributes.indexOf(this.selectedAttribute) < 0) {
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
        this.nfcTagsData.attributes.indexOf(this.selectedAttribute)
      ] = this.blankAttribute;
    }
    this.nfcTagsData.attributes = attributes;
    this.displayDialog = false;
    this.nfcTagsFG.controls.attributes.patchValue({
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
    this.nfcTagsFG.patchValue({
      status: 0
    });
  }
}
