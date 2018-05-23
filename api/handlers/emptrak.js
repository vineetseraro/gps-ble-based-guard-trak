const commonHelper = require('../helpers/common');
const bluebirdPromise = require('bluebird');
const messages = require('../mappings/messagestring.json');
const mongoose = require('mongoose');
const akResponse = require('../lib/respones');
const clientHandler = require('../lib/clientHandler');
const currentUserHandler = require('../lib/currentUserHandler');

const taskHelper = require('../helpers/tasks');
const empHelper = require('../helpers/emptrak');
const akUtils = require('../lib/utility');

module.exports.emptrakDashboard = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    const parsedEvent = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));

    commonHelper.connectToDb(dbURI);
    if (parsedEvent.queryStringParameters.date) {
      parsedEvent.queryStringParameters.startTo = akUtils.addDaysToDate(
        parsedEvent.queryStringParameters.date,
        1
      );

      parsedEvent.queryStringParameters.endFrom = akUtils.addDaysToDate(
        parsedEvent.queryStringParameters.date,
        0
      );
    }

    parsedEvent.queryStringParameters.sort = parsedEvent.queryStringParameters.sort || 'from';
    parsedEvent.queryStringParameters.limit = parsedEvent.queryStringParameters.limit || '10000';
    bluebirdPromise
      .all([
        taskHelper
          .get(taskHelper.getFilterParams(parsedEvent), taskHelper.getExtraParams(parsedEvent))
          .catch(() => []),
        empHelper.totalInTime(event)
      ])
      .then(resultObj => {
        const response = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            code: 200,
            message: 'Success',
            description: 'Dashboard List',
            data: {
              totalIn: resultObj[1].interval || 0,
              tasks: resultObj[0]
            }
          })
        };
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

module.exports.myTasks = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    const parsedEvent = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));
    if (parsedEvent.queryStringParameters.date) {
      parsedEvent.queryStringParameters.startFrom = akUtils.addDaysToDate(
        parsedEvent.queryStringParameters.date,
        0
      );

      parsedEvent.queryStringParameters.startTo = akUtils.addDaysToDate(
        parsedEvent.queryStringParameters.date,
        1
      );
    }
    parsedEvent.queryStringParameters.sort = parsedEvent.queryStringParameters.sort || 'from';
    parsedEvent.queryStringParameters.limit = parsedEvent.queryStringParameters.limit || '10000';

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

module.exports.totalInTime = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    const parsedEvent = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));
    commonHelper.connectToDb(dbURI);

    empHelper
      .totalInTime(parsedEvent)
      .then(resultObj => {
        const response = akResponse.success(resultObj, messages.ATTRIBUTE_LIST);

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

module.exports.inOutDetails = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    const parsedEvent = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));
    commonHelper.connectToDb(dbURI);

    empHelper
      .inOutDetails(parsedEvent)
      .then(resultObj => {
        const response = akResponse.success(resultObj, messages.ATTRIBUTE_LIST);

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

module.exports.inOutHistory = (event, context, callback) => {
  commonHelper.decryptDbURI().then(dbURI => {
    const parsedEvent = commonHelper.parseLambdaEvent(event);
    clientHandler.setClient(clientHandler.getClientObject(parsedEvent));
    currentUserHandler.setCurrentUser(currentUserHandler.getCurrentUserObject(parsedEvent));
    commonHelper.connectToDb(dbURI);
    empHelper
      .inOutHistory(parsedEvent)
      .then(resultObj => {
        const response = akResponse.success(resultObj, messages.ATTRIBUTE_LIST);

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
