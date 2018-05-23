import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/primeng';
import { SelectItem } from 'primeng/primeng';

import { environment } from '../../../../environments/environment';
import { CognitoUtil, LoggedInCallback, UserLoginService, UserParametersService } from '../../../core/aws/cognito.service';
import { TimeZoneModel } from '../../../core/global.model';
import { GlobalService } from '../../../core/global.service';
import { ValidationService } from '../../../core/validators/validation.service';
import { LocationComponent } from '../../../core/widget/location/location/location.component';
import { AkPhoneCodeComponent } from '../../../core/widget/phonecode/ak-phonecode.component';
import { UserPoolUserService } from '../../userpools/shared/userpool.service';
import { UserModel } from '../shared/user.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css'],
  providers: [UserService, ValidationService]
})
export class MyProfileComponent implements LoggedInCallback, OnInit {
  userFG: FormGroup;
  msgs: Message[] = [];
  loader = false;
  title: string;
  userDetail: UserModel;
  display = false;
  currentUserGroup: Array<any> = [];
  username: string;
  accessToken: string;
  currentUserRole: String = '';
  currentUserPreferresRole: String = '';
  locationData: any;
  phoneData: any;
  timeZoneModelList: TimeZoneModel[];
  timeZoneOptionList: SelectItem[] = [];
  savedImages: Array<any> = [];
  relatedImages: Array<any> = [];
  images: Array<any> = [];
  sub: string;
  profileImage = {
    url: '',
    meta: {
      width: '',
      height: ''
    }
  };
  showLocation = false;
  // open = false;
  titleOptionList: SelectItem[] = [];
  openHelpText = false;
  countryName = '';
  countryList: SelectItem[] = [];
  countryApiResult: any = [];
  radiusVal = 300;
  radiusUnit = '';
  locationName: string;
  floorName: string;
  zoneName: string;

  @ViewChild(AkPhoneCodeComponent) phoneComponent: AkPhoneCodeComponent;
  @ViewChild(LocationComponent) locationComponent: LocationComponent;
  constructor(
    public router: Router,
    public userLoginService: UserLoginService,
    public userParams: UserParametersService,
    private fb: FormBuilder,
    private userPoolUserService: UserPoolUserService,
    private cognitoUtil: CognitoUtil,
    private globalService: GlobalService,
    private userService: UserService,
    private validationService: ValidationService
  ) {
    this.userLoginService.isAuthenticated(this);
    this.accessToken = this.cognitoUtil.accessToken;
  }

