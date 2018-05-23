export interface RawLocationTracking {
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
    lat: number;
    lon: number;
    sensors: Sensor;
    tsdt: string;
    dt: string;
    hit: string;
    locStrmTm: string;
    trLbdTm: string;
    ptLbdTm: string;
    pid: string;
}

export interface RawLocationTrackingModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: RawLocationTracking[];
}

export interface Sensor {
    uuid: number,
    maj: number,
    min: number,
    rssi: number,
    rng: number,
    dis: number
}
