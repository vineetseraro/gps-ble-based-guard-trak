import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/primeng';

import { environment } from '../../../../environments/environment';
import { HttpRestService } from '../../../core/http-rest.service';
import { UserPoolGroupService } from '../shared/userpool.service';

@Component({
  selector: 'app-userpool-group-add',
  templateUrl: './userpool-group.component.html'
})
export class UserPoolGroupComponent implements OnInit {
  userpoolGroupForm: FormGroup;
  msgs: Message[] = [];
  title = '';
  userDetail = [];
  loader = false;
  isEdit;
  openHelpText = false;

  constructor(
    private fb: FormBuilder,
    private userPoolGroupService: UserPoolGroupService,
    private httpRestService: HttpRestService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userpoolGroupForm = this.fb.group({
      groupName: ['', [Validators.required]],
      description: ['', []],
      // precedence: ['', []],
      userPoolId: [environment.projectId, [Validators.required]]
    });
  }

  ngOnInit() {
    const data = this.route.snapshot.params;
    // console.log(data);
    this.loader = true;
    if (data.hasOwnProperty('name')) {
      this.isEdit = true;
      this.title = 'Edit Group';
      this.userPoolGroupService.getGroup(data.name).subscribe(
        res => {
          this.updateGroup(res);
        },
        (err:any) => {
          this.showError(err);
        }
      );
      this.userPoolGroupService.listUsersInGroup(data.name).subscribe(
        res => {
          const userList = [];
          for (let i = 0; i < res['Users'].length; i++) {
            const sub = res['Users'][i].Attributes.filter((x:any) => x.Name === 'sub')[0].Value;
            const fName = res['Users'][i].Attributes.filter((x:any) => x.Name === 'given_name')[0].Value;
            const lName = res['Users'][i].Attributes.filter((x:any) => x.Name === 'family_name')[0].Value;
            const email = res['Users'][i].Username;
            const status = res['Users'][i].UserStatus;
            userList.push({
              id: sub,
              name: fName + ' ' + lName,
              email: email,
              status: status
            });
          }
          this.userDetail = userList;
          this.loader = false;
        },
        (err:any) => {
          this.userDetail = [];
          this.showError(err);
        }
      );
    } else {
      this.isEdit = false;
      this.loader = false;
      this.title = 'Create Group';
    }
  }

  /**
   * Function to set group details on view mode
   * @param {object} group
   * @memberof UserPoolGroupComponent
   */
  updateGroup(group: any) {
    this.userpoolGroupForm.reset({
      groupName: group.Group.GroupName,
      description: group.Group.Description,
      // precedence: group.Group.Precedence,
      userPoolId: environment.projectId
    });
  }

  /**
   * Function to save a group
   * @param {object} value
   * @memberof UserPoolGroupComponent
   */
  onSubmit(value: any) {
    if (this.title === 'Edit Group') {
      this.editGroup(value);
    } else {
      this.createGroup(value);
    }
  }

  /**
   * Function to create a group
   * @param {object} value
   * @memberof UserPoolGroupComponent
   */
  public createGroup(value: any) {
    this.loader = true;
    this.httpRestService.post('iam' + environment.serverEnv + '/group', value).subscribe(
     (data:any) => {
        data;
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'Success',
          detail: 'group added successfully'
        });
        this.loader = false;
        this.navigateToListFromGroup();
      },
      (error:any) => this.showError(error)
    );
  }

  /**
   * Function for editing group
   * @param {object} value
   * @memberof UserPoolGroupComponent
   */
  public editGroup(value: any) {
    // const groupRequest: any = { GroupName: value.groupName, Description: value.description, Precedence: value.precedence };
    const groupRequest: any = {
      GroupName: value.groupName,
      Description: value.description,
      Precedence: 0
    };
    this.loader = true;
    this.userPoolGroupService.updateGroup(groupRequest).subscribe(
     (data:any) => {
        data;
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'Success',
          detail: 'Group edited successfully'
        });
        this.loader = false;
        this.navigateToListFromGroup();
      },
      (error:any) => this.showError(error)
    );
  }

  /**
   * Function for showing the error
   * @memberof UserPoolGroupComponent
   */
  public showError(error: any) {
    this.loader = false;
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: error.message });
  }

  /**
   * Function for navigating to Groups tab in list
   * @memberof UserPoolGroupComponent
   */
  public navigateToListFromGroup() {
    setTimeout(() => {
      this.router.navigateByUrl('/userpools/groups', { skipLocationChange: true });
    }, 1000);
  }

  /**
   * Function for navigating to Groups tab in list
   * @memberof UserPoolGroupComponent
   */
  public goToListFromGroup() {
    this.router.navigateByUrl('/userpools/groups', { skipLocationChange: true });
  }

  /**
   * Set flag to show/hide password helptext
   * @param {any}
   * @memberof UserPoolGroupComponent
   */
  setFlagForHelptext(flag: boolean) {
    this.openHelpText = flag;
  }
}
