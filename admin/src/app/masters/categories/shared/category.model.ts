
export class CategoryResponse {
        code: number;
        message: string;
        description: string;
}

export interface CategoryListModel extends CategoryResponse {
        totalRecords: number;
        recordsCount: number;
        data: CategoryModel[];

}

export class ReadCategory extends CategoryResponse {
        data: CategoryModel[];
}

export interface CategoryModel {
        id: string;
        code: string;
        name: string;
        sysDefined: number;
        status: number;
        updatedBy: string;
        updatedOn: string;
        tags: Tag[];
        parent: string;
        seoName: string;
        ancestors: Ancestor[];

}

export class CategoryAddRequest {
        parent: string;
        code: string;
        name: string;
        status: number;
        sysDefined: number;
        tags: Tag[];

}


export interface Tag {
        tagId: string;
        tagName: string;
}

export interface Ancestor {
        pid: string;
        pSeoName: string;
        pCatName: string;
}

