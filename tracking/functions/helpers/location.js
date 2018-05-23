/*jshint esversion: 6 */
/*jshint node: true */
'use strict';

const AppPromise = require("bluebird");
const UtilityLib = require("../../lib/utility");
const utility = new UtilityLib();

/**
 * Location.Helper
 * @constructor
 */
var location = function() {
    
};

/**
 * Get Location for data latitude/longitude
 * @param {object} data - request data
 * @returns {promise} Promise
 */
location.prototype.getLocation = function(data) {
    utility.debug("IN KNOWN");
    //utility.debug(data);
    
    const ApiRequestLib = require("../../lib/apirequest");
    const apiRequest = new ApiRequestLib();    
    return new AppPromise( (resolve, reject) => {
        if(typeof data.location === "undefined" || typeof data.location.coordinates === "undefined") {
            throw new Error("Lat/Lon not found");
        }
        if(data.location.coordinates[0] === null || data.location.coordinates[1] === null) {
          resolve(null);
        }
        var apiURI = process.env.apiLocationURI + '?latitude=' + data.location.coordinates[1] + '&longitude=' + data.location.coordinates[0];
        //utility.debug(apiURI);
        return apiRequest.doRequest({
            host: process.env.apiLocationHost,
            method: "GET",
            port: process.env.apiPort,
            uri: apiURI
        }).then( (results) => {
          resolve(results);
        }).catch( (err) => {
          reject("Error in processing Location " + err.message);
        });
    }).then( (results) => {
        let locationdetails = {};
        if(results === null || typeof results.data === "undefined" || results.data === null) {
            return {};
        }
        
        if(typeof data.locationdetails === "undefined") {
            data.locationdetails = [];
        }
        if(typeof results.data.id !== "undefined") {
            locationdetails = {
                "locationId" : results.data.id,
                "name" : results.data.name,
                "city" : results.data.city,
                "state" : results.data.state,
                "address" : results.data.address,
                "country" : results.data.country,
                "zipcode" : results.data.zipcode,
                "lat" : results.data.latitude,
                "lon" : results.data.longitude
            };
        } else {
            locationdetails = {"locationId" : 0};
        }
        
        //resolve(data);
        return locationdetails;
    });
};

/**
 * Get Location for data latitude/longitude
 * @param {object} data - request data
 * @returns {promise} Promise
 */
location.prototype.getApiData = function(data) {
  const ApiRequestLib = require("../../lib/apirequest");
  const apiRequest = new ApiRequestLib();
  return AppPromise.try( () => {
      var apiURL = process.env.apiBatchURI;
      return apiRequest.doRequest({
          host: process.env.apiHost,
          method: "POST",
          port: process.env.apiPort,
          uri: apiURL,
          data: data
      }).then( (results) => {
          var result = results.data;
          //console.log(result)
          return result;
      }).catch( (err) => {
          return false;
          console.log(err)
          throw new Error(" --- > " + err.message);
      });
  });
};

module.exports = location;
