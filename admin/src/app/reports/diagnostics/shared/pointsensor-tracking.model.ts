export interface PointSensorTracking {
    _id: string;
    projectid: string;
    clientid: string;
    did: string;
    pkid: string;
    alt: number;
    spd: number;
    prv: string;
    acc: number;
    dir: number;
    ts: number;
    deviceInfo: Device;
    sensors: Sensor;
    location: GeoJson;
    locationdetails: Location;
    tsdt: string;
    dt: string;
    hit: string;
    locStrmTm: string;
    trLbdTm: string;
    ptLbdTm: string;
    pid: string;
}

export interface GeoJson {
    coordinates: number[],
    type: string
}

export interface PointSensorTrackingModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: PointSensorTracking[];
}

export interface Device {
    id: string,
    name: string,
    code: string,
    type: string
}

export interface Location {
    locationId: string,
    name: string,
    city: string,
    state: string,
    address: string,
    country: string,
    zipcode: string,
    lat: number,
    lon: number
}

export interface Sensor {
    id: string,
    code: string,
    name: string,
    uuid: number,
    maj: number,
    min: number,
    rssi: number,
    rng: number,
    dis: number
}
