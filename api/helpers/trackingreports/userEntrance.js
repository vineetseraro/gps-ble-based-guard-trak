// const trackingModel = require('../../models/tracking');
const trackingEntranceModel = require('../../models/trackingEntrance');
const userEntranceModel = require('../../models/userEntrance');
const mongoose = require('mongoose');
const moment = require('moment');
const bluebirdPromise = require('bluebird');
// const commonHelper = require('./../common');
// const userModel = require('../../models/users');
// const clientHandler = require('../../lib/clientHandler');
const akUtils = require('../../lib/utility');

class userEntranceService {
  constructor() {
    this.preFilter = { 'user.id': { $exists: true } };
  }

  userEntrance(event) {
    const key = 'userEntrance';
    return bluebirdPromise.all([
      this.userEntranceData(this.getFilterParams(event, key), this.getExtraParams(event, key), key),
      this.userEntranceCount(this.getFilterParams(event, key))
    ]);
  }

  userEntranceData(filterParams, otherParams, key) {
    // preFilter = {'sensors.user.id': {$exists: true} };
    // console.log(JSON.stringify(filterParams));
    return (
      userEntranceModel
        .find(filterParams)
        .sort(otherParams.sort)
        .skip(otherParams.pageParams.offset)
        .limit(otherParams.pageParams.limit)
        .exec()
        // .then(result => result.map(x => this.formatResponse(x, key)))
        .then(result => {
          // // console.log(result);
          if (!result.length) {
            return bluebirdPromise.reject();
          }
          return bluebirdPromise.resolve(result);
        })
    );
  }

  userEntranceCount(filterParams, key) {
    return userEntranceModel
      .find(filterParams)
      .exec()
      .then(result => 
        //console.log(result);
         result.length
      );
  }

  userEntranceFilters(event) {
    const filters = this.preFilter;
    if (event.queryStringParameters.filter) {
      filters.$or = [
        {
          'user.name': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'device.name': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'device.code': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'location.code': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'location.name': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'location.floor.code': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'location.floor.name': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'location.floor.zone.code': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'location.floor.zone.name': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'sensors.name': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'sensors.code': new RegExp(event.queryStringParameters.filter, 'i')
        }
      ];
    }

    if (event.queryStringParameters.location) {
      filters['location.id'] = mongoose.Types.ObjectId(event.queryStringParameters.location);
    }
    if (event.queryStringParameters.floor) {
      filters['location.floor.id'] = mongoose.Types.ObjectId(event.queryStringParameters.floor);
    }
    if (event.queryStringParameters.zone) {
      filters['location.zone.id'] = mongoose.Types.ObjectId(event.queryStringParameters.zone);
    }
    if (event.queryStringParameters.user) {
      filters['user.id'] = mongoose.Types.ObjectId(event.queryStringParameters.user);
    }

    if (event.queryStringParameters.dateFrom && event.queryStringParameters.dateTo) {
      filters.dt = {};
      filters.dt.$gt = new Date(event.queryStringParameters.dateFrom);
      filters.dt.$lt = new Date(event.queryStringParameters.dateTo);
    }
    if (event.queryStringParameters.firstInFrom && event.queryStringParameters.firstInTo) {
      filters.firstIn = {};
      filters.firstIn.$gt = new Date(event.queryStringParameters.firstInFrom);
      filters.firstIn.$lt = new Date(event.queryStringParameters.firstInTo);
    }
    if (event.queryStringParameters.lastOutFrom && event.queryStringParameters.lastOutTo) {
      filters.lastOut = {};
      filters.lastOut.$gt = new Date(event.queryStringParameters.lastOutFrom);
      filters.lastOut.$lt = new Date(event.queryStringParameters.lastOutTo);
    }

    /* if (event.queryStringParameters.timeFrom && event.queryStringParameters.timeTo) {
      filters['$or'] = [];
      
      filters['$or'] = [
        {
          'entryTime' : { $gt: new Date(event.queryStringParameters.timeFrom), $lt: new Date(event.queryStringParameters.timeTo) },
        },
        {
          'exitTime' : { $gt: new Date(event.queryStringParameters.timeFrom), $lt: new Date(event.queryStringParameters.timeTo) },
        }
      ];
    }
    */
    return filters;
  }

  getFilterParams(event, key) {
    switch (key) {
      case 'userEntrance':
        return this.userEntranceFilters(event);
      case 'userEntranceHistory':
        return this.userEntranceHistoryFilters(event);

      default:
        return {};
    }
  }

  getExtraParams(event, key) {
    const params = {};
    params.sort = {};
    const offset = event.queryStringParameters.offset ? event.queryStringParameters.offset : 0;
    const limit = event.queryStringParameters.limit ? event.queryStringParameters.limit : 20;
    params.pageParams = {
      offset: parseInt(offset, 10),
      limit: parseInt(limit, 10)
    };
    if (event.queryStringParameters.sort) {
      const sortQuery = event.queryStringParameters.sort;
      const sortColumns = sortQuery.split(',');
      sortColumns.forEach(function(col) {
        let sortOrder = 1;
        col = col.trim();
        const isValidColumn =
          this.getColumnMap(col, key) || this.getColumnMap(col.replace('-', ''), key);
        if (isValidColumn) {
          if (col.startsWith('-')) {
            sortOrder = -1;
            col = col.replace('-', '');
          }

          col = this.getColumnMap(col, key);
          params.sort[col] = sortOrder;
        }
      }, this);
    } else {
      params.sort.updatedAt = -1;
    }

    return params;
  }

