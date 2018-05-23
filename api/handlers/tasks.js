const commonHelper = require('../helpers/common');
const bluebirdPromise = require('bluebird');
const messages = require('../mappings/messagestring.json');
const mongoose = require('mongoose');
const taskHelper = require('../helpers/tasks');
const akResponse = require('../lib/respones');
const clientHandler = require('../lib/clientHandler');
const currentUserHandler = require('../lib/currentUserHandler');
const incidentHelper = require('../helpers/incident');
const reportHelper = require('../helpers/report');

/**
 * Get task List
 *  
 * @param {Object} event event passed to the lambda
 * @param {Object} context context passed to the lambda
 * @callback callback Lambda Callback
 */
module.exports.getTasks = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    const parsedEvent = commonHelper.parseLambdaEvent(event);

    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));

    commonHelper.connectToDb(dbURI);

    bluebirdPromise
      .all([
        taskHelper.get(
          taskHelper.getFilterParams(parsedEvent),
          taskHelper.getExtraParams(parsedEvent)
        ),
        taskHelper.count(taskHelper.getFilterParams(parsedEvent))
      ])
      .then(resultObj => {
        const response = akResponse.listSuccess(resultObj, messages.ATTRIBUTE_LIST);

        mongoose.disconnect();
        callback(null, response);
      })
      .catch(() => {
        // TODO : please remove 404 from catch block as it is a valid success response. catch should only catught exceptions and return with status in range of 500
        const response = akResponse.noDataFound(messages.NO_RECORDS, messages.NO_RECORDS);
        mongoose.disconnect();
        callback(null, response);
      });
  });
};

/**
 * Get Single task for specified ID
 * 
 * @param {Object} event event passed to the lambda
 * @param {Object} context context passed to the lambda
 * @callback callback Lambda Callback
 */
module.exports.getTaskById = (event, context, callback) => {
  // console.log(event);
  commonHelper.decryptDbURI().then(dbURI => {
    const parsedEvent = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));

    commonHelper.connectToDb(dbURI);
    taskHelper.setHeaders(parsedEvent.headers);

    taskHelper
      .getById(parsedEvent.pathParameters.id)
      .then(result => {
        const response = akResponse.success(result, messages.ATTRIBUTE_FETCH_SUCCESS, messages.OK);

        mongoose.disconnect();
        callback(null, response);
      })
      .catch(() => {
        // TODO : please remove 404 from catch block as it is a valid success response. catch should only catught exceptions and return with status in range of 500
        const response = akResponse.noDataFound(messages.NO_RECORDS, messages.NO_RECORDS);
        mongoose.disconnect();
        callback(null, response);
      });
  });
};

/**
 * Update an task.
 * 
 * @param {Object} event event passed to the lambda
 * @param {Object} context context passed to the lambda
 * @callback callback Lambda Callback
 */

module.exports.updateTask = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    const parsedEvent = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));

    commonHelper.connectToDb(dbURI);
    taskHelper
      .validateUpdate(parsedEvent)
      .then(() => {
        taskHelper
          .update(parsedEvent)
          .then(() => taskHelper.getById(parsedEvent.pathParameters.id, true))
          .then(result => {
            const response = akResponse.success(
              result,
              messages.ATTRIBUTE_UPDATE_SUCCESS,
              messages.OK
            );

            mongoose.disconnect();
            callback(null, response);
          })
          .catch(() => {
            // TODO : please remove 301 from catch block as it is a not valid success response. catch should only catught exceptions and return with status in range of 500
            const response = akResponse.notModified(
              messages.ATTRIBUTE_UPDATE_FAIL,
              messages.ATTRIBUTE_UPDATE_FAIL
            );

            mongoose.disconnect();
            callback(null, response);
          });
      })
      .catch(errors => {
        // TODO : please remove 422 from catch block as it is a not valid success response. catch should only catught exceptions and return with status in range of 500
        const response = akResponse.validationFailed(
          errors,
          messages.VALIDATION_ERRORS_OCCOURED,
          messages.VALIDATION_ERROR
        );

        mongoose.disconnect();
        callback(null, response);
      });
  });
};

/**
 * Save an task.
 * 
 * @param {Object} event event passed to the lambda
 * @param {Object} context context passed to the lambda
 * @callback callback Lambda Callback
 */
