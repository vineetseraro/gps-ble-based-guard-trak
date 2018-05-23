import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { GlobalService } from '../../../core/global.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ak-things',
  templateUrl: './ak-things.component.html'
})
export class AKThingsComponent implements OnInit {
  tagControl: FormControl;
  thingOptionList: SelectItem[] = [];
  categories = [];
  @Input('thingTypes') types: String;
  @Input('parentFormGroup') parentFormGroup: FormGroup;
  @Input('selectedThings') selectedThings: string[];
  @Output() onThingsUpdate: EventEmitter<any> = new EventEmitter();
  @Output() onThingsInit: EventEmitter<any> = new EventEmitter();

  constructor(private globalService: GlobalService) {}

  ngOnInit() {
    this.tagControl = new FormControl();
    this.getOptionList();
  }

  @Input()
  set addThings(things) {
    things.forEach(thing => {
      this.thingOptionList.push({ label: thing.name, value: thing.id });
    });
  }

  getOptionList() {
    // const type = 'beacon,tempTag,nfcTag';
    this.globalService
      .getDropdown('things' + environment.serverEnv + '/associatablethings', 'type=' + this.types)
      .subscribe(
        (data: any) => {
          const things = data.data.filter( (thing) => {
            return thing.name.search('DB-') === -1;
          });
          const list = this.globalService.prepareDropDown(things, '');
          this.thingOptionList.push.apply(this.thingOptionList, list);

          if (this.thingOptionList.length > 0) {
            this.onThingsInit.emit(true);
          } else {
            this.onThingsInit.emit(false);
          }
        },
        (error: any) => this.onThingsInit.emit(error)
      );
  }
}
