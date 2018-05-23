const userTrackingModel = require('./../../models/userTracking');
const userEntranceModel = require('./../../models/userEntrance');
const userModel = require('./../../models/users');
const akUtils = require('./../../lib/utility');
const bluebirdPromise = require('bluebird');
const mongoose = require('mongoose');
const commonTrackingService = require('./common.js');
var userTrackingService = function() {};

/**
 * Get User information from tracking data
 * 
 * @param {Object} pointData
 * @return {Promise} Promise to represent the product for tracking data
 * 
 */
userTrackingService.prototype.getUserData = function(pointData) {
  return userModel.findOne({
    //'things' : { '$elemMatch' : { 'code' : pointData.sensors.code } }
    'things.code': pointData.sensors.code
  });
};

userTrackingService.prototype.saveUserTracking = function(pointData, currentLocation) {
  akUtils.log('IN UPD USER/TR');
  return this.getUserData(pointData).then(userObj => {
    if (userObj === null || typeof userObj._id === 'undefined') {
      // akUtils.log('No valid user attached.');
      return;
    }
    const self = this;
    return bluebirdPromise.join(
      self.updateUserLocation(userObj, pointData, currentLocation),
      commonTrackingService.updateTrackingLocation(
        'user',
        {
          id: mongoose.Types.ObjectId(userObj._id),
          code: userObj.sub,
          name: [userObj.given_name, userObj.family_name].join(' ')
        },
        pointData,
        currentLocation
      ),
      commonTrackingService.pushToIot(
        'user',
        {
          id: mongoose.Types.ObjectId(userObj._id),
          code: userObj.sub,
          name: [userObj.given_name, userObj.family_name].join(' ')
        },
        pointData,
        currentLocation,
        process.env.userTrackingIotTopic
      ),
      self.updateUserLocationEntrance(userObj, pointData, currentLocation),
      self.updateUserZoneEntrance(userObj, pointData, currentLocation),
      (userResults, trackingResults, iotResults) => {}
    );
  });
};

/**
 * Update User tracking information from tracking data
 * 
 * @param {Object} userObj User Data
 * @param {Object} pointData Tracking Data
 * @param {Object} currenLocation Location Object
 * @return {Promise} Promise after saving
 * 
 */
userTrackingService.prototype.updateUserLocation = function(userObj, pointData, currentLocation) {
  const conditions = { 'user.id': userObj._id };
  let lastLocation = null;
  let lastTrackingObj = null;
  return userTrackingModel
    .findOne(conditions)
    .then(userTrackingObj => {
      if (userTrackingObj !== null) {
        lastTrackingObj = userTrackingObj;
        lastLocation = userTrackingObj.currentLocation;
      }
      return lastLocation;
    })
    .then(() => {
      if (
        lastTrackingObj === null ||
        lastTrackingObj.lastTracked.getTime() < new Date(pointData.ts).getTime()
      ) {
        let lastMoved = new Date(pointData.ts);
        if (lastTrackingObj !== null) {
          lastMoved = lastTrackingObj.lastMoved;
          if (currentLocation.id !== null && lastLocation.id !== null) {
            if (lastLocation.id.toString() !== currentLocation.id.toString()) {
              lastMoved = new Date(pointData.ts);
            }
          } else if (
            (lastLocation.id === null && currentLocation.id !== null) ||
            (lastLocation.id !== null && currentLocation.id === null)
          ) {
            lastMoved = new Date(pointData.ts);
          } else {
            if (
              lastLocation.address[0].value !== currentLocation.address[0].value ||
              lastLocation.address[1].value !== currentLocation.address[1].value
            ) {
              lastMoved = new Date(pointData.ts);
            }
          }
        } else {
          lastMoved = new Date(pointData.ts);
        }

        const updateParams = {
          $set: {
            user: {
              id: userObj._id,
              code: userObj.sub,
              name: [userObj.given_name, userObj.family_name].join(' ')
            },
            client: pointData.client,
            pointId: pointData._id,
            currentLocation: currentLocation,
            device: pointData.deviceInfo,
            sensor: {
              id: pointData.sensors.id,
              code: pointData.sensors.code,
              name: pointData.sensors.name,
              rng: pointData.sensors.rng
            },
            lastTracked: new Date(pointData.ts),
            lastMoved: lastMoved
          }
        };
        // akUtils.log(updateParams);
        return userTrackingModel.findOneAndUpdate(conditions, updateParams, {
          upsert: true,
          new: true
        });

        //update(conditions, updateParams)
        //.exec();
      } else {
        return false;
      }
    });
};

/**
 * Update User entrance information from tracking data
 * 
 * @param {Object} userObj User Data
 * @param {Object} pointData Tracking Data
 * @param {Object} currenLocation Location Object
 * @return {Promise} Promise after saving
 * 
 */