  getColumnMap(col, key) {
    let map;
    switch (key) {
      case 'userEntrance':
        map = {
          userName: 'user.name',
          locationName: 'location.name',
          totalInterval: 'interval',
          firstIn: 'firstIn',
          lastOut: 'lastOut',
          formatdt: 'dt'
        };
        break;
      case 'userEntranceHistory':
        map = {
          interval: 'interval',
          entryTime: 'entryTime',
          exitOut: 'exitTime'
        };
        break;
      default:
        map = {};
    }

    if (col) {
      return map[col] || col;
    }
    return map;
  }

  userEntranceHistory(event) {
    const key = 'userEntranceHistory';
    return bluebirdPromise.all([
      this.userEntranceHistoryData(
        this.getFilterParams(event, key),
        this.getExtraParams(event, key),
        key
      ),
      this.userEntranceHistoryCount(this.getFilterParams(event, key))
    ]);
  }

  userEntranceHistoryData(filterParams, otherParams, key) {
    // preFilter = {'sensors.user.id': {$exists: true} };
    // console.log(JSON.stringify(filterParams));
    return (
      trackingEntranceModel
        .find(filterParams)
        .sort(otherParams.sort)
        .skip(otherParams.pageParams.offset)
        .limit(otherParams.pageParams.limit)
        .exec()
        // .then(result => result.map(x => this.formatResponse(x, key)))
        .then(result => {
          // console.log(result);
          if (!result.length) {
            return bluebirdPromise.reject();
          }
          const processedResults = result.map(row => {
            const loc = row.location;
            delete loc.address;
            return {
              entryTime: row.entryTime,
              exitTime: row.exitTime,
              interval: row.interval,
              location: loc
            };
          });

          return bluebirdPromise.resolve(processedResults);
        })
    );
  }

  userEntranceHistoryCount(filterParams, key) {
    return trackingEntranceModel
      .find(filterParams)
      .exec()
      .then(
        result =>
          // console.log(result);
          result.length
      );
  }

  userEntranceHistoryFilters(event) {
    const filters = {};
    // filters['sensors.user.id'] = mongoose.Types.ObjectId(event.pathParameters.userId);
    filters['sensors.user.code'] = event.pathParameters.userId;

    if (event.pathParameters.locationType === 'location') {
      filters['location.id'] = event.pathParameters.location;
      filters['location.zones'] = { $exists: false };
    } else if (event.pathParameters.locationType === 'zone') {
      filters['location.zones'] = { $exists: true };
      filters['location.zones.id'] = event.pathParameters.location;
    }
    // filters.type = 'location';
    const startTime = moment(decodeURIComponent(event.pathParameters.dt)).startOf('day');
    const endTime = moment(decodeURIComponent(event.pathParameters.dt)).endOf('day');
    filters.updatedAt = {};
    filters.updatedAt.$gt = startTime;
    filters.updatedAt.$lt = endTime;

    /* if (event.queryStringParameters.filter) {
      filters.$or = [
        {
          pkid: new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'device.name': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'device.code': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'location.code': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'location.name': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'location.floor.code': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'location.floor.name': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'location.floor.zone.code': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'location.floor.zone.name': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'sensors.name': new RegExp(event.queryStringParameters.filter, 'i')
        },
        {
          'sensors.code': new RegExp(event.queryStringParameters.filter, 'i')
        }
      ];
    } */

    if (event.queryStringParameters.entryTimeFrom && event.queryStringParameters.entryTimeTo) {
      filters.entryTime = {};
      filters.entryTime.$gt = new Date(event.queryStringParameters.entryTimeFrom);
      filters.entryTime.$lt = new Date(event.queryStringParameters.entryTimeTo);
    }
    if (event.queryStringParameters.exitTimeFrom && event.queryStringParameters.exitTimeTo) {
      filters.exitTime = {};
      filters.exitTime.$gt = new Date(event.queryStringParameters.exitTimeFrom);
      filters.exitTime.$lt = new Date(event.queryStringParameters.exitTimeTo);
    }

    /* if (event.queryStringParameters.timeFrom && event.queryStringParameters.timeTo) {
      filters['$or'] = [];
      
      filters['$or'] = [
        {
          'entryTime' : { $gt: new Date(event.queryStringParameters.timeFrom), $lt: new Date(event.queryStringParameters.timeTo) },
        },
        {
          'exitTime' : { $gt: new Date(event.queryStringParameters.timeFrom), $lt: new Date(event.queryStringParameters.timeTo) },
        }
      ];
    }
    */
    return filters;
  }
}

module.exports = new userEntranceService();
