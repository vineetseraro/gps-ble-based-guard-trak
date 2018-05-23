
export interface Tag {
  id: string;
  name: string;
  sysDefined: number;
  status: number;
  updatedBy: string;
  updatedOn: string;
}


export interface TagModel {
  code: number;
  message: string;
  description: string;
  totalRecords: number;
  recordsCount: number;
  data: Tag[];
}
export interface TagDetailsModel {
  code: number;
  message: string;
  description: string;
  data: Tag;
}
export interface AddRequestModel {
  name: string;
  status: number;
  sysDefined: number;

}