userTrackingService.prototype.updateUserLocationEntrance = function(
  userObj,
  pointData,
  currentLocation
) {
  akUtils.log('IN USER LOC ENTR');
  let userLocation = null;

  if (typeof userObj.locations !== 'undefined') {
    if (typeof userObj.locations[0] !== 'undefined') {
      userLocation = userObj.locations[0];
    }
  }

  if (userLocation !== null) {
    if (pointData.locationEntry === true || pointData.locationExit === true) {
      if (pointData.locationEntry === true && currentLocation.id + '' !== userLocation.id + '') {
        return false;
      }

      const tsdt = new Date(pointData.ts);
      tsdt.setHours(12, 0, 0, 0);
      // let dstart = tsdt.toUTCString();

      const conditions = {
        'user.id': userObj._id,
        type: 'location',
        // 'location.id': currentLocation.id,
        dt: tsdt
      };
      akUtils.log(JSON.stringify(conditions));
      return userEntranceModel.findOne(conditions).then(userEntranceObj => {
        if (userEntranceObj === null && pointData.locationEntry === true) {
          akUtils.log('IN USER LOC C ');
          userEntranceObj = new userEntranceModel();
          userEntranceObj.type = 'location';
          userEntranceObj.user = {
            id: userObj._id,
            code: userObj.sub,
            name: userObj.given_name + ' ' + userObj.family_name
          };
          userEntranceObj.location = {
            id: currentLocation.id,
            code: currentLocation.code,
            name: currentLocation.name,
            zone: {},
            floor: {}
          };
          userEntranceObj.dt = tsdt;
          userEntranceObj.firstIn = new Date(pointData.ts);
          userEntranceObj.lastOut = null;
          userEntranceObj.interval = 0;

          /* return userEntranceObj.findOneAndUpdate(conditions, userEntranceObj, {
            upsert: true,
            new: true
          })
          .exec();  */
          return userEntranceObj.save();
        } else if (userEntranceObj !== null && pointData.locationExit === true) {
          akUtils.log('IN USER LOC D ');
          // console.log(userEntranceObj.lastOut)
          // console.log(pointData.ts)

          if (
            userEntranceObj.lastOut === null ||
            (userEntranceObj.lastOut !== null && userEntranceObj.lastOut.getTime() < pointData.ts)
          ) {
            akUtils.log('IN USER LOC E ');

            if (userEntranceObj.location.id + '' !== userLocation.id + '') {
              return false;
            }

            userEntranceObj.lastOut = new Date(pointData.ts);
            userEntranceObj.interval =
              userEntranceObj.lastOut.getTime() - userEntranceObj.firstIn.getTime();
            return userEntranceObj.save();
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  } else {
    return false;
  }
};

/**
 * Update User entrance information from tracking data
 * 
 * @param {Object} userObj User Data
 * @param {Object} pointData Tracking Data
 * @param {Object} currenLocation Location Object
 * @return {Promise} Promise after saving
 * 
 */
userTrackingService.prototype.updateUserZoneEntrance = function(
  userObj,
  pointData,
  currentLocation
) {
  akUtils.log('IN USER ZONE ENTR');
  let userLocation = null;
  if (typeof userObj.locations !== 'undefined') {
    if (typeof userObj.locations[0] !== 'undefined') {
      if (
        typeof userObj.locations[0].floor !== 'undefined' &&
        typeof userObj.locations[0].floor.zone !== 'undefined'
      ) {
        userLocation = userObj.locations[0];
      }
    }
  }

  if (userLocation !== null) {
    if (pointData.zoneEntry === true || pointData.zoneExit === true) {
      if (
        pointData.zoneEntry === true &&
        currentLocation.zones.id + '' !== userLocation.floor.zone.id + ''
      ) {
        return false;
      }

      akUtils.log('IN USER ZONE A ');
      const tsdt = new Date(pointData.ts);
      tsdt.setHours(12, 0, 0, 0);

      const conditions = {
        'user.id': userObj._id,
        type: 'zone',
        // 'location.zone.id': currentLocation.zones.id,
        dt: tsdt
      };
      akUtils.log(JSON.stringify(conditions));
      return userEntranceModel.findOne(conditions).then(userEntranceObj => {
        // currentLocation.zones.id + '' === userLocation.floor.zone.id + ''
        akUtils.log('IN USER ZONE B ');
        if (userEntranceObj === null && pointData.zoneEntry === true) {
          akUtils.log('IN USER ZONE C ');
          userEntranceObj = new userEntranceModel();
          userEntranceObj.type = 'zone';
          userEntranceObj.user = {
            id: userObj._id,
            code: userObj.sub,
            name: userObj.given_name + ' ' + userObj.family_name
          };
          userEntranceObj.location = {
            id: currentLocation.id,
            code: currentLocation.code,
            name: currentLocation.name,
            zone: {
              id: currentLocation.zones.id,
              code: currentLocation.zones.code,
              name: currentLocation.zones.name
            },
            floor: {
              id: currentLocation.floor.id,
              code: currentLocation.floor.code,
              name: currentLocation.floor.name
            }
          };
          userEntranceObj.dt = tsdt;
          userEntranceObj.firstIn = new Date(pointData.ts);
          userEntranceObj.lastOut = null;
          userEntranceObj.interval = 0;

          return userEntranceObj.save();
          /*return userEntranceObj.findOneAndUpdate(conditions, userEntranceObj, {
            upsert: true,
            new: true
          })
          .exec();  */
        } else if (userEntranceObj !== null && pointData.zoneExit === true) {
          akUtils.log('IN USER ZONE D ');
          // console.log(userEntranceObj.lastOut)
          // console.log(pointData.ts)

          if (
            userEntranceObj.lastOut === null ||
            (userEntranceObj.lastOut !== null && userEntranceObj.lastOut.getTime() < pointData.ts)
          ) {
            if (userEntranceObj.location.zone.id + '' !== userLocation.floor.zone.id + '') {
              return false;
            }

            akUtils.log('IN USER ZONE E ');
            userEntranceObj.lastOut = new Date(pointData.ts);
            userEntranceObj.interval =
              userEntranceObj.lastOut.getTime() - userEntranceObj.firstIn.getTime();
            return userEntranceObj.save();
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    } else {
      return false;
    }
  } else {
    return false;
  }
};

module.exports = new userTrackingService();
