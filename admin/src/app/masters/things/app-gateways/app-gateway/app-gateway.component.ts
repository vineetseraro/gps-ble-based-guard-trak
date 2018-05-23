import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../../core/global.service';
import { Apps } from '../../shared/things.model';
import { ThingsService } from '../../shared/things.service';
import { environment } from '../../../../../environments/environment';
import { ValidationService } from '../../../../core/validators/validation.service';
import {Attribute as AppAttribute } from '../../shared/things.model';



@Component({
    selector: 'app-gateway-add',
    templateUrl: './app-gateway.component.html',
        providers: [ValidationService]

})
export class AppGatewayComponent implements OnInit {

    appData: Apps;
    loader = false;
    appGatewayFG: FormGroup;
    msgs: Message[] = [];
    tags: any = [];
    //private tagOptionList = [];
    displayDialog = false;
    blankAttribute: AppAttribute;
    selectedAttribute: AppAttribute;
    dialogTitle: String = '';
    showDelete = false;
    // attributeNameOptionList: SelectItem[];
    attributeOptionList: SelectItem[];
    attributeOptionListOne: SelectItem[];

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private thingsService: ThingsService,
        private router: Router,
        private globalService: GlobalService,
        private validationService: ValidationService
    ) {

    }

    onCancel() {
        this.router.navigate(['/things/apps']);
    }
    ngOnInit(): void {
        this.fetchDropDown();
        this.appGatewayFG = this.fb.group({
            'id': ['', []],
            'name': ['', [Validators.required, Validators.maxLength(environment.nameMaxLength)]],
            'code': ['', []],
            'os': ['', []],
            'manufacturer': ['', []],
            'appVersion': ['', []],
            'model': ['', []],
            'deviceId': ['', []],
            'tags': [this.tags],
            'appName': ['', []],
            'attributes': this.fb.array([]),
        });
        this.appGatewayFG.controls.attributes = this.fb.group({
            'attributeType': [''],
            'attributeValue': [''],
        });

        let id = this.route.snapshot.params['id'];
        console.log(id);
        this.loader = true;
        this.thingsService.getApp(id).subscribe((data:any) => {
            this.appData = data.data;
            this.updateBeacon();
            // this.appData.attributes.push({
            //     name: 'Select Attribute',
            //     id: 'Seleect Attribute', value: '', status: 0, sysDefined: 0
            // });
            this.loader = false;
        });
    }

    updateBeacon() {
        this.tags = this.globalService.getTagKeywords(this.appData.tags);
        this.appGatewayFG.patchValue({
            name: this.appData.name,
            code: this.appData.code,
            uuid: this.appData.uuid,
            os: this.appData.os,
            manufacturer: this.appData.manufacturer,
            appVersion: this.appData.appVersion,
            model: this.appData.model,
            deviceId: this.appData.deviceId,
            appName: this.appData.appName,
            tags: this.tags,
        });
    }


    /**
     * call when tag add
     * @param {string} keywords
     * @memberof AppComponent
     */
    onAddTag(keywords: string) {
        this.tags.push(keywords);
    }

    /**
     * call when Tag remove
     * @param {string} keywords
     * @memberof AppComponent
     */
    onRemoveTag(keywords: string) {
        const index = this.tags.indexOf(keywords);
        if (index !== -1) {
            this.tags.splice(index, 1);
        }
    }

    /**
     * call when Tag update
     * @param {string} keywords
     * @memberof AppComponent
     */
    onTagUpdate(event: any) {
        this.tags = event;
    }

    fetchDropDown() {
        /// Get the Attribites List from API ////
        this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data:any) => {
            this.attributeOptionListOne = this.globalService.prepareDropDown(data.data, "Select");
            this.attributeOptionList = this.globalService.prepareHandlerNameList(data.data);
        });
    }



    onSubmit(value: any) {
        this.loader = true;
        value.status = this.appData.status;
        value.attributes = [];
        if (typeof this.attributeOptionListOne !== 'undefined') {
            for (let i = 0; i < this.appData.attributes.length; i++) {
                const optionss = this.attributeOptionListOne.filter((x:any) => x.label === this.appData.attributes[i].name);
                if (optionss.length > 0) {
                    value.attributes.push({ value: this.appData.attributes[i].value, id: optionss[0].value });
                }
            }
        }

        this.thingsService.updateApp(value, this.appData.id).subscribe(
            () => {
                this.showSuccess('App updated successfully');
            },
            (error:any) => this.showError(error));
    }

    public showError(error: any) {
        this.loader = false;
        this.validationService.showError(this.appGatewayFG, error);
    }

    public showSuccess(message: string) {
        this.loader = false;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Success', detail: message });
        setTimeout(() => {
            this.onCancel();
        }, environment.successMsgTime);
    }

    deleteRow(data:any) {
        data;
        this.appData.attributes.indexOf(this.selectedAttribute);
        this.appData.attributes = this.appData.attributes.filter(obj => obj !== this.selectedAttribute);
        this.displayDialog = false;
    }

    /**
     * To add Attribute
     * @memberof LocationComponent
     */
    addMoreAttribute() {
        this.dialogTitle = 'Add Attribute';
        this.showDelete = false;
        this.displayDialog = true;
        this.appGatewayFG.controls.attributes = this.fb.group({
            'attributeType': ['', [Validators.required]],
            'attributeValue': ['', [Validators.required]],
        });
        this.appGatewayFG.controls.attributes.reset({
            attributeType: '',
            attributeValue: '',
        });
    }

    onRowSelect(event) {
        this.dialogTitle = 'Edit Attribute';
        this.showDelete = true;
        this.appGatewayFG.controls.attributes.patchValue({
            attributeType: event.data.name,
            attributeValue: event.data.value,
        });
        this.displayDialog = true;
    }


    /**
     * To save Attribute of location
     * @memberof LocationComponent
     */
    saveAttributes(data:any) {
        const attributes = [...this.appData.attributes];
        if (this.appData.attributes.indexOf(this.selectedAttribute) < 0) {
            this.blankAttribute = { name: data.attributeType, id: '', value: data.attributeValue, status: 0, sysDefined: 0 };
            attributes.push(this.blankAttribute);
        } else {
            this.blankAttribute = { name: data.attributeType,
            id: data.id, value: data.attributeValue, status: 0, sysDefined: 0 };
            attributes[this.appData.attributes.indexOf(this.selectedAttribute)] = this.blankAttribute;
        }
        this.appData.attributes = attributes;
        this.displayDialog = false;
        this.appGatewayFG.controls.attributes.patchValue({
            attributeType: '',
            attributeValue: '',
        });
    }

    /**
     * To close Attribute Dialog
     * @memberof LocationComponent
     */
    closeDialog() {
        this.displayDialog = false;
    }
}
