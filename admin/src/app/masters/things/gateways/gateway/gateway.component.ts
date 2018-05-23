import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../../core/global.service';
import { Gateway } from '../../shared/things.model';
import { ThingsService } from '../../shared/things.service';
import { ValidationService } from '../../../../core/validators/validation.service';
import { environment } from '../../../../../environments/environment';
import {Attribute as GatewayAttribute } from '../../shared/things.model';


@Component({
    selector: 'app-gateway-add',
    templateUrl: './gateway.component.html',
    providers: [ValidationService]
})
export class GatewayComponent implements OnInit {

    gatewayData: Gateway;
    loader = false;
    title = '';
    gatewayFG: FormGroup;
    msgs: Message[] = [];
    tags: any = [];
    attributeNameOptionList: SelectItem[];
    attributeOptionList: SelectItem[];
    isEdit = false;
    id;
    displayDialog = false;
    blankAttribute: GatewayAttribute;
    selectedAttribute: GatewayAttribute;
    showDelete = false;
    dialogTitle: String = '';

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
        this.router.navigate(['/things/gateways']);
    }
    ngOnInit(): void {
        this.fetchDropDown();
        this.gatewayFG = this.fb.group({
            'id': ['', []],
            'code': ['', [Validators.required]],
            'name': ['', [Validators.required]],
            'type': [''],
            'last_connection': ['', []],
            'location': ['', []],
            'uuid': ['', [Validators.required]],
            'tags': [this.tags],
            'attributes': this.fb.array([]),
            'status': [true],
        });
        this.gatewayFG.controls.attributes = this.fb.group({
            'attributeType': [''],
            'attributeValue': [''],
        });
        this.id = this.route.snapshot.params['id'];
        if (this.id) {
            this.isEdit = true;
            this.loader = true;
            this.title = 'Edit Gateway';
            this.setEditDefaultStatus();
            this.thingsService.getGateway(this.id).subscribe((data:any) => {
                this.gatewayData = data.data;
                this.updateGateway();
               /* this.gatewayData.attributes.push({
                    name: 'Select Attribute',
                    id: 'Seleect Attribute', value: '', status: 0, sysDefined: 0
                });*/
                this.loader = false;
            });
        } else {
            this.isEdit = false;
            this.title = 'Add Gateway';
            this.gatewayData = new Gateway();
            this.gatewayData.attributes = [];
        }

    }

    updateGateway() {
        this.tags = this.globalService.getTagKeywords(this.gatewayData.tags);

        this.gatewayFG.patchValue({
            id: this.gatewayData.id,
            name: this.gatewayData.name,
            code: this.gatewayData.code,
            uuid: this.gatewayData.uuid,
            type: this.gatewayData.type,
            location: this.gatewayData.location,
            last_connection: this.gatewayData.last_connection,
            tags: this.tags,
            status: this.gatewayData.status === 1 ? true : false,
        });
    }
    /*jshint unused: false */
    onTagUpdate(event: any) {
        return event;

    }

    fetchDropDown() {
        /// Get the Attribites List from API ////
        this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data:any) => {
            this.attributeOptionList = this.globalService.prepareDropDown(data.data, "");
            this.attributeNameOptionList = this.globalService.prepareHandlerNameList(data.data);
        });
    }

    deleteRow(data:any) {
        data;
        this.gatewayData.attributes.indexOf(this.selectedAttribute);
        this.gatewayData.attributes = this.gatewayData.attributes.filter(obj => obj !== this.selectedAttribute);
        this.displayDialog = false;
    }

    /*addMoreAttribute() {
        const attributes = [...this.gatewayData.attributes];
        const blankAttribute = { name: 'Select Attribute', id: 'Seleect Attribute', value: 'Enter Value', status: 0, sysDefined: 0 };
        attributes.push(blankAttribute);
        this.gatewayData.attributes = attributes;
    }*/


    onSubmit(value: any) {
        this.loader = true;
        if (value.status === true) {
            value.status = 1;
        } else if (value.status === false) {
            value.status = 0;
        }
        value.attributes = [];
        if (typeof this.attributeOptionList !== 'undefined') {
            for (let i = 0; i < this.gatewayData.attributes.length; i++) {
                const optionss = this.attributeOptionList.filter((x:any) => x.label === this.gatewayData.attributes[i].name);
                if (optionss.length > 0) {
                    value.attributes.push({ value: this.gatewayData.attributes[i].value, id: optionss[0].value });
                }
            }
        }
        if (this.id) {
            this.editGateway(value);
        } else {
            this.addGateway(value);
        }
    }

    addGateway(value) {
        this.thingsService.addGateway(value).subscribe(
            () => {
                this.showSuccess('Gateway saved successfully');
            },
            (error:any) => this.showError(error));
    }

    editGateway(value) {

        this.thingsService.updateGateway(value, this.gatewayData.id).subscribe(
            () => {
                this.showSuccess('Gateway updated successfully');
            },
            (error:any) => this.showError(error));
    }

    public showError(error: any) {
        this.loader = false;
        this.validationService.showError(this.gatewayFG, error);
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
     * @memberof GatewayComponent
     */
    addMoreAttribute() {
        this.dialogTitle = 'Add Attribute';
        this.showDelete = false;
        this.displayDialog = true;
        this.gatewayFG.controls.attributes = this.fb.group({
            'attributeType': ['', [Validators.required]],
            'attributeValue': ['', [Validators.required]],
        });
        this.gatewayFG.controls.attributes.reset({
            attributeType: '',
            attributeValue: '',
        });
    }

    onRowSelect(event) {
        this.dialogTitle = 'Edit Attribute';
        this.showDelete = true;
        this.gatewayFG.controls.attributes.patchValue({
            attributeType: event.data.name,
            attributeValue: event.data.value,
        });
        this.displayDialog = true;
    }


    /**
     * To save Attribute of Gateway
     * @memberof GatewayComponent
     */
    saveAttributes(data:any) {
        const attributes = [...this.gatewayData.attributes];
        if (this.gatewayData.attributes.indexOf(this.selectedAttribute) < 0) {
            this.blankAttribute = { name: data.attributeType, id: '', value: data.attributeValue, status: 0, sysDefined: 0 };
            attributes.push(this.blankAttribute);
        } else {
            this.blankAttribute = { name: data.attributeType,
            id: data.id, value: data.attributeValue, status: 0, sysDefined: 0 };
            attributes[this.gatewayData.attributes.indexOf(this.selectedAttribute)] = this.blankAttribute;
        }
        this.gatewayData.attributes = attributes;
        this.displayDialog = false;
        this.gatewayFG.controls.attributes.patchValue({
            attributeType: '',
            attributeValue: '',
        });
    }

    /**
     * To close Attribute Dialog
     * @memberof GatewayComponent
     */
    closeDialog() {
        this.displayDialog = false;
    }

    setEditDefaultStatus() {
        this.gatewayFG.patchValue({
            status: 0,
        });
    }
}
