export interface Order {
    id: string;
    code: string;
    status: number;
    orderStatus: number;
    orderStatusLabel: string;
    updatedBy: string;
    expectedCompletionDate: string;
    orderedDate: string;
    products: Item[];
    addresses: Address[];
    attributes: Attribute[];
    client: Client;
    tags: Tag[];
    fromAddress: string;
    toAddress: string;
    consumer: User;
    salesRepName: string;
    notes: string;
    etd: string;
    surgery: string;
    surgeon: string;
    patient: string;
    isReported: boolean;
    issues: ShipmentIssue[];
}

export interface OrderModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: Order[];
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
    id: string;
    name: string;
    value: string;
}

export interface Item {
    id: string;
    code: string;
    name: string;
    value: string;
    things: Thing[];
}

export interface Address {
    addressType: string;
    location: Location;
}

export interface Location {
    id: string;
    code: string;
    name: string;
    address: Attribute[];
}


export interface Order {
    id: string;
    code: string;
    name: string;
}

export interface Thing {
    id: string;
    code: string;
    name: string;
    thingType: string;
}

export interface User {
    uuid: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
}

export interface OrderOrchestrationList {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: OrderOrchestration[];
}

export interface OrderOrchestration {
    id: string;
    orderStatus: string;
    actionTime: string;
}

export interface ShipmentIssue {
    id: string;
    shipmentCode: string;
    shipmentId: string;
}

