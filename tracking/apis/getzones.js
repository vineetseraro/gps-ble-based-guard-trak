'use strict';

module.exports.handler = (event, context, callback) => {

    function prepareInputData(data) {
        //console.log(JSON.parse(data.body));
        //return JSON.parse(data.body);
            return data.queryStringParameters
    }

    function getZones(db) {
        //console.log(requestData);
        
        zonecollection = db.collection('zones');
        
        return new Promise(function (resolve, reject) {
            
            if(typeof requestData.did != "undefined") {
                return findZoneFromDevice(requestData.did).then(function(zones){
                    resolve(zones);
                });
            } else if(typeof requestData.sensors != "undefined") {
                console.log("IN STATIC BEACON START");
                var zones = [];
                var i = 0;
                var sensorKeys = requestData.sensors.split(",");
                console.log(sensorKeys);
                if(sensorKeys.length == 0) {
                    reject("No sensor found");
                }
        
                return findZoneFromStaticSensor(sensorKeys).then(function(zones){
                    console.log("IN STATIC BEACOn RESULT");
                    resolve(zones);
                });
            } else {
                reject("Not a valid request");
            }
            
        }).then(function(results) {
            console.log(results)
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
    

    function findZoneFromDevice(did) {
        
        return new Promise(function (resolve, reject) {
            //var zonecollection = db.collection('zones');
            var cursor = zonecollection.aggregate([
                {
                    "$lookup" : {
                        from: "devices",
                        localField: "device",
                        foreignField: "_id",
                        as: "deviceInfo"
                    }
                },
                {
                    "$unwind" : "$deviceInfo"
                },
                {
                    "$lookup" : {
                        from: "locations",
                        localField: "location",
                        foreignField: "_id",
                        as: "locationInfo"
                    }
                },
                {
                    "$unwind" : "$locationInfo"
                },
                {
                    "$match" : {
                        "deviceInfo.did" : did
                    }
                },
                {
                    "$project" : {
                        "_id" : 1,
                        "name" : 1,
                        "staticbeacon" : 1,
                        "device" : "$deviceInfo",
                        "location" : {
                            "id" : "$locationInfo._id",
                            "name" : "$locationInfo.name",
                            "city" : "$locationInfo.city",
                            "state" : "$locationInfo.state",
                            "address" : "$locationInfo.address",
                            "country" : "$locationInfo.country"
                        }
                    }
                }
            ]);
            cursor.toArray(function(err,result) {
                if(err) {
                    reject("ERROR : " + err.message);
                } else {
                    if(Array.isArray(result) && result.length > 0) {
                        //zones.push({"id": result[0]._id,  "name": result[0].name});
                        zones.push({
                            "id" : result[0]._id,
                            "name" : result[0].name,
                            "location" : result[0].location,
                            "detectType" : "device",
                            "detectObjectId" : result[0].device._id,
                            "detectObjectName" : result[0].device.name
                        });
                    }
                    resolve(zones);
                }
            });
        });
    }        
    
    function findZoneFromStaticSensor(sensorKeys) {
        //var zonecollection = db.collection('zones');
        console.log("IN STATIC BEACOn FUN 1");
        return new Promise(function (resolve, reject) {
            var cursor = zonecollection.aggregate([
                {
                    "$lookup" : {
                        from: "sensors",
                        localField: "staticbeacon",
                        foreignField: "_id",
                        as: "sensorInfo"
                    }
                },
                {
                    "$unwind" : "$sensorInfo"
                },
                {
                    "$lookup" : {
                        from: "locations",
                        localField: "location",
                        foreignField: "_id",
                        as: "locationInfo"
                    }
                },
                {
                    "$unwind" : "$locationInfo"
                },
                {
                    "$match" : {
                        "sensorInfo.name" : { "$in" : sensorKeys}
                    }
                },
                {
                    "$project" : {
                        "_id" : 1,
                        "name" : 1,
                        "staticbeacon" : 1,
                        "device" : 1,
                        "sensor" : "$sensorInfo",
                        "location" : {
                            "id" : "$locationInfo._id",
                            "name" : "$locationInfo.name",
                            "city" : "$locationInfo.city",
                            "state" : "$locationInfo.state",
                            "address" : "$locationInfo.address",
                            "country" : "$locationInfo.country"
                        }
                    }
                }
            ]);
            
            cursor.toArray(function(err,results) {
                if(err) {
                    //db.close()
                    reject("ERROR : " + err.message);
                } else {
                    var i = 0;
                    if(Array.isArray(results) && results.length > 0) {
                        //zones.push({"id": result[0]._id,"name": result[0].name});
                        results.forEach(function(result){
                            //console.log(result)
                            zones.push({
                                "id" : result._id,
                                "name" : result.name,
                                "location" : result.location,
                                "detectType" : "staticbeacon",
                                "detectObjectId" : result.staticbeacon,
                                "detectObjectName" : result.sensor.name
                            });
                            
                            i++;
                            
                            if(i == results.length) {
                                console.log("IN STATIC BEACOn FUN 8");
                                resolve(zones);
                            }
                        }) 
                    } else {
                        resolve([]);
                    }
                }
            });
        });
    }
    
    try {
        const KmsLib = require("../lib/aws/kms");
        const kms = new KmsLib();
        
        var zones = [];
        var MongoClient = require('mongodb').MongoClient;
        var zonecollection;
        var db, i;
        
        //var dsn = process.env.dbURI;
        var requestData = prepareInputData(event);
        
        kms.decrypt(process.env.dbURI).then((dsn) => {
            return MongoClient.connect(dsn);
        })
        .then(getZones).then(function(result) {
            //endTime = Date.now();
            const response = {
                statusCode: 200,
                headers: {
                  "Content-Type" : "application/json"
                }, 
                body: JSON.stringify({
                    message: 'GetZones function executed successfully!',
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
                    error:  err.message,
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
                error:  err.message,
                request: event
            }),
        };
        callback(new Error(err.message));
    }
};
