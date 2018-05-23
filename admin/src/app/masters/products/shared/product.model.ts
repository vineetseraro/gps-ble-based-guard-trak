
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
    floor: Floor;
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
