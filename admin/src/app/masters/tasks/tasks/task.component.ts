import { Attribute } from './../../attributes/shared/attribute.model';
import { GlobalService } from '../../../core/global.service';
import { ValidationService } from '../../../core/validators/validation.service';
import { Task, TaskModel, Location } from '../shared/task.model';
import { TaskService } from '../shared/task.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/primeng';
import { Observable, Subscription } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import { FloorService } from './../../floors/shared/floor.service';
import { ZoneService } from './../../zones/shared/zone.service';
import { UserService } from '../../users/shared/user.service';


@Component({
    selector: 'app-task-add',
    templateUrl: './task.component.html',
    styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit, OnDestroy {
    savedImages: Array<any> = [];
    relatedImages: Array<any> = [];
    images: Array<any> = [];
    totalRecords: number;
    previousQuery: any;
    msgs: Message[] = [];
    submitted: boolean;
    description: string;
    location: any;
    taskForm: FormGroup;
    data: any;
    private subscription: Subscription;
    title: String = '';
    id: String = '';
    taskModel: Observable<TaskModel>;
    addressList: any;
    attributeNameOptionList: SelectItem[];
    attributeList: SelectItem[];
    display = false;
    datalist: Attribute[] = [];
    blankLocation: Location;
    task = <Task>{};
    tags = [];
    selectedCategory = [];
    // selectedUsers = [];
    selectedUser = '';
    loader = false;
    isTaskInit = false;
    isUserInit = false;
    floorList = [];
    zoneList = [];
    floorArray = [];
    floorId: String = '';
    floorVal: String = '';
    isLocationInit = false;
    isEdit = false;
    displayDialog = false;
    parentOptionList: SelectItem[];
    selectedLocation: Location;
    showDelete = false;
    dialogTitle: String = '';
    zoneArray = [];
    dateFormat: String;
    allUsers: any = [];
    selectedDevice = [];
    isDeviceInit = false;
    repeatOn: String = '';
    recur: any = {};
    weekDays = [];
    monthList = [];
    selectedWeeks: string[] = [];
    filterWeekly: Number = 1;
    filterDaily: Number = 1;
    filterMonthly1: Number = 1;
    filterMonthly2: Number = 1;
    dayFilter: String = 'workday';
    filterYear1: Number = 1;
    filterYear2: String = '';
    showCalForOccurrence: Boolean = false;
    occurrenceType: String = 'NoEndDate';
    totalOccurrence: Number = 1;
    endBy: String = '';
    selectedDeviceObj = [];
    schedule: String = '';
    minDate: Date;
    repeats: any = {};

    /**
     * Constructor Definition
     * @param FormBuilder
     * @param TaskService
     * @param GlobalService
     * @param Router
     * @param ActivatedRoute
     */
    constructor(
        private fb: FormBuilder,
        private taskService: TaskService,
        private globalService: GlobalService,
        private router: Router,
        private floorService: FloorService,
        private zoneService: ZoneService,
        private userService: UserService,
        private validationService: ValidationService,
        private route: ActivatedRoute, ) { }

    /**
     * Init function definition
     * @memberof TaskComponent
     */
    ngOnInit() {
        this.minDate = new Date();

        this.clearError();
        this.schedule = 'fixed';
        // this.applyFilter('daily'); // default
        this.repeatOn = 'daily';
        this.recur.type = 'daily';
        this.getWeekdays();
        this.getMonthList();
        this.dateFormat = this.globalService.getCalenderDateFormat();
        this.prepareForm();
        this.fetchDropDown();
        this.savedImages = [];
        this.relatedImages = [];
        this.images = [];

        this.userService.listUsers('').subscribe(
            (data: any) => {
                this.allUsers = data.data;
            },
            (error: any) => {
                error;
            }
        );

        this.subscription = this.route.params.subscribe(
            (params: any) => {
                if (params.hasOwnProperty('id')) {
                    this.setEditDefaultStatus();
                    this.id = params['id'];
                    this.loader = true;
                    this.taskService.get(this.id).subscribe(data => {
                        this.loader = false;
                        this.task = data.data;
                        this.updateTask(this.task);
                        this.getParentDropdowns(this.task.id);
                    }, error => this.showError(error));
                    this.title = 'Edit Tour Schedule';
                } else {
                    this.task.locations = [];
                    this.title = 'Add Tour Schedule';
                    this.setRecurringFilters(this.recur.type);
                    this.schedule = 'fixed';
                    this.getParentDropdowns(null);
                }
            }
        );
    }

    /**
     * Function for destroying all the components behavior
     * @memberof TaskComponent
     */
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    getParentDropdowns(taskId: string) {
        this.globalService.getParentDropdown('tasks' + environment.serverEnv, taskId).subscribe(data => {
            this.parentOptionList = this.globalService.prepareDropDown(data.data, 'Select Parent');
            this.taskForm.patchValue({
                parent: this.task.parent
            });
        }, error => this.showError(error));
    }

    /**
     * Fuction for set the form values in edit
     * @memberof TaskComponent
     */
    updateTask(task: Task) {
        this.isEdit = true;
        // set users on edit mode
        if (task.attendees) {
            task.attendees.forEach((user) => {
                // this.selectedUsers.push(user.uuid);
                this.selectedUser = user.uuid;
            });
        }
        if (task.device) {
            this.selectedDevice = task.device.id;
        }
        this.savedImages = Object.assign(task.images);
        if (task.images) {
            task.images.forEach((prodImage) => {
                this.images.push(this.globalService.processImage(prodImage));
            });
        }
        this.relatedImages = Object.assign(task.images);

        this.taskForm.patchValue({
            name: task.name,
            code: task.code,
            users: this.isUserInit ? this.selectedUser : [],
            description: task.description || '',
            parent: '',
            images: [],
            status: task.status === 1 ? true : false,
            locations: [],
            device: this.isDeviceInit ? this.selectedDevice : '',
            frequency: task.frequency
        });
        this.applySchedule(task.scheduleType);
        if ( task.scheduleType === 'fixed' ) {
            this.taskForm.patchValue({
                from: this.globalService.calendarformatDate(task.from),
                to: this.globalService.calendarformatDate(task.to)
            });
        } else if ( task.scheduleType === 'recurring' ) {
            if ( ['day', 'workday'].includes(task.recur.repeat.type) ) {
                this.dayFilter = task.recur.repeat.type;
            }
            this.repeats[task.recur.type] = task.recur.repeat;
            this.taskForm.patchValue({
                fromTime: this.globalService.calendarformatTime(task.from),
                toTime: this.globalService.calendarformatTime(task.to),
                startDate: this.globalService.calendarformatDate(task.startDate)
            });
            this.recur = task.recur;
            this.setRecurringFilters(this.recur.type);
        }
    }

    /**
     * Function to fetch dropdown values on the
     * basis of parameter given.
     * @memberof TaskComponent
     */
    fetchDropDown() {
        this.globalService.getDropdown('locations' + environment.serverEnv).subscribe(data => {
            this.addressList = this.globalService.prepareDropDown(data.data, 'Select Location');
            this.isLocationInit = true;
            if (this.location !== undefined && this.location !== null) {
                this.taskForm.patchValue({
                    location: this.task.location.id,
                });
            }
        },
        error => this.showError(error));
    }

    /**
     * Function for preparing the form
     * @memberof TaskComponent
     */
    prepareForm() {
        this.taskForm = this.fb.group({
            'name': ['', [Validators.required, Validators.maxLength(environment.nameMaxLength)]],
            'code': [''],
            'users': [this.selectedUser],
            'description': [''],
            'from': [''],
            'to': [''],
            'status': [true],
            'images': [],
            'parent': '',
            'locations': this.fb.array([]),
            'device': [this.selectedDevice, [Validators.required]],
            'frequency': ['', [Validators.required, Validators.min(1)]],
            'fromTime': [''],
            'toTime': [''],
            'startDate': [''],
            'filterDaily': [0],
            'filterWeekly': [0]
        });
        this.taskForm.controls.locations = this.fb.group({
            'location': [''],
            'floor': [''],
            'zone': ['']
        });
        // default
        this.applySchedule('fixed');
    }

    /**
     * Calling the edit API
     * @param {int} id
     * @param id
     */
    onEdit(id) {
        this.router.navigate(['/tasks', id, 'edit']);
    }


    /**
     * Navigation back
     * @private
     * @memberof TaskComponent
     */
    private navigateBack() {
        this.router.navigate(['/tasks']);
    }

    /**
     * Submit Action
     * @param {string} value
     * @memberof TaskComponent
     */
    onSubmit(value: any) {
        this.clearError();
        if (value.status === true) {
            value.status = 1;
        } else if (value.status === false) {
            value.status = 0;
        }
        value.locations = [];
        this.submitted = true;
        value.images = this.relatedImages;
        // const users = value.users;
        value.attendees = [];
        // if ( users.length > 0 ) {
        if (value.users) {
            // users.forEach((userSub) => {
                const userSub = value.users;
                const userData = this.allUsers.filter((x: any) => x.sub === userSub);
                if (userData.length) {
                    value.attendees.push({
                        'uuid': userData[0].sub,
                        'name': userData[0].given_name + ' ' + userData[0].family_name,
                        'firstName': userData[0].given_name,
                        'lastName': userData[0].family_name,
                        'email': userData[0].email,
                        'mobileNo': userData[0].MobileNumber
                    });
                }
            // });
        }
        this.task.locations.forEach( (locObj) => {
            const tempLoc = {location: '', floor: '', zone: ''};
            tempLoc.location = locObj.id || '';
            tempLoc.floor = locObj.floor.id || '';
            tempLoc.zone = locObj.floor.zone.id || '';
            value.locations.push(tempLoc);
        });
        // set recur here
        // value.recur = this.recur;
        value.code = value.name;
        if ( this.schedule === 'fixed' ) {
            value.from = this.globalService.processDate(value.from);
            value.to = this.globalService.processDate(value.to);
            value.recur = null;
            value.startDate = null;
        } else if ( this.schedule === 'recurring' ) {
            value.recur = this.recur;
            if ( this.repeats[this.recur.type] ) {
                value.recur.repeat = this.repeats[this.recur.type];
            }
            value.from = this.globalService.processTime(value.fromTime);
            value.to = this.globalService.processTime(value.toTime);
            value.startDate = this.globalService.processDate(value.startDate, true);
        }
        value.scheduleType = this.schedule;
        // value.device = {id: value.device};
        value.device = this.selectedDeviceObj[0];
        // console.log(value);
        if (this.id === '') {
            this.saveTask(value);
        } else {
            this.editTask(value);
        }

    }

    /**
     * Save Task Function
     * @param {any} value
     * @memberof TaskComponent
     */
    saveTask(value) {
        this.loader = true;
        this.taskService.add(value).subscribe(
            data => {
                this.data = data.data;
                this.showSuccess('Tour Schedule saved successfully');
            }, error => this.showError(error)
        );
    }

    /**
     * Edit Task Function
     * @param {any} value
     * @memberof TaskComponent
     */
    editTask(value) {
        this.loader = true;
        value.code = this.task.code;
        this.taskService.update(value, this.id).subscribe(
            data => {
                this.data = data;
                this.showSuccess('Tour Schedule updated successfully');
            },
            error => this.showError(error)
        );
    }

    public showError(error: any) {
        this.loader = false;
        this.validationService.showError(this.taskForm, error);
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
     * delete Attribute row
     * @param {*} data
     * @memberof TaskComponent
     */
    deleteRow(data: any) {
        data;
        this.task.locations = this.task.locations.filter(obj => obj !== this.selectedLocation);
        this.displayDialog = false;
    }

    /**
     * When tags are updated.
     * @memberof TaskComponent
     */
    onTagUpdate(event) {
        this.tags = event;
    }

    /**
     * Initialising Things Dropdown
     * @memberof TaskComponent
     */
    onUsersInit(event) {
        if (typeof (event) === 'boolean') {
            this.isUserInit = event;
            // if (this.selectedUsers.length > 0) {
            if ( this.selectedUser ) {
                this.updateUsers();
            }
        } else {
            this.showError(event);
        }
    }

    updateUsers() {
        this.taskForm.patchValue({
            users: this.selectedUser,
        });
    }

    /**
     * On finalising the upload images of task.
     * @memberof TaskComponent
     */
    onImageListFinalised(event) {
        this.relatedImages = event;
    }

    /**
     * Function to navigate to previous page
     * @memberof CategoryComponent
     */
    onCancel() {
        this.navigateBack();
    }

    /**
     * To fetch floors of a particular location
     * @memberof TaskComponent
     */
    fetchFloor(type, floorId = null, zoneId = null) {
        this.floorList = [];
        this.zoneList = [];
        this.floorArray = [];

        this.loader = true;

        this.floorList.push({ label: 'Select Floor', value: null });
        this.floorService.getFloor(type).subscribe(data => {
            this.floorArray = data.data;
            this.floorList = this.globalService.prepareDropDown(this.floorArray, 'Select Floor');
            this.zoneList = [];
            this.loader = false;
            if (floorId != null) { // edit mode
                this.taskForm.patchValue({ floor: floorId });
                this.fetchZone(floorId, zoneId);
            }
        }, error => {
                this.floorList = [{ 'label': 'No Floors Available', 'value': null }]
                this.showError(error);
            }
        );
    }

    /**
     * To fetch zones of a particular floor
     * @memberof TaskComponent
     */
    fetchZone(type, zoneId = null) {
        this.zoneList = [];
        this.zoneArray = [];
        this.loader = true;
        this.zoneList.push({ label: 'Select Check Point', value: null });
         this.zoneService.getZone(type).subscribe(data => {
             this.zoneArray = data.data;
            this.zoneList = this.globalService.prepareDropDown(this.zoneArray, 'Select Check Point');
             this.loader = false;
            if (zoneId != null) {
                this.taskForm.patchValue({ zone: zoneId });
            }
        }, error => {
                this.zoneList = [{ 'label': 'No Check Points Available', 'value': null }]
                this.showError(error);
            }
        );
    }

    /**
     * function called to fetch zones and floor on the basis
     * of location and zone id for edit view.
     * @param {string} locationId
     * @param {string} floorId
     * @param {string} zoneId
     * @memberof TaskComponent
     */
    fetchZoneOnUpdate(locationId, floorId, zoneId) {
        if (locationId) {
            this.fetchFloor(locationId, floorId, zoneId);
        }
    }

    /**
     * To add Attribute
     * @memberof TaskComponent
     */
    addMoreLocation() {
        this.dialogTitle = 'Add Location';
        this.showDelete = false;
        this.displayDialog = true;
        this.taskForm.controls.locations = this.fb.group({
            'location': ['', [Validators.required]],
            'floor': [''],
            'zone': ['']
        });
        this.taskForm.controls.locations.reset({
            location: '',
            floor: '',
            zone: ''
        });
    }

    /**
     * To save Attribute of task
     * @memberof TaskComponent
     */
    saveLocations(data) {
        let locObj = <any>{};
        locObj = this.getDetails('location', data.location);
        locObj.floor = this.getDetails('floor', data.floor);
        locObj.floor.zone = this.getDetails('zone', data.zone);

        const locations = [...this.task.locations];
        if (this.task.locations.indexOf(this.selectedLocation) < 0) {
            locations.push(locObj);
        } else {
            locations[this.task.locations.indexOf(this.selectedLocation)] = locObj;
        }
        this.task.locations = locations;

        this.displayDialog = false;
        this.taskForm.controls.locations.patchValue({
            location: '',
            floor: '',
            zone: ''
        });
        this.taskForm.controls.locations = this.fb.group({
            location: [''],
            floor: [''],
            zone: ['']
        });
    }


    getDetails( type, id ) {
        let details = [];
        let response = {};
        switch ( type ) {
            case 'location' :
                details = this.addressList.filter((x: any) => x.value === id);
            break;
            case 'floor' :
                details = this.floorList.filter((x: any) => x.value === id);
            break;
            case 'zone' :
                details = this.zoneList.filter((x: any) => x.value === id);
            break;
        }
        if (details.length) {
            response = {
                'name': details[0].label,
                'id': details[0].value
            };
        }
        return response;
    }

    /**
     * To close Attribute Dialog
     * @memberof TaskComponent
     */
    closeDialog() {
        this.displayDialog = false;
    }

    setEditDefaultStatus() {
        this.taskForm.patchValue({
            status: 0,
        });
    }

    onRowSelect(event: any) {
        this.dialogTitle = 'Edit Location';
        this.displayDialog = true;
        if (this.id) {
            this.taskForm.controls.locations.reset({
                location: '',
                floor: '',
                zone: ''
            });
            this.showDelete = true;
            this.taskForm.controls.locations = this.fb.group({
                location: [event.data.id, [Validators.required]],
                floor: [''],
                zone: ['']
            });

            if ( event.data.floor && event.data.floor.zone ) {
                this.fetchZoneOnUpdate(event.data.id, event.data.floor.id, event.data.floor.zone.id);
                this.taskForm.controls.locations.patchValue({
                    // location: event.data.id,
                    floor: event.data.floor.id || '',
                    zone: event.data.floor.zone.id || ''
                });
            }
        } else {
            this.selectedLocation = <any>Array;
        }
    }

    /**
     * Initialising device Dropdown
     * @memberof TaskComponent
     */
    onDeviceInit(event) {
        if (typeof (event) === 'boolean') {
            this.isDeviceInit = event;
            if (this.selectedDevice) {
                this.updateDevice();
            }
        } else {
            this.showError(event);
        }
    }

    updateDevice() {
        this.taskForm.patchValue({
            device: this.selectedDevice,
        });
    }

    setDefaultFilters() {
        this.filterDaily = 1;
        this.filterWeekly = 1;
        this.filterMonthly1 = 1;
        this.filterMonthly2 = 1;
        this.filterYear1 = 1;
        this.filterYear2 = '';
    }

    setRecurringFilters(type = null) {
        this.repeatOn = type || this.repeatOn;
        this.recur.type = this.repeatOn;
        // set defaults
        this.setDefaultFilters();
        if ( this.recur ) {

            this.schedule = 'recurring';

            let repeat = <any> {};
            // last saved values
            let lastSaved = false;
            if ( this.repeats[this.recur.type] ) {
                repeat = this.repeats[this.recur.type];
                lastSaved = true;
            } else {
                repeat = this.recur.repeat;
            }

            let params = {};
            if ( this.recur.type === 'weekly' ) {
                if ( !lastSaved ) {
                    this.filterWeekly = 1;
                } else {
                    this.filterWeekly = (repeat.every) ? repeat.every : 1;
                }
                this.selectedWeeks = repeat.days || [];
                params = ['week', {'every': this.filterWeekly}];
            } else if ( this.recur.type === 'daily' && this.dayFilter === 'day' ) {
                if ( !lastSaved ) {
                    this.filterDaily = 1;
                } else {
                    this.filterDaily = (repeat.every) ? repeat.every : 1;
                }
                params = ['day', {'every': repeat.every}];
            } else if ( this.recur.type === 'daily' && this.dayFilter === 'workday' ) {
                this.filterDaily = 1;
                params = ['workday', {}];
            } else if ( this.recur.type === 'monthly' ) {
                this.filterMonthly1 = repeat.on || 1;
                if ( !lastSaved ) {
                    this.filterMonthly2 = 1;
                } else {
                    this.filterMonthly2 = (repeat.every) ? repeat.every : 1;
                }
                params = ['month', {'filterMonthly1': this.filterMonthly1, 'filterMonthly2': this.filterMonthly2}];
            } else if ( this.recur.type === 'yearly' ) {
                this.filterYear1 = repeat.on || 1;
                this.filterYear2 = (repeat.every) ? repeat.every : 'January';
                params = ['year', {'filterYear1': this.filterYear1, 'filterYear2': this.filterYear2}];
            }
            this.applyFilters.apply(this, params);

            const occurrence = this.recur.occurrence || '';
            let value = '';
            this.occurrenceType = occurrence.type || this.occurrenceType;
            if ( this.occurrenceType === 'Occurrence' ) {
                value = occurrence.totalOccurrence;
                this.totalOccurrence = occurrence.totalOccurrence;
            } else if ( this.occurrenceType === 'EndBy' ) {
                value = this.globalService.calendarformatDate(occurrence.endBy);
                this.endBy = value;
            }
            this.applyOccurrence(this.occurrenceType, value);
        }
    }

    getWeekdays () {
        this.weekDays = [
            // {'label': 'Select Days', 'value': ''},
            {'label': 'Monday', 'value': 'Monday'},
            {'label': 'Tuesday', 'value': 'Tuesday'},
            {'label': 'Wednesday', 'value': 'Wednesday'},
            {'label': 'Thursday', 'value': 'Thursday'},
            {'label': 'Friday', 'value': 'Friday'},
            {'label': 'Saturday', 'value': 'Saturday'},
            {'label': 'Sunday', 'value': 'Sunday'}
        ];
    }
    getMonthList () {
        this.monthList = [
            {'value': 'January', 'label': 'January'},
            {'value': 'February', 'label': 'February'},
            {'value': 'March', 'label': 'March'},
            {'value': 'April', 'label': 'April'},
            {'value': 'May', 'label': 'May'},
            {'value': 'June', 'label': 'June'},
            {'value': 'July', 'label': 'July'},
            {'value': 'August', 'label': 'August'},
            {'value': 'September', 'label': 'September'},
            {'value': 'October', 'label': 'October'},
            {'value': 'November', 'label': 'November'},
            {'value': 'December', 'label': 'December'}
        ];
    }

    applyFilters(type, filters) {
        this.recur.repeat = {};
        const fields = ['filterDaily', 'filterWeekly'];
        fields.map( (field) => this.validationService.removeValidation(this.taskForm, field) );
        if ( this.recur.type === 'daily' ) {
            if ( type === 'workday' ) {
                this.recur.repeat.type = 'workday';
                this.recur.repeat.every = '1'; // always
            } else {
                this.validationService.addValidation(this.taskForm, 'filterDaily', Validators.required);
                this.recur.repeat.type = 'day';
                this.recur.repeat.every = filters.every;
            }
        } else if ( this.recur.type === 'weekly' ) {
            this.recur.repeat.type = 'week';
            this.recur.repeat.every = filters.every;
            this.recur.repeat.days = this.selectedWeeks;
            this.validationService.addValidation(this.taskForm, 'filterWeekly', Validators.required);
        } else if ( this.recur.type === 'monthly' ) {
            this.recur.repeat.type = 'month';
            this.recur.repeat.on = filters.filterMonthly1;
            this.recur.repeat.every = filters.filterMonthly2;
        } else if ( this.recur.type === 'yearly' ) {
            this.recur.repeat.type = 'year';
            this.recur.repeat.on = filters.filterYear1;
            this.recur.repeat.every = filters.filterYear2;
        }
        this.repeats[this.recur.type] = this.recur.repeat;
    }

    applyOccurrence (occurenceType, value) {
        this.showCalForOccurrence = false;
        this.recur.occurrence = {};
        this.recur.occurrence.type = occurenceType;
        if ( occurenceType === 'Occurrence' ) {
            this.recur.occurrence.totalOccurrence = value;
        } else if ( occurenceType === 'EndBy' ) {
            this.showCalForOccurrence = true;
            this.recur.occurrence.endBy = this.globalService.processDate(value);
        }
    }

    onDeviceUpdated(selDevice) {
        this.selectedDeviceObj = selDevice;
    }

    applySchedule(schedule: String) {
        this.schedule = schedule;
        const fields = ['from', 'to', 'fromTime', 'toTime', 'startDate', 'filterDaily', 'filterWeekly'];
        fields.map( (field) => this.validationService.removeValidation(this.taskForm, field) );

        switch ( this.schedule ) {
            case 'fixed':
                this.validationService.addValidation(this.taskForm, 'from', Validators.required);
                this.validationService.addValidation(this.taskForm, 'to', Validators.required);
            break;
            case 'recurring':
                this.validationService.addValidation(this.taskForm, 'fromTime', Validators.required);
                this.validationService.addValidation(this.taskForm, 'toTime', Validators.required);
                this.validationService.addValidation(this.taskForm, 'startDate', Validators.required);
            break;
        }
    }

    /**
     * clear API Error
     * @memberof TaskComponent
     */
    clearError() {
        this.validationService.clearErrors();
    }

}
