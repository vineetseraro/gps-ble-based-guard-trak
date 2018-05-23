import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';

import { GlobalService } from '../../../core/global.service';
import { UserPoolPasswordPolicy, UserPoolPolicies } from '../shared/userpool.model';
import { UserPoolService } from '../shared/userpool.service';
import { UserPoolModel } from './../shared/userpool.model';


@Component({
  selector: 'app-userpool',
  templateUrl: './userpool-policies.component.html',
  providers: [GlobalService]
})
export class UserPoolPoliciesComponent implements OnInit {

  userpoolPolicyForm: FormGroup;
  msgs: Message[] = [];
  title: String;
  id: string;
  loader = false;
  userPoolModel: UserPoolModel;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userPoolService: UserPoolService
  ) { }

  ngOnInit() {
    this.loader = true;
    this.userpoolPolicyForm = this.fb.group({
      minLength: ['', [Validators.required]],
      reqNumber: [''],
      reqSpl: [''],
      reqUpperCase: [''],
      reqLowerCase: [''],
      // isSignUpAllowed: [''],
      unusedAccountValidity: ['']
    });


    this.userPoolService.describeUserPool().subscribe(res => {
      this.userPoolModel = res;
      this.userpoolPolicyForm.reset({
        minLength: res.Policies.PasswordPolicy.MinimumLength,
        reqNumber: res.Policies.PasswordPolicy.RequireNumbers,
        reqSpl: res.Policies.PasswordPolicy.RequireSymbols,
        reqUpperCase: res.Policies.PasswordPolicy.RequireUppercase,
        reqLowerCase: res.Policies.PasswordPolicy.RequireLowercase,
        // isSignUpAllowed: res.AdminCreateUserConfig.AllowAdminCreateUserOnly,
        unusedAccountValidity: res.AdminCreateUserConfig.UnusedAccountValidityDays
      });
      this.loader = false;

    }, (err: any) => {
      this.loader = false;
      this.showError(err);
    });

    this.title = 'Password Policy';

  }

  onSubmit(value: any) {
    this.loader = true;
    // const updatedUserPool = new UserPoolModel;
    const policy = new UserPoolPolicies;
    const pwdPolicy = new UserPoolPasswordPolicy;
    pwdPolicy.MinimumLength = value.minLength;
    pwdPolicy.RequireLowercase = value.reqLowerCase;
    pwdPolicy.RequireNumbers = value.reqNumber;
    pwdPolicy.RequireSymbols = value.reqSpl;
    pwdPolicy.RequireUppercase = value.reqUpperCase;
    policy.PasswordPolicy = pwdPolicy;
    // updatedUserPool.Policies = policy;
    this.userPoolModel.Policies = policy;

    // const adminCreateUserConfig = new UserPoolAdminCreateUserConfig;
    // adminCreateUserConfig.AllowAdminCreateUserOnly = false; // value.isSignUpAllowed;
    // adminCreateUserConfig.UnusedAccountValidityDays = value.unusedAccountValidity;
    // // updatedUserPool.AdminCreateUserConfig = adminCreateUserConfig;
    // this.userPoolModel.AdminCreateUserConfig = adminCreateUserConfig;

    this.userPoolModel.AdminCreateUserConfig.AllowAdminCreateUserOnly = false;
    this.userPoolModel.AdminCreateUserConfig.UnusedAccountValidityDays = value.unusedAccountValidity;

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
      this.msgs.push({ severity: 'success', summary: 'Success', detail: 'Permission updated successfully' });
      this.loader = false;
      this.navigateToList();
    }, (error: any) => {
      this.loader = false;
      this.showError(error);
    });
  }

  /**
   * Function for showing the error
   * @memberof UserPoolPoliciesComponent
   */
  public showError(error: any) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.message });
  }

  /**
   * Function for navigating to list
   * @memberof UserPoolPoliciesComponent
   */
  navigateToList() {
    setTimeout(() => {
      this.router.navigate(['/userpools/users']);
    }, 1000);
  }
}
