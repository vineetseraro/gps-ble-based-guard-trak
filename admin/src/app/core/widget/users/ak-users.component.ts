import { EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectItem } from 'primeng/primeng';
import { GlobalService } from '../../../core/global.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-ak-users',
  templateUrl: './ak-users.component.html'
})
export class AKUsersComponent implements OnInit {
  @Input('isMultiSelect') isMultiSelect: boolean;
  @Input('parentFormGroup') parentFormGroup: FormGroup;
  @Input('selectedUsers') selectedUsers: string[];
  @Input('search') search: boolean;
  @Output() onUsersUpdate: EventEmitter<any> = new EventEmitter();
  @Output() onUsersInit: EventEmitter<any> = new EventEmitter();
  userOptionList: SelectItem[] = [];

  constructor(private globalService: GlobalService) {}

  ngOnInit() {
    this.getOptionList();
  }

  getOptionList() {
    this.globalService
      .getDropdown('users' + environment.serverEnv + '/', 'filter=Akguard')
      .subscribe(
        (data: any) => {
          let defaultText = '';
          if ( !this.isMultiSelect ) {
            defaultText = 'Select Guard';
          }

          const list = this.globalService.prepareUserDropDown(data.data,  defaultText);
          this.userOptionList.push.apply(this.userOptionList, list);

          // this.userOptionList.sort( (a, b) => {
          //   return a.label > b.label;
          // });

          if (this.userOptionList.length > 0) {
            this.onUsersInit.emit(true);
          } else {
            this.onUsersInit.emit(false);
          }
        },
        (error: any) => this.onUsersInit.emit(error)
      );
  }
}
