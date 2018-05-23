export interface Date {
  name: string;
  id: string;
}

export interface DateTime {
  name: string;
  id: string;
}

export interface TimeZone {
  name: string;
  id: string;
}

export interface Configuration {
  id: string;
  code: string;
  name: string;
  status: number;
  updatedBy: string;
  date: Date;
  dateTime: DateTime;
  measurement: string;
  timezone: TimeZone;
  pagination: number;
  updatedOn: string;
  isAutoShipMode: boolean;
  isAutoDeliveryMode: boolean;
  stationaryShipmentTimeSeconds: number;
  kontaktApiKey: string;
  temperatureUnit: string;
  autocloseorder: boolean;
  autocloseorderafter: number;
  autocloseshipment: boolean;
  autocloseshipmentafter: number;
  kontaktSyncTimeSeconds: number;
}

export interface ConfigurationModel {
  code: number;
  message: string;
  description: string;
  totalRecords: number;
  recordsCount: number;
}
