export interface MobileLogsTracking {
    _id: string;
    projectid: string;
    clientid: string;
    filename: string;
    app: string;
    filedt: string;
    did: string;
    uuid: string;
    maj: number;
    min: number;
    rng: number;
    lat: number;
    lon: number;
    acc: number;
    alt: number;
    ts: number;
    prv: string;
    localts: string;
    mqttts: number;
    logts: number;
    batt: string;
    ble: string;
    gps: string;
    wifi: string;
    pkid: string;
    code: string;
    ack: string;
    message: string;
    dt: string;
}

export interface MobileLogsTrackingModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: MobileLogsTracking[];
}
