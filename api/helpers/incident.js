const incidentModel = require('../models/incident');
const taskHelper = require('./tasks');
const validator = require('../lib/validatorAsync');
const akUtils = require('../lib/utility');
const jsTypeChecker = require('javascript-type-checker');
const mongoose = require('mongoose');
const bluebirdPromise = require('bluebird');
const commonHelper = require('./common');
const moment = require('moment');
const clientHandler = require('../lib/clientHandler');
const currentUserHandler = require('../lib/currentUserHandler');
// const trackingHelper = require('./tracking');

const incidentService = function() {};

/**
 * Set client of the helper for use across all functions in the helper
 * 
 * @param {Object} clientObj
 * @return {Void}
 * 
 */
incidentService.prototype.setClient = function(clientObj) {
  this.client = clientObj;
};

/**
 * Set headers of the helper for use across all functions in the helper
 * 
 * @param {Object} clientObj
 * @return {Void}
 * 
 */
incidentService.prototype.setHeaders = function(headers) {
  this.headers = headers;
};

/**
 * Set headers of the helper for use across all functions in the helper
 * 
 * @param {Object} clientObj
 * @return {Void}
 * 
 */
incidentService.prototype.setConfigs = function() {
  return require('./configuration')
    .getConfigurations()
    .then(configs => {
      this.configs = configs;
    });
};


/**
 * Fetch a particular incident by providing its ID
 * 
 * @param {String} incidentId ID of the issue to Fetch
 * @return {Promise} Promise to represent the result of get operation.
 * 
 */
incidentService.prototype.getById = function(incidentId = 'default', platform = 'mobile') {
  if (!mongoose.Types.ObjectId.isValid(incidentId)) {
    return bluebirdPromise.reject();
  }

  let conditions = {
    _id: mongoose.Types.ObjectId(incidentId)
  };
  conditions = clientHandler.addClientFilterToConditions(conditions);

  return incidentModel
    .find(conditions)
    .exec()
    .then(result => {
      if (result.length > 0) {
        if (platform === 'web') {
          return bluebirdPromise.resolve(this.formatWebResponse(result[0]));
        } else if (platform === 'internal') {
          return bluebirdPromise.resolve(result[0]);
        }
        return bluebirdPromise.resolve(this.formatResponse(result[0]));
      }
      return bluebirdPromise.reject();
    });
};


/**
 * Performs response from DB operations to return as API response.
 * 
 * @param {Object} data Database operation result.
 * @param {Boolean} isDropdown Whether the APi is requesting a dropdown.
 * @return {Promise} formattedResponse Formatted Response
 * 
 */
incidentService.prototype.formatResponse = function(data, isDropdown = false) {
  const formattedResponse = {};
  if (!isDropdown) {
    formattedResponse.id = data._id;
    formattedResponse.code = data.code;
    formattedResponse.name = data.name;
    formattedResponse.sysDefined = data.sysDefined;
    formattedResponse.status = data.status;
    formattedResponse.updatedOn = data.updatedOn;
    formattedResponse.updatedBy = `${((data || {}).updatedBy || '').firstName} ${((data || {})
      .updatedBy || ''
    ).lastName}`;
    formattedResponse.client = data.client;
    formattedResponse.tags = data.tags;
    return formattedResponse;
  }
  formattedResponse.id = data._id;
  formattedResponse.name = data.name;
  return formattedResponse;
};

/**
 * Performs validations common in both update and save.
 * 
 * @param {Object} event Lambda Event
 * @return {Promise} Resolved promise with populated event if successful. Rejected promise with validation errors otherwise.
 * 
 */
