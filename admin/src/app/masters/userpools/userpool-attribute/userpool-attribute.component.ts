import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message, SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../core/global.service';
import { UserPoolService } from '../shared/userpool.service';
import { UserPoolSchemaAttributes, UserPoolStringAttributeConstraints } from './../shared/userpool.model';


@Component({
  selector: 'app-userpool',
  templateUrl: './userpool-attribute.component.html',
  providers: [GlobalService]
})
export class UserPoolAttributeComponent implements OnInit {

  types: SelectItem[] = [];
  userpoolAttributeForm: FormGroup;
  msgs: Message[] = [];
  title: String;
  id: string;
  loader = false;

  constructor(
    private fb: FormBuilder,
    private userPoolService: UserPoolService
  ) { }


  ngOnInit() {

    this.types.push({ label: 'string', value: 'String' });
    this.types.push({ label: 'number', value: 'Number' });
    // this.DashboardService.isMask = true;
    this.userpoolAttributeForm = this.fb.group({
      name: ['', [Validators.required]],
      minLength: ['', [Validators.required]],
      maxLength: ['', [Validators.required]],
      isMutable: [true],
      type: [''],
    });
    this.title = 'Add Attribute';

  }

  /**
   * Function called on submit
   * @memberof UserPoolAttributeComponent
   */
  onSubmit(value: any) {
    this.loader = true;
    const p = [];
    const param = new UserPoolSchemaAttributes;
    param.Name = value.name;
    param.AttributeDataType = value.type;
    param.Mutable = value.isMutable;
    param.DeveloperOnlyAttribute = false;
    param.Required = false;
    param.StringAttributeConstraints = new UserPoolStringAttributeConstraints;
    param.StringAttributeConstraints.MinLength = value.minLength;
    param.StringAttributeConstraints.MaxLength = value.maxLength;
    p.push(param);
    this.userPoolService.addCustomAttributes(p).subscribe(
     (data:any) => {
        data;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Success', detail: 'Attribute added successfully' });
        this.navigateBack();
        this.loader = false;
      },
      (error:any) => {
        this.loader = false;
        this.showError(error);
      });

  }

  /**
   * Function for showing the error
   * @memberof UserPoolAttributeComponent
   */
  public showError(error: any) {
    this.msgs = [];
    error.data.forEach((element:any) => {
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: element.message });
    });
  }

  /**
   * Function called on cancel
   * @memberof UserPoolAttributeComponent
   */
  onCancel() {
    this.navigateBack();
  }

  /**
   * Function to navigate back to list
   * @memberof UserPoolAttributeComponent
   */
  private navigateBack() {
    setTimeout(function() {
      this.router.navigate(['/userpools/attributes']);
    }, 1000);
  }
}
