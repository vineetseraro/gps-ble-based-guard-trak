export interface Gadget {
    id: string;
    name: string;
    description: string;
    type: string;
    image: string;
}

export interface GadgetModel {
    code: number;
    message: string;
    recordCount: number;
    totalRecords: number;
    data: Gadget[];
}

