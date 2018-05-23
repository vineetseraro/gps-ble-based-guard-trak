// import { Category } from 'aws-sdk/clients/support';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';

import { GlobalService } from '../../../core/global.service';
import { CategoryAddRequest, CategoryModel } from '../shared/category.model';
import { CategoryApiService } from '../shared/categoryapiservice';
import { DashboardService } from './../../../themes/stryker/services/dashboard.service';
import { environment } from '../../../../environments/environment';
import { ValidationService } from '../../../core/validators/validation.service';



@Component({
    selector: 'app-category-add',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss'],
    providers: [CategoryApiService, GlobalService, ValidationService]
})
export class CategoryComponent implements OnInit {

    attributes: SelectItem[];
    categoryForm: FormGroup;
    msgs: Message[] = [];
    title: String;
    id: string;
    readCategory: CategoryModel;
    attributeOption: SelectItem[];
    display = false;
    tags: any = [];
    loader = false;
    editmessage = '';
    categoryOptionList: SelectItem[];
    isParentLoad = 'false';




    /**
     * Creates an instance of CategoryComponent.
     * @param {FormBuilder} fb
     * @param {CategoryApiService} categaryApiService
     * @param {Router} router
     * @param {ActivatedRoute} route
     * @param {GlobalService} globalService
     * @param {DashboardService} DashboardService
     * @memberof CategoryComponent
     */
    constructor(
        private fb: FormBuilder,
        private categaryApiService: CategoryApiService,
        private router: Router,
        private route: ActivatedRoute,
        private globalService: GlobalService,
        public DashboardService: DashboardService,
        private validationService: ValidationService
    ) { }

    /**
     * Initilization method
     * @memberof CategoryComponent
     */
    ngOnInit() {
        this.globalService.getDropdown('attributes' + environment.serverEnv).subscribe((data:any) => {
            this.attributeOption = this.globalService.prepareDropDown(data.data, "Select");
        });

        this.categoryForm = this.fb.group({
            'name': ['', [Validators.required, Validators.maxLength(environment.nameMaxLength)]],
            'code': ['', [Validators.required, Validators.maxLength(environment.codeMaxLength)]],
            'parent': [''],
            status: [true],
            sysDefined: { value: 0, disabled: true },
            tags: [this.tags]

        });


        this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('id')) {
                    this.setEditDefaultStatus();
                    this.id = params['id'];
                    this.loader = true;
                    this.categaryApiService.get(this.id).subscribe((data:any) => {
                        this.loader = false;
                        this.readCategory = data.data;
                        this.updateCategory(this.readCategory);
                        this.getDropDowns(this.id);

                    });
                    this.title = 'Edit Category';
                } else {
                    this.getDropDowns(null);
                    this.title = 'Add Category';

                }
            }
        );

    }

    /**
     * Update Category
     * @memberof CategoryComponent
     */
    updateCategory(readCategory: CategoryModel) {
        this.tags = this.globalService.getTagKeywords(readCategory.tags);
        const disableValue = readCategory.sysDefined === 1 ? true : false;
        if (this.tags === undefined || this.tags === null) {
            this.tags = [];
        }
        disableValue ? this.editmessage = 'You Can not edit System defined attribute' : this.editmessage = '';

        this.categoryForm.reset({
            name: { value: readCategory.name, disabled: disableValue },
            code: { value: readCategory.code, disabled: true },
            status: { value: readCategory.status === 1 ? true : false, disabled: disableValue },
            sysDefined: { value: readCategory.sysDefined, disabled: true },
            tags: { value: this.tags, disabled: disableValue },
            parent: { value: '', disabled: disableValue },


        });

    }


    initAttribute() {
        let attrForm: FormGroup;
        attrForm = this.fb.group({
            'id': ['', []],
            'value': ['', []],
        });

        // attrForm = this.fb.group(new Attribute());

        return attrForm;
    }




    /**
     * Submit Button Click
     * @param {*} value
     * @memberof CategoryComponent
     */
    onSubmit(value: any) {
        if (value.status === true) {
            value.status = 1;
        } else {
            value.status = 0;
        }

        if (this.id == null) {
            this.addCategory(value);
        } else {
            this.editCategory(value);
        }

    }


    /**
     * Add New Category
     * @param {*} value
     * @memberof CategoryComponent
     */
    addCategory(value: any) {
        const addCategoryRequest: CategoryAddRequest = {
            parent: value.parent, code: value.code, name: value.name, status: value.status,
            sysDefined: value.sysDefined, tags: this.tags
        };
        this.loader = true;
        this.categaryApiService.addCategory(addCategoryRequest).subscribe(
            () => {
                this.showSuccess('Category saved successfully');
            },
            (error:any) => this.showError(error));
    }

    getDropDowns(categoryID: any) {
        this.globalService.getParentDropdown('categories' + environment.serverEnv, categoryID).subscribe((data:any) => {
            this.categoryOptionList = this.globalService.prepareDropDown(data.data, 'Select Parent');
            console.log('loaded category' + this.readCategory.parent);
            this.categoryForm.patchValue({
                parent: this.readCategory.parent,

            });
        }, (error:any) => this.showError(error));
    }

    /**
     * Update Category
     * @param {*} value
     * @memberof CategoryComponent
     */
    editCategory(value: any) {
        const addCategoryRequest: CategoryAddRequest =
            {
                parent: value.parent, code: this.readCategory.code,
                name: value.name, status: value.status, sysDefined: value.sysDefined, tags: this.tags
            };
        this.loader = true;
        this.categaryApiService.editCategory(addCategoryRequest, this.id).subscribe(
            () => {
                this.showSuccess('Category updated successfully');
            },
            (error:any) => this.showError(error));
    }


    /**
     * Function to show error message from API
     * @param {*} error 
     * @memberof CategoryComponent
     */
    public showError(error: any) {
        this.loader = false;
        this.validationService.showError(this.categoryForm, error);
    }

    public showSuccess(message: string) {
        this.loader = false;
        this.msgs = [];
        this.msgs.push({ severity: 'success', summary: 'Success', detail: message });
        setTimeout(() => {
            this.navigateBack();
        }, environment.successMsgTime);
    }


    /**
     * Function to navigate to privious page
     * @memberof CategoryComponent
     */
    onCancel() {
        this.navigateBack();
    }

    /**
       * Function to navigate to privious after Add/Edit Category
       * @memberof CategoryComponent
       */
    private navigateBack() {
        this.router.navigate(['/categories']);
    }


    onTagUpdate(event: any) {
        this.tags = event;
    }
 setEditDefaultStatus()
  {
    this.categoryForm.patchValue({
                status: 0,

            });
  }
}
