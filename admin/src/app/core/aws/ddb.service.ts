import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

/**
 * Created by Vladimir Budilov
 */


declare var AWS: any;

@Injectable()
export class DynamoDBService {

    constructor() {
        // console.log('DynamoDBService: constructor');
    }

    getAWS() {
        return AWS;
    }

    writeLogEntry(type: string) {
        try {
            const date = new Date().toString();
            // console.log('DynamoDBService:Writing log entry.Type:'+type+'ID:'+AWS.config.credentials.params.IdentityId+'Date:'+date);
            this.write(AWS.config.credentials.params.IdentityId, date, type);
        } catch (exc) {
            // console.log('DynamoDBService: Couldn't write to DDB');
        }

    }

    write(data: string, date: string, type: string): void {
        // console.log('DynamoDBService: writing ' + type + " entry");
        const DDB = new AWS.DynamoDB({
            params: { TableName: environment.ddbTableName }
        });

        // Write the item to the table
        const itemParams = {
            Item: {
                userId: { S: data },
                activityDate: { S: date },
                type: { S: type }
            }
        };
        DDB.putItem(itemParams, function (result) {
            result;
            // console.log('DynamoDBService: wrote entry: ' + JSON.stringify(result));
        });
    }

}
