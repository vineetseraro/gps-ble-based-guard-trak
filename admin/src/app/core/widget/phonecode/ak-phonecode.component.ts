import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { CountryModel } from '../../../core/global.model';
import { GlobalService } from '../../../core/global.service';

@Component({
    selector: 'app-ak-phonecode',
    templateUrl: './ak-phonecode.component.html',
})
export class AkPhoneCodeComponent implements OnInit {
    countryModelList: CountryModel[];
    phoneCodeOptionList: SelectItem[] = [];
    @Input() countryName: string = '';
    @Input('parentFormGroup') parentFormGroup: FormGroup;
    @Input() locationUpdated;

    constructor(
    private globalService: GlobalService) { }

    ngOnInit() {
        this.getPhoneCode();
    }

    getPhoneCode() {
        this.globalService.getCountryPhoneCode().subscribe(
           (data:any) => {
                // this.phoneCodeOptionList = this.globalService.prepareDropDown(data.data, 'Select Country Code');
                this.phoneCodeOptionList.push({
                    label: 'Select',
                    value: ''
                });
                this.countryModelList = data.data;
                this.countryModelList.forEach(countryCode => {
                    this.phoneCodeOptionList.push({ label: '+' + countryCode.dialCode
                        + ' ( ' + countryCode.name + ' ) ', value: countryCode.shortCode });
                });
            });
    }

    setPhoneData(country) {
        if (country !== '' && country !== undefined) {
            this.globalService.getCountryPhoneCode().subscribe(
           (data:any) => {
                this.countryModelList = data.data;
                this.countryModelList.forEach(countryCode => {
                    if (countryCode.name.trim() === country.trim()) {
                        this.parentFormGroup.patchValue({
                            phonecode: countryCode.shortCode,
                            mobilecode: countryCode.shortCode,
                        });
                    }
                });
            });
        }
    }
}
