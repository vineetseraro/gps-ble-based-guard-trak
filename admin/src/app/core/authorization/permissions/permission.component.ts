import { environment } from './../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

import { HttpRestService } from '../../../core/http-rest.service';
import { ValidationService } from '../../../core/validators/validation.service';
import { UserPoolGroupService } from '../../../masters/userpools/shared/userpool.service';
import { ModuleModel, PermissionResponse, ResourceModel, UserGroupRole } from '../shared/authorization.model';

@Component({
  selector: 'app-userpool',
  templateUrl: './permission.component.html',
  providers: [ValidationService]
})
export class PermissionComponent implements OnInit {
  permissionFG: FormGroup;
  resources: ResourceModel[] = [];
  modules: ModuleModel[] = [];
  // roleName: string;
  userGroupRoles: UserGroupRole[] = [];
  groups: SelectItem[] = [];
  selectedGroup: UserGroupRole;
  loader = false;
  msgs: Message[] = [];
  isDisable = true;
  defaultAdminPermissionJson: any;
  // isChkDisable = false;

  constructor(
    private fb: FormBuilder,
    private httpRestService: HttpRestService,
    private userPoolGroupService: UserPoolGroupService,
    private validationService: ValidationService
  ) {
    this.permissionFG = this.fb.group({
      roleName: ['', []],
      modules: this.fb.array([])
    });

    this.loader = true;
    this.userPoolGroupService.listGroups([], '').subscribe(res => {
      this.loader = false;
      res['Groups'].forEach((group:any) => {
        const userGroupRole = new UserGroupRole();
        userGroupRole.group = group.GroupName;
        userGroupRole.role = group.RoleArn.split('/')[1];
        this.userGroupRoles.push(userGroupRole);
        this.groups.push({ label: group.GroupName, value: userGroupRole });
      });
    });

    // console.log('multi--');
    // var multi: number[][] = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]];
    // console.log(multi[0].length);
    // for (var i: number = 0; i < multi.length; i++) {

    //   for (var j: number = 0; j < multi[i].length; j++) {
    //     console.log(multi[i][j]);

    //   }

    // }
  }

  groupChanged() {
    // console.log(this.selectedGroup.role);
    this.getGroupPolicy(this.selectedGroup.role);
    const control = <FormArray>this.permissionFG.controls['modules'];
    while (control.length) {
      control.removeAt(0);
    }
  }

  getGroupPolicy(role: string) {
    this.loader = true;
    this.validationService.clearErrors();
    this.httpRestService
      .get('iam' + environment.serverEnv + '/group/policy?role=' + role)
      .map((res:any) => <PermissionResponse>res.json())
      .subscribe(
        (response:any) => {
          // this.resources = [];
          this.loader = false;
          this.isDisable = false;
          this.modules = response.data.modules;
          this.setresourcees();
        },
        (error:any) => {
          this.showError(error);
        }
      );
  }

  setresourcees() {
    this.permissionFG.patchValue({
      roleName: this.selectedGroup.role
    });

    const formArrayControl = <FormArray>this.permissionFG.controls['modules'];
    // console.log(formArrayControl.controls.length);

    this.modules.forEach(moduleModel => {
      // console.log(moduleModel.name);

      // if (moduleModel.name === "admin") {
      //   this.isChkDisable = true;

      // } else {
      //   this.isChkDisable = false;

      // }

      const moduleFG = this.fb.group({
        name: [moduleModel.name, []],
        resources: this.fb.array([])
      });

      const resourceFGs = moduleModel.resources.map(resourceModel => this.fb.group(resourceModel));
      const resourceFormArray = this.fb.array(resourceFGs);

      if (moduleModel.name === 'admin') {
        this.defaultAdminPermissionJson = moduleModel;
        // const arr: any = <FormArray>resourceFormArray.get('0');
        // resourceFormArray.removeAt(0);
        // console.log(arr.controls);
      } else {
        moduleFG.setControl('resources', resourceFormArray);
        formArrayControl.push(moduleFG);
      }
    });
  }

  ngOnInit(): void {}

  get modules1() {
    return <FormArray>this.permissionFG.get('modules');
  }

  checkboxClicked(event: any, selectedModule: number, selectedResource: number) {
    event;
    selectedModule;
    selectedResource;
    // console.log(event);
    // console.log(selectedResource);

    // for (let i = 0; i < this.modules.length; i++) {

    //   if (i == selectedModule) {
    //     console.log(i);

    //     this.modules[i].resources;

    //   } else {
    //     continue;
    //   }

    // }
  }
  onSubmit(value: any) {
    this.loader = true;
    value.userPoolId = environment.projectId;
    value.modules.push(this.defaultAdminPermissionJson);
    // console.log(value);
    this.httpRestService.put('iam' + environment.serverEnv + '/group/policy', value).subscribe(
      () => {
        this.loader = false;
        this.msgs = [];
        this.msgs.push({
          severity: 'success',
          summary: 'Success',
          detail:
            'Permissions updated successfully. The changes will be applied to the user after 3-5 minutes'
        });
      },
      (error:any) => this.showError(error)
    );
  }

  public showError(error: any) {
    this.loader = false;
    this.validationService.showError(this.permissionFG, error);
  }
}
