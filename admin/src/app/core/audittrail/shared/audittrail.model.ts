
export interface Audittrail {
  id: string;
  actionType: string;
  model: string;
  actionTime: string;
  actionBy: UpdatedBy;
  client: Client;
  object: any;
}


export interface AudittrailList {
  code: number;
  message: string;
  description: string;
  totalRecords: number;
  recordsCount: number;
  data: Audittrail[];
}

export interface AudittrailDetailsModel {
  code: number;
  message: string;
  description: string;
  data: Audittrail;
}

export interface UpdatedBy {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Client {
  clientId: string;
  projectId: string;
}
