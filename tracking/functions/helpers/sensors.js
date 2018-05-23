/*jshint esversion: 6 */
/*jshint node: true */
'use strict';
const AppPromise = require("bluebird");
const UtilityLib = require("../../lib/utility");
const utility = new UtilityLib();

/**
 * Sensors.Helper
 * @constructor
 */
var sensors = function() {
    
};

/**
 * Request to Sensor API & get sensor information
 * @param {object} sensorObj - Sensor Data
 * @returns {promise} Promise
 */
sensors.prototype.getSensorDataFromApi = function(sensorType, sensorObj) {
    
    const ApiRequestLib = require("../../lib/apirequest");
    const apiRequest = new ApiRequestLib();
    return AppPromise.try( () => {
        var apiURL = process.env.apiSensorURI;
        return apiRequest.doRequest({
            host: process.env.apiHost,
            method: "POST",
            port: process.env.apiPort,
            uri: apiURL,
            data: { "type": sensorType, "things": sensorObj }
        }).then( (results) => {
            var result = results.data;
            return result;
        }).catch( (err) => {
            return false;
            //throw new Error(" --- > " + err.message);
        });
    });
};

/**
 * Get Sensor information for sensor list
 * @param {array} sensors - sensors list
 * @returns {promise} Promise
 */
sensors.prototype.getSensor = function(sensors) {
    utility.debug("IN SENSOR");
    var self = this;
    if(typeof sensors === "undefined" ) {
        return false;
    }
    let body = "";
    let idx = 0;
    
    let sensortype = null;
    let sensorList = sensors.map( (sensorObj, index) => {
      if(typeof sensorObj.type !== 'undefined') {
        sensortype = sensorObj.type;
      }
      return self.getSensorKeyFields(sensorObj);
      // { uuid : sensorObj.uuid, major : sensorObj.maj, minor : sensorObj.min };
    });
    
    return self.getSensorDataFromApi(sensortype, sensorList).then((results) => {
      utility.debug("IN SESSOR TESTSTTT");
      if(results === false || results === null) {
        return sensors;
      }
      return sensors.map((row, idx) => {
        results.forEach((row1, idx1) => {
          row = self.compareAndGetSensors(row, row1);
          /*if(row.uuid !== '' && row.maj !== 0 && row.min !== 0 ) {
            if( (row.uuid + '').toLowerCase() === (row1.uuid + '').toLowerCase() && row.maj === row1.major && row.min === row1.minor ) {
              row.id = row1.id;
              row.code = row1.code;
              row.name = row1.name;
            }
          }*/
        });
        return row;
      });
    });
};

/**
 * Get Device information for device uid
 * @param {string} duid - device unique code
 * @returns {promise} Promise
 */
sensors.prototype.getDevice = function(duid) {
    utility.debug("IN DEVICE");
    var self = this;
    //if(typeof duid === "undefined" ) {
    //    return false;
    //}
    const ApiRequestLib = require("../../lib/apirequest");
    const apiRequest = new ApiRequestLib();
    
    return AppPromise.try( () => {
        let apiURL = process.env.apiDeviceURI + '?code=' + duid;
        return apiRequest.doRequest({
            host: process.env.apiHost,
            method: "GET",
            port: process.env.apiPort,
            uri: apiURL,
            //data: { "things" : sensorObj }
        }).then( (results) => {
            let result = results.data;
            return result;
        }).catch( (err) => {
            return false;
            //throw new Error(" --- > " + err.message);
        });
    }).then((results) => {
      return results;
    });
};

/**
 * Get Sensor fields information for different types
 * @param {string} duid - device unique code
 * @returns {promise} Promise
 */
sensors.prototype.getSensorKeyFields = function(sensorObj) {
  switch(sensorObj.type) {
    case "tempTag":
    case "nfcTag":
      return { uid : sensorObj.uid };
    case "beacon":
    default:
      return { uuid : sensorObj.uuid, major : sensorObj.maj, minor : sensorObj.min };
  }
}

/**
 * Get Sensor fields information for different types
 * @param {string} duid - device unique code
 * @returns {promise} Promise
 */
sensors.prototype.getSensorKey = function(sensorObj) {
  switch(sensorObj.type) {
    case "tempTag":
    case "nfcTag":
      return sensorObj.uid;
    case "beacon":
    default:
      return sensorObj.uuid + ':' + sensorObj.maj + ':' + sensorObj.min;
  }
}

/**
 * Validate Sensor fields information for different types
 * @param {string} duid - device unique code
 * @returns {promise} Promise
 */
