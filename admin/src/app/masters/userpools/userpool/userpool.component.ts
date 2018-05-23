import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/primeng';

import { UserPoolClientService, UserPoolService } from '../shared/userpool.service';
import { UserPoolModel } from './../shared/userpool.model';


@Component({
  selector: 'app-userpool',
  templateUrl: './userpool.component.html',
})
export class UserPoolComponent implements OnInit {

  data: any;
  userPoolModel: UserPoolModel = new UserPoolModel;
  requiredAttributes = '';
  customAttributes = '';
  passwordPolicy = '';
  passwordMinLength = 0;
  allowAdminCreateUserOnly = false;
  clientNames = '';
  loader = false;
  msgs: Message[] = [];

  constructor(private userPoolService: UserPoolService, private userPoolClientService: UserPoolClientService) {
    this.loader = true;
    this.userPoolService.describeUserPool().subscribe(res => {
      this.loader = false;
      // console.log(res);
      // console.log('poolid : ' + res.Id);
      this.data = res;
      this.userPoolModel = res;
      this.userPoolModel.SchemaAttributes.forEach(value => {
        if (value.Required) {
          this.requiredAttributes = this.requiredAttributes.concat(value.Name) + ',';
        } else {
          this.customAttributes = this.customAttributes.concat(value.Name) + ',';
        }
      });
      this.passwordMinLength = this.userPoolModel.Policies.PasswordPolicy.MinimumLength;

      if (this.userPoolModel.Policies.PasswordPolicy.RequireLowercase) {
        this.passwordPolicy = this.passwordPolicy.concat('lowercase letters,');
      }
      if (this.userPoolModel.Policies.PasswordPolicy.RequireUppercase) {
        this.passwordPolicy = this.passwordPolicy.concat('uppercase letters,');

      }
      if (this.userPoolModel.Policies.PasswordPolicy.RequireNumbers) {
        this.passwordPolicy = this.passwordPolicy.concat('numbers,');

      }

      if (this.userPoolModel.Policies.PasswordPolicy.RequireSymbols) {
        this.passwordPolicy = this.passwordPolicy.concat('special character');
      }

      this.allowAdminCreateUserOnly = this.userPoolModel.AdminCreateUserConfig.AllowAdminCreateUserOnly;


    }, (err:any) => {
      this.showError(err);
    });

    this.userPoolClientService.listUserPoolClients([], '').subscribe(res => {
      if ( res['UserPoolClients'] && res['UserPoolClients'].length ) {
        const clients = [];
        res['UserPoolClients'].forEach(value => {
          clients.push(value.ClientName);
        });
        if ( clients ) {
          this.clientNames = clients.join(', ');
        }
      }
    }, (err:any) => {
      this.showError(err);
    });
  }

  /**
   * Function for showing the error
   * @memberof UserPoolComponent
   */
  public showError(error: any) {
    this.loader = false;
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.message });
  }

  ngOnInit() {

  }

}
