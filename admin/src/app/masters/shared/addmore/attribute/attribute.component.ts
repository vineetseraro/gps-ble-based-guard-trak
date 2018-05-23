import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';


@Component({
  selector: 'add-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {

  @Input('group')
  public attributeForm: FormGroup; // our model driven form

  attributesOptions: SelectItem[];
  constructor() {

  }

  ngOnInit() {
  }

  @Input()
  set attributes(attributes: SelectItem[]) {
    this.attributesOptions = attributes;
  }
  get attributes(): SelectItem[] {
    return this.attributes;
  }
}