module.exports.saveTask = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    const parsedEvent = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));

    commonHelper.connectToDb(dbURI);

    taskHelper
      .validateRequest(parsedEvent)
      .then(() => {
        taskHelper
          .save(parsedEvent)
          .then(result => taskHelper.getById(result._id, true))
          .then(result => {
            const response = akResponse.created(
              result,
              messages.ATTRIBUTE_SAVE_SUCCESS,
              messages.OK
            );

            mongoose.disconnect();
            callback(null, response);
          })
          .catch(() => {
            // TODO : please remove 400 from catch block as it is a not valid response it will be send if Json format is not valid. catch should only catught exceptions and return with status in range of 500
            const response = akResponse.badRequest(
              messages.ATTRIBUTE_CREATE_FAIL,
              messages.ATTRIBUTE_CREATE_FAIL
            );

            mongoose.disconnect();
            callback(null, response);
          });
      })
      .catch(errors => {
        // TODO : please remove 422 from catch block as it is a not valid success response. catch should only catught exceptions and return with status in range of 500
        const response = akResponse.validationFailed(
          errors,
          messages.VALIDATION_ERRORS_OCCOURED,
          messages.VALIDATION_ERROR
        );
        mongoose.disconnect();
        callback(null, response);
      });
  });
};

/**
 * action on tour
 * 
 * @param {Object} event event passed to the lambda
 * @param {Object} context context passed to the lambda
 * @callback callback Lambda Callback
 */

module.exports.startTour = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    const parsedEvent = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));

    commonHelper.connectToDb(dbURI);
    taskHelper
      .startTour(parsedEvent)
      .then(result => {
        const response = akResponse.success(
          result,
          'Tour started successfully',
          messages.OK
        );
        mongoose.disconnect();
        callback(null, response);
      })
      .catch((err) => {
        // TODO : please remove 301 from catch block as it is a not valid success response. catch should only catught exceptions and return with status in range of 500
        const response = akResponse.notModified(
          messages.ATTRIBUTE_UPDATE_FAIL,
          messages.ATTRIBUTE_UPDATE_FAIL
        );

        mongoose.disconnect();
        callback(null, response);
      });
        
  });
};

/**
 * end tour
 * 
 * @param {Object} event event passed to the lambda
 * @param {Object} context context passed to the lambda
 * @callback callback Lambda Callback
 */

module.exports.endTour = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    const parsedEvent = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));

    commonHelper.connectToDb(dbURI);
    taskHelper
      .endTour(parsedEvent)
      .then(result => {
        const response = akResponse.success(
          result,
          'Tour ended successfully',
          messages.OK
        );
        mongoose.disconnect();
        callback(null, response);
      })
      .catch(() => {
        // TODO : please remove 301 from catch block as it is a not valid success response. catch should only catught exceptions and return with status in range of 500
        const response = akResponse.notModified(
          messages.ATTRIBUTE_UPDATE_FAIL,
          messages.ATTRIBUTE_UPDATE_FAIL
        );

        mongoose.disconnect();
        callback(null, response);
      });
        
  });
};

/**
 * scan 
 * 
 * @param {Object} event event passed to the lambda
 * @param {Object} context context passed to the lambda
 * @callback callback Lambda Callback
 */

module.exports.scanLocation = (event, context, callback) => {
  console.log(JSON.stringify(event));
  commonHelper.decryptDbURI().then(dbURI => {
    const parsedEvent = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));

    commonHelper.connectToDb(dbURI);
    taskHelper
      .scanLocation(parsedEvent)
      .then(result => {
        const response = akResponse.success(
          result,
          'Scan done successfully',
          messages.OK
        );
        mongoose.disconnect();
        callback(null, response);
      })
      .catch(() => {
        // TODO : please remove 301 from catch block as it is a not valid success response. catch should only catught exceptions and return with status in range of 500
        const response = akResponse.notModified(
          messages.ATTRIBUTE_UPDATE_FAIL,
          messages.ATTRIBUTE_UPDATE_FAIL
        );

        mongoose.disconnect();
        callback(null, response);
      });
        
  });
}

/**
 * Save an incident
 * 
 * @param {Object} event event passed to the lambda
 * @param {Object} context context passed to the lambda
 * @callback callback Lambda Callback
 */
module.exports.saveIncident = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    event = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(event));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(event));
    const incidentHelper = require('../helpers/incident');
    const mongoose = require('mongoose');
    commonHelper.connectToDb(dbURI);
    incidentHelper
      .validateRequest(event)
      .then(() => {
        incidentHelper
          .save(event)
          .then(result => {
            const response = {
              statusCode: 200,
              headers: {
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({
                code: 200,
                status: 1,
                message: 'success',
                data: {
                  incidentResponse: result
                },
                _links: {
                  self: {
                    href: ''
                  }
                }
              })
            };
            mongoose.disconnect();
            callback(null, response);
          })
          .catch(error => {
            // console.log(error);
            const response = {
              statusCode: 400,
              headers: {
                'Access-Control-Allow-Origin': '*'
              },
              body: JSON.stringify({
                code: 400,
                message: messages.ATTRIBUTE_CREATE_FAIL,
                description: messages.ATTRIBUTE_CREATE_FAIL,
                data: {}
              })
            };

            mongoose.disconnect();
            callback(null, response);
          });
      })
      .catch(errors => {
        // console.log(errors);
        const response = {
          statusCode: 422,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            code: 422,
            message: messages.VALIDATION_ERROR,
            description: messages.VALIDATION_ERRORS_OCCOURED,
            data: errors
          })
        };
        mongoose.disconnect();
        callback(null, response);
      });
  });
};

