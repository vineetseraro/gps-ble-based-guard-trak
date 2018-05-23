import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message, SelectItem } from 'primeng/primeng';

import { environment } from '../../../../environments/environment';
import { TimeZoneModel } from '../../../core/global.model';
import { GlobalService } from '../../../core/global.service';
import { ValidationService } from '../../../core/validators/validation.service';
import { UserPoolModel } from '../../../masters/userpools/shared/userpool.model';
import { UserModel } from '../../../masters/users/shared/user.model';
import { UserService } from '../../../masters/users/shared/user.service';
import {
  CognitoCallback,
  LoggedInCallback,
  UserLoginService,
  UserRegistrationService
} from '../../aws/cognito.service';
import { UserPoolNoAuthService } from './../../../masters/userpools/shared/userpool.service';

/**
 * This component is responsible for displaying and controlling
 * the registration of the users.
 */

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  providers: [UserService, ValidationService]
})
export class RegisterComponent implements CognitoCallback, OnInit, LoggedInCallback {
  userForm: FormGroup;
  errorMessage: string;
  msgs: Message[] = [];
  loader = false;
  username: string;
  title: string;
  userDetail: UserModel;
  isEdit = false;
  zoneOptionList: SelectItem[];
  countryOptionList: SelectItem[];
  display = false;
  groupList: SelectItem[] = [];
  currentUserGroup: String[] = [];
  timeZoneModelList: TimeZoneModel[];
  timeZoneOptionList: SelectItem[] = [];
  savedImages: Array<any> = [];
  relatedImages: Array<any> = [];
  profileImage = {
    url: '',
    meta: {
      width: '',
      height: ''
    }
  };
  isUserInit = false;
  userPoolModel: UserPoolModel;
  passwordPolicy: String = '';
  showLocation = false;
  locationData: any;
  titleOptionList: SelectItem[] = [];
  openHelpText = false;
  countryList: SelectItem[] = [];

  // registerform: FormGroup;
  constructor(
    public userRegistration: UserRegistrationService,
    private fb: FormBuilder,
    public router: Router,
    // public userParams: UserParametersService,
    // private userPoolGroupService: UserPoolGroupService,
    // private userPoolUserService: UserPoolUserService,
    private userPoolNoAuthService: UserPoolNoAuthService,
    private globalService: GlobalService,
    public userService: UserLoginService,
    private userApiService: UserService,
    private validationService: ValidationService
  ) {
    this.userService.isAuthenticated(this);
  }

