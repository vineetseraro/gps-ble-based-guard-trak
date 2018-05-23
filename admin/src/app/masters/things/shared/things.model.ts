export interface Tag {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
}
export interface Client {
  id: string;
  projectId: string;
}

export interface Attribute {
  name: string;
  id: string;
  value: string;
  sysDefined: number;
  status: number;
}

export interface Category {
  id: string;
  name: string;
}
export interface Product {
  id: string;
  name: string;
}

export interface Beacon {
  id: string;
  code: string;
  name: string;
  type: string;
  status: number;
  updatedBy: string;
  updatedOn: string;
  master: string;
  battery_level: number;
  last_connection: string;
  txPower: number;
  interval: number;
  uuid: string;
  major: number;
  minor: number;
  alias: string;
  client: Client;
  tags: Tag[];
  attributes: Attribute[];
  categories: Category[];
  product: Product;
}
export class Gateway {
  id: string;
  code: string;
  name: string;
  type: string;
  status: number;
  updatedBy: string;
  updatedOn: string;
  last_connection: string;
  uuid: string;
  location: string;
  client: Client;
  tags: Tag[];
  attributes: Attribute[];
  categories: Category[];
}
export class Apps {
  id: string;
  code: string;
  name: string;
  type: string;
  status: number;
  appName: string;
  updatedBy: string;
  updatedOn: string;
  uuid: string;
  os: string;
  manufacturer: string;
  model: string;
  client: Client;
  tags: Tag[];
  deviceId: string;
  appVersion: string;
  attributes: Attribute[];
}
export interface TempTags {
  id: string;
  code: string;
  name: string;
  type: string;
  status: number;
  updatedBy: string;
  updatedOn: string;
  uid: string;
  minTemp: number;
  maxTemp: number;
  measurementCycle: number;
  client: Client;
  tags: Tag[];
  attributes: Attribute[];
  categories: Category[];
  product: Product;
}

export interface NfcTags {
  id: string;
  code: string;
  name: string;
  type: string;
  status: number;
  updatedBy: string;
  updatedOn: string;
  uid: string;
  minTemp: number;
  maxTemp: number;
  measurementCycle: number;
  client: Client;
  tags: Tag[];
  attributes: Attribute[];
  categories: Category[];
  product: Product;
}

export class ThingsResponse {
  code: number;
  message: string;
  description: string;
  totalRecords: number;
  recordsCount: number;
}

export class BeaconModel extends ThingsResponse {
  data: Beacon[];
}
export class TempTagsModel extends ThingsResponse {
  data: TempTags[];
}
export class NfcTagsModel extends ThingsResponse {
  data: NfcTags[];
}
export class GatewayModel extends ThingsResponse {
  data: Gateway[];
}
export class AppsModel extends ThingsResponse {
  data: Apps[];
}

export class SyncModel extends ThingsResponse {
  data: SyncResponce[];
}

export class SyncResponce {}
