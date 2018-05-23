export interface Tag {
        id: string;
        name: string;
}

export interface Ancestor {
        pid: string;
        pseoName: string;
        pname: string;
}

export interface Item {
        id: string;
        name: string;
        status: number;
        sysDefined: number;
}

export interface Collection {
        id: string;
        code: string;
        name: string;
        type: string;
        sysDefined: number;
        status: number;
        updatedBy: string;
        updatedOn: string;
        tags: Tag[];
        parent: string;
        seoName: string;
        ancestors: Ancestor[];
        items: Item[];
}

export interface CollectionModel {
        code: number;
        message: string;
        description: string;
        totalRecords: number;
        recordsCount: number;
        data: Collection[];
}