import { Injectable } from '@angular/core';

@Injectable()
export class Configuration {
    public content_type: string = 'application/json;';
    public accept: string = 'application/json';
    public deviceid: string = '123456';
    public sid: string;
    public role: string = 'salesrep';
}
