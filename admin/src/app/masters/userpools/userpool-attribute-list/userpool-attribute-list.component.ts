import { Component, HostListener, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';

import { GlobalService } from '../../../core/global.service';
import { UserPoolService } from '../shared/userpool.service';
import { UserPoolModel, UserPoolSchemaAttributes } from './../shared/userpool.model';


@Component({
  selector: 'app-userpool',
  templateUrl: './userpool-attribute-list.component.html',
  providers: [GlobalService]
})
export class UserPoolAttributeListComponent implements OnInit {

  userPoolModel: UserPoolModel;
  requiredAttributes = '';
  customAttributes = '';
  totalRecords = 0;
  attributeList: UserPoolSchemaAttributes[] = [];
  loader = false;
  innerHeight: any;
  msgs: Message[] = [];

  constructor(private userPoolService: UserPoolService) {
    this.loader = true;
    this.userPoolService.describeUserPool().subscribe(res => {
      // console.log(res);
      this.userPoolModel = res;
      this.totalRecords = this.userPoolModel.SchemaAttributes.length;
      const customAttributeList: UserPoolSchemaAttributes[] = [];
      this.userPoolModel.SchemaAttributes.forEach(value => {
        if (value.Required) {
        } else {
          customAttributeList.push(value);
        }
      });
      this.attributeList = customAttributeList;
      this.loader = false;
    }, (err:any) => {
      this.loader = false;
      this.showError(err);
    });
  }

  /**
   * Function for showing the error
   * @memberof UserPoolAttributeListComponent
   */
  public showError(error: any) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.message });
  }

  ngOnInit() {
    this.heightCalc();
  }

  public heightCalc() {
    this.innerHeight = (window.screen.height);
    console.log(this.innerHeight);
    this.innerHeight = (this.innerHeight - 350) + "px"
    console.log(this.innerHeight);
  }

  @HostListener('window:resize', ['$event'])
 onResize(event:any) {
    this.innerHeight = ((event.target.innerHeight) - 210) + "px";
  }

}
