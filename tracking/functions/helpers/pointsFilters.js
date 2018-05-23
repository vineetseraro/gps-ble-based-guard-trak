/*jshint esversion: 6 */
/*jshint node: true */
'use strict';

const AppPromise = require("bluebird");
const UtilityLib = require("../../lib/utility");
const utility = new UtilityLib();

const SensorsLib = require("./sensors");
var sensorsLib = new SensorsLib();

const PointsModel = require("../../models/points");
var pointsModel = new PointsModel();    

/**
 * Points Filters.Helper
 * @constructor
 */
var pointsFilters = function() {
    
};
/*
* Set DB Connection
* @param {object} dbConnection - DB Connection
* @returns void
*/
pointsFilters.prototype.setDbConnection = function(dbConnection) {
   this.dbConnection = dbConnection;
};


/**
 * Sort data by timestamp
 * @param {array} data - Request Data
 * @returns {promise} Promise
 */
pointsFilters.prototype.sortByTime = function(data) {
    return new AppPromise((resolve, reject) => { 
        let resuls = data.sort((prev, next) => {
            return prev.ts > next.ts;
        });
        resolve(resuls);
    });
};

/**
 * Filter data fields
 * Will remove remote points if found invalid fields 
 * @param {object} data - Request Data
 * @returns {promise} Promise
 */
pointsFilters.prototype.filterInvalidData = function(data) {
    let self = this;
    let discardedPoints = [];
    let discardedSensors = [];
    if(process.env.enableDataTypeFilters === 1 || process.env.enableDataTypeFilters === "1") {
      return new AppPromise((resolve, reject) => {
          let results = data.map( (row, idx) => {
            let isValid = true;
            let invalidField = null;
              if(typeof row.acc !== "number") {
                isValid = false;
                invalidField = { 'fieldName' : 'acc', 'fieldValue' : row.acc };
              } else if(typeof row.alt !== "number") {
                isValid = false;
                invalidField = { 'fieldName' : 'alt', 'fieldValue' : row.alt };
              } else if(typeof row.clientid !== "string" || row.clientid === "" ) {
                isValid = false;
                invalidField = { 'fieldName' : 'clientid', 'fieldValue' : row.clientid };
              } else if(typeof row.did !== "string" || row.did === "" ) {
                isValid = false;
                invalidField = { 'fieldName' : 'did', 'fieldValue' : row.did };
              } else if(typeof row.dir !== "number") {
                isValid = false;
                invalidField = { 'fieldName' : 'dir', 'fieldValue' : row.dir };
              } else if(typeof row.lat !== "number" || row.lat === 0 ) {
                isValid = false;
                invalidField = { 'fieldName' : 'lat', 'fieldValue' : row.lat };
              } else if(typeof row.lon !== "number" || row.lon === 0 ) {
                isValid = false;
                invalidField = { 'fieldName' : 'lon', 'fieldValue' : row.lon };
              } else if(typeof row.pkid !== "string" || row.pkid === "" ) {
                isValid = false;
                invalidField = { 'fieldName' : 'pkid', 'fieldValue' : row.pkid };
              } else if(typeof row.projectid !== "string" || row.projectid === "" ) {
                isValid = false;
                invalidField = { 'fieldName' : 'projectid', 'fieldValue' : row.projectid };
              } else if(typeof row.prv !== "string") {
                isValid = false;
                invalidField = { 'fieldName' : 'prv', 'fieldValue' : row.prv };
              } else if(typeof row.spd !== "number") {
                isValid = false;
                invalidField = { 'fieldName' : 'spd', 'fieldValue' : row.spd };
              } else if(typeof row.ts !== "number" || row.ts === 0 ) {
                isValid = false;
                invalidField = { 'fieldName' : 'ts', 'fieldValue' : row.ts };
              } else if(typeof row.sensors !== "object") {
                isValid = false;
                invalidField = { 'fieldName' : 'sensor', 'fieldValue' : row.sensors };
              } else if(typeof row.sensors.length === 0) {
                isValid = false;
                invalidField = { 'fieldName' : 'sensorlen', 'fieldValue' : row.sensors.length };
              } 
              
              let sensorsFlag = true;
              row.sensors.forEach( (srow, sidx) => {
                const validateInfo = sensorsLib.validateSensorInfo(srow);
                // sensorsFlag = validateInfo.valid;
                // invalidField = validateInfo.field;
                
                if(validateInfo.valid === false) {
                  row.sensors[sidx].discarded = true;
                  row.sensors[sidx].discardType = "invalidType";
                  row.sensors[sidx].discardInfo = validateInfo.field;
                  
                  discardedSensors.push(row);
                } else {
                  row.sensors[sidx].discarded = false;
                }
              });
            
              if(isValid === false) {
                row.discarded = true;
                row.discardType = "invalidType";
                row.discardInfo = invalidField;
                discardedPoints.push(row);
              }
              return row;
              
          });
          resolve(results);
      }).then( (results) => {
        return self.insertDiscardedPoints("invalidType", discardedPoints, null).then( (discardResults) => {
          return results;
        });
      }).then( (results) => {
        return self.insertDiscardedSensors("invalidType", discardedSensors, null).then( (discardResults) => {
          return results;
        });
      });
      
    } else if(process.env.enableDataTypeFilters === 2) {
      return AppPromise.each(
        (data) => {
          utility.debug("IN FILTER Lat/Long");
          return self.filterInvalidLatLon(data);
        }, 
        (data) => {
          utility.debug("IN FILTER Device");
          return self.filterInvalidDevice(data);
        }
      );
    } else {
      return new AppPromise( (resolve) => {
        resolve(data);
      } );
    }
};

