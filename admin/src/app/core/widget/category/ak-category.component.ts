import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';

import { environment } from '../../../../environments/environment';
import { GlobalService } from '../../../core/global.service';


@Component({
  selector: 'app-ak-category',
  templateUrl: './ak-category.component.html',

})
export class AKCategoryComponent implements OnInit {
  tagControl: FormControl;
  categoryOptionList: SelectItem[] = [];
  categories = [];
  @Input('parentFormGroup') parentFormGroup: FormGroup;
  @Input('selectedCategory') selectedCategory: string[];
  @Output() onCategoryUpdate: EventEmitter<any> = new EventEmitter();
  @Output() onCategoryInit: EventEmitter<any> = new EventEmitter();

  constructor(
    private globalService: GlobalService) { }



  ngOnInit() {
    this.tagControl = new FormControl();
    this.getOptionList();
  }
  getOptionList() {
    this.globalService.getDropdown('categories' + environment.serverEnv).subscribe((data:any) => {
      this.categoryOptionList = this.globalService.prepareDropDown(data.data,"");
      if (this.categoryOptionList.length > 0) {
        this.onCategoryInit.emit(true);
      }else {
        this.onCategoryInit.emit(false);
      }

    },
      (error:any) => this.onCategoryInit.emit(error));

  }


}
