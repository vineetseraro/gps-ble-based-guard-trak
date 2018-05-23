import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Injectable()
export class ValidationService {
  serverValidation: any = [];
  tabError: string[] = [];

  static getValidatorErrorMessage(key: string, validatorName: string, validatorValue?: any) {
    let config = {
      required: `${key} is mandatory`,
      invalidEmailAddress: 'Invalid Email',
      invalidAlphanumeric: `Only alphanumeric allowed `,
      invalidURL: `Invalid URL `,
      invalidVideoURL: `Invalid URL `,
      invalidPrice: `Invalid price.`,
      invalidPassword:
        'Invalid password. Password must be at least 6 characters long, and contain a number.',
      minlength: `must be at least ${validatorValue.requiredLength} characters long.`,
      maxlength: `Max. ${validatorValue.requiredLength} characters are allowed.`,
      invalidPhoneNumber: `Invalid Phone Number`,
      invalidMobileNumber: `Invalid Mobile Number`
    };

    return config[validatorName];
  }

  static creditCardValidator(control) {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (
      control.value.match(
        /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/
      )
    ) {
      return null;
    } else {
      return { invalidCreditCard: true };
    }
  }

  static alphanumericValidator(control) {
    if (control.value.match(/^[A-Za-z0-9 ]+$/)) {
      return null;
    } else {
      return { invalidAlphanumeric: true };
    }
  }

  static emailValidator(control) {
    // RFC 2822 compliant regex
    if (control.value != null) {
      if (
        control.value.match(
          /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )
      ) {
        return null;
      } else {
        return { invalidEmailAddress: true };
      }
    }
  }

  static urlValidator(control) {
    // RFC 2822 compliant regex
    if (control.value !== '' && control.value !== undefined) {
      if (
        control.value.match(
          /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
        )
      ) {
        return null;
      } else {
        return { invalidURL: true };
      }
    } else {
      return null;
    }
  }

  static priceValidator(control) {
    // RFC 2822 compliant regex

    if (!control.value || control.value >= 0) {
      return null;
    } else {
      return { invalidPrice: true };
    }
  }

  static videoUrlValidator(control) {
    // RFC 2822 compliant regex
    if (control.value !== '' && control.value !== undefined) {
      if (
        control.value.match(
          /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
        )
      ) {
        return null;
      } else {
        return { invalidVideoURL: true };
      }
    } else {
      return null;
    }
  }

  static passwordValidator(control) {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { invalidPassword: true };
    }
  }

  static required(control: FormControl) {
    if (control.value.trim() === '' || control.value === undefined || control.value === null) {
      return { required: true };
    } else {
      return null;
    }
  }

  static phoneValidator(control: FormControl) {
    const formGroup = control.parent;
    let countryCode = '';
    let phoneNumber = '';
    if (formGroup) {
      phoneNumber = formGroup.controls['PhoneNumber'].value;
      countryCode = formGroup.controls['phonecode'].value;
      formGroup.controls['phonecode'].setErrors(null);
      formGroup.controls['PhoneNumber'].setErrors(null);
    }

    let result;
    if (phoneNumber !== '') {
      switch (countryCode) {
        case 'US':
          // ^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$
          if (phoneNumber.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
            result;
          } else {
            result = { invalidPhoneNumber: true };
          }
          break;
        case 'IN':
          if (phoneNumber.match(/^[0-9]\d{2,4}-\d{6,8}$/)) {
            result;
          } else {
            result = { invalidPhoneNumber: true };
          }
          break;
      }
    }
    return result;
  }

  static mobileValidator(control: FormControl) {
    const formGroup = control.parent;
    let countryCode = '';
    let mobileNumber = '';
    if (formGroup) {
      mobileNumber = formGroup.controls['MobileNumber'].value;
      countryCode = formGroup.controls['MobileCode'].value;
      formGroup.controls['MobileCode'].setErrors(null);
      formGroup.controls['MobileNumber'].setErrors(null);
    }

    let result;
    if (mobileNumber !== undefined && mobileNumber !== '') {
      switch (countryCode) {
        case 'US':
          // ^\D?(\d{3})\D?\D?(\d{3})\D?(\d{4})$
          if (mobileNumber.match(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/)) {
            result;
          } else {
            result = { invalidMobileNumber: true };
          }
          break;
        case 'IN':
          if (mobileNumber.match(/^[7-9][0-9]{9}$/)) {
            result;
          } else {
            result = { invalidMobileNumber: true };
          }
          break;
      }
    }
    return result;
  }

  // validate form fields at client side
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        control.markAsDirty({ onlySelf: true });
        control.updateValueAndValidity();
        if (control.status == 'INVALID') {
          this.checkForTabError({ field: field });
        }
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  removeValidation(formGroup: FormGroup, controlKey) {
    formGroup.controls[controlKey].setValidators(null);
    formGroup.controls[controlKey].updateValueAndValidity();
  }

  addValidation(formGroup: FormGroup, controlKey, validator) {
    formGroup.controls[controlKey].setValidators(validator);
    formGroup.controls[controlKey].updateValueAndValidity();
  }

  clearErrors() {
    this.serverValidation = [];
    this.tabError = [];
  }

  showError(form: FormGroup, error: any) {
    // console.log(error);
    if (error.status) {
      switch (error.status) {
        case 403: {
          this.serverValidation.push('Permission error.');
          break;
        }
      }
      return;
    }
    this.tabError = [];
    switch (error.code) {
      case 422: {
        this.serverValidation = [];

        error.data.forEach((element: any) => {
          const control: AbstractControl = form.get(element.field);
          if (control != null) {
            this.checkForTabError(element);
            control.setErrors({
              requirqed: true
            });
          }

          if (element.message instanceof Array) {
            Array.prototype.push.apply(this.serverValidation, element.message);
          } else if (typeof element === typeof '') {
            this.serverValidation.push(element);
          } else {
            this.serverValidation.push(element.message);
          }
          // elements which are not on forms
          if (element.field === 'products') {
            this.checkForTabError(element);
          }
        });
        break;
      }
      case 404: {
        // this.serverValidation.push("Some error occur! Please try again.");
        break;
      }
      case 403: {
        this.serverValidation.push('Permission error.');
        break;
      }
      case 401: {
        this.serverValidation.push('Some error occur! Please try again.');
        break;
      }
      default: {
        this.serverValidation.push('Some error occur! Please try again.');
      }
    }
  }

  checkForTabError(element) {
    // this.tabError = [];
    switch (element.field) {
      case 'videoUrl': {
        this.tabError.push('tab-error-1');
        break;
      }
      case 'url': {
        this.tabError.push('tab-error-1');
        break;
      }
      case 'price': {
        this.tabError.push('tab-error-1');
        break;
      }
      case 'products': {
        this.tabError.push('tab-error-1');
        break;
      }
      case 'itemName': {
        this.tabError.push('tab-error-1');
        break;
      }
      case 'carrierUser': {
        this.tabError.push('tab-error-2');
        break;
      }
      case 'scheduledPickupDate': {
        this.tabError.push('tab-error-2');
        break;
      }
    }
  }
}