/**
 * Insert discarded points
 * Will remove remote points if found invalid device id 
 * @param {object} data - Request Data
 * @returns {promise} Promise
 */
pointsFilters.prototype.insertDiscardedPoints = function(type, data, extra) {
  /*return new AppPromise((resolve, reject) => {
    resolve(data);
  });
  */
  let self = this;
  
  if(data.length > 0) {
    
    const DiscardedPointsModel = require("../../models/discardedPoints");
    var discardedPointsModel = new DiscardedPointsModel();    
    let udata = data.map( (row) => {
      row.discardType = type;
      return row; 
    });
    return new AppPromise((resolve, reject) => {
        discardedPointsModel.setDbConnection(self.dbConnection);
        discardedPointsModel.save(udata);
        resolve(data);
    });
  } else {
      return new AppPromise((resolve, reject) => {
        resolve(data);
      });
  }
  
};

/**
 * Insert discarded points
 * Will remove remote points if found invalid device id 
 * @param {object} data - Request Data
 * @returns {promise} Promise
 */
pointsFilters.prototype.insertDiscardedSensors = function(type, data, extra) {
  let self = this;
  
  if(data.length > 0) {
    const DiscardedSensorsModel = require("../../models/discardedSensors");
    var discardedSensorsModel = new DiscardedSensorsModel();    
    let udata = data.map( (row) => {
      const rowCopy = Object.assign({}, row);

      rowCopy.sensors = row.sensors.filter( (row1) => {
        return row1.discarded; 
      });
      return rowCopy;
    });  
    return new AppPromise((resolve, reject) => {
        discardedSensorsModel.setDbConnection(self.dbConnection);
        discardedSensorsModel.save(udata);
        
        resolve(data);
    });
  } else {
      return new AppPromise((resolve, reject) => {
        resolve(data);
      });
  }
};


/**
 * Filter out invalid device
 * Will remove remote points if found invalid device id 
 * @param {object} data - Request Data
 * @returns {promise} Promise
 */
pointsFilters.prototype.filterInvalidDevice = function(data) {
    let self = this;
    return new AppPromise((resolve, reject) => {
        let results = data.map( (row, idx) => {
            if(typeof row.did === "undefined" || row.did === "") {
              row.discarded = true;
              row.discardType = "invalidType";
              row.discardInfo = { 'fieldName' : 'did', 'fieldValue' : row.did };;
              
              return row;
            } else {
              return row;
            }
        });
        
        resolve(results);
    });
};

/**
 * Filter out invalid latitude / longitude
 * Will remove remote points if found invalid lat/lon 
 * @param {object} data - Request Data
 * @returns {promise} Promise
 */
pointsFilters.prototype.filterInvalidLatLon = function(data) {
    let self = this;
    return new AppPromise((resolve, reject) => {
        let results = data.map( (row, idx) => {
            if(typeof row.lat === "undefined" || row.lat == 0) {
              row.discarded = true;
              row.discardType = "invalidType";
              row.discardInfo = { 'fieldName' : 'lat', 'fieldValue' : row.lat };
              return row;
            } else if(typeof row.lon === "undefined" || row.lon == 0) {
              row.discarded = true;
              row.discardType = "invalidType";
              row.discardInfo = { 'fieldName' : 'lon', 'fieldValue' : row.lon };
              return row;
            } else {
              return row;
            }
        });
        
        resolve(results);
    });
};


/**
 * Filter out noise points from data
 * Will remove remote points manually on example logic for if vehicle speed less than 60km/h, 
 * So remote points must be more than 1km from last point for 1 minute duration 
 * @param {object} data - Request Data
 * @returns {promise} Promise
 */
