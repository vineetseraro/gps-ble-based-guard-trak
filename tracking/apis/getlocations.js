'use strict';

module.exports.handler = (event, context, callback) => {

    function prepareInputData(data) {
        //return data;
        return data.queryStringParameters
    }
    
    function getKnownLocation(db) {
        
        return new Promise(function (resolve, reject) {
            if(typeof requestData.latitude == "undefined" || typeof requestData.longitude == "undefined") {
                reject("Lat/Long not found ");
            }
            
            var locationcollection = db.collection('locations');
            locationcollection.findOne({
                "perimeter" : {
                    "$geoIntersects" : {
                        "$geometry" : {
                            "type":  "Point", 
                            "coordinates" : [Number(requestData.longitude), Number(requestData.latitude)]
                        }
                    }
                }
            }, {}, function(err, result) {
                if(err) {
                    db.close()
                    reject("ERROR : " + err.message);
                    
                } else {
                    db.close()
                    resolve(result);
                }
            });
        });
    }

    
    function getLocationFromGeo(data) {
        console.log("IN UNKNOWN LOCATION GEO")
        const http = require('http');
        //console.log(event);
        return new Promise(function (resolve, reject) {
            var body = "";
            var options = {
                host: 'maps.googleapis.com',
                port: 80,
                path: '/maps/api/geocode/json?latlng=' + data.slatitude + ',' + data.slongitude + '&sensor=true'
            };
            
            return http.get(options, function(res) {
                if (res.statusCode < 200 || res.statusCode >= 300) {
                    // First reject
                    reject(new Error('statusCode=' + res.statusCode));
                    return;
                }
                res.setEncoding('utf8');
                res.on('error', function () {
                    reject(new Error('er statusCode=' + res.statusCode));
                    //resolve(JSON.parse(body));
                });
                res.on('timeout', function () {
                    reject(new Error('tm statusCode=' + res.statusCode));
                    //resolve(JSON.parse(body));
                });
                res.on('data', function (chunk) {
                    body += chunk;
                    //console.log('CHUNK: ' + chunk);
                });
                res.on('end', function () {
                    resolve(JSON.parse(body));
                });
            }).on('error', function (e) {
                reject(new Error('errrr statusCode=' + e));
                //resolve(JSON.parse(body));
            });
            
        })
    }

    function prepareLocations(data) {
        console.log("IN UNKNOWN LOCATION PREPARE")
        return new Promise(function (resolve, reject) {
            var city = "", state = "",country = "",address = "";
            var addressArray = [];
            if(data.results.length > 0 && typeof data.results[0].address_components != "undefined") {
                var gaddress_components = data.results[0].address_components;
                for(var i=0;i<gaddress_components.length;i++) {
                    //console.log("In D2");
                    var comps = gaddress_components[i];
                    
                    if (comps.types.indexOf("administrative_area_level_2") >= 0 || comps.types.indexOf("locality") >= 0) {
                        city = comps.long_name;
                    }
                    
                    if (comps.types.indexOf("administrative_area_level_1") >= 0) {
                        state = comps.long_name;
                    }
                    
                    if (comps.types.indexOf("country") >= 0) {
                        country = comps.long_name;
                    }
                    
                    if (comps.types.indexOf("premise") >= 0) {
                        addressArray.push(comps.long_name);
                    }
                    
                    if (comps.types.indexOf("sublocality_level_3") >= 0) {
                        addressArray.push(comps.long_name);
                    }
                    
                    if (comps.types.indexOf("sublocality_level_2") >= 0) {
                        addressArray.push(comps.long_name);
                    }
                    
                    if (comps.types.indexOf("sublocality_level_1") >= 0) {
                        addressArray.push(comps.long_name);
                    }
                }
                
                address = addressArray.join(",");
                
            }
            
            resolve({
                latitude: requestData.latitude,
                longitude: requestData.longitude,
                _id: 0,
                name: "",
                city: city,
                state: state,
                country: country,
                address: address
            });
        });
    }

    function setCache(input) {
        console.log("IN SET CACHE");
        return new Promise(function (resolve, reject) {
            //console.log(input)
            var cacheKey = "gloc-" + requestData.slatitude + "-" + requestData.slongitude;
            
            cacheClient.set(cacheKey, JSON.stringify({
                _id: input._id,
                name: input.name,
                city: input.city,
                state: input.state,
                country: input.country,
                address: input.address
            }), function(err, data) {
                resolve ({
                    _id: input._id,
                    name: input.name,
                    city: input.city,
                    state: input.state,
                    country: input.country,
                    address: input.address
                });
            });
        }); 
    }

    function getLocationFromCache(data) {
        console.log("IN UNKNOWN LOCATION FROM CACHE")
        if(data == null) {
            console.log('From Http');
            return getLocationFromGeo(event).then(prepareLocations).then(setCache);
        } else {
            console.log('From Cache');
            return data;
        }
    }

    function getUnknownLocation() {
        
        console.log("IN UNKNOWN LOCATION")
        return new Promise(function (resolve, reject) {
            if(typeof requestData.latitude == "undefined" || typeof requestData.longitude == "undefined") {
                reject("Required Latitude/Longitude")
            }
            requestData.slongitude = requestData.longitude.toFixed(4);
            requestData.slatitude = requestData.latitude.toFixed(4);
            
            var cacheKey = "gloc-" + requestData.slatitude + "-" + requestData.slongitude;
            return cacheClient.getData(cacheKey, function (err, data) {
                if(typeof data == "undefined") {
                    data = null;
                }
                return (err ) ? reject(err) : resolve(JSON.parse(data)); // fulfull the promise
            });
        }).then(getLocationFromCache).then(function(location) {
            cacheClient.close();
            return location;
        }).catch(function (err) {
            console.log(err)
            return false;
            //reject("Unable to get location");
        });
    }

    function checkLocation(data) {
        console.log("IN CHECK LOCATION");
        console.log(data);
        return new Promise(function(resolve, reject){
            if(data == null ) {
                resolve(getUnknownLocation());
            } else {
                resolve({
                    "_id" : data._id,
                    "name" : data.name,
                    "address" : data.address,
                    "city" : data.city,
                    "state" : data.state,
                    "country" : data.country
                });
            }
        });
    } 
    
    try {
        
        //var config = require("../config").config;
        
        const cache = require("../lib/cache");
        var cacheClient = new cache();
        
        const KmsLib = require("../lib/aws/kms");
        const kms = new KmsLib();
        
        var MongoClient = require('mongodb').MongoClient;
        
        var db, i;
        
        //var dsn = process.env.dbURI;
        
        var zones = [];
        
        var requestData = prepareInputData(event);
        
        if(typeof requestData.latitude == "undefined" || typeof requestData.longitude == "undefined") {
            throw new Error("Lat/Long not found ");
        }
        
        kms.decrypt(process.env.dbURI).then((dsn) => {
            return MongoClient.connect(dsn);
        })
        .then(getKnownLocation).then(checkLocation).then(function(result) {
            
            const response = {
                statusCode: 200,
                headers: {
                  "Content-Type" : "application/json"
                }, 
                body: JSON.stringify({
                    message: 'NearByLocation function executed successfully!',
                    data: result,
                    request: event
                }),
            };
            //console.log(response);
            callback(null, response);
            //assert.equal(err, null );
        
        }).catch(function (err) {
            const response = {
                statusCode: 501,
                headers: {
                  "Content-Type" : "application/json"
                }, 
                body: JSON.stringify({
                    error: err.message,
                    request: event
                }),
            };
            //callback(response, err.message);
            
            //callback(response);
            callback(new Error(err.message));
        });
    } catch(err) {
        const response = {
            statusCode: 501,
            headers: {
              "Content-Type" : "application/json"
            }, 
            body: JSON.stringify({
                error: err.message,
                request: event
            }),
        };
        //callback(response, err.message);
        callback(new Error(err.message));
    }
};
