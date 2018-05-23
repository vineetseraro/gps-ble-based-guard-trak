export interface TaskType {
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

export interface Floor {
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

export interface Task {
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
    location: any;
    floor: Floor;
    zone: Zone;
    from: string;
    to: string;
    attendees: any;
    locations: any;
    device: any;
    frequency: number;
    recur: any;
    startDate: string;
    scheduleType: string;
}

export interface TaskModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: Task[];
}