  // callback of isAuthenticated to check if user is logged in or not
  isLoggedIn(message: string, isLoggedIn: boolean) {
    message;
    if (isLoggedIn) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit() {
    this.showLocation = false;
    this.savedImages = [];
    this.relatedImages = [];
    this.userForm = this.fb.group({
      title: [''],
      given_name: ['', [Validators.required, Validators.maxLength(environment.nameMaxLength)]],
      family_name: ['', [Validators.required, Validators.maxLength(environment.codeMaxLength)]],
      email: ['', [Validators.required, ValidationService.emailValidator]],
      password: ['', [Validators.required]],
      zoneinfo: ['', [Validators.required]],
      address: [''],
      city: [''],
      state: [''],
      country: [''],
      zipcode: [''],
      latitude: [0],
      longitude: [0],
      radius: [0],
      // phone_number: [''],
      MobileNumber: ['', [ValidationService.mobileValidator]],
      group: [[]],
      isAdminApproved: [''],
      MobileCode: ['', [ValidationService.mobileValidator]]
    });

    this.titleOptionList = this.userPoolNoAuthService.listSalutations();

    this.timeZoneOptionList.push({ label: 'Please select', value: null });
    this.globalService.getCountryPhoneCode().subscribe((data: any) => {
      this.countryList = data.data.map((x: any) => {
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
    this.globalService.getTimeZones().subscribe(
      (data: any) => {
        this.timeZoneModelList = data.data;
        this.timeZoneModelList.forEach(timeZone => {
          this.timeZoneOptionList.push({
            label: timeZone.name + ' ( ' + timeZone.offset + ' ) ',
            value: timeZone.name
          });
        });
      },
      (error: any) => this.showError(error)
    );

    // get password policy
    this.userPoolNoAuthService.describeUserPool().subscribe(
      res => {
        this.userPoolModel = res;
        const passwordMinLength = this.userPoolModel.Policies.PasswordPolicy.MinimumLength;

        if (passwordMinLength) {
          this.passwordPolicy =
            'Password must have at least ' + passwordMinLength + ' characters.\n';
        }

        const passPolicyArr = [];
        let lastPolicy = '';
        if (this.userPoolModel.Policies.PasswordPolicy.RequireLowercase) {
          passPolicyArr.push(' lowercase letters');
          lastPolicy = ' lowercase letters';
        }
        if (this.userPoolModel.Policies.PasswordPolicy.RequireUppercase) {
          passPolicyArr.push(' uppercase letters');
          lastPolicy = ' uppercase letters';
        }
        if (this.userPoolModel.Policies.PasswordPolicy.RequireNumbers) {
          passPolicyArr.push(' numbers');
          lastPolicy = ' numbers';
        }
        if (this.userPoolModel.Policies.PasswordPolicy.RequireSymbols) {
          passPolicyArr.push(' 1 special character');
          lastPolicy = ' 1 special character';
        }
        if (passPolicyArr.length) {
          this.passwordPolicy =
            this.passwordPolicy.concat('Password must require' + passPolicyArr.join(',')) + '.';
          if (passPolicyArr.length >= 2) {
            this.passwordPolicy = this.passwordPolicy.replace(
              ',' + lastPolicy,
              ' and ' + lastPolicy
            );
          }
        }
      },
      (err: any) => {
        this.showError(err);
      }
    );
  }

  onCancel() {
    this.router.navigate(['/login']);
  }

  /**
     * Function for creating a new user
     * @param {any}
     * @memberof RegisterComponent
     */
  onSubmit(value: UserModel) {
    this.loader = true;
    value.Username = value.email;
    if (this.relatedImages.length === 0) {
      value.picture = '';
    } else {
      value.picture = this.relatedImages[0].url;
    }

    // this.userRegistration.register(value, this);
    this.userApiService.register(value).subscribe(
      (data: any) => {
        this.showSuccess(
          data.data.user.username,
          'Your account has been created successfully. Confirmation code is sent on your email.'
        );
      },
      (error: any) => this.showError(error)
    );
  }

  public showSuccess(username: String, message: string) {
    this.loader = false;
    this.msgs = [];
    this.msgs.push({ severity: 'success', summary: 'Success', detail: message });
    setTimeout(() => {
      this.router.navigate(['/confirm-registration', username]);
    }, environment.successMsgTime);
  }

  cognitoCallback(message: string, result: any) {
    this.loader = false;
    if (message !== null) {
      // error
      this.showError(message);
    } else {
      // success
      // move to the next step
      this.msgs = [];
      this.msgs.push({
        severity: 'success',
        summary: 'Success',
        detail:
          'Your account has been created successfully. Confirmation code is sent on your email.'
      });
      const self = this;
      setTimeout(() => {
        self.router.navigate(['/confirm-registration', result.user.username]);
      }, 2000);
    }
  }

  public showError(error: any) {
    console.log(error);
    this.loader = false;
    this.msgs = [];
    this.msgs.push({
      severity: 'error',
      summary: 'Error Message',
      detail: error.data.cause.message
    });
    setTimeout(() => {}, environment.successMsgTime);
    this.validationService.showError(this.userForm, error);
  }

  onImageListFinalised(event: any) {
    this.relatedImages = event;
  }

  handleLocationUpdate(event: any) {
    this.showLocation = true;
    this.locationData = event.value;
  }

  /**
     * Set flag to show/hide password helptext
     * @param {any}
     * @memberof RegisterComponent
     */
  setFlagForHelptext(flag: boolean) {
    this.openHelpText = flag;
  }
}