pointsFilters.prototype.filterNoise = function(data) {
    let self = this;
    let discardedPoints = [];
    self.sensorsArray = [];
    return new AppPromise((resolve, reject) => {
        //resolve(data);
        //return;
        
        let sensorsLocation = {};
        data.forEach( (row, idx) => {
            if(typeof row.sensors != "undefined") {
                row.sensors.forEach( (srow, sidx) => {
                    let skey = sensorsLib.getSensorKey(srow);
                    if(typeof sensorsLocation[skey] == "undefined") {
                        sensorsLocation[skey] = [];
                    }
                    sensorsLocation[skey].push({
                        "loc_idx" : idx,
                        "sensor_idx" : sidx,
                        "lat" : row.lat,
                        "lon" : row.lon,
                        "ts" : row.ts
                    });
                });
            }
        });
        
        let filteredSensorsLocation = {};
        for(let skey in sensorsLocation) {
            let sensorsLocationRow = sensorsLocation[skey];
            let flag = false;
            let lastAddress = [];
            filteredSensorsLocation[skey] = sensorsLocationRow.filter((row, idx) => {
                //self.checkNoiseSensors(results, row, idx);
                if(lastAddress.length > 0) {
                    flag  = self.getNoiseStatus(lastAddress, [row.lat, row.lon, row.ts]);
                }
                lastAddress = [row.lat, row.lon, row.ts];
                return !flag;
            });
        }
        
        let results = data.map( (row, idx) => {
          let isValid = true;
          let tsensors = [];
            if(typeof row.sensors !== "undefined") {
                tsensors = row.sensors.filter( (srow, sidx) => {
                    let found = false;
                    let skey = sensorsLib.getSensorKey(srow);
                    filteredSensorsLocation[skey].forEach( (fsrow, fsidx) => {
                        if(idx === fsrow.loc_idx && sidx === fsrow.sensor_idx) {
                            found = true;
                        }
                    });
                    if(found === true) {
                        return true;
                    } else {
                        return false;
                    }
                });
                if(tsensors.length === 0) {
                    isValid = false;
                } else {
                    isValid = true;
                }
            } else {
                isValid = false;
            }
            
            if(isValid === false) {
              row.discarded = true;
              row.discardType = "noise";
              row.discardInfo = {};
              discardedPoints.push(row);
            }
            return row;
        });
        resolve(results);
    }).then( (results) => {
      return self.insertDiscardedPoints("noise", discardedPoints, null).then( (discardResults) => {
        return results;
      });
    });
};

/**
 * Compare if movement distance/speed found more than acceptable 
 * @param {array} previousPointArr - Previous Point Data
 * @param {array} currentPointArr - Current Point Data
 * @returns {boolean} 
 */
pointsFilters.prototype.getNoiseStatus = function(previousPointArr, currentPointArr) {
    let self = this;
    let distance = ( self.distanceBetween(previousPointArr, currentPointArr) / 1000 );
    let speed = distance / ( (currentPointArr[2] - previousPointArr[2]) / ( 1000 * 60 * 60 ) );
    
    //console.log("Distance = " + distance + " , Duration = " + ( (currentPointArr[2] - previousPointArr[2]) / 1000 ) + " , Speed = " + speed);
    if( speed > process.env.validSpeedLimit ) {
        return true;
    }
    
    return false;
};

/**
 * Get Distance in meters between two points
 * @param {array} point1 - First Point
 * @param {array} point2 - Second Point
 * @returns {number} 
 */
pointsFilters.prototype.distanceBetween = function(point1, point2) {
    const turfDistance = require("@turf/distance");
    
    let from = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [Number(point1[1]), Number(point1[0])]
      }
    };
    let to = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [Number(point2[1]), Number(point2[0])]
      }
    };
    
    let units = "kilometers";

    let points = {
      "type": "FeatureCollection",
      "features": [from, to]
    };

    return turfDistance(from, to, units) * 1000;
};

/**
 * Filter out duplicate points from data
 * Will remove duplicate points comes for same sensors in small duration (ex. 10 seconds ) 
 * and near by lat / long (ex. 5 meters range from initial point)
 * @param {object} data - Request Data
 * @returns {promise} Promise
 */