incidentService.prototype.commonValidations = function(event) {
  return bluebirdPromise
    .all([
      bluebirdPromise.all([validator.required(event.body.did)]),
      bluebirdPromise.all([validator.required(event.body.ts)]),
      bluebirdPromise.all([validator.required(event.body.comment)])
    ])
    .then(result => {
      const validatorErrorsMap = {
        did: {
          index: 0,
          fieldName: 'did'
        },
        ts: {
          index: 1,
          fieldName: 'ts'
        },
        comment: {
          index: 2,
          fieldName: 'comment'
        }
      };
      const errors = akUtils.mapAndGetValidationErrors(result, validatorErrorsMap);
      if (errors) {
        return bluebirdPromise.reject(errors);
      }
      return bluebirdPromise.resolve();
    });
};


/**
 * Performs save-specific validations before performing common validations.
 * 
 * @param {Object} event Lambda Event
 * @return {Promise} Resolved promise with populated event if successful. Rejected promise with validation errors otherwise.
 * 
 */
incidentService.prototype.validateRequest = function(event) {
  return this.commonValidations(event)
    .then(() => {})
    .catch(errors => {
      if (!jsTypeChecker.isEmptyObject(errors)) {
        return bluebirdPromise.reject(
          akUtils.getObjectValues(akUtils.sortErrorsObject(errors, 'incidents'))
        );
      }
      return bluebirdPromise.resolve();
    });
};

/**
 * Save an issue
 * 
 * @param {Object} event Lambda Event
 * @return {Promise} Promise to represent the result of save operation.
 * 
 */
incidentService.prototype.save = function save(event) {
  akUtils.log(JSON.stringify(event));
  const deviceId = event.body.did;
  const timestamp = event.body.ts;
  // const lat = event.body.latitude;
  // const lon = event.body.longitude;
  // let conditions = { 'tour.id': mongoose.Types.ObjectId(tourId) };
  let conditions = {};
  conditions = clientHandler.addClientFilterToConditions(conditions);
  const commentObj = {};
  return taskHelper.getTourByDeviceInTime(deviceId, timestamp)
    .then(tourData => {
      // create comment object here
      commentObj.id = '';
      commentObj.data = event.body.comment;
      commentObj.images = event.body.images || [];
      commentObj.reporter = currentUserHandler.getCurrentUser();
      commentObj.reportedOn = new Date();
      
      // const updateParams = {};
      const incidentObj = new incidentModel(); // create a new instance of the  model
      incidentObj.tour = {};
      if(tourData !== null) {
        incidentObj.tour = {
          id: tourData._id,
          tourId: tourData.tourId,
          name: tourData.task.name + '-' + tourData.tourId
        }
      }
      incidentObj.status = 1;
      incidentObj.incidentStatus = 1;
      incidentObj.incidentType = '';
      incidentObj.createdOn = Date.now();

      incidentObj.createdBy = currentUserHandler.getCurrentUser();
      incidentObj.assignee = {};
      incidentObj.comments = [commentObj];
      incidentObj.updatedOn = Date.now();
      incidentObj.updatedBy = currentUserHandler.getCurrentUser();
      incidentObj.client = clientHandler.getClient();
      //updateParams.$set = incidentObj;
      //updateParams.$setOnInsert = { __v: 1 };
    
      return incidentObj
        .save();
    
    }).then( (incidentObj) => {
        commentObj.id = incidentObj.id;
        /******** update tour and tour action here ********/
        return taskHelper.updateTour(deviceId, timestamp, 'incident', commentObj, event.body);
        /******** update tour and tour action here ********/      
    }).then( () => {
      return bluebirdPromise.resolve(commentObj);
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * Performs response from DB operations to return as API response.
 * 
 * @param {Object} data Database operation result.
 * @return {Promise} formattedResponse Formatted Response
 * 
 */
incidentService.prototype.formatWebResponse = function(data) {
  const formattedResponse = data.comments
    .map(commentObj => ({
      author: commentObj.reporter || '',
      comment: commentObj.data || '',
      commentCreationDate: commentObj.reportedOn || '',
      images: commentObj.images || {}
    }))
    .reverse();
  return formattedResponse;
};

module.exports = new incidentService();
