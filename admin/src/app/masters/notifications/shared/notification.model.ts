export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string,
    notificationTime : string,
    params : any,
    recieverUserData: { "firstName", "lastName"},
    actionBy : { "firstName", "lastName"}

}



export interface NotificationModel {
    code: number;
    message: string;
    description: string;
    totalRecords: number;
    recordsCount: number;
    data: Notification[];
}

