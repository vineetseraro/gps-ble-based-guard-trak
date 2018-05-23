export interface Params {
}

export interface Gadget {
    gadgetId: string;
    type: string;
    gadgetCode: string;
    name: string;
    visible: boolean;
    helpText: string;
    params: Params;
}

export interface Position {
    leftSection: Gadget[];
    rightSection: Gadget[];
}

export interface UserGadgetModel {
    displayScheme: string;
    position: Position;
}    

export interface UserGadget {
    code: number;
    message: string;
    description: string;
    data: UserGadgetModel;
}
    