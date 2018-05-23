'use strict';

module.exports.handler = (event, context, callback) => {

    function prepareInputData(data) {
        //console.log(JSON.parse(data.body));
        //return JSON.parse(data.body);
        return data.queryStringParameters
    }

    function getSensors(db) {
        console.log(requestData);
        return new Promise(function (resolve, reject) {
            if(typeof requestData.uuid == "undefined" || typeof requestData.maj == "undefined" || typeof requestData.min == "undefined" ) {
                reject("No Sensors found");
            }
            var zones = [];
            var sensorcollection = db.collection('sensors');
            var cursor = sensorcollection.find(
                {
                    "uuid" : requestData.uuid.toLowerCase(),
                    "major" : Number(requestData.maj),
                    "minor" : Number(requestData.min)
                }
            );
            cursor.toArray(function(err,results) {
                db.close();
                if(err) {
                    reject("ERROR : " + err.message);
                } else {
                    resolve(results);
                }
            });
            
            
        }).then(function(results) {
            if(results == null || results.length == 0) {
                db.close();
                return [];
            }
            db.close();
            return results;
        }).catch(function(err) {
            db.close();
            return null;
        });
    }
    
    try {
        const KmsLib = require("../lib/aws/kms");
        const kms = new KmsLib();
        var MongoClient = require('mongodb').MongoClient;
        
        var db, i;
        
        //var dsn = process.env.dbURI;
        var requestData = prepareInputData(event);
        
        kms.decrypt(process.env.dbURI).then((dsn) => {
            return MongoClient.connect(dsn);
        }).then(getSensors).then(function(result) {
            //endTime = Date.now();
            const response = {
                statusCode: 200,
                headers: {
                  "Content-Type" : "application/json"
                }, 
                body: JSON.stringify({
                    message: 'GetSensors function executed successfully!',
                    data: result,
                    request: event
                }),
            };
            callback(null, response);
            //assert.equal(err, null );
        
        }).catch(function (err) {
            const response = {
                statusCode: 501,
                headers: {
                  "Content-Type" : "application/json"
                }, 
                body: JSON.stringify({
                    error: "GETSENSOR : " + err.message,
                    request: event
                }),
            };
            callback(new Error(err.message));
        });
    } catch(err) {
        const response = {
            statusCode: 501,
            headers: {
              "Content-Type" : "application/json"
            }, 
            body: JSON.stringify({
                error: "GETSENSOR : " + err.message,
                request: event
            }),
        };
        callback(new Error(err.message));
    }
};