  // callback of isAuthenticated to check if user is logged in or not
  isLoggedIn(message: string, isLoggedIn: boolean) {
    message;
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
    }
  }

  gotoPreviousScreen() {
    window.history.back();
  }

  ngOnInit() {
    const self = this;
    this.showLocation = false;
    this.savedImages = [];
    this.relatedImages = [];
    this.images = [];

    this.display = true;
    this.userFG = this.fb.group({
      title: [''],
      given_name: ['', [Validators.required, Validators.maxLength(environment.nameMaxLength)]],
      family_name: ['', [Validators.required, Validators.maxLength(environment.codeMaxLength)]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      isActive: [''],
      zoneinfo: ['', [Validators.required]],
      address: [''],
      city: [''],
      state: [''],
      MobileCode: ['', [ValidationService.mobileValidator]],
      country: [''],
      zipcode: [''],
      latitude: [0],
      longitude: [0],
      radius: [300],
      MobileNumber: ['', [ValidationService.mobileValidator]]
    });

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
          label: 'Select Phonecode',
          value: ''
        },
        ...this.countryList
      ];
    });

    this.globalService.getTimeZones().subscribe(
      (data: any) => {
        this.timeZoneModelList = data.data;
        this.timeZoneOptionList.push({ label: 'Select Time Zone', value: null });
        this.timeZoneModelList.forEach(timeZone => {
          this.timeZoneOptionList.push({
            label: timeZone.name + ' ( ' + timeZone.offset + ' ) ',
            value: timeZone.name
          });
        });

        if ( self.userDetail && self.userDetail.hasOwnProperty('zoneinfo') && self.userDetail.zoneinfo !== null ) {
          this.userFG.patchValue({
            zoneinfo: self.userDetail.zoneinfo
          });
        }
      },
      (error: any) => this.showError(error)
    );

    const loggedInUserObj = this.cognitoUtil.getCurrentUser();
    if (loggedInUserObj.username !== null) {
      this.username = loggedInUserObj.username;
    }

    this.title = 'Edit Profile';
    this.loader = true;

    this.userPoolUserService.getUser(this.accessToken).subscribe(
      res => {
        this.loader = false;
        const result: any = res;
        if (result != null) {
          for (let i = 0; i < result.UserAttributes.length; i++) {
            // check for sub
            if (result.UserAttributes[i].Name === 'sub') {
              this.sub = result.UserAttributes[i].Value;
              break;
            }
          }

          self.userService.get(self.sub).subscribe(
            (data: any) => {
              self.setUser(data.data);
            },
            (error: any) => self.showError(error)
          );
        }
      },
      (err: any) => {
        this.showError(err);
      }
    );

    this.currentUserGroup = this.userPoolUserService.userDetails('cognito:groups');
    this.currentUserRole = this.userPoolUserService.userDetails('cognito:roles');
    this.currentUserPreferresRole = this.userPoolUserService.userDetails('cognito:preferred_role');

    this.userFG.controls['email'].disable();
    this.userFG.controls['isActive'].disable();
  }

  setUser(result: any) {
    this.userDetail = result;
    this.username = this.userDetail.Username; // fall back of cognito callback
    if (result.picture != null) {
      this.profileImage.url = result.picture;
      this.savedImages = Object.assign([this.profileImage]);
      this.images.push(this.globalService.processImage(this.profileImage));
      this.relatedImages = Object.assign([this.profileImage]);
    }
    this.setProfileDetails();
  }

  handleLocationUpdate(event) {
    this.locationData = event.value;
    this.countryName = this.locationData.country;
    if (this.phoneComponent) {
      this.phoneComponent.setPhoneData(this.countryName);
    }
  }

  /**
     * Fuction for set the form values in edit
     */
  setProfileDetails() {
    if (this.userDetail.hasOwnProperty('address') && this.userDetail.address !== null) {
      this.showLocation = true;
    }
    this.userFG.patchValue({
      title: this.userDetail.title,
      given_name: this.userDetail.given_name,
      family_name: this.userDetail.family_name,
      email: this.userDetail.email,
      isActive: true,
      zoneinfo: this.userDetail.zoneinfo,
      address: this.userDetail.address,
      city: this.userDetail.city,
      state: this.userDetail.state,
      country: this.userDetail.country,
      phone_number: this.userDetail.phone_number,
      MobileCode: this.userDetail.MobileCode,
      MobileNumber: this.userDetail.MobileNumber,
      latitude: +this.userDetail.latitude,
      longitude: +this.userDetail.longitude,
      zipcode: this.userDetail.zipcode,
      // savedImages: this.userDetail.picture,
      radius: +this.userDetail.radius
    });
    // this.setAssignedLocation();
  }

  /**
     * Function for updating the user profile
     * @param {*} UserProfileSaveRequest
     * @memberof MyProfileComponent
     */
  onSubmit(value: any) {
    this.loader = true;
    value.latitude = '' + value.latitude;
    value.longitude = '' + value.longitude;
    if (this.relatedImages.length === 0) {
      value.picture = '';
    } else {
      value.picture = this.relatedImages[0].url;
    }

    this.userService.editProfile(value).subscribe(
      (data: any) => {
        data;
        this.showSuccess('Profile successfully updated');
      },
      (error: any) => this.showError(error)
    );
  }

  public showError(error: any) {
    this.loader = false;
    this.validationService.showError(this.userFG, error);
  }

  public showSuccess(message: string) {
    this.loader = false;
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Success', detail: message });
    setTimeout(() => {
      this.gotoPreviousScreen();
    }, environment.successMsgTime);
  }

  onImageListFinalised(event) {
    this.relatedImages = event;
  }

  /**
     * Set flag to show/hide password helptext
     * @param {any}
     * @memberof MyProfileComponent
     */
  setFlagForHelptext(flag: boolean) {
    this.openHelpText = flag;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const self = this;
    if (event.index === 1) {
      self.locationComponent.centerMap();
    }
  }

  setAssignedLocation () {
    const self = this;
    if (this.userDetail.hasOwnProperty('locations') && this.userDetail.locations.length > 0 ) {
      const locObj = this.userDetail.locations[0];
      if ( locObj.hasOwnProperty('id') && locObj.id !== null ) {
        self.locationName = locObj.name;
        if ( locObj.hasOwnProperty('floor') && locObj.floor !== null && locObj.floor.hasOwnProperty('id') && locObj.floor.id !== null ) {
          const floorObj = locObj.floor;
          self.floorName = floorObj.name;
          if ( floorObj.hasOwnProperty('zone') && floorObj.zone !== null && floorObj.hasOwnProperty('id') && floorObj.zone.id !== null ) {
            self.zoneName = floorObj.zone.name;
          }
        }
      }
    }
  }

}
