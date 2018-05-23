const bluebirdPromise = require('bluebird');
const mongoose = require('mongoose');
const taskHelper = require('./tasks');
const userEntranceModel = require('../models/userEntrance');
const trackingEntranceModel = require('../models/trackingEntrance');
const clientHandler = require('../lib/clientHandler');
const currentUserHandler = require('../lib/currentUserHandler');
// const moment = require('moment');
const moment = require('moment-timezone');
const akUtils = require('../lib/utility');

class EmptrakHelper {}

/**
 * Query the database to fetch attributes on the basis of search parameters and other parameters
 * 
 * @param {Object} searchParams search filters
 * @param {Object} otherParams pagination, sorting etc other params.
 * @return {Promise} Promise to represent the result of get operation.
 * 
 */
EmptrakHelper.prototype.totalInTime = function(event) {
  const filters = {
    'user.code': currentUserHandler.getCurrentUser().uuid || '',
    $and: [
      { dt: { $gte: moment.utc().startOf('day') } },
      { dt: { $lt: moment.utc().endOf('day') } }
    ],
    type: 'location'
  };
  const tz = currentUserHandler.getCurrentUser().timezone || '';

  if ((event.queryStringParameters.date || '') !== '') {
    filters.$and = [
      {
        dt: {
          $gte: moment
            .tz(event.queryStringParameters.date, tz)
            .startOf('day')
            .utc()
        }
      },
      {
        dt: {
          $lt: moment
            .tz(event.queryStringParameters.date, tz)
            .endOf('day')
            .utc()
        }
      }
    ];
  }
  // filters.$or = [
  //   { exitTime: { $eq: null } },
  //   { exitTime: { $gte: moment.utc().startOf('day'), $lt: moment.utc().endOf('day') } }
  // ];

  return userEntranceModel
    .findOne(filters)
    .collation({
      locale: 'en_US',
      caseLevel: false
    })
    .exec()
    .then(result => {
      // console.log(result);
      const response = {};
      if (result) {
        response.location = result.location;
        response.firstIn = akUtils.convertDateToTimezone({
          dateToConvert: result.firstIn,
          timeZone: currentUserHandler.getCurrentUser().timezone,
          formatType: 'ta'
        });
        response.lastOut = akUtils.convertDateToTimezone({
          dateToConvert: result.lastOut,
          timeZone: currentUserHandler.getCurrentUser().timezone,
          formatType: 'ta'
        });
        response.interval = result.interval;
        response.dt = result.dt;
      }
      return response;
    });
};

/**
 * Query the database to fetch attributes on the basis of search parameters and other parameters
 * 
 * @param {Object} searchParams search filters
 * @param {Object} otherParams pagination, sorting etc other params.
 * @return {Promise} Promise to represent the result of get operation.
 * 
 */
EmptrakHelper.prototype.inOutDetails = function(event) {
  const filters = {
    'sensors.user.code': currentUserHandler.getCurrentUser().uuid || '', // '24132f0d-b965-4d2f-9752-012fcd189dc1',
    type: 'location'
  };
  const tz = currentUserHandler.getCurrentUser().timezone || '';
  if (mongoose.Types.ObjectId.isValid(event.queryStringParameters.location)) {
    filters['location.id'] = mongoose.Types.ObjectId(event.queryStringParameters.location);
  }
  if (event.queryStringParameters.date === 'today') {
    filters.entryTime = {
      $gte: moment
        .tz(tz)
        .startOf('day')
        .utc(),
      $lt: moment
        .tz(tz)
        .endOf('day')
        .utc()
    };
    // filters.$or = [
    //   { exitTime: { $eq: null } },
    //   { exitTime: { $gte: moment.utc().startOf('day'), $lt: moment.utc().endOf('day') } }
    // ];
  } else if (moment(event.queryStringParameters.date).isValid) {
    filters.entryTime = {
      $gte: moment
        .tz(event.queryStringParameters.date, tz)
        .startOf('day')
        .utc(),
      $lt: moment
        .tz(event.queryStringParameters.date, tz)
        .endOf('day')
        .utc()
    };
  }
  return trackingEntranceModel
    .find(filters)
    .collation({
      locale: 'en_US',
      caseLevel: false
    })
    .exec()
    .then(result => {
      const list = [];
      if (result) {
        for (const i in result) {
          if (result[i]) {
            const temp = {};
            // temp.device = result[i].device;
            // temp.location = result[i].location;
            temp.name = (result[i].location || {}).name;
            temp.type = result[i].type;
            temp.entryTime = akUtils.convertDateToTimezone({
              dateToConvert: result[i].entryTime,
              timeZone: currentUserHandler.getCurrentUser().timezone,
              formatType: 'ta'
            });
            temp.exitTime = akUtils.convertDateToTimezone({
              dateToConvert: result[i].exitTime,
              timeZone: currentUserHandler.getCurrentUser().timezone,
              formatType: 'ta'
            });
            temp.interval = result[i].interval;
            list.push(temp);
          }
        }
      }
      return list;
    });
};

/**
 * Query the database to fetch attributes on the basis of search parameters and other parameters
 * 
 * @param {Object} searchParams search filters
 * @param {Object} otherParams pagination, sorting etc other params.
 * @return {Promise} Promise to represent the result of get operation.
 * 
 */
EmptrakHelper.prototype.inOutHistory = function(event) {
  const filters = {
    'user.code': currentUserHandler.getCurrentUser().uuid || '', // '24132f0d-b965-4d2f-9752-012fcd189dc1',
    type: 'location'
  };
  const tz = currentUserHandler.getCurrentUser().timezone || '';
  if (event.queryStringParameters.fromDate) {
    filters.firstIn = {
      $gte: moment
        .tz(event.queryStringParameters.fromDate, tz)
        .startOf('day')
        .utc()
    };
  }

  if (event.queryStringParameters.toDate) {
    filters.lastOut = {
      $lt: moment
        .tz(event.queryStringParameters.toDate, tz)
        .endOf('day')
        .utc()
    };
  }
  // console.log(filters);
  return userEntranceModel
    .find(filters)
    .collation({
      locale: 'en_US',
      caseLevel: false
    })
    .exec()
    .then(result => {
      const list = [];
      if (result) {
        for (const i in result) {
          if (result[i]) {
            const temp = {};
            // temp.device = result[i].device;
            // temp.location = result[i].location;
            temp.name = (result[i].location || {}).name;
            temp.type = result[i].type;
            temp.firstIn = akUtils.convertDateToTimezone({
              dateToConvert: result[i].firstIn,
              timeZone: currentUserHandler.getCurrentUser().timezone,
              formatType: 'ta'
            });
            temp.lastOut = akUtils.convertDateToTimezone({
              dateToConvert: result[i].lastOut,
              timeZone: currentUserHandler.getCurrentUser().timezone,
              formatType: 'ta'
            });
            temp.interval = result[i].interval;
            temp.date = akUtils.convertDateToTimezone({
              dateToConvert: result[i].dt,
              timeZone: currentUserHandler.getCurrentUser().timezone,
              formatType: 'd'
            });
            list.push(temp);
          }
        }
      }
      return list;
    })
    .catch(e => {
      // console.log(e);
    });
};

module.exports = new EmptrakHelper();