sensors.prototype.validateSensorInfo = function(sensorObj) {
  let valid = true;
  let field = {};
  /*if(typeof sensorObj.type !== "string" ) {
    valid = false;
    field = { 'fieldName' : 'type', 'fieldValue' : sensorObj.type };
  } else {*/
    switch(sensorObj.type) {
      case "tempTag":
      case "nfcTag":
        if(typeof sensorObj.uid !== "string" || sensorObj.uid === "" ) {
          valid = false;
          field = { 'fieldName' : 'uid', 'fieldValue' : sensorObj.uid };
        }
        break;
      case "beacon":
      default:
        if(typeof sensorObj.dis !== "number") {
          valid = false;
          field = { 'fieldName' : 'dis', 'fieldValue' : sensorObj.dis };
        } else if(typeof sensorObj.rng !== "number") {
          valid = false;
          field = { 'fieldName' : 'rng', 'fieldValue' : sensorObj.rng };
        } else if(typeof sensorObj.rssi !== "number") {
          valid = false;
          field = { 'fieldName' : 'rssi', 'fieldValue' : sensorObj.rssi };
        //} else if(typeof sensorObj.uuid !== "string" || sensorObj.uuid === "" ) {
        } else if(typeof sensorObj.uuid !== "string" || ( typeof sensorObj.uuid === "string" && (sensorObj.uuid + '').toLowerCase() !== process.env.defaultBeaconUUID) ) {
          valid = false;
          field = { 'fieldName' : 'uuid', 'fieldValue' : sensorObj.uuid };
        } else if(typeof sensorObj.maj !== "number" || sensorObj.maj === 0 ) {
          valid = false;
          field = { 'fieldName' : 'maj', 'fieldValue' : sensorObj.maj };
        } else if(typeof sensorObj.min !== "number" || sensorObj.min === 0 ) {
          valid = false;
          field = { 'fieldName' : 'min', 'fieldValue' : sensorObj.min };
        } 
    }
  // }
  
  return { valid: valid, field: field };
}

/**
 * Validate Sensor fields information for different types
 * @param {string} duid - device unique code
 * @returns {promise} Promise
 */
sensors.prototype.compareAndGetSensors = function(row, row1) {
  switch(row.type) {
    case "tempTag":
    case "nfcTag":
      if(row.uid !== '' ) {
        if( (row.uid + '').toLowerCase() === (row1.uid + '').toLowerCase()) {
          row.id = row1.id;
          row.code = row1.code;
          row.name = row1.name;
        }
      }
      break;
    case "beacon":
    default:
      if(row.uuid !== '' && row.maj !== 0 && row.min !== 0 ) {
        if( (row.uuid + '').toLowerCase() === (row1.uuid + '').toLowerCase() && row.maj === row1.major && row.min === row1.minor ) {
          row.id = row1.id;
          row.code = row1.code;
          row.name = row1.name;
        }
      }
  }
  
  return row;
  
};

/**
 * Validate Sensor fields information for different types
 * @param {string} duid - device unique code
 * @returns {promise} Promise
 */
sensors.prototype.getThingFromApiData = function(apiData, sensorData) {
  switch(sensorData.type) {
    case "tempTag":
    case "nfcTag":
      return apiData[sensorData.type + '--' + sensorData.uid];
      break;
    case "beacon":
    default:
      return apiData[sensorData.type + '--' + sensorData.uuid + '--' + sensorData.maj + '--' + sensorData.min];
  }
  
  return row;
  
};

sensors.prototype.prepareSensorFilterForApi = function(batchApiFilter, sensorData) {
  //console.log('================================')
  let tempThings;
  sensorData.forEach((srow) => {
  switch(srow.type) {
    case "tempTag":
    case "nfcTag":
    //console.log('-------------------------------')
    //console.log(batchApiFilter);
    //console.log(sensorData);
      //sensorData.forEach((srow) => {
        tempThings = batchApiFilter.things.filter((row) => {
          if(row.type === srow.type && row.uid === srow.uid) {
            return true;
          }
          return false;
        });
        if(tempThings.length === 0) {
          batchApiFilter.things.push({
            type: srow.type, 
            uid: srow.uid
          });
        }
      //});
      break;
    case "beacon":
    default:
      //utility.debug("IN NNNNNN");
      //utility.debug(sensorData);
      //sensorData.forEach((srow) => {
        //utility.debug("IN AAAA");
        //utility.debug(srow);
        tempThings = batchApiFilter.things.filter((row) => {
          utility.debug(row.type + " = " + srow.type + " | " + row.uuid + " = " + srow.uuid + " | " + row.major + " = " + srow.maj + " | " + row.minor + " = " + srow.min);
          if(row.type === srow.type && row.uuid === srow.uuid && row.major === srow.maj && row.minor === srow.min) {
            return true;
          }
          return false;
        });
        utility.debug(tempThings.length);
        if(tempThings.length === 0) {
          batchApiFilter.things.push({
            type: srow.type, 
            uuid: srow.uuid,
            major: srow.maj,
            minor: srow.min
          });
        }
      //});
      break;
  }
  });
  return batchApiFilter;
  
};

module.exports = sensors;
