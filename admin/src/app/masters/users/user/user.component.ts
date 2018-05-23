import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';

import { environment } from '../../../../environments/environment';
import { UserParametersService } from '../../../core/aws/cognito.service';
import { TimeZoneModel } from '../../../core/global.model';
import { GlobalService } from '../../../core/global.service';
import { ValidationService } from '../../../core/validators/validation.service';
import { LocationComponent } from '../../../core/widget/location/location/location.component';
import { AkPhoneCodeComponent } from '../../../core/widget/phonecode/ak-phonecode.component';
import { UserPoolGroupService, UserPoolUserService } from '../../userpools/shared/userpool.service';
import { UserModel } from '../shared/user.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user-add',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService, ValidationService]
})
export class UserComponent implements OnInit {
  userForm: FormGroup;
  msgs: Message[] = [];
  loader = false;
  username: string;
  title: string;
  userDetail: UserModel;
  sub: string;
  isEdit = false;
  zoneOptionList: SelectItem[];
  countryOptionList: SelectItem[];
  display = false;
  groupList: SelectItem[] = [];
  currentUserGroup: string;
  timeZoneModelList: TimeZoneModel[];
  timeZoneOptionList: SelectItem[] = [];
  savedImages: Array<any> = [];
  relatedImages: Array<any> = [];
  images: Array<any> = [];
  locationData: any;
  profileImage = {
    url: '',
    meta: {
      width: '',
      height: ''
    }
  };
  isUserInit = false;
  showLocation = false;
  titleOptionList: SelectItem[] = [];
  countryName = '';
  countryList: SelectItem[] = [];
  countryApiResult: any = [];
  // addressList: any;
  // zoneList: any;
  // floorList: any;

