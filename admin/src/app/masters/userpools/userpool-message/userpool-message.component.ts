import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';

import { GlobalService } from '../../../core/global.service';
import { UserPoolService } from '../shared/userpool.service';
import {
    UserPoolAdminCreateUserConfig,
    UserPoolInviteMessageTemplate,
    UserPoolModel,
    UserPoolSchemaAttributes,
} from './../shared/userpool.model';


@Component({
  selector: 'app-userpool',
  templateUrl: './userpool-message.component.html',
  providers: [GlobalService]
})
export class UserPoolMessageComponent implements OnInit {

  msgs: Message[] = [];
  title: String;
  smsMessage: String;
  emailSubject: String;
  emailMessage: String;
  userpoolMessageForm: FormGroup;
  userPoolModel: UserPoolModel;
  inviteMessageTemplate: UserPoolInviteMessageTemplate;
  attributeList: UserPoolSchemaAttributes[]= [];
  loader = false;

  constructor(
    private fb: FormBuilder,
    private userPoolService: UserPoolService,
    private router: Router
  ) {
    this.userpoolMessageForm = this.fb.group({
      smsMessage: ['', [Validators.required]],
      emailSubject: ['', [Validators.required]],
      emailMessage: ['', [Validators.required]]
    });

    this.loader = true;
    this.userPoolService.describeUserPool().subscribe(res => {
      // console.log(res);
      this.loader = false;
      this.userPoolModel = res;
      this.inviteMessageTemplate = res.AdminCreateUserConfig.InviteMessageTemplate;
      this.smsMessage = res.AdminCreateUserConfig.InviteMessageTemplate.SMSMessage;
      this.emailSubject = res.AdminCreateUserConfig.InviteMessageTemplate.EmailSubject;
      this.emailMessage = res.AdminCreateUserConfig.InviteMessageTemplate.EmailMessage;
      this.userpoolMessageForm.reset({
        smsMessage: this.smsMessage,
        emailSubject: this.emailSubject,
        emailMessage: this.emailMessage
      });
    }, (err:any) => {
      this.loader = false;
      this.showError(err);
    });

    this.title = 'Invite Message Templates';

  }

  ngOnInit() {

  }

  /**
   * Function called on submit
   * Params {object} value
   * @memberof UserPoolMessageComponent
   */
  onSubmit(value: any) {
    // const updatedUserPool = new UserPoolModel;
    const adminCreateUserConfig = new UserPoolAdminCreateUserConfig;
    const inviteMessageTemplate = new UserPoolInviteMessageTemplate;
    inviteMessageTemplate.SMSMessage = value.smsMessage;
    inviteMessageTemplate.EmailSubject = value.emailSubject;
    inviteMessageTemplate.EmailMessage = value.emailMessage;

    adminCreateUserConfig.InviteMessageTemplate = inviteMessageTemplate;
    // updatedUserPool.AdminCreateUserConfig = adminCreateUserConfig;
    this.userPoolModel.AdminCreateUserConfig = adminCreateUserConfig;

    if ( this.userPoolModel.Id ) {
      delete this.userPoolModel.Id;
    }
    if ( this.userPoolModel.Name ) {
      delete this.userPoolModel.Name;
    }
    if ( this.userPoolModel.LastModifiedDate ) {
      delete this.userPoolModel.LastModifiedDate;
    }
    if ( this.userPoolModel.CreationDate ) {
      delete this.userPoolModel.CreationDate;
    }
    if ( this.userPoolModel.SchemaAttributes ) {
      delete this.userPoolModel.SchemaAttributes;
    }
    if ( this.userPoolModel.EstimatedNumberOfUsers ) {
      delete this.userPoolModel.EstimatedNumberOfUsers;
    }
    if ( this.userPoolModel.SmsConfiguration ) {
      delete this.userPoolModel.SmsConfiguration;
    }

    this.userPoolService.updateUserPool(this.userPoolModel).subscribe(() => {
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Success', detail: 'Invite Message Templates updated successfully' });
        this.navigateBack();
        this.loader = false;
    }, (error:any) => {
      this.showError(error);
    });

  }


  /**
   * Function for showing the error
   * @memberof UserPoolMessageComponent
   */
  public showError(error: any) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.message });
  }

  /**
   * Function called on cancel
   * @memberof UserPoolMessageComponent
   */
  onCancel() {
      this.userpoolMessageForm.reset({
        smsMessage: this.smsMessage,
        emailSubject: this.emailSubject,
        emailMessage: this.emailMessage
      });
    this.navigateBack();
  }

  /**
   * Function for navigating to list
   * @memberof UserPoolMessageComponent
   */
  public navigateBack() {
    setTimeout(() => {
        this.router.navigate(['/userpools/users']);
    }, 1000);
  }

}
