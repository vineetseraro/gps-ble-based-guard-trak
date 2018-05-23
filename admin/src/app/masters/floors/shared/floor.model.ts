
    export interface Coordinates {
        latitude: number;
        longitude: number;
    }

    export interface Meta {
        height: string;
        width: string;
    }

    export interface FloorMapDetails {
        xCoord: number;
        yCoord: number;
    }

    export interface Thing {
        id: string;
        code: string;
        name: string;
    }

    export interface Zone {
        code: string;
        id: string;
        name: string;
        status: number;
        radius: number;
        floorMapDetails: FloorMapDetails;
        things: Thing[];
    }

    export interface Client {
    }

    export interface Tag {
        id: string;
        name: string;
    }

    export interface Category {
        id: string;
        name: string;
    }

    export interface Attribute {
        id: string;
        name: string;
        value: string;
        sysDefined: number;
        status: number;
    }

    export interface Floor {
        id: string;
        code: string;
        name: string;
        status: number;
        updatedBy: string;
        updatedOn: Date;
        client: Client;
        tags: Tag[];
        seoName: string;
        categories: Category[];
        attributes: Attribute[];
        parent: string;
    }

export interface FloorModel {
        code: number;
        message: string;
        description: string;
        totalRecords: number;
        recordsCount: number;
        data: Floor[];
}
