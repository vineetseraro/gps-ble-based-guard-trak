export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Meta {
  height: string;
  width: string;
}

export interface FloorMapDetails {
  xCoord: number;
  yCoord: number;
}

export interface Thing {
  id: string;
  code: string;
  name: string;
}

export interface Zone {
  code: string;
  id: string;
  name: string;
  status: number;
  radius: number;
  floorMapDetails: FloorMapDetails;
  things: Thing[];
}

export interface Floor {
  id: string;
  name: string;
  image: string;
  meta: Meta;
  zones: Zone[];
}

export interface Client {}

export interface Tag {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Attribute {
  id: string;
  name: string;
  value: string;
  sysDefined: number;
  status: number;
}

export interface Location {
  id: string;
  code: string;
  name: string;
  coordinates: Coordinates;
  floors: Floor[];
  status: number;
  updatedBy: string;
  updatedOn: Date;
  client: Client;
  tags: Tag[];
  seoName: string;
  categories: Category[];
  attributes: Attribute[];
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  radius: number;
  phone: string;
  phonecode: string;
  fax: string;
  radiusUnit: string;
  perimeter: any;
}

export interface LocationModel {
  code: number;
  message: string;
  description: string;
  totalRecords: number;
  recordsCount: number;
  data: Location[];
}