pointsFilters.prototype.filterDuplicates = function(data) {
    let self = this;
    let discardedSensors = [];
    this.sensorsArray = [];
    return new AppPromise((resolve, reject) => {
      let sensorsLocation = [];
      data = data.map( (row, idx) => {
        if(typeof row.sensors !== "undefined") {
          row.sensors.forEach( (srow, sidx) => {
              let found = false;
              let skey = sensorsLib.getSensorKey(srow);
              sensorsLocation.map( (slrow,slidx) => {
                if(slrow === row.pkid+'--'+skey) {
                  found = true;
                }
              });
              
              if(found === true) {
                row.sensors[sidx].discarded = true;
                row.sensors[sidx].discardType = "duplicate";
                row.sensors[sidx].discardInfo = {
                  "duptype" : "sensor"
                }
                discardedSensors.push(row);
              } else {
                sensorsLocation.push(row.pkid+'--'+skey);
              }
          });
          return row;
        } else {
          return row;
        }
      });
      
      resolve(data);
    }).then( (results) => {
      return self.insertDiscardedSensors("duplicate", discardedSensors, null).then( (discardResults) => {
        return results;
      });
    });
      
      /*return new AppPromise((resolve, reject) => { 
        let sensorsLocation = {};
        data.forEach( (row, idx) => {
          if(typeof row.sensors !== "undefined") {
            row.sensors.forEach( (srow, sidx) => {
                let skey = sensorsLib.getSensorKey(srow);
                if(typeof sensorsLocation[skey] === "undefined") {
                    sensorsLocation[skey] = [];
                }
                sensorsLocation[skey].push({
                    "loc_idx" : idx,
                    "sensor_idx" : sidx,
                    "lat" : row.lat,
                    "lon" : row.lon,
                    "ts" : row.ts
                });
            });
          }
        });
        
        let filteredSensorsLocation = {};
        for(let skey in sensorsLocation) {
            let sensorsLocationRow = sensorsLocation[skey];
            let flag = false;
            let lastAddress = [];
            filteredSensorsLocation[skey] = sensorsLocationRow.filter( (row, idx) => {
                //self.checkNoiseSensors(results, row, idx);
                if(lastAddress.length > 0) {
                    //flag  = self.getNoiseStatus(lastAddress, [row.lat, row.lon, row.ts]);
                    if( ( row.ts - lastAddress[2] )  < 10000 && self.distanceBetween([row.lat, row.lon], [lastAddress[0], lastAddress[1]]) < 10 ) {
                        flag = true;
                    }
                }
                lastAddress = [row.lat, row.lon, row.ts];
                return !flag;
            });
        }
        
        let results = data.map( (row, idx) => {
          let isValid = true;
          let tsensors = [];
          if(typeof row.sensors !== "undefined") {
            tsensors = row.sensors.filter( (srow, sidx) => {
                let found = false;
                let skey = sensorsLib.getSensorKey(srow);
                filteredSensorsLocation[skey].forEach( (fsrow, fsidx) => {
                    if(idx === fsrow.loc_idx && sidx === fsrow.sensor_idx) {
                        found = true;
                    }
                });
                if(found === true) {
                    return true;
                } else {
                    return false;
                }
            });
          }
          if(tsensors.length === 0) {
              isValid = false;
          } else {
              isValid = true;
          }
          
          if(isValid === false) {
            row.discarded = true;
            row.discardType = "duplicate";
            row.discardInfo = {}
            discardedPoints.push(row);
          }
          return row;
          
      });
      
      resolve(results);
        
    }).then( (results) => {
      return self.insertDiscardedPoints("duplicate", discardedPoints, null).then( (discardResults) => {
        return results;
      });
    });*/
};


/**
 * Filter out duplicate points from data
 * Will remove duplicate points comes for same sensors in small duration (ex. 10 seconds ) 
 * and near by lat / long (ex. 5 meters range from initial point)
 * @param {object} data - Request Data
 * @returns {promise} Promise
 */
pointsFilters.prototype.filterDuplicateInHistory = function(data) {
  let self = this;
  let discardedPoints = [];
  this.sensorsArray = [];
  pointsModel.setDbConnection(this.dbConnection);
  let promises = data.map( (row, idx) => {
    return pointsModel.findOne({"pkid": row.pkid}).then((exPoint) => {
      if(exPoint !== null && exPoint !== false) {
        row.discarded = true;
        row.discardType = "duplicate";
        row.discardInfo = {"duptype" : "history"};
        discardedPoints.push(row);
      }
    });  
  });
  
  return AppPromise.all(promises).then(() => {
    if(discardedPoints.length > 0) {
      return self.insertDiscardedPoints("duplicate", discardedPoints, null).then( (discardResults) => {
        return data;
      });
    } else {
      return new Promise((resolve) => {
        resolve(data);
      });
    }
  });
};

module.exports = pointsFilters;
