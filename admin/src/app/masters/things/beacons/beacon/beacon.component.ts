import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../../core/global.service';
import { Beacon } from '../../shared/things.model';
import { ThingsService } from '../../shared/things.service';
import { environment } from '../../../../../environments/environment';
import { ValidationService } from '../../../../core/validators/validation.service';
import {Attribute as BeaconAttribute } from '../../shared/things.model';



@Component({
    selector: 'app-beacon-add',
    templateUrl: './beacon.component.html',
    providers: [ValidationService]

})

export class BeaconComponent implements OnInit {
    beaconData: Beacon;
    loader = false;
    beaconFG: FormGroup;
    msgs: Message[] = [];
    tags: any = [];
    attributeNameOptionList: SelectItem[];
    attributeOptionList: SelectItem[];
    displayDialog = false;
    blankAttribute: BeaconAttribute;
    selectedAttribute: BeaconAttribute;
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
        this.router.navigate(['/things/beacons']);
    }
    ngOnInit(): void {
        this.fetchDropDown();
        this.beaconFG = this.fb.group({
            'id': ['', []],
            'name': ['', [Validators.required, Validators.maxLength(environment.nameMaxLength)]],
            'code': ['', []],
            'battery_level': [0, []],
            'last_connection': ['', []],
            'txPower': ['', []],
            'interval': [0, []],
            'uuid': ['', []],
            'major': [0, []],
            'minor': [0, []],
            'tags': [this.tags],
            'attributes': this.fb.array([])
        });
        this.beaconFG.controls.attributes = this.fb.group({
            'attributeType': [''],
            'attributeValue': [''],
        });
        let id = this.route.snapshot.params['id'];
        console.log(id);
        this.loader = true;
        this.thingsService.getBeacon(id).subscribe((data:any) => {
            this.beaconData = data.data;
            this.updateBeacon();
            /*this.beaconData.attributes.push({
                name: 'Select Attribute',
                id: 'Seleect Attribute', value: '', status: 0, sysDefined: 0
            });*/
            this.loader = false;
        });
    }

    updateBeacon() {
        this.tags = this.globalService.getTagKeywords(this.beaconData.tags);
        this.beaconFG.patchValue({
            name: this.beaconData.name,
            code: this.beaconData.code,
            uuid: this.beaconData.uuid,
            major: this.beaconData.major,
            minor: this.beaconData.minor,
            last_connection: this.beaconData.last_connection,
            battery_level: this.beaconData.battery_level,
            txPower: this.beaconData.txPower,
            interval: this.beaconData.interval,
            tags: this.tags,
        });
    }
    onTagUpdate(event: any) {
        return event;
    }

    fetchDropDown() {
        /// Get the Attribites List from API ////
        this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data:any) => {
            this.attributeOptionList = this.globalService.prepareDropDown(data.data, "Select");
            this.attributeNameOptionList = this.globalService.prepareHandlerNameList(data.data);
        });
    }

    deleteRow(data:any) {
        data;
        this.beaconData.attributes.indexOf(this.selectedAttribute);
        this.beaconData.attributes = this.beaconData.attributes.filter(obj => obj !== this.selectedAttribute);
        this.displayDialog = false;
    }

    /*addMoreAttribute() {
        const attributes = [...this.beaconData.attributes];
        const blankAttribute = { name: 'Select Attribute', id: 'Seleect Attribute', value: 'Enter Value', status: 0, sysDefined: 0 };
        attributes.push(blankAttribute);
        this.beaconData.attributes = attributes;
    }*/


    onSubmit(value: any) {
        this.loader = true;
        value.status = this.beaconData.status;
        value.attributes = [];
        if (typeof this.attributeOptionList !== 'undefined') {
            for (let i = 0; i < this.beaconData.attributes.length; i++) {
                const optionss = this.attributeOptionList.filter((x:any) => x.label === this.beaconData.attributes[i].name);
                if (optionss.length > 0) {
                    value.attributes.push({ value: this.beaconData.attributes[i].value, id: optionss[0].value });
                }
            }
        }
        this.thingsService.update(value, this.beaconData.id).subscribe(
            () => {
                this.showSuccess('Beacon updated successfully');
            },
            (error:any) => this.showError(error));
    }

    public showError(error: any) {
        this.loader = false;
        this.validationService.showError(this.beaconFG, error);
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
     * @memberof BeaconComponent
     */
    addMoreAttribute() {
        this.dialogTitle = 'Add Attribute';
        this.showDelete = false;
        this.displayDialog = true;
        this.beaconFG.controls.attributes = this.fb.group({
            'attributeType': ['', [Validators.required]],
            'attributeValue': ['', [Validators.required]],
        });
        this.beaconFG.controls.attributes.reset({
            attributeType: '',
            attributeValue: '',
        });
    }

    onRowSelect(event) {
        this.dialogTitle = 'Edit Attribute';
        this.showDelete = true;
        this.beaconFG.controls.attributes.patchValue({
            attributeType: event.data.name,
            attributeValue: event.data.value,
        });
        this.displayDialog = true;
    }


    /**
     * To save Attribute of Beacon
     * @memberof BeaconComponent
     */
    saveAttributes(data:any) {
        const attributes = [...this.beaconData.attributes];
        if (this.beaconData.attributes.indexOf(this.selectedAttribute) < 0) {
            this.blankAttribute = { name: data.attributeType, id: '', value: data.attributeValue, status: 0, sysDefined: 0 };
            attributes.push(this.blankAttribute);
        } else {
            this.blankAttribute = { name: data.attributeType,
            id: data.id, value: data.attributeValue, status: 0, sysDefined: 0 };
            attributes[this.beaconData.attributes.indexOf(this.selectedAttribute)] = this.blankAttribute;
        }
        this.beaconData.attributes = attributes;
        this.displayDialog = false;
        this.beaconFG.controls.attributes.patchValue({
            attributeType: '',
            attributeValue: '',
        });
    }

    /**
     * To close Attribute Dialog
     * @memberof BeaconComponent
     */
    closeDialog() {
        this.displayDialog = false;
    }
}
