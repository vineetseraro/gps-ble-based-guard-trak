
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';
import { GlobalService } from '../../../core/global.service';
import { AddRequestModel, Attribute, AttributeType } from '../shared/attribute.model';
import { AttributesService } from '../shared/attributes.service';
import { DashboardService } from './../../../themes/stryker/services/dashboard.service';
import { ValidationService } from '../../../core/validators/validation.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-attributes-add',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss'],
  providers: [AttributesService, GlobalService, ValidationService],
})

export class AttributeComponent implements OnInit {
  attributes: SelectItem[];
  data: AttributeType[];
  code = '';
  name = '';
  attributeForm: FormGroup; // our model driven form
  msgs: Message[] = [];
  id = '';
  attribute: Attribute;
  title = '';
  display = false;
  tags: any = [];
  loader = false;
  editmessage = '';
  /**
   * Creates an instance of AttributeComponent.
   * @param {AttributesService} attributeService
   * @param {Router} router
   * @param {FormBuilder} fb
   * @param {ActivatedRoute} route
   * @param {GlobalService} globalService
   * @memberof AttributeComponent
   */
  constructor(
    private attributeService: AttributesService,
    private router: Router,
    private fb: FormBuilder,
    public DashboardService: DashboardService,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private validationService: ValidationService
  ) { }

  /**
   * Function for closing the modal box
   * @memberof AttributeComponent
   */

  /**
   * Init function
   * @memberof AttributeComponent
   */
  ngOnInit() {

    this.attributeForm = this.fb.group({
      'name': ['', [Validators.required, Validators.maxLength(environment.nameMaxLength)]],
      'code': ['', [Validators.required, Validators.maxLength(environment.codeMaxLength)]],
      'status': [true],
      'sysDefined': [{ value: 0, disabled: true }],
      'tags': [this.tags]
    });
    this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.setEditDefaultStatus();
          this.id = params['id'];
          this.loader = true;
          this.attributeService.getAttributeDetails(this.id).subscribe((data: any) => {
            this.loader = false;
            this.attribute = data.data;
            this.setAttributeDetails(this.attribute);

          });
          this.title = 'Edit Attribute';
        } else {
          this.title = 'Add Attribute';
        }
      }
    );



  }
  /**
   * Function for submit the form
   * @param {*} value
   * @memberof AttributeComponent
   */
  onSubmit(value: any) {
    if (value.status === true) {
      value.status = 1;
    } else if (value.status === false) {
      value.status = 0;
    }
    if (this.id === '') {
      this.addAttribute(value);
    } else {
      this.editAttribute(value);
    }
  }
  /**
   * Set attributes value functions
   * @param {Attribute} attribute
   * @memberof AttributeComponent
   */
  setAttributeDetails(attribute: Attribute) {
    this.tags = this.globalService.getTagKeywords(attribute.tags);
    const disableValue = attribute.sysDefined === 1 ? true : false;
    if (this.tags === undefined || this.tags === null) {
      this.tags = [];
    }
    disableValue ? this.editmessage = 'You Can not edit System defined attribute' : this.editmessage = '';

    this.attributeForm.reset({
      name: { value: attribute.name, disabled: disableValue },
      code: { value: attribute.code, disabled: true },
      status: { value: attribute.status === 1 ? true : false, disabled: disableValue },
      sysDefined: { value: attribute.sysDefined, disabled: true },
      tags: { value: this.tags, disabled: disableValue }
    });


  }


  /**
   * Function for adding the attribute
   * @param {*} value
   * @memberof AttributeComponent
   */
  addAttribute(value: any) {
    // console.log('value of form=='+ finalTags);
    // const finalTags = this.globalService.getTags(this.tagKeywords, this.tags);
    const addAttributeRequest: AddRequestModel = {
      code: value.code,
      name: value.name,
      status: value.status,
      sysDefined: value.sysDefined,
      tags: this.tags
    };

    this.loader = true;

    this.attributeService.addAttribute(addAttributeRequest).subscribe(
      (data: any) => {
        this.data = data.data;
        this.showSuccess('Attribute saved successfully');
      },
      (error: any) => this.showError(error));
  }
  /**
   * Function for editing the attribute form
   * @param {*} value
   * @memberof AttributeComponent
   */
  editAttribute(value: any) {
    const addAttributeRequest: AddRequestModel = {
      code: this.attribute.code,
      name: value.name,
      status: value.status,
      sysDefined: value.sysDefined,
      tags: this.tags
    };
    this.loader = true;
    this.attributeService.editAttribute(addAttributeRequest, this.id).subscribe(
      (data: any) => {
        this.data = data.data;
        this.showSuccess('Attribute updated successfully');
      },
      (error: any) => this.showError(error));
  }
  /**
   * Function for showing the error
   * @param {*} error
   * @memberof AttributeComponent
   */
  public showError(error: any) {
    this.loader = false;
    this.validationService.showError(this.attributeForm, error);
  }

  public showSuccess(message: string) {
    this.loader = false;
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Success', detail: message });
    setTimeout(() => {
      this.navigateBack();
    }, environment.successMsgTime);
  }
  onTagUpdate(event: any) {
    this.tags = event;
  }

  onCancel() {
    this.navigateBack();
  }

  private navigateBack() {
    this.router.navigate(['/attributes']);
  }
  setEditDefaultStatus() {
    this.attributeForm.patchValue({
      status: 0,

    });
  }

}
