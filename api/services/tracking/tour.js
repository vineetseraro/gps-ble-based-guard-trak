const mongoose = require('mongoose');
const trackingmodel = require('./../../models/tracking');
const tourModel = require('./../../models/tours');
const tourActionModel = require('./../../models/tourActions');
const currentUserHandler = require('../../lib/currentUserHandler');
const clientHandler = require('../../lib/clientHandler');
const akUtils = require('../../lib/utility');
var tourService = function () {
  
};

tourService.prototype.saveTourScan = function (pointData) {
  return trackingmodel.findOne({'pkid' : pointData.pkid, 
  'sensors.id' : mongoose.Types.ObjectId(pointData.sensors.id)}).then((trackingData) => {
    if(trackingData !== null && trackingData.location.addresses.zones !== 'undefined' && trackingData.location.addresses.zones.id !== 'undefined') {
      let conditions = {
        'device.id' : mongoose.Types.ObjectId(trackingData.deviceInfo.id),
        'from' : {$lt: new Date(trackingData.ts)},
        'to' : {$gt: new Date(trackingData.ts)}
      };
      
      return tourModel.findOne(conditions).sort({'_id' : -1}).exec().then((tourData) => {
        // If no previous record exists, Insert new 
        const tourActionObj = new tourActionModel();
        
        tourActionObj.attendee = {};
        tourActionObj.task = {};
        tourActionObj.tour = {};
        
        if(tourData !== null) {
          tourActionObj.attendee = currentUserHandler.getCurrentUser();
          tourActionObj.task = tourData.task;
          tourActionObj.tour = {
            id: tourData.id,
            tourId: tourData.tourId,
            code: tourData.code,
            name: tourData.name
          };
        } 
        
        tourActionObj.action = {
          actionType: 'Scan',
          actionDate: new Date(trackingData.ts),
        };
        
        tourActionObj.device = {
          id: mongoose.Types.ObjectId(trackingData.deviceInfo.id),
          code: trackingData.deviceInfo.code,
          name: trackingData.deviceInfo.name
        };
        
        tourActionObj.location = {
          id : trackingData.location.addresses.id,
          code : trackingData.location.addresses.code,
          name : trackingData.location.addresses.name,
          address : [],
          floor : {
            id : trackingData.location.addresses.floor.id,
            code : trackingData.location.addresses.floor.code,
            name : trackingData.location.addresses.floor.name,
            zone : {
              id : trackingData.location.addresses.zones.id,
              code : trackingData.location.addresses.zones.code,
              name : trackingData.location.addresses.zones.name
            }
          }
        };
        
        tourActionObj.additionalInfo = {
          scan: {
            sensor: {
              id: trackingData.sensors.id,
              code: trackingData.sensors.code,
              name: trackingData.sensors.name
            },
            device: {
              id : trackingData.deviceInfo.id,
              name : trackingData.deviceInfo.name,
              code : trackingData.deviceInfo.code,
              type : trackingData.deviceInfo.type,
              appName : trackingData.deviceInfo.appName,
              manufacturer : trackingData.deviceInfo.manufacturer,
              os : trackingData.deviceInfo.os,
              model : trackingData.deviceInfo.model,
              version : trackingData.deviceInfo.version,
              appVersion : trackingData.deviceInfo.appVersion
            },
            pkid: trackingData.pkid
          }
        };
        
        tourActionObj.updatedOn = Date.now();
        tourActionObj.updatedBy = currentUserHandler.getCurrentUser();
        tourActionObj.client = clientHandler.getClient();

        return tourActionObj.save().then((tourActionData) => {
          const conditions = {
            _id: mongoose.Types.ObjectId(tourActionData.tour.id)
          };
          const updateParams = {
            $push: {actions: {
              id: mongoose.Types.ObjectId(tourActionData._id),
              action: tourActionData.action
            }},
            $inc: {
              __v: 1
            }
          };
          return tourModel
            .findOneAndUpdate(conditions, updateParams, {
              upsert: false,
              new: true
            })
            .exec()
            .catch(err => {
              akUtils.log(err);
            });
        });
      });
    } else {
      return true;
    }
  });
};


module.exports = new tourService();
