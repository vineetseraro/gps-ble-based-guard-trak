export interface Shipment {
    id: string;
    code: string;
    // name: string;
    status: number;
    shipmentStatus: number;
    shipmentStatusLabel: string;
    updatedBy: string;
    scheduledPickupDate: string;
    etd: string;
    products: Item[];
    addresses: Address[];
    deliveryDetails: DeliveryDetails;
    trackingDetails: DeliveryDetails;
    attributes: Attribute[];
    client: Client;
    tags: Tag[];
    fromAddress: string;
    toAddress: string;
    carrierUser: User;
    carrierUserName: string;
    isReported: boolean;
    issue: string;
    createdOn: string;
    deliveryDate: string;
}

export interface ShipmentModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: Shipment[];
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
    // sysDefined: number;
    // status: number;
}

export interface Item {
    id: string;
    name: string;
    value: string;
    orderDetails: OrderDetails;
    deliveryStatus: number;
    currentLocation: Location;
    isAlreadySaved: boolean;
}

export interface OrderDetails {
    id: string;
    code: string;
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

export interface DeliveryDetails {
    // carrierUser: User;
    // attributes: Attribute[];
    recipientFirstName: string;
    recipientLastName: string;
    recipientMobileCode: string;
    recipientMobileNumber: string;
    pdfUrl: string;
}

export interface User {
    uuid: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNo: string;
}

export interface TrackingDetails {
    currentLocation: CurrentLocation;
}

export interface CurrentLocation {
    locId: string;
    locCode: string;
    locName: string;
    pointCoordinates: string;
    address: Attribute[];
}

export interface ShipmentOrchestrationList {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: ShipmentOrchestration[];
}

export interface ShipmentOrchestration {
    id: string;
    shipmentStatus: string;
    shipmentStatusLabel: string
    actionTime: string;
}

export interface ShipmentItemOrchestration {
    id: string;
    itemStatus: string;
    itemStatusLabel: string
    actionTime: string;
}