/**
 * Get Single incident for specified ID
 * 
 * @param {Object} event event passed to the lambda
 * @param {Object} context context passed to the lambda
 * @callback callback Lambda Callback
 */
module.exports.getIncidentDetails = (event, context, callback) => {
  
  commonHelper.decryptDbURI().then(dbURI => {
    event = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(event));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(event));
    const mongoose = require('mongoose');
    commonHelper.connectToDb(dbURI);
    const incidentHelper = require('../helpers/incident');
    incidentHelper.setHeaders(event.headers);
    
    incidentHelper
      .getById(event.pathParameters.id, 'web')
      .then(result => {
        const response = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            code: 200,
            message: 'Ok',
            description: messages.INCIDENT_FETCH_SUCCESS,
            data: result
          })
        };
        mongoose.disconnect();
        callback(null, response);
      })
      .catch(() => {
        const response = {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            code: 404,
            message: messages.NO_RECORD_FOUND,
            description: messages.NO_RECORD_FOUND,
            data: {}
          })
        };
        mongoose.disconnect();
        callback(null, response);
      });
  });
};


/**
 * Get Single tour for specified ID
 * 
 * @param {Object} event event passed to the lambda
 * @param {Object} context context passed to the lambda
 * @callback callback Lambda Callback
 */
module.exports.getTour = (event, context, callback) => {
  // console.log(event);
  commonHelper.decryptDbURI().then(dbURI => {
    let result = {};
    const parsedEvent = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));

    commonHelper.connectToDb(dbURI);
    taskHelper.setHeaders(parsedEvent.headers);
    let tourId = parsedEvent.pathParameters.id;
    taskHelper
      .getByTourId(tourId)
      .then(tourResult => {
        result = tourResult;
        return taskHelper.getById(tourResult.task.id)
      }).then( (taskResult) => {
        result.locations = {};
        result.locations = taskResult.locations;
        return taskHelper.getScannedLocations(tourId);
      }).then( (scannedLocations) => {
        result.scannedLocations = {};
        result.scannedLocations = scannedLocations
        mongoose.disconnect();
        const response = akResponse.success(result, messages.ATTRIBUTE_FETCH_SUCCESS, messages.OK);
        callback(null, response);
      })
      .catch(() => {
        // TODO : please remove 404 from catch block as it is a valid success response. catch should only catught exceptions and return with status in range of 500
        const response = akResponse.noDataFound(messages.NO_RECORDS, messages.NO_RECORDS);
        mongoose.disconnect();
        callback(null, response);
      });
  });
};


/**
 * Get tour list
 * 
 * @param {Object} event event passed to the lambda
 * @param {Object} context context passed to the lambda
 * @callback callback Lambda Callback
 */
module.exports.getTours = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    event = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(event));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(event));
    const mongoose = require('mongoose');
    commonHelper.connectToDb(dbURI);
    //  filter: user who created tour
    // event.queryStringParameters.updatedBy = currentUserHandler.currentUser.uuid;
    event.queryStringParameters.deviceId = event.headers.deviceId;
    // event.queryStringParameters.forAdmin = true;

    reportHelper
      .getTours(event)
      .then(resultObj => {
        const response = akResponse.listSuccess(resultObj, messages.ATTRIBUTE_LIST);
        mongoose.disconnect();
        callback(null, response);
      })
      .catch(err => {
        console.log(err);
        const response = this.nodataResponse();
        mongoose.disconnect();
        callback(null, response);
      });
  });
};

/**
 * Get tour list
 * 
 * @param {Object} event event passed to the lambda
 * @param {Object} context context passed to the lambda
 * @callback callback Lambda Callback
 */
module.exports.getTourByDevice = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    event = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(event));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(event));
    const mongoose = require('mongoose');
    commonHelper.connectToDb(dbURI);
    
    taskHelper
      .getTourByDevice(event)
      .then(result => {
        const response = akResponse.success(result, messages.ATTRIBUTE_FETCH_SUCCESS, messages.OK);
        mongoose.disconnect();
        callback(null, response);
      })
      .catch((errors) => {
        const response = akResponse.validationFailed(
          errors,
          messages.VALIDATION_ERRORS_OCCOURED,
          messages.VALIDATION_ERROR
        );

        mongoose.disconnect();
        callback(null, response);
      });
  });
};

module.exports.nodataResponse = () => ({
  statusCode: 404,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({
    code: 404,
    message: messages.NO_RECORDS,
    description: messages.NO_RECORDS,
    data: []
  })
});
