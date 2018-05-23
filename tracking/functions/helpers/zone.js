/*jshint esversion: 6 */
/*jshint node: true */
'use strict';
const AppPromise = require("bluebird");
const UtilityLib = require("../../lib/utility");
const utility = new UtilityLib();

/**
 * Zone.Helper
 * @constructor
 */
var zone = function() {
    this.zones = [];
};

/**
 * Find Zone for static beacon
 * @param {object} requestData - Request Data
 * @returns {promise} Promise
 */
zone.prototype.getZoneFromStaticBeacon = function(requestData) {
    utility.debug("IN ZONE STATIC BEACON");
    var self = this;
    let ApiRequestLib = require("../../lib/apirequest");
    let apiRequest = new ApiRequestLib();  
    return new AppPromise(  (resolve, reject) => {
        if(typeof requestData.sensors === "undefined" || !Array.isArray(requestData.sensors)) {
            //reject("No Sensors found");
            resolve(null);
        }
        //utility.debug(requestData);
        //const postData = JSON.stringify({'sensors' : requestData.sensors});
        var sensorKeyArr = [];
        requestData.sensors.forEach( (sensorObj) => {
            if(typeof sensorObj.name !== "undefined") {
                sensorKeyArr.push(sensorObj.code);
            }
        });
        //var sensorKeyStr = sensorKeyArr.join(",");
        
        //var apiURI = process.env.apiZoneURI + '?sensors=' + sensorKeyStr;
        var apiURI = process.env.apiZoneURI;
        //utility.debug(apiURI);
        const options = {
            host: process.env.apiZoneHost,
            method: "POST",
            port: process.env.apiPort,
            uri: apiURI,
            data: { "things" : sensorKeyArr }
        };
        //utility.debug(process.env.apiZoneHost)
        //utility.debug(options)
        return apiRequest.doRequest(options).then( (results) => {
            resolve(results);    
        }).catch( (err) => {
            reject(err);
        });
    }).then( (results) => {
        if(results === null || typeof results.data === "undefined") {
            return [];
        }
        
        return results.data;
        
    });
};

/**
 * Find Zone for static device
 * @param {object} requestData - Request Data
 * @returns {promise} Promise
 */
zone.prototype.getZoneFromDevice = function(requestData) {
    utility.debug("IN ZONE DEVICE");
    var self = this;
    let ApiRequestLib = require("../../lib/apirequest");
    let apiRequest = new ApiRequestLib();  
    return new AppPromise( (resolve, reject) => {
        if(typeof requestData.did === "undefined") {
            resolve([]);
        } else {
          //var apiURI = process.env.apiZoneURI + '?did=' + requestData.did;
          var apiURI = process.env.apiZoneURI;
          
          return apiRequest.doRequest({
              host: process.env.apiZoneHost,
              method: "POST",
              port: process.env.apiPort,
              uri: apiURI,
              data: { "things" : [requestData.did] }
          }).then( (results) => {
              resolve(results);    
          }).catch( (err) => {
              reject(err);
          });
        }
    }).then( (results) => {
        if(results === null || typeof results.data === "undefined") {
            return [];
        }
        
        return results.data;
        
    });
};


module.exports = zone;
