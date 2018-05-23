export interface ProductTracking {
    pkid: string;
    spd: number;
    prv: string;
    acc: number;
    device: Device;
    sensor: Sensor;
    location: Location;
    zone: Zone;
    product: Product;
    shipment: Shipment;
    trackedAt: string;
    updatedAt: string;
    client: Client;
}
export interface ProductTrackingModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: ProductTracking[];
}

export interface Device {
    id: string,
    name: string,
    code: string,
    type: string
}

export interface Location {
    id: string,
    name: string,
    code: string,
    known: boolean
}

export interface Zone {
    id: string,
    name: string,
    code: string,
    thing: Device
}

export interface Product {
    id: string,
    name: string,
    code: string
}

export interface Shipment {
    id: string,
    name: string,
    code: string
}

export interface Client {
    id: string;
    projectId: string;
}
export interface Sensor {
    id: string,
    code: string
}