  @ViewChild(AkPhoneCodeComponent) phoneComponent: AkPhoneCodeComponent;
  @ViewChild(LocationComponent) locationComponent: LocationComponent;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public userParams: UserParametersService,
    private userPoolGroupService: UserPoolGroupService,
    private userPoolUserService: UserPoolUserService,
    private globalService: GlobalService,
    private validationService: ValidationService
  ) { }

  ngOnInit() {
    const self = this;
    this.showLocation = false;
    this.savedImages = [];
    this.relatedImages = [];
    this.images = [];

    this.userForm = this.fb.group({
      title: [''],
      given_name: ['', [Validators.required, Validators.maxLength(environment.nameMaxLength)]],
      family_name: ['', [Validators.required, Validators.maxLength(environment.codeMaxLength)]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      isActive: [true],
      zoneinfo: ['', [Validators.required]],
      address: [''],
      city: [''],
      state: [''],
      // phonecode: ['', [ValidationService.phoneValidator]],
      MobileCode: ['IN', [ValidationService.mobileValidator]],
      country: [''],
      zipcode: [''],
      latitude: [0],
      longitude: [0],
      radius: [300],
      // PhoneNumber: ['', [ValidationService.phoneValidator]],
      MobileNumber: ['', [ValidationService.mobileValidator]],
      group: [[], [Validators.required]],
      isAdminApproved: [true],
      // location: ['', [Validators.required]],
      // zone: [''],
      // floor: ['']
    });

    // this.globalService.getDropdown('locations' + environment.serverEnv).subscribe((data: any) => {
    //   this.addressList = this.globalService.prepareDropDown(data.data, 'Select Location');
    // });

    this.titleOptionList = this.userPoolUserService.listSalutations();
    this.globalService.getCountryPhoneCode().subscribe((data: any) => {
      this.countryApiResult = data.data;
      this.countryList = data.data.map(x => {
        return {
          label: '+' + x.dialCode + ' (' + x.name + ')',
          value: x.shortCode
        };
      });

      this.countryList = [
        {
          label: 'Select',
          value: ''
        },
        ...this.countryList
      ];
    });

    this.userPoolGroupService.listGroups([], '').subscribe(
      res => {
        this.groupList.push({ label: 'Select Group', value: null });
        res['Groups'].forEach((element: any) => {
          self.groupList.push({ label: element.GroupName, value: element.GroupName });
        });
        if (self.currentUserGroup) {
          self.userForm.patchValue({
            group: self.currentUserGroup
          });
        }
      },
      (err: any) => {
        this.showError(err);
      }
    );

    this.globalService.getTimeZones().subscribe(
      (data: any) => {
        this.timeZoneModelList = data.data;
        this.timeZoneOptionList.push({ label: 'Select Time Zone', value: null });
        this.timeZoneModelList.forEach(timeZone => {
          self.timeZoneOptionList.push({
            label: timeZone.name + ' ( ' + timeZone.offset + ' ) ',
            value: timeZone.name
          });
        });
        if (this.userDetail) {
          self.userForm.patchValue({
            zoneinfo: self.userDetail.zoneinfo
          });
        } else {
          self.userForm.patchValue({
            zoneinfo: window.localStorage.getItem('systemTimeZone')
          });
        }
      },
      (error: any) => this.showError(error)
    );

    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('sub')) {
        this.loader = true;
        this.sub = params['sub'];
        this.title = 'Edit User';
        this.isEdit = true;
        this.userService.get(this.sub).subscribe(
          (data: any) => {
            self.setUser(data.data);
          },
          (error: any) => this.showError(error)
        );
      } else {
        this.isEdit = false;
        this.title = 'Add User';
      }
    });
  }

  /**
     * Initialising Group Dropdown
     * @memberof GroupComponent
     */
  onGroupInit(event) {
    this.isUserInit = event;
  }

  setUser(result: any) {
    this.loader = false;
    this.userDetail = result;
    this.username = this.userDetail.Username;
    if (result.picture != null && this.ValidURL(result.picture)) {
      this.profileImage.url = result.picture;
      this.savedImages = Object.assign([this.profileImage]);
      this.relatedImages = Object.assign([this.profileImage]);
      this.images.push(this.globalService.processImage(this.profileImage));
    }
    this.setUserDetails();
  }

  /**
     * Set the form values in edit
     * @param {UserModel} userDetail
     * @memberof UserComponent
     */
  setUserDetails() {
    this.currentUserGroup = '';
    const approved = this.userDetail.isAdminApproved === 'yes' ? true : false;
    if (this.userDetail.hasOwnProperty('address') && this.userDetail.address !== null) {
      this.showLocation = true;
    }
    if (this.userDetail.hasOwnProperty('groups') && this.userDetail.groups.length > 0) {
      this.currentUserGroup = this.userDetail.groups[0].name;
    }

    this.userForm.patchValue({
      title: this.userDetail.title,
      given_name: this.userDetail.given_name,
      family_name: this.userDetail.family_name,
      email: this.userDetail.email,
      isActive: this.userDetail.Enabled,
      zoneinfo: this.userDetail.zoneinfo,
      address: this.userDetail.address,
      city: this.userDetail.city,
      state: this.userDetail.state,
      country: this.userDetail.country,
      phone_number: this.userDetail.phone_number,
      MobileNumber: this.userDetail.MobileNumber,
      MobileCode: this.userDetail.MobileCode,
      latitude: this.userDetail.latitude,
      longitude: this.userDetail.longitude,
      zipcode: this.userDetail.zipcode,
      isAdminApproved: approved,
      group: this.currentUserGroup,
      radius: +this.userDetail.radius
    });
    // this.setAssignedLocation();
  }

  onSubmit(value: any) {
    this.loader = true;
    if (this.relatedImages.length === 0) {
      value.picture = '';
    } else {
      value.picture = this.relatedImages[0].url;
    }
    value.locations = [{ 'locationId': '', 'floor': '', 'zone': '' }];
    if (value.location) {
      value.locations[0].locationId = value.location;
    }
    if (value.floor) {
      value.locations[0].floor = value.floor;
    }
    if (value.zone) {
      value.locations[0].zone = value.zone;
    }
    if (this.username) {
      this.editUser(value);
    } else {
      this.addUser(value);
    }
  }

  /**
     * Function for creating a new user
     * @param {any} UserSaveRequest
     * @memberof UserComponent
     */
  addUser(value: any) {
    value.username = value.email;
    // value.picture = this.savedImages[0].url;
    if (value.isAdminApproved === true) {
      value.isAdminApproved = 'yes';
    } else {
      value.isAdminApproved = 'no';
    }

    const selectedGroups: Array<any> = [];
    selectedGroups.push(value.group);
    value.groups = selectedGroups;

    this.userService.addUser(value).subscribe(
      (data: any) => {
        data;
        this.showSuccess('User saved successfully');
      },
      (error: any) => this.showError(error)
    );
  }

  /**
     * Function for editing an existing user
     * @param {any} UserSaveRequest
     * @memberof UserComponent
     */
  editUser(value: any) {
    if (value.isAdminApproved === true) {
      value.isAdminApproved = 'yes';
    } else {
      value.isAdminApproved = 'no';
    }
    const selectedGroups: Array<any> = [];
    selectedGroups.push(value.group);
    if (value.group instanceof Array) {
      value.groups = value.group;
    } else {
      value.groups = selectedGroups;
    }
    value.username = this.userDetail.Username;
    this.userService.editUser(value, this.userDetail.Username).subscribe(
      (data: any) => {
        data;
        this.showSuccess('User updated successfully');
      },
      (error: any) => this.showError(error)
    );
  }

  public showError(error: any) {
    this.loader = false;
    this.validationService.showError(this.userForm, error);
  }

  public showSuccess(message: string) {
    this.loader = false;
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Success', detail: message });
    setTimeout(() => {
      this.navigateBack();
    }, environment.successMsgTime);
  }

  public navigateBack() {
    this.router.navigate(['/userpools/users']);
  }

  saveUserCallback(message: string, result: any) {
    result;
    if (message) {
      this.showError(message);
    } else {
      this.msgs = [];
      this.msgs.push({
        severity: 'success',
        summary: 'Success',
        detail: 'User updated successfully'
      });
      setTimeout(() => {
        this.router.navigate(['/userpools/users']);
      }, 2000);
    }
  }

  updateUserStatusCallback() {
    this.loader = false;
  }

  onImageListFinalised(event) {
    this.relatedImages = event;
  }

  handleLocationUpdate(event) {
    this.locationData = event.value;
    this.countryName = this.locationData.country;
    if (this.phoneComponent) {
      this.phoneComponent.setPhoneData(this.countryName);
    }
  }
  ValidURL(str) {
    const pattern = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/; // fragment locater
    return pattern.test(str) ? true : false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    console.log(event.index);
    const self = this;
    if (event.index === 1) {
      self.locationComponent.centerMap();
    }
  }

  // fetchFloor(location, floorToSet = null, zoneToSet = null) {
  //   const self = this;
  //   this.loader = true;
  //   this.globalService.getDropdown('locations' + environment.serverEnv + '/' + location + '/floors').subscribe((data: any) => {
  //     this.floorList = this.globalService.prepareDropDown(data.data, 'Select Floors');
  //     if (floorToSet) {
  //       self.userForm.patchValue({ floor: floorToSet });
  //       if (zoneToSet) {
  //         self.fetchZone(floorToSet, zoneToSet);
  //       }
  //     }
  //     this.loader = false;
  //   },
  //     (error: any) => {
  //       error;
  //       self.userForm.patchValue({ floor: null, zone: null });
  //       this.floorList = [{ 'label': 'No Floors Available', 'value': null }]
  //       this.zoneList = [{ 'label': 'No Check Points Available', 'value': null }]
  //       this.loader = false;
  //     });
  // }

  // fetchZone(floor, zoneToSet = null) {
  //   const self = this;
  //   this.loader = true;
  //   this.globalService.getDropdown('locations' + environment.serverEnv + '/floors/' + floor + '/zones').subscribe((data: any) => {
  //     this.zoneList = this.globalService.prepareDropDown(data.data, 'Select Check Point');
  //     this.loader = false;
  //     if (zoneToSet) {
  //       self.userForm.patchValue({ zone: zoneToSet });
  //     }
  //   },
  //     (error: any) => {
  //       error;
  //       self.userForm.patchValue({ zone: null });
  //       this.zoneList = [{ 'label': 'No Check Points Available', 'value': null }]
  //       this.loader = false;
  //     });
  // }

  // setAssignedLocation() {
  //   const self = this;
  //   if (this.userDetail.hasOwnProperty('locations') && this.userDetail.locations.length > 0) {
  //     const locObj = this.userDetail.locations[0];
  //     let locationId = '';
  //     let floorId = '';
  //     let zoneId = '';
  //     if (locObj.hasOwnProperty('id') && locObj.id !== null) {
  //       locationId = locObj.id;
  //       if (locObj.hasOwnProperty('floor') && locObj.floor !== null && locObj.floor.hasOwnProperty('id') && locObj.floor.id !== null) {
  //         const floorObj = locObj.floor;
  //         floorId = floorObj.id;
  //         if (floorObj.hasOwnProperty('zone') && floorObj.zone !== null && floorObj.hasOwnProperty('id') && floorObj.zone.id !== null) {
  //           zoneId = floorObj.zone.id;
  //         }
  //       }
  //       self.userForm.patchValue({ location: locationId });
  //       self.fetchFloor(locationId, floorId, zoneId);
  //     }
  //   }
  // }
}
