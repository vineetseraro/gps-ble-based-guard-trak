
export interface ProductType {
    id: string;
    value: string;
    name: string;
}

export interface Client {
    id: string;
    projectId: string;
}
export interface Tag {
    id: string;
    name: string;
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

export interface Location {
    id: string;
    name: string;
}

export interface Zone {
    id: string;
    name: string;
}

export interface Ancestor {
    id: string;
    name: string;
    pname: string;
}

export interface Thing {
    id: string;
    name: string;
    thingType: string;
}

export interface Product {
    id: string;
    code: string;
    name: string;
    status: number;
    updatedBy: string;
    price: number;
    updatedOn: string;
    images: string[];
    url: string;
    videoUrl: string;
    description: string;
    client: Client;
    tags: Tag[];
    attributes: Attribute[];
    categories: Category[];
    parent: string;
    seoName: string;
    ancestors: Ancestor[];
    things: Thing[];
    location: Location;
    zone: Zone;
}

export interface ProductModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: Product[];
}

export interface ProductLocator {
    id: string;
    code: string;
    name: string;
    device: any;
    sensors: any;
    location: any;
    trackedAt: string;
}

export interface ProductLocatorModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: ProductLocator[];
}

export interface ProductLocatorMap {
    id: string;
    key: string;
    code: string;
    type: string;
    location: string;
    products: any;
}

export interface ProductLocatorMapModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: ProductLocatorMap[];
}

export interface ProductLocatorHistoryMap {
    trackedAt: string;
    sensor: any;
    location: any;
}

export interface ProductLocatorHistoryMapModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: ProductLocatorHistoryMap[];
}

export interface DeviceLocator {
    id: string;
    code: string;
    name: string;
    attributes: any;
    sensors: any;
    location: any;
    trackedAt: string;
}

export interface DeviceLocatorModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: DeviceLocator[];
}

export interface DeviceLocatorMapModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: DeviceLocatorMap[];
}

export interface DeviceLocatorMap {
    id: string;
    key: string;
    code: string;
    type: string;
    location: string;
    devices: any;
}


export interface DeviceLocatorHistoryMap {
    trackedAt: string;
    sensor: any;
    location: any;
}

export interface DeviceLocatorHistoryMapModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: DeviceLocatorHistoryMap[];
}

export interface ShipmentLocatorMapModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: ShipmentLocatorMap[];
}

export interface ShipmentLocatorMap {
    id: string;
    key: string;
    code: string;
    type: string;
    location: string;
    shipments: any;
}
