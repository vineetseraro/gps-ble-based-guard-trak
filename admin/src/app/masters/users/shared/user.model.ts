export class UserResponse {
  code: number;
  message: string;
  description: string;
}

export interface UserListModel extends UserResponse {
  totalRecords: number;
  recordsCount: number;
  data: UserModel[];
}

export class UserModel {
  title: string;
  Username: string;
  email: string;
  password: string;
  given_name: string;
  family_name: string;
  zoneinfo: string;
  address: string;
  city: string;
  state: string;
  country: string;
  radius: number;
  MobileNumber: string;
  latitude: any;
  longitude: any;
  zipcode: String;
  UserStatus: String;
  email_verified: String;
  phone_number: String;
  phone_number_verified: String;
  sub: String;
  UserCreateDate: string;
  UserLastModifiedDate: string;
  Enabled: String;
  isAdminApproved: String;
  UserAttributes: Attribute[];
  picture: string;
  displayGroup: string;
  groups: UserGroups[];
  MobileCode: String;
  locations: any;
}

export class UserSaveRequest {
  Username: string;
  UserAttributes: Attribute[];
}
export class UserGroups {
  name: string;
}

export class UserSaveStatusRequest {
  Username: string;
  Status: Boolean;
}

export class Attribute {
  name: string;
  value: string;
}

export class UserProfileSaveRequest {
  AccessToken: string;
  UserAttributes: Attribute[];
}
