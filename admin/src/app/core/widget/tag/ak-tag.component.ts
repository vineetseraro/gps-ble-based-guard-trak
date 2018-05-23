import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

import { GlobalService } from '../../../core/global.service';

@Component({
  selector: 'app-ak-tag',
  templateUrl: './ak-tag.component.html',

})
export class AKTagComponent implements OnInit {
  tagControl: FormControl;
  loader = false;
  tagOptionList = [];

  @Input('parentFormGroup') parentFormGroup: FormGroup;
  @Input('tags') tags: string[];
  @Output() onTagUpdate: EventEmitter<any> = new EventEmitter();

  constructor(
    private globalService: GlobalService) { }



  ngOnInit() {
    this.tagControl = new FormControl();
    this.onTextChange('');
  }
  /**
     * call on add Tag
     * @param {string} keywords
     * @memberof AKTagComponent
     */
  onAddTag(keywords: string) {
    this.tags.push(keywords);
    console.log(this.tags);

    this.onTagUpdate.emit(this.tags);

  }

  /**
   * call on remove Tag
   * @param {string} keywords
   * @memberof AKTagComponent
   */
  onRemoveTag(keywords: string) {
    const index = this.tags.indexOf(keywords);
    if (index !== -1) {
      this.tags.splice(index, 1);
      this.onTagUpdate.emit(this.tags);

    }
  }

  /**
   * call when text change
   * @param {string} text
   * @memberof AKTagComponent
   */
  onTextChange(query: string) {
    this.globalService.getTagDropdown(query).subscribe((data:any) => {
      this.tagOptionList = this.globalService.prepareOptionList(data.data);
    });
  }



}
