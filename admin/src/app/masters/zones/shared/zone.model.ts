
    export interface Coordinates {
        latitude: number;
        longitude: number;
    }

    export interface Meta {
        height: string;
        width: string;
    }

    export interface ZoneMapDetails {
        xCoord: number;
        yCoord: number;
    }

    export interface Thing {
        id: string;
        code: string;
        name: string;
    }

    /*export interface Zone {
        code: string;
        id: string;
        name: string;
        status: number;
        radius: number;
        zoneMapDetails: ZoneMapDetails;

    }*/

    export interface Floor {
        id: string;
        name: string;
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

    export interface Zone {
        id: string;
        code: string;
        name: string;
        coordinates: Coordinates;
        zones: Zone[];
        status: number;
        updatedBy: string;
        updatedOn: Date;
        client: Client;
        tags: Tag[];
        seoName: string;
        categories: Category[];
        attributes: Attribute[];
        address: string;
        city: string;
        state: string;
        country: string;
        zipcode: string;
        radius: number;
        phone: string;
        fax: string;
        radiusUnit: string;
        parent: string;
        location: string;
        things: Thing[];
        ancestors: Floor[];
    }

export interface ZoneModel {
        code: number;
        message: string;
        description: string;
        totalRecords: number;
        recordsCount: number;
        data: Zone[];
}