
export interface Tag {
  tagName: string;
  tagId: string;
}

export interface AddRequestModel {
  code: string;
  name: string;
  status: number;
  sysDefined: number;
  tags: Tag[];
}
export interface AttributeType {
  id: string;
  code: string;
  name: string;
}

export interface Attribute {
  id: string;
  name: string;
  code: string;
  sysDefined: number;
  status: number;
  updatedBy: string;
  updatedOn: string;
  tags: Tag[];
}

export interface AttributeDetailsModel {
  code: number;
  message: string;
  description: string;
  data: Attribute;
}


export interface AttributeModel {
  code: number;
  message: string;
  description: string;
  totalRecords: number;
  recordsCount: number;
  data: Attribute[];
}


export interface AttributeTypeModel {
  code: number;
  message: string;
  description: string;
  totalRecords: number;
  recordsCount: number;
  data: AttributeType[];
}
