export interface EmployeeLocator {
    id: string;
    Username: string;
    name: string;
    sensors: any;
    location: any;
    device: any;
    devicetrackings: any;
    trackedAt: string;
}

export interface EmployeeLocatorModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: EmployeeLocator[];
}

export interface EmployeeLocatorHistory {
    user: any;
    sensors: any;
    location: any;
    trackedAt: string;
}

export interface EmployeeLocatorHistoryModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: EmployeeLocatorHistory[];
}

export interface UserEntrance {
    id: string;
    location: any;
    user: any;
    interval: number;
    firstIn: string;
    lastOut: string;
    dt: string;
    type: string;
}

export interface UserEntranceModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: UserEntrance[];
}


export interface LoginHistory {
    id: string;
    loginTime: any;
    logoutTime: any;
    device: any;
    user: any;
    sensor: any;
}

export interface LoginHistoryModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: LoginHistory[];
}

export interface TourEventModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: TourEvent[];
}

export interface TourEvent {
    id: string;
    task: any;
    tour: any;
    attendee: any;
    action: any;
    location: any;
    additionalInfo: any;
    updatedOn: string;
}

export interface DeviceTourStatsModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: DeviceTourStats[];
}

export interface DeviceTourStats {
    id: any;
    from: string;
    device: any;
    totalTours: number;
    totalFailedTours: number;
    totalSuccessTours: number;
    totalInProcessTours: number;
}

export interface GuardTourStatsModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: GuardTourStats[];
}

export interface GuardTourStats {
    id: any;
    from: string;
    attendee: any;
    totalTours: number;
    totalFailedTours: number;
    totalSuccessTours: number;
    totalInProcessTours: number;
}
