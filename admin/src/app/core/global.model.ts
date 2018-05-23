
/**
 * Dropdown Model Interface
 * @export
 * @interface DropdownModel
 */
export interface DropdownModel {
        code: number;
        message: string;
        description: string;
        totalRecords: number;
        recordsCount: number;
        data: Dropdown[];
}

/**
 * Dropdown Interface
 * @export
 * @interface Dropdown
 */
export interface Dropdown {
        id: string;
        name: string;
      //  sub: string;
}

export class APIResponse {
        code: number;
        message: string;
        description: string;
        totalRecords: number;
        recordsCount: number;
}

export class CountryResponse extends APIResponse {
        data: CountryModel[];
}

export class CountryModel {
        id: string;
        shortCode: string;
        dialCode: string;
        name: string;
}

export class TimeZoneResponse extends APIResponse {
        data: TimeZoneModel[];
}

export class TimeZoneModel {
        id: string;
        offset: string;
        name: string;
}

export class DateResponse extends APIResponse {
        data: DateModel[];
}

export class DateModel {
        id: string;
        offset: string;
        name: string;
        example: string;
}

export class DateTimeResponse extends APIResponse {
        data: DateTimeModel[];
}

export class DateTimeModel {
        id: string;
        offset: string;
        name: string;
        example: string;
}


