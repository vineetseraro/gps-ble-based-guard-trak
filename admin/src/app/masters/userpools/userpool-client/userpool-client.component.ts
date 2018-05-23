import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../core/global.service';
import { UserPoolClientService } from '../shared/userpool.service';
import { UserPoolDescribeClient } from './../shared/userpool.model';


@Component({
  selector: 'app-userpool',
  templateUrl: './userpool-client.component.html',
  providers: [GlobalService]
})
export class UserPoolClientComponent implements OnInit {

  types: SelectItem[] = [];
  userpoolClientForm: FormGroup;
  msgs: Message[] = [];
  title: String;
  id: string;
  loader = false;
  client: UserPoolDescribeClient;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userPoolClientService: UserPoolClientService,
  ) { }

  ngOnInit() {
    this.loader = true;
    this.userpoolClientForm = this.fb.group({
      ClientName: ['', [Validators.required]],
      ClientId: [''],
      ClientSecret: [''],
      RefreshTokenValidity: ['', [Validators.required]],
    });

    this.title = 'Add Client';

    this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('clientid') && params.hasOwnProperty('userpoolid')) {
          this.userPoolClientService.describeUserPoolClient(params['userpoolid'], params['clientid']).subscribe(res => {
            this.client = res;
            this.updateClient();
            this.loader = false;
          }, (err:any) => {
            this.loader = false;
            this.showError(err);
          });

          this.title = 'Edit Client';
        } else {
          this.title = 'Add Client';
        }
      }
    );

  }

  /**
   * Fuction for set the form values in edit
   * @memberof UserPoolClientComponent
   */
  updateClient() {
    this.userpoolClientForm.reset({
      ClientName: this.client.ClientName,
      ClientId: this.client.ClientId,
      ClientSecret: this.client.ClientSecret,
      RefreshTokenValidity: this.client.RefreshTokenValidity
    });
  }

  /**
   * Function called on submit
   * @param {object} value
   * @memberof UserPoolClientComponent
   */
  onSubmit(value: any) {
    this.editClient(value);
  }

  /**
   * Function to edit client details
   * @param {object} value
   * @memberof UserPoolClientComponent
   */
  editClient(value) {
    this.userPoolClientService.updateUserPoolClient(value).subscribe(
     (data:any) => {
        data;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Success', detail: 'Client updated successfully' });
        this.navigateToList();
      },
      (error:any) => this.showError(error));
  }

  /**
   * Function for showing the error
   * @memberof UserPoolClientComponent
   */
  public showError(error: any) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.message });
  }

  /**
   * Function for navigating to list
   * @memberof UserPoolClientComponent
   */
  public navigateToList() {
    setTimeout(() => {
        this.router.navigate(['/userpools/clients']);
    }, 1000);
  }

}
