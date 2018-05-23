import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { Subject } from 'rxjs/Rx';

import { UserPoolGroupService } from '../masters/userpools/shared/userpool.service';
import { GlobalService } from './global.service';

@Injectable()
export class SearchService {
  private notify = new Subject<any>();
  allUsers;
  users: SelectItem[];
  /**
   * Observable string streams
   */
  notifyObservable$ = this.notify.asObservable();

  constructor(
    private userPoolGroupService: UserPoolGroupService,
    private globalService: GlobalService,
  )
  {}

  public notifyOther(data: any) {
    if (data) {
      this.notify.next(data);
    }
  }

  public getSalesRepUsers(userType) {
      return  this.userPoolGroupService.listUsersInGroup(userType).map(data => {
        if(userType == "AkCarrier") {
          this.allUsers = [{ id: '', name: 'Select Carrier User' }];
        } else {
          this.allUsers = [{ id: '', name: 'Select Sales Representative' }];
        }
        for (let i = 0; i < data['Users'].length; i++) {
            const isApproved = data['Users'][i].Attributes.filter(x => (x.Name === 'custom:isAdminApproved' && x.Value === 'yes'));
            if (isApproved.length) {
                const sub = data['Users'][i].Attributes.filter((x:any) => x.Name === 'sub')[0].Value;
                const fName = data['Users'][i].Attributes.filter((x:any) => x.Name === 'given_name')[0].Value;
                const lName = data['Users'][i].Attributes.filter((x:any) => x.Name === 'family_name')[0].Value;
                const email = data['Users'][i].Attributes.filter((x:any) => x.Name === 'email')[0].Value;
                const mobileObj = data['Users'][i].Attributes.filter((x:any) => x.Name === 'custom:MobileNumber');
                let mobileNo = '';
                if (mobileObj.length) {
                    mobileNo = mobileObj[0].Value;
                }
                this.allUsers.push({
                    'id': sub,
                    'name': fName + ' ' + lName,
                    'firstName': fName,
                    'lastName': lName,
                    'email': email,
                    'mobileNo': mobileNo
                });
            }
        }
        return this.globalService.prepareDropDown(this.allUsers, '');
    });
  }
  
}