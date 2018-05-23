/*jshint esversion: 6 */
/*jshint node: true */
'use strict';

const AppPromise = require("bluebird");

//const DbLib = require("../lib/db");
//const db = new DbLib();

const LocationLib = require("./location");
var locationLib = new LocationLib();    

const UtilityLib = require("../../lib/utility");
const utility = new UtilityLib();
     
const ZoneLib = require("./zone");
var zoneLib = new ZoneLib();    

const SensorsLib = require("./sensors");
var sensorsLib = new SensorsLib();

const PointsFiltersLib = require("./pointsFilters");
var pointsFiltersLib = new PointsFiltersLib();

const PointsModel = require("../../models/points");
var pointsModel = new PointsModel();    

const RawPointsModel = require("../../models/rawpoints");
var rawPointsModel = new RawPointsModel();    

const RawLocationsModel = require("../../models/rawlocations");
var rawLocationsModel = new RawLocationsModel();    

const RawSensorsModel = require("../../models/rawsensors");
var rawSensorsModel = new RawSensorsModel();    

const PointsThingsModel = require("../../models/pointsThings");
var pointsThingsModel = new PointsThingsModel();    

const SensorLocationModel = require("../../models/sensorLocation");
var sensorLocationModel = new SensorLocationModel();    

const LatencyTrackingModel = require("../../models/latencyTracking");
var latencyTrackingModel = new LatencyTrackingModel();    

//const DbLib = require("../../lib/db");
//const db = new DbLib();

const KinesisLib = require("../../lib/aws/kinesis");
var kinesisLib = new KinesisLib();

/**
 * Process.Helper
 * @constructor
 */
var process = function() {
    this.dbConnection = {};
};

/**
 * Parse input packet & start filter/processing
 * @param {object} dbObj - DB Connection Object
 * @returns {promise} Promise
 */
process.prototype.prepareData = function(dbObj, locationData, trLbdTm) {
  utility.debug("PREPARE DATA")
  this.dbConnection = dbObj;
  let self = this;
  let filteredData = [];
  //utility.debug('000')
  //utility.debug(JSON.stringify(locationData));
  //locationData[0].data.data[0].sensors[0].uuid = "DDDDD";
  //locationData[0].data.data[0].sensors[1].maj = 1;
  //locationData[0].data.data[0].sensors[1].min = 72;
  
  const promises = locationData.map((locationD) => {
    let data = locationD.data.data;
    const metadata = locationD.metadata;
    
    return AppPromise.join (
      self.insertRawPoints(data, metadata),
      self.insertRawSensors(data, metadata),
      self.filterLocations(data),
      (rawPointsResults, rawLocationsResults, filterResults) => {
        
        const filteredDataPromises = filterResults.map((row) => {
          
          const invalidPoints = row.filter((vdata) => {
            vdata.locStrmTm = new Date(metadata.approximateArrivalTimestamp * 1000);
            vdata.trLbdTm = new Date(trLbdTm);
            vdata.ptLbdTm = new Date();
            
            delete vdata.meta;
            return vdata.discarded;
          });
          const validPoints = row.filter((vdata) => {
            vdata.locStrmTm = new Date(metadata.approximateArrivalTimestamp * 1000);
            vdata.trLbdTm = new Date(trLbdTm);
            vdata.ptLbdTm = new Date();
            
            return !vdata.discarded;
          });
          //utility.debug('XX ------------------------------- ')
          //utility.debug(invalidPoints)
          //utility.debug(validPoints)
          
          return AppPromise.join(
            self.insertPoints(invalidPoints),
            self.insertPointThings(invalidPoints)      
          ).then((vresults) => {
            validPoints.meta = metadata;
            return validPoints;
          });
        });
        return AppPromise.all(filteredDataPromises).then((results) => {
          return results;
        });
      });
  });

  let batchApiFilter = {
    locations: [],
    devices: [],
    things: []
  };
  
  return AppPromise.all(promises).then((filteredData) => {
    let filteredDataA = [];
    filteredData.forEach((row) => {
      row.forEach((row1) => {
        row1.forEach((row2) => {
          //utility.debug(row2);
          filteredDataA.push(row2);
        });
      });
    });
    
    filteredDataA.forEach((row) => {
      const tempLoc = batchApiFilter.locations.filter((row1) => {
        if(row1.latitude === row.lat && row1.longitude === row.lon) {
          return true;
        }
        return false;
      });
      
      if(tempLoc.length === 0) {
        batchApiFilter.locations.push({latitude: row.lat,longitude: row.lon});
      }
      
      if(batchApiFilter.devices.indexOf(row.did) === -1) {
        batchApiFilter.devices.push(row.did);
      }
      
      // const tempThings = [];
      batchApiFilter = sensorsLib.prepareSensorFilterForApi(batchApiFilter, row.sensors);
      
      /*const tempThings = batchApiFilter.things.filter((row1) => {
        if(row1.type === row.type && row1.uuid === row.uuid && row1.major === row.maj && row1.minor === row.min) {
          return true;
        }
        return false;
      });
      
      if(tempThings.length === 0) {
        row.sensors.forEach((srow) => {
          batchApiFilter.things.push({
            type: srow.type, 
            uuid: srow.uuid,
            major: srow.maj,
            minor: srow.min
          });
        });
      }*/
    });
    
    //utility.debug(JSON.stringify(batchApiFilter));
    return locationLib.getApiData(batchApiFilter).then( (apiData) => {
      return self.preparePoints(filteredDataA, apiData);
    });
  });
};

/**
 * Process request point list
 * @param {array} request - point list
 * @returns {promise} Promise
 */
process.prototype.filterLocations = function(data) {
  const self = this;
  const promises = data.map((row) => {
    return self.filterPoints(data);
  });
  return AppPromise.all(promises);
}
/**
 * Process request point list
 * @param {array} request - point list
 * @returns {promise} Promise
 */
process.prototype.preparePoints = function(request, apiData) {
  utility.debug("PREPARE POINT")
    let recordsToInsert = [];
    let self = this;
    let points = [];
    let promises = request.map( (row, idx) => {
        if(typeof request[idx].lat == "undefined") {
          request[idx].lat = null;
        }
        
        if(typeof request[idx].lon == "undefined") {
          request[idx].lon = null;
        }
        
        let point = {
            "projectid" : request[idx].projectid,
            "clientid" : request[idx].clientid,
            "did" : request[idx].did,
            "alt" : request[idx].alt,
            "spd" : request[idx].spd,
            "pkid" : request[idx].pkid,
            "dir" : request[idx].dir,
            "acc" : request[idx].acc,
            "prv" : request[idx].prv,
            "ts" : request[idx].ts,
            "location" : {
                "type": "Point",
                "coordinates" : [
                    request[idx].lon,
                    request[idx].lat,
                ]
            },
            "sensors" : request[idx].sensors,
            "locationdetails" : [],
            "tsdt" : new Date(request[idx].ts),
            "dt" : new Date(),
            "hit" : new Date(request[idx].ht),
            "locStrmTm" : request[idx].locStrmTm,
            "trLbdTm" : request[idx].trLbdTm,
            "ptLbdTm" : request[idx].ptLbdTm,
            "discarded" : request[idx].discarded,
            "discardType" : request[idx].discardType,
            "discardInfo" : request[idx].discardInfo,
            
            "ts" : request[idx].ts,
        };
        
        let locationData = apiData.locations[request[idx].lat + '--' + request[idx].lon];
        if(locationData.status !== false) {
          point.locationdetails[0] = {
            "locationId" : locationData.data.id,
            "name" : locationData.data.name,
            "city" : locationData.data.city,
            "state" : locationData.data.state,
            "address" : locationData.data.address,
            "country" : locationData.data.country,
            "zipcode" : locationData.data.zipcode,
            "lat" : locationData.data.latitude,
            "lon" : locationData.data.longitude            
          };
        } else {
          point.locationdetails[0] = {};
        }
        
        let deviceData = apiData.devices[request[idx].did];
        if(deviceData.status !== false) {
          
          point.deviceInfo = {
            "id" : deviceData.data.id,
            "name" : deviceData.data.name,
            "code" : deviceData.data.code,
            "type" : deviceData.data.type,
            "appName" : deviceData.data.appName,
            "manufacturer" : deviceData.data.manufacturer,
            "os" : deviceData.data.os,
            "model" : deviceData.data.model,
            "version" : deviceData.data.version,
            "appVersion" : deviceData.data.appVersion
          };
          
          if(deviceData.data.zoneData.length > 0) {
            point.locationdetails[1] = {
              "locationId" : deviceData.data.zoneData[0].location.id,
              "code" : deviceData.data.zoneData[0].location.code,
              "name" : deviceData.data.zoneData[0].location.name,
              "city" : deviceData.data.zoneData[0].location.city,
              "state" : deviceData.data.zoneData[0].location.state,
              "address" : deviceData.data.zoneData[0].location.address,
              "country" : deviceData.data.zoneData[0].location.country,
              "zipcode" : deviceData.data.zoneData[0].location.zipcode,
              "zones" : [
                  {
                    "id" : deviceData.data.zoneData[0].id,
                    "code" : deviceData.data.zoneData[0].code,
                    "name" : deviceData.data.zoneData[0].name,
                    "detectType" : "sensor",
                    "thing" : {
                      "id" : deviceData.data.id,
                      "name" : deviceData.data.name,
                      "code" : deviceData.data.code,
                    }
                    //"detectObjectId" : value.data[0].things[0].id,
                  }
              ],
              "floor" : [
                  {
                      "id" : deviceData.data.zoneData[0].floor.id,
                      "code" : deviceData.data.zoneData[0].floor.code,
                      "name" : deviceData.data.zoneData[0].floor.name    //"detectObjectId" : value[0].things[0].id,
                  }
              ]
            }
          }
        } else {
          point.deviceInfo = {};
        }
        
        request[idx].sensors.map((serow, seidx) => {
          let thingsData = sensorsLib.getThingFromApiData(apiData.things, serow);
          // let thingsData = apiData.things['beacon' + '--' + serow.uuid + '--' + serow.maj + '--' + serow.min];
          if(typeof thingsData !== "undefined") {
            point.sensors[seidx].id = thingsData.id;
            point.sensors[seidx].code = thingsData.code;
            point.sensors[seidx].name = thingsData.name;
            if(thingsData.id === null) {
              point.sensors[seidx].discarded =  true;
            } else {
              point.sensors[seidx].discarded =  false;
            }
            
            if(thingsData.zoneData.length > 0) {
              point.locationdetails.push({
                "locationId" : thingsData.zoneData[0].location.id,
                "code" : thingsData.zoneData[0].location.code,
                "name" : thingsData.zoneData[0].location.name,
                "city" : thingsData.zoneData[0].location.city,
                "state" : thingsData.zoneData[0].location.state,
                "address" : thingsData.zoneData[0].location.address,
                "country" : thingsData.zoneData[0].location.country,
                "zipcode" : thingsData.zoneData[0].location.zipcode,
                "zones" : [
                    {
                      "id" : thingsData.zoneData[0].id,
                      "code" : thingsData.zoneData[0].code,
                      "name" : thingsData.zoneData[0].name,
                      "detectType" : "sensor",
                      "thing" : {
                        "id" : thingsData.id,
                        "code" : thingsData.code,
                        "name" : thingsData.name
                      }
                      //"detectObjectId" : value.data[0].things[0].id,
                    }
                ],
                "floor" : [
                    {
                        "id" : thingsData.zoneData[0].floor.id,
                        "code" : thingsData.zoneData[0].floor.code,
                        "name" : thingsData.zoneData[0].floor.name    //"detectObjectId" : value[0].things[0].id,
                    }
                ]
              });
            }
          } else {
            point.sensors[seidx].id = null;
            point.sensors[seidx].code = null;
            point.sensors[seidx].name = null;
            point.sensors[seidx].discarded =  true;
          }
        });
        points.push(point);
    });
    //utility.debug(points);
    //utility.debug(JSON.stringify(points));
    return self.processLocation(points);
    
};

/**
 * Filter request point list
 * @param {array} data - point list
 * @returns {promise} Promise
 */
process.prototype.filterPoints = function(data) {
  utility.debug("IN FILTER POINTS");
  let self = this;
  pointsFiltersLib.setDbConnection(this.dbConnection);
  return pointsFiltersLib.sortByTime(data).then((data) => {
      return self.applyFilters(data);
  });
};

/**
 * Apply filters
 * @param {array} data - point list
 * @returns {promise} Promise
 */
process.prototype.applyFilters = function(data) {
  utility.debug("IN FILTER Data");
    return pointsFiltersLib.filterInvalidData(data).then( (results) => {
      utility.debug("IN FILTER History Duplicate");
      //utility.debug(results);
       return pointsFiltersLib.filterDuplicateInHistory(results); 
    }).then( (results) => {
       utility.debug("IN FILTER DUPL");
        return pointsFiltersLib.filterDuplicates(results);
    } ).then( (results) => {
      utility.debug("IN FILTER NOISE");
      return pointsFiltersLib.filterNoise(results);
    })
    .then( (results) => {
        return results;
    });
};

process.prototype.processLocation = function(points) {
  const self = this;
  return self.processLocationEntryExit(points).then((results) => {
    return self.processZoneEntryExit(results);
  }).then((results) => {
    return AppPromise.join(
      this.insertPoints(results),
      this.insertPointThings(results),
      this.pushtoBLStream(results)
    );
  });
}

/**
 * Insert process raw point data
 * @param {object} data - raw data
 * @returns {promise} Promise
 */
process.prototype.insertRawPoints = function(data, metadata) {
    let self = this;
    let records = {"data" : data};
    return new AppPromise((resolve, reject) => {
        records.meta = metadata;
        //records.ts = Number(data.ts);
        records.dt = new Date();
        utility.debug("IN RAW POINTS");
        rawPointsModel.setDbConnection(self.dbConnection);
        rawPointsModel.save(records);
        resolve(data);
    });
};

/**
 * Insert process raw point data
 * @param {object} data - raw data
 * @returns {promise} Promise
 */
process.prototype.insertRawSensors = function(data, metadata) {
    let self = this;
    let records = {"data" : data};
    rawSensorsModel.setDbConnection(self.dbConnection);
    
    utility.debug("IN RAW LOCATION");
    //utility.debug(data.constructor);
    let sensorsData = [];
    if(data.constructor === Array) {
      let promises = data.map( (row, idx) => {
        row.meta = metadata;
        row.dt = new Date();
        row.tsdt = new Date(row.ts);
        if(typeof row.sensors !== "undefined" && row.sensors.constructor === Array) {
          let promisesSn = row.sensors.map( (rowsn, idxsn) => {
            let updrow = {};
            for(let skey in row ) {
              if(skey !== "sensors") {
                  updrow[skey] = row[skey];
              }
            }
            // let updrow = rowsn;
            updrow.sensors = rowsn;
            
            sensorsData.push(updrow);
            
          });
        } else {
          sensorsData.push(row);
        }
      });
      
      return rawSensorsModel.insertMany(sensorsData);
      
      // return AppPromise.all(promises);
    } else {
      data.meta = metadata;
      data.dt = new Date();
      return rawSensorsModel.save(data);
      
      /*return new AppPromise((resolve, reject) => {
        resolve(null);
      });*/
    }
};

/**
 * Insert process point data
 * @param {object} point - point data
 * @returns {promise} Promise
 */
process.prototype.insertPoints = function(points) {
  let self = this;
  utility.debug("IN INSERT POINT")
  
  return new AppPromise((resolve, reject) => {
    if(points.length === 0) {
      resolve(points);
    } else {
      pointsModel.setDbConnection(self.dbConnection);
      pointsModel.insertMany(points);
      resolve(points);  
    }
    
  });
};

/**
 * Insert process point -> sensor data
 * @param {object} point - point -> sensor data
 * @returns {promise} Promise
 */
process.prototype.insertPointThings = function(points) {
  let self = this;
  utility.debug(" =============== IN POINT THINGS ===========================")
  // utility.debug(data);
  
  let pointsThings = [];
  points.forEach((point) => {
    if(typeof point.sensors !== "undefined" && point.sensors.constructor === Array) {
      point.sensors.forEach( (row, idx) => {
        let pointrow = {};
        for(let k in point) {
          if(k == "sensors") {
            pointrow[k] = row;
          } else {
            pointrow[k] = point[k];
          }
        }
        delete pointrow._id;
        pointsThings.push(pointrow);
      });
    }
  });
  if(pointsThings.length === 0) {
    return new AppPromise((resolve) => {
      resolve(points);
    });
  }
  pointsThingsModel.setDbConnection(self.dbConnection);
  return pointsThingsModel.insertMany(pointsThings);
};

/**
 * Insert process point -> sensor data
 * @param {object} point - point -> sensor data
 * @returns {promise} Promise
 */
process.prototype.saveLatencyTracking = function(data) {
  let self = this;
  utility.debug("IN INSERT LATC")
  return new AppPromise((resolve, reject) => {
      latencyTrackingModel.setDbConnection(self.dbConnection);
      latencyTrackingModel.save({
        "pkid" : data.pkid,
        "tsdt" : data.tsdt,
        "dt" : data.dt,
        "hit" : data.hit,
        "locStrmTm" : data.locStrmTm,
        "trLbdTm" : data.trLbdTm,
        "ptLbdTm" : data.ptLbdTm
      });
      resolve(true);
  });
}



/**
 * Insert process point -> sensor data
 * @param {object} point - point -> sensor data
 * @returns {promise} Promise
 */
process.prototype.pushtoBLStream = function(points) {
  const process = require("process")
  
  let pointsThings = [];
  points.forEach((point) => {
    if(typeof point.sensors !== "undefined" && point.sensors.constructor === Array) {
      point.sensors.forEach( (row, idx) => {
        let pointrow = {};
        for(let k in point) {
          if(k == "sensors") {
            pointrow[k] = row;
          } else {
            pointrow[k] = point[k];
          }
        }
        delete pointrow._id;
        pointsThings.push(pointrow);
      });
    }
  });
  
  const promises = pointsThings.map((row) => {
    if(row.discarded === true || row.sensors.discarded === true) {
      return false;
    } else {
      return kinesisLib.publish(process.env.blStreamName, process.env.blStreamPartitionKey, row, () => {
          return row;
          // return {};
      });  
    }
  });
  
  return AppPromise.all( promises);
  
};


/**
 * Process request point object
 * @param {object} data - point object
 * @returns {promise} Promise
 */
process.prototype.processLocationEntryExit = function(data) {
  const self = this;
  const apromises = data.map((results) => {
    results.locationEntry = false;
    results.locationExit = false;
    if(!(typeof results.sensors !== "undefined" && results.sensors.constructor === Array)) {
      return new AppPromise((resolve) => {
        resolve(results)
      })
    } else {
      sensorLocationModel.setDbConnection(self.dbConnection);
      //return new AppPromise( (resolve) => {
        let promises = results.sensors.map( (row, idx) => {
            return sensorLocationModel.findOne({"sensors.code": row.code, "type": "location"}).then((sensRes) => {
              if(sensRes === null) {
                if(results.locationdetails[0].locationId !== null) {
                  results.locationEntry = true;
                }
              } else {
                utility.debug("IN LOCATION ENTRY/EXIT");
                // utility.debug(JSON.stringify(sensRes));
                if(sensRes.locationdetails !== null && results.locationdetails[0].locationId === null) {
                  results.locationExit = true;
                } else if(sensRes.locationdetails === null && results.locationdetails[0].locationId !== null) {
                  results.locationEntry = true;
                } else if(sensRes.locationdetails !== null && results.locationdetails[0].locationId !== null && sensRes.locationdetails.locationId !== results.locationdetails[0].locationId) {
                  results.locationEntry = true;
                }
              }
              let loc;
              if(results.locationExit === true) {
                loc = null;
              } else if(results.locationEntry === true) {
                loc = results.locationdetails[0];
              }
              
              if(results.locationExit === true || results.locationEntry === true) {
                return sensorLocationModel.save({"sensors.code": row.code, "type": "location"}, {
                  "sensors" : row,
                  "type": "location",
                  "locationdetails" : loc
                }).then(() => {
                  return results;
                });
              } else {
                return results;
              }
            })
        });
        
        return AppPromise.all( promises).then(() => {
          return(results);
        });
      //});
    }
  });
  
  return AppPromise.all( apromises).then((aresults) => {
    return aresults;
  });
}

/**
 * Process request point object
 * @param {object} data - point object
 * @returns {promise} Promise
 */
process.prototype.processZoneEntryExit = function(data) {
  const self = this;
  const apromises = data.map((results) => {
    
      results.zoneEntry = false;
      results.zoneExit = false;
      if(!(typeof results.sensors !== "undefined" && results.sensors.constructor === Array)) {
        return new AppPromise((resolve) => {
          resolve(results)
        })
      } else {
        sensorLocationModel = new SensorLocationModel();
        sensorLocationModel.setDbConnection(self.dbConnection);
        //return new AppPromise( (resolve) => {
        let promises = results.sensors.map( (row, idx) => {
          return sensorLocationModel.findOne({"sensors.code": row.code, "type": "zone"}).then((sensRes) => {
            if(sensRes === null) {
              if(typeof results.locationdetails[1] !== "undefined" && typeof results.locationdetails[1].zones[0] !== 'undefined') {
                results.zoneEntry = true;
              }
            } else {
              if(sensRes.locationdetails !== null && typeof sensRes.locationdetails.zones !== "undefined" && sensRes.locationdetails.zones.constructor === Array && sensRes.locationdetails.zones[0].id !== null) {
                if(typeof results.locationdetails[1] === "undefined") {
                  results.zoneExit = true;
                }
              } else if( sensRes.locationdetails === null && typeof results.locationdetails[1] !== "undefined" && results.locationdetails[1].zones.constructor === Array && results.locationdetails[1].zones[0].id !== null) {
                results.zoneEntry = true;
              } else if(sensRes.locationdetails !== null && typeof sensRes.locationdetails.zones !== "undefined" && sensRes.locationdetails.zones.constructor === Array && results.locationdetails[1].zones.constructor === Array && typeof results.locationdetails !== "undefined" && sensRes.locationdetails.zones[0].id !== results.locationdetails[1].zones[0].id) {
                results.zoneEntry = true;
              }
            }
            let loc;
            if(results.zoneExit === true) {
              loc = null;
            } else if(results.zoneEntry) {
              loc = results.locationdetails[1];
            }
            let dataToSave = {};
            if(results.zoneExit === true || results.zoneEntry === true) {
              dataToSave = {
                "sensors" : row,
                "type": "zone",
                "locationdetails" : loc
              };
            } else {
              let defLoc = {};
              if(sensRes !== null) {
                defLoc = sensRes.locationdetails;
              }
              dataToSave = {
                "sensors" : row,
                "type": "zone",
                "locationdetails" : defLoc
              };
            }
            
            return sensorLocationModel.save({"sensors.code": row.code, "type": "zone"}, dataToSave).then(() => {
              return results;
            });
          })
        });
        
        return AppPromise.all( promises).then(() => {
          return(results);
        });
      //});
        
      }
  });
  
  return AppPromise.all( apromises).then((aresults) => {
    return aresults;
  });
}

/**
 * Process request point object
 * @param {object} data - point object
 * @returns {promise} Promise
 */
process.prototype.processLocationOld = function(data) {
  utility.debug("IN PROCE LOCA");
    let self = this;
    let sensorsKeyArray = {};
    let deviceArray = {};
    //utility.debug("-------------||--------------------");
    //utility.debug(data);
    
    if(data.discarded === true) {
      return AppPromise.join(
          self.insertPoints(data),
          self.insertPointThings(data)      )
    } else {
      return AppPromise.join(
        sensorsLib.getDevice(data.did),
        sensorsLib.getSensor(data.sensors),
        locationLib.getLocation(data),
        (deviceResults, sensorsResults, locationResults) => {
            utility.debug("===== IN DEVICE PACKET ====");
            
            data.deviceInfo = {};
            if(deviceResults !== false) {
              deviceArray = deviceResults;
              data.deviceInfo = {
                "id" : deviceResults.id,
                "name" : deviceResults.name,
                "code" : deviceResults.code,
                "type" : deviceResults.type,
                "appName" : deviceResults.appName,
                "manufacturer" : deviceResults.manufacturer,
                "os" : deviceResults.os,
                "model" : deviceResults.model,
                "version" : deviceResults.version,
                "appVersion" : deviceResults.appVersion
              };
              
              data.deviceInfo.attrs = [];
              
              deviceResults.attributes.forEach((row, idx) => {
                if(row.name != "") {
                  //data.deviceInfo.attrs.push({row.name : row.value});
                }
                
              });
            }
            
            utility.debug("===== IN SENSOR PACKET ====");
            //utility.debug(sensorsResults);
            if(sensorsResults !== false) {
              sensorsResults.forEach((row, idx) => {
                if(row.id === null) {
                  row.discarded =  true;
                } else {
                  row.discarded =  false;
                }
                sensorsResults[idx] = row;
                sensorsKeyArray[row.code] = {
                  id : row.id,
                  code : row.code,
                  name : row.name,
                  discarded : row.discarded
                }
              });
              data.sensors = sensorsResults;
            }
            utility.debug("===== IN KNOWN PACKET ====");
            //utility.debug(results[1]);
            data.locationdetails.push(locationResults);
            //let locationdetails = results[1].locationdetails;
            
            utility.debug("===== IN ZONE DEVICE PACKET ====");
            //utility.debug(results[3]);
            //utility.debug(results);
            
            return data;
        }
    )
    .then( (data) => { 
        //utility.debug(results);
        if(data.locationdetails[0].locationId !== null) {
          return AppPromise.join(
            zoneLib.getZoneFromDevice(data),
            zoneLib.getZoneFromStaticBeacon(data),
            (deviceZoneResults, beaconZoneResults) => {
              
              if(deviceZoneResults !== null) {
                //utility.debug(sensorsKeyArray);
                
                for(let sensorKey in deviceZoneResults) {
                  //utility.debug(sensorKey);
                  let value = deviceZoneResults[sensorKey];
                    //utility.debug(value);
                    if(value.length > 0) {
                      data.locationdetails.push({
                          "locationId" : value[0].location.id,
                          "code" : value[0].location.code,
                          "name" : value[0].location.name,
                          "city" : value[0].location.city,
                          "state" : value[0].location.state,
                          "address" : value[0].location.address,
                          "country" : value[0].location.country,
                          "zipcode" : value[0].location.zipcode,
                          "zones" : [
                              {
                                  "id" : value[0].id,
                                  "code" : value[0].code,
                                  "name" : value[0].name,
                                  "detectType" : "device",
                                  "thing" : {
                                    "id" : deviceArray.id,
                                    "code" : deviceArray.code,
                                    "name" : deviceArray.name
                                  }
                                  //"detectObjectId" : value[0].things[0].id,
                              }
                          ],
                          "floor" : [
                              {
                                  "id" : value[0].floor.id,
                                  "code" : value[0].floor.code,
                                  "name" : value[0].floor.name    //"detectObjectId" : value[0].things[0].id,
                              }
                          ]
                      });  
                    }
                }  
              }
              
              
              if(beaconZoneResults !== null) {
                for(let sensorKey in beaconZoneResults) {
                  let value = beaconZoneResults[sensorKey];
                
                    //utility.debug(value);
                    if(value.length > 0) {
                      data.locationdetails.push({
                        "locationId" : value[0].location.id,
                        "code" : value[0].location.code,
                        "name" : value[0].location.name,
                        "city" : value[0].location.city,
                        "state" : value[0].location.state,
                        "address" : value[0].location.address,
                        "country" : value[0].location.country,
                        "zipcode" : value[0].location.zipcode,
                        "zones" : [
                            {
                              "id" : value[0].id,
                              "code" : value[0].code,
                              "name" : value[0].name,
                              "detectType" : "sensor",
                              "thing" : {
                                "id" : sensorsKeyArray[sensorKey].id,
                                "code" : sensorsKeyArray[sensorKey].code,
                                "name" : sensorsKeyArray[sensorKey].name
                              }
                              //"detectObjectId" : value.data[0].things[0].id,
                            }
                        ],
                        "floor" : [
                            {
                                "id" : value[0].floor.id,
                                "code" : value[0].floor.code,
                                "name" : value[0].floor.name    //"detectObjectId" : value[0].things[0].id,
                            }
                        ]
                      });
                    }
                }
              }
              
              return data;
              
            }
          );
        } else {
          return new AppPromise((resolve) => {
            resolve(data);
          });
        }
        
    } ).
    then( (results) => {
      results.locationEntry = false;
      results.locationExit = false;
      if(!(typeof results.sensors !== "undefined" && results.sensors.constructor === Array)) {
        return new AppPromise((resolve) => {
          resolve(results)
        })
      } else {
        sensorLocationModel.setDbConnection(self.dbConnection);
        //return new AppPromise( (resolve) => {
          let promises = results.sensors.map( (row, idx) => {
              return sensorLocationModel.findOne({"sensors.code": row.code, "type": "location"}).then((sensRes) => {
                if(sensRes === null) {
                  if(results.locationdetails[0].locationId !== null) {
                    results.locationEntry = true;
                  }
                } else {
                  utility.debug("IN LOCATION ENTRY/EXIT");
                  // utility.debug(JSON.stringify(sensRes));
                  if(sensRes.locationdetails !== null && results.locationdetails[0].locationId === null) {
                    results.locationExit = true;
                  } else if(sensRes.locationdetails === null && results.locationdetails[0].locationId !== null) {
                    results.locationEntry = true;
                  } else if(sensRes.locationdetails !== null && results.locationdetails[0].locationId !== null && sensRes.locationdetails.locationId !== results.locationdetails[0].locationId) {
                    results.locationEntry = true;
                  }
                }
                let loc;
                if(results.locationExit === true) {
                  loc = null;
                } else if(results.locationEntry === true) {
                  loc = results.locationdetails[0];
                }
                
                if(results.locationExit === true || results.locationEntry === true) {
                  return sensorLocationModel.save({"sensors.code": row.code, "type": "location"}, {
                    "sensors" : row,
                    "type": "location",
                    "locationdetails" : loc
                  }).then(() => {
                    return results;
                  });
                } else {
                  return results;
                }
              })
          });
          
          return AppPromise.all( promises).then(() => {
            return(results);
          });
        //});
        
      }
    }).
    then( (results) => {
      results.zoneEntry = false;
      results.zoneExit = false;
      if(!(typeof results.sensors !== "undefined" && results.sensors.constructor === Array)) {
        return new AppPromise((resolve) => {
          resolve(results)
        })
      } else {
        sensorLocationModel = new SensorLocationModel();
        sensorLocationModel.setDbConnection(self.dbConnection);
        //return new AppPromise( (resolve) => {
        let promises = results.sensors.map( (row, idx) => {
          return sensorLocationModel.findOne({"sensors.code": row.code, "type": "zone"}).then((sensRes) => {
            if(sensRes === null) {
              if(typeof results.locationdetails[1] !== "undefined" && typeof results.locationdetails[1].zones[0] !== 'undefined') {
                results.zoneEntry = true;
              }
            } else {
              if(sensRes.locationdetails !== null && typeof sensRes.locationdetails.zones !== "undefined" && sensRes.locationdetails.zones.constructor === Array && sensRes.locationdetails.zones[0].id !== null) {
                if(typeof results.locationdetails[1] === "undefined") {
                  results.zoneExit = true;
                }
              } else if( sensRes.locationdetails === null && typeof results.locationdetails[1] !== "undefined" && results.locationdetails[1].zones.constructor === Array && results.locationdetails[1].zones[0].id !== null) {
                results.zoneEntry = true;
              } else if(sensRes.locationdetails !== null && typeof sensRes.locationdetails.zones !== "undefined" && sensRes.locationdetails.zones.constructor === Array && results.locationdetails[1].zones.constructor === Array && typeof results.locationdetails !== "undefined" && sensRes.locationdetails.zones[0].id !== results.locationdetails[1].zones[0].id) {
                results.zoneEntry = true;
              }
            }
            let loc;
            if(results.zoneExit === true) {
              loc = null;
            } else if(results.zoneEntry) {
              loc = results.locationdetails[1];
            }
            let dataToSave = {};
            if(results.zoneExit === true || results.zoneEntry === true) {
              dataToSave = {
                "sensors" : row,
                "type": "zone",
                "locationdetails" : loc
              };
            } else {
              let defLoc = {};
              if(sensRes !== null) {
                defLoc = sensRes.locationdetails;
              }
              dataToSave = {
                "sensors" : row,
                "type": "zone",
                "locationdetails" : defLoc
              };
            }
            
            return sensorLocationModel.save({"sensors.code": row.code, "type": "zone"}, dataToSave).then(() => {
              return results;
            });
          })
        });
        
        return AppPromise.all( promises).then(() => {
          return(results);
        });
      //});
        
      }
    }).
    then( (results) => {
        return AppPromise.join(
            self.insertPoints(results),
            self.insertPointThings(results)
            // self.pushtoBLStream(results)
        )
    } ).then((results) => {
        utility.debug("FINALLY");
        //utility.debug(results);
    });
    
  }
  
};


/**
 * Destructor function
 * @returns void
 */
process.prototype.done = function() {
    this.dbConnection.close();
}



module.exports = process;
