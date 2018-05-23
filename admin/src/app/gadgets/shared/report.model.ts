export interface Report {
    label: string;
    value: string;
}

export interface ReportModel {
    code: number;
    message: string;
    recordCount: number;
    totalRecords: number;
    data: Report[];
}

