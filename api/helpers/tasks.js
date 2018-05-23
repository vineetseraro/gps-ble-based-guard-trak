const taskmodel = require('../models/tasks');
const validator = require('../lib/validatorAsync');
const akUtils = require('../lib/utility');
const jsTypeChecker = require('javascript-type-checker');
const mongoose = require('mongoose');
const bluebirdPromise = require('bluebird');
const commonHelper = require('./common');
const currentUserHandler = require('../lib/currentUserHandler');
const clientHandler = require('../lib/clientHandler');
const tourmodel = require('../models/tours');
const touractionmodel = require('../models/tourActions');
const timediff = require('timediff');
const thingsHelper = require('./things');
const deviceHelper = require('./device');
const zoneHelper = require('./core/zone');
const rawScanLocationModel = require('../models/rawScanLocations');
const nearbyLocationHelper = require('./tracking/nearbyLocation');
const findZoneHelper = require('./tracking/findZone');
const cronHelper = require('./cron');

const taskDependent = {
  things: 'tasks.id',
  'product.1': 'trackingDetails.currentLocation.address.id',
  'product.2': 'tasks.id',
  kollection: 'items.id',
  location: 'tasks.id'
};

// const search = require('../services/search');

const taskService = function() {};

/**
 * Set client of the helper for use across all functions in the helper
 *
 * @param {Object} clientObj
 * @return {Void}
 *
 */
taskService.prototype.setClient = function(clientObj) {
  this.client = clientObj;
};

/**
 * Set headers of the helper for use across all functions in the helper
 *
 * @param {Object} clientObj
 * @return {Void}
 *
 */
taskService.prototype.setHeaders = function(headers) {
  this.headers = headers;
};

/**
 * Set headers of the helper for use across all functions in the helper
 *
 * @param {Object} clientObj
 * @return {Void}
 *
 */
taskService.prototype.setConfigs = function() {
  // console.log('config');
  return require('./configuration')
    .getConfigurations()
    .then(configs => {
      this.configs = configs;
    });
};
/**
 * Query the database to fetch tasks on the basis of search parameters and other parameters
 *
 * @param {Object} searchParams search filters
 * @param {Object} otherParams pagination, sorting etc other params.
 * @return {Promise} Promise to represent the result of get operation.
 *
 */
taskService.prototype.get = function(searchParams, otherParams) {
  return taskmodel
    .find(searchParams)
    .sort(otherParams.sort)
    .skip(otherParams.pageParams.offset)
    .limit(otherParams.pageParams.limit)
    .collation({
      locale: 'en_US',
      caseLevel: false
    })
    .exec()
    .then(result => {
      const list = [];
      if (result) {
        for (let i = 0; i < result.length; i++) {
          list.push(this.formatResponse(result[i], otherParams.isDropdown));
        }
      }
      return list;
    })
    .then(result => {
      if (result.length === 0) {
        return bluebirdPromise.reject();
      }
      return bluebirdPromise.resolve(result);
    });
};

/**
 * Fetch a particular task by providing its ID
 *
 * @param {String} taskId ID of the task to Fetch
 * @return {Promise} Promise to represent the result of get operation.
 *
 */
taskService.prototype.getById = function(taskId = 'default') {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    return bluebirdPromise.reject();
  }
  // if (!forSearch) {
  //   return search.searchById('tasks', taskId + '');
  // } else {
  let conditions = {
    _id: mongoose.Types.ObjectId(taskId)
  };
  conditions = clientHandler.addClientFilterToConditions(conditions);

  return taskmodel
    .find(conditions)
    .exec()
    .then(result => {
      
      if (result.length > 0) {
        const promises = result[0].locations.map((locationrow, locationidx) => {
          if(typeof locationrow.floor.zone.id !== 'undefined') {
            return zoneHelper.getById(locationrow.floor.zone.id).then((zoneData) => {
              locationrow.floor.zone.pointCoordinates = {
                type: 'Point',
                coordinates: [zoneData.coordinates.longitude, zoneData.coordinates.latitude]
              };
              return locationrow;
            });
          } else {
            return locationrow;
          }
          
        });
        
        return bluebirdPromise.all(promises).then((locations) => {
          result[0].locations = locations;
          return bluebirdPromise.resolve(this.formatResponse(result[0]));
        });
        
      }
      return bluebirdPromise.reject();
    });
  // }
};

/**
 * Fetch a particular task by providing its Code
 *
 * @param {String} code Code of the task to Fetch
 * @return {Promise} Promise to represent the result of get operation.
 *
 */
taskService.prototype.getByCode = function(code = '') {
  let conditions = {
    code
  };
  conditions = clientHandler.addClientFilterToConditions(conditions);

  return taskmodel
    .find(conditions)
    .exec()
    .then(result => {
      if (result.length > 0) {
        return bluebirdPromise.resolve(this.formatResponse(result[0]));
      }
      return bluebirdPromise.reject();
    });
};

/**
 * Count tasks on the basis of some search conditions.
 *
 * @param {Object} searchParams Search Conditions
 * @return {Promise<Number>} Number of matching tasks.
 *
 */
taskService.prototype.count = function(searchParams = {}) {
  return taskmodel.count(searchParams).exec();
};

/**
 * Performs response from DB operations to return as API response.
 *
 * @param {Object} data Database operation result.
 * @param {Boolean} isDropdown Whether the APi is requesting a dropdown.
 * @return {Promise} formattedResponse Formatted Response
 *
 */
taskService.prototype.formatResponse = function(data, isDropdown = false) {
  const formattedResponse = {};
  // const tz = (currentUserHandler.getCurrentUser() || {}).timezone;
  if (!isDropdown) {
    formattedResponse.id = data._id;
    formattedResponse.code = data.code;
    formattedResponse.name = data.name;
    formattedResponse.status = data.status;

    formattedResponse.description = data.description;
    formattedResponse.from = data.from;
    formattedResponse.to = data.to;
    formattedResponse.images = data.images || [];
    formattedResponse.notes = data.notes;
    formattedResponse.attendees = data.attendees;
    formattedResponse.locations = data.locations;

    formattedResponse.updatedOn = data.updatedOn;
    formattedResponse.updatedBy = `${((data || {}).updatedBy || '').firstName} ${((data || {})
      .updatedBy || ''
    ).lastName}`;
    formattedResponse.client = data.client;
    formattedResponse.tags = data.tags;
    formattedResponse.frequency = data.frequency;
    formattedResponse.device = data.device;
    formattedResponse.recur = data.recur;
    formattedResponse.scheduleType = data.scheduleType;
    formattedResponse.startDate = data.startDate;
    formattedResponse.startTime = data.startTime;
    formattedResponse.endTime = data.endTime || 'NA';
    return formattedResponse;
  }
  formattedResponse.id = data._id;
  formattedResponse.name = data.name;
  return formattedResponse;
};

/**
 * Map keys for sorting.
 *
 * @param {String} key
 * @return {String}
 *
 */
taskService.prototype.getColumnMap = function getColumnMap(key) {
  const map = {
    id: '_id',
    code: 'code',
    name: 'name',
    sysDefined: 'sysDefined',
    updatedOn: 'updatedOn',
    updatedBy: 'updatedBy',
    from: 'from',
    to: 'to',
    endTime: 'endTime',
    device: 'device.name'
  };

  if (key) {
    return map[key] || key;
  }
  return map;
};

/**
 * Generate the search conditions for the GET operation.
 *
 * @param {Object} event Lambda Event
 * @return {Object} filters.
 *
 */
taskService.prototype.getFilterParams = function(event) {
  let filters = {};

  filters = clientHandler.addClientFilterToConditions(filters);

  if (event.queryStringParameters && event.queryStringParameters.filter) {
    // filters._all = event.queryStringParameters.filter;
    filters.$or = [
      {
        name: new RegExp(event.queryStringParameters.filter, 'i')
      },
      {
        code: new RegExp(event.queryStringParameters.filter, 'i')
      },
      {
        'attendees.0.firstName': new RegExp(event.queryStringParameters.filter, 'i')
      },
      {
        'attendees.0.lastName': new RegExp(event.queryStringParameters.filter, 'i')
      },
      {
        scheduleType: new RegExp(event.queryStringParameters.filter, 'i')
      },
      {
        description: new RegExp(event.queryStringParameters.filter, 'i')
      },
      {
        'device.name': new RegExp(event.queryStringParameters.filter, 'i')
      },
      {
        'device.code': new RegExp(event.queryStringParameters.filter, 'i')
      }      
    ];
  }

  if (event.queryStringParameters.id) {
    filters._id = mongoose.Types.ObjectId(event.queryStringParameters.id);
  }

  if (event.queryStringParameters.code) {
    filters.code = new RegExp(event.queryStringParameters.code, 'i');
  }

  if (event.queryStringParameters.name) {
    filters.name = new RegExp(event.queryStringParameters.name, 'i');
  }

  if (event.queryStringParameters.status) {
    filters.status = parseInt(event.queryStringParameters.status, 10);
  }
  if (event.queryStringParameters.attendee) {
    filters['attendees.uuid'] = event.queryStringParameters.attendee;
  }
  
  if (event.queryStringParameters.scheduleType) {
    filters.scheduleType = new RegExp(event.queryStringParameters.scheduleType, 'i');
  }

  if (event.queryStringParameters.updatedOnFrom || event.queryStringParameters.updatedOnTo) {
    filters.updatedOn = {};
  }

  if (event.queryStringParameters.updatedOnFrom) {
    filters.updatedOn.$gte = new Date(event.queryStringParameters.updatedOnFrom);
  }

  if (event.queryStringParameters.updatedOnTo) {
    filters.updatedOn.$lte = akUtils.formatToDateFilter(
      new Date(event.queryStringParameters.updatedOnTo)
    );
  }

  if (event.queryStringParameters.startFrom || event.queryStringParameters.startTo) {
    filters.startTime = {};
  }

  if (event.queryStringParameters.startFrom) {
    filters.startTime.$gte = new Date(event.queryStringParameters.startFrom);
  }

  if (event.queryStringParameters.startTo) {
    filters.startTime.$lte = akUtils.formatToDateFilter(new Date(event.queryStringParameters.startTo));
  }

  if (event.queryStringParameters.endFrom || event.queryStringParameters.endTo) {
    filters.endTime = {};
  }

  if (event.queryStringParameters.endFrom) {
    filters.endTime.$gte = new Date(event.queryStringParameters.endFrom);
  }

  if (event.queryStringParameters.endTo) {
    filters.endTime.$lte = akUtils.formatToDateFilter(new Date(event.queryStringParameters.endTo));
  }

  if (event.queryStringParameters.device && mongoose.Types.ObjectId.isValid(event.queryStringParameters.device)) {
    filters['device.id'] = mongoose.Types.ObjectId(event.queryStringParameters.device);
  }

  // if (request.queryStringParameters.status === '1' || request.queryStringParameters.status === '0') filters.status = request.queryStringParameters.status === '1';
  if (event.queryStringParameters.dd === '1') {
    filters.status = 1;
    filters.sysDefined = 0;
  }

  if (
    currentUserHandler.getCurrentUser().preferredRole !==
    akUtils.getRoleFromGroupName(process.env.adminGroupName)
  ) {
    filters['attendees.uuid'] = currentUserHandler.getCurrentUser().uuid;
  }

  return filters;
};

/**
 * Generate the extra parameters for the GET operation like sorting, pagination etc.
 *
 * @param {Object} request Lambda Event
 * @return {Object} extraParams
 *
 */
taskService.prototype.getExtraParams = function(event) {
  const params = {};
  params.sort = {};
  if (!event.queryStringParameters) {
    params.pageParams = {
      offset: 0,
      limit: 20
    };
    params.sort.updatedOn = -1;
    return params;
  }
  const dd = event.queryStringParameters.dd === '1';
  const offset = event.queryStringParameters.offset ? event.queryStringParameters.offset : 0;
  const limit = event.queryStringParameters.limit ? event.queryStringParameters.limit : 20;
  params.isDropdown = dd;
  params.pageParams = {
    offset: dd ? 0 : parseInt(offset, 10),
    limit: dd ? 65535 : parseInt(limit, 10)
  };
  if (event.queryStringParameters.sort) {
    const sortQuery = event.queryStringParameters.sort;
    const sortColumns = sortQuery.split(',');
    sortColumns.forEach(function(col) {
      let sortOrder = 1;
      col = col.trim();
      const isValidColumn = this.getColumnMap(col) || this.getColumnMap(col.replace('-', ''));
      if (isValidColumn) {
        if (col.startsWith('-')) {
          sortOrder = -1;
          col = col.replace('-', '');
        }

        col = this.getColumnMap(col);
        params.sort[col] = sortOrder;
      }
    }, this);
  } else {
    params.sort.updatedOn = -1;
  }

  return params;
};

/**
 * Performs validations common in both update and save.
 *
 * @param {Object} event Lambda Event
 * @return {Promise} Resolved promise with populated event if successful. Rejected promise with validation errors otherwise.
 *
 */
taskService.prototype.commonValidations = function(event) {
  return bluebirdPromise
    .all([
      // bluebirdPromise.all([
      //   validator.required(event.body.code),
      //   validator.stringLength(0, validator.CODE_MAX_LENGTH, event.body.code),
      //   validator.notDuplicate('tasks', 'code', event.body.code, event.pathParameters.id)
      // ]),
      bluebirdPromise.all([
        validator.required(event.body.name),
        validator.stringLength(0, validator.NAME_MAX_LENGTH, event.body.name)
      ]),
      bluebirdPromise.all([validator.valueAllowed([0, 1], event.body.status)]),
      // bluebirdPromise.all([validator.required(event.body.description)]),
      bluebirdPromise.all([validator.required(event.body.from)]),
      bluebirdPromise.all([validator.required(event.body.to)]),
      bluebirdPromise.all([validator.required(event.body.locations)]),
      bluebirdPromise.all([
        validator.type('array', event.body.tags),
        validator.duplicateArrayElements(null, event.body.tags),
        validator.validatePopulatableLists('tags', event.body.tags),
        validator.arrayOfType('string', event.body.tags)
      ]),
      bluebirdPromise.all([
        validator.required(event.body.device),
        // validator.required(event.body.device.id)
      ])
    ])
    .then(result => {
      const validatorErrorsMap = {
        // code: {
        //   index: 0,
        //   fieldName: 'Code'
        // },
        name: {
          index: 0,
          fieldName: 'Name'
        },
        status: {
          index: 1,
          fieldName: 'Status'
        },
        // description: {
        //   index: 3,
        //   fieldName: 'Description'
        // },
        from: {
          index: 2,
          fieldName: 'Event From Time'
        },
        to: {
          index: 3,
          fieldName: 'Event To Time'
        },
        location: {
          index: 4,
          fieldName: 'Location'
        },
        tags: {
          index: 5,
          fieldName: 'Tags'
        },
        device: {
          index: 6,
          fieldName: 'Device'
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
 * Performs update-specific validations before performing common validations.
 *
 * @param {Object} event Lambda Event
 * @return {Promise} Resolved promise with populated event if successful. Rejected promise with validation errors otherwise.
 *
 */
taskService.prototype.validateUpdate = function(event) {
  let basicErrors;
  if ((event.queryStringParameters.mobile || 0) === '1') {
    return bluebirdPromise.resolve(event);
  }
  return this.commonValidations(event)
    .catch(errors => errors)
    .then(errorsIfAny => {
      basicErrors = errorsIfAny || {};
      return bluebirdPromise.all([
        bluebirdPromise.all([
          validator.elementExists('tasks', event.pathParameters.id),
          validator.deactivationCheck('tasks', event.body.status, event.pathParameters.id)
        ]),
        // bluebirdPromise.all([
        //   validator.checkSame('tasks', 'code', event.body.code, event.pathParameters.id)
        // ])
      ]);
    })
    .then(result => {
      const mapping = {
        global: {
          index: 0,
          fieldName: 'Schedule'
        },
        // code: {
        //   index: 1,
        //   fieldName: 'Code'
        // }
      };
      const validationResult = akUtils.mapAndGetValidationErrors(result, mapping);
      const combinedErrors = Object.assign({}, basicErrors, validationResult);
      if (!jsTypeChecker.isEmptyObject(combinedErrors)) {
        return bluebirdPromise.reject(
          akUtils.getObjectValues(akUtils.sortErrorsObject(combinedErrors, 'tasks'))
        );
      }
      return bluebirdPromise.resolve();
    })
    .catch(errors => bluebirdPromise.reject(errors));
};

/**
 * Checks if a give code already exists in the database.
 *
 * @param {String} code Code to check
 * @param {String} excludedObjId Object ID of current object if checking while update.
 * @return {Promise} Resolved promise if duplicate code. Rejected promise otherwise
 *
 */
taskService.prototype.isDuplicateCode = function(code = '', excludedObjId = null) {
  let conditions;
  if (excludedObjId !== null && mongoose.Types.ObjectId.isValid(excludedObjId)) {
    conditions = {
      code,
      _id: {
        $ne: mongoose.Types.ObjectId(excludedObjId)
      }
    };
  } else {
    conditions = {
      code
    };
  }
  conditions = clientHandler.addClientFilterToConditions(conditions);

  return taskmodel
    .findOne(conditions)
    .exec()
    .then(result => {
      if (result) {
        return bluebirdPromise.resolve();
      }
      return bluebirdPromise.reject();
    });
};

taskService.prototype.isDuplicate = function(field, value = '', excludedObjId = null) {
  let conditions = {};
  conditions[field] = value;
  if (excludedObjId !== null && mongoose.Types.ObjectId.isValid(excludedObjId)) {
    conditions._id = {
      $ne: mongoose.Types.ObjectId(excludedObjId)
    };
  }
  conditions = clientHandler.addClientFilterToConditions(conditions);

  return taskmodel
    .findOne(conditions)
    .exec()
    .then(result => {
      if (result) {
        return bluebirdPromise.resolve();
      }
      return bluebirdPromise.reject();
    });
};
/**
 * Performs save-specific validations before performing common validations.
 * 
 * @param {Object} event Lambda Event
 * @return {Promise} Resolved promise with populated event if successful. Rejected promise with validation errors otherwise.
 * 
 */
taskService.prototype.validateRequest = function(event) {
  return this.commonValidations(event)
    .then(() => {})
    .catch(errors => {
      if (!jsTypeChecker.isEmptyObject(errors)) {
        return bluebirdPromise.reject(
          akUtils.getObjectValues(akUtils.sortErrorsObject(errors, 'tasks'))
        );
      }
      return bluebirdPromise.resolve();
    });
};

/**
 * Save an task
 *
 * @param {Object} event Lambda Event
 * @return {Promise} Promise to represent the result of save operation.
 *
 */
taskService.prototype.save = function save(event) {
  const locationObj = [];
  let taskDetailObj = {};
  return bluebirdPromise.each(event.body.locations, locObj => {
    return bluebirdPromise.all([
        commonHelper.populateSingleLocation(locObj.location, false, false),
        commonHelper.populateSingleFloor(locObj.floor),
        commonHelper.populateSingleZone(locObj.zone)
      ])
      .then(populatedData => {
        let loc = {};
        loc = populatedData[0] || {};
        loc.address = populatedData[0].attributes || [];
        loc.floor = populatedData[1] || [];
        loc.floor.zone = populatedData[2] || [];
        locationObj.push(loc);
      });
  }).then( () => {
    const taskObj = new taskmodel(); // create a new instance of the  model
    taskObj.locations = locationObj;

    taskObj.code = event.body.name;
    taskObj.name = event.body.name;
    taskObj.sysDefined = 0;
    taskObj.status = event.body.status;

    taskObj.description = event.body.description || '';
    taskObj.from = event.body.from;
    taskObj.to = event.body.to;
    taskObj.images = event.body.images || [];
    taskObj.notes = event.body.notes;
    taskObj.attendees = event.body.attendees;

    taskObj.frequency = event.body.frequency || 0;

    taskObj.startDate = event.body.startDate || null;

    taskObj.device = null;
    if ( event.body.device.hasOwnProperty('id') ) {
      taskObj.device = event.body.device;
    }
    taskObj.recur = event.body.recur || [];

    taskObj.updatedOn = Date.now();
    taskObj.updatedBy = currentUserHandler.getCurrentUser();
    taskObj.client = clientHandler.getClient();
    taskObj.tags = [];
    taskObj.scheduleType = event.body.scheduleType || 'fixed';

    if ( taskObj.scheduleType === 'fixed' ) {
      taskObj.startTime = event.body.from;
      taskObj.endTime = event.body.to;
    }

    return taskObj.save();
  }).then( (taskDetails) => {
    taskDetailObj = taskDetails
    return cronHelper.scheduleTour(taskDetails._id);
  }).then( () => {
    return bluebirdPromise.resolve(taskDetailObj);
  }).catch(err => {
    akUtils.log(err);
  });
};

/**
 * Update an task
 * 
 * @param {Object} event Lambda Event
 * @return {Promise} Promise to represent the result of update operation.
 * 
 */
taskService.prototype.update = function(event) {
  let locationObj = [];
  if ((event.queryStringParameters.mobile || 0) === '1') {
    const conditions = {
      _id: event.pathParameters.id
    };
    const taskUpdateObj = {};

    taskUpdateObj.images = event.body.images;
    taskUpdateObj.notes = event.body.notes;
    const updateParams = {
      $set: taskUpdateObj,
      $inc: {
        __v: 1
      }
    };
    return taskmodel
      .findOneAndUpdate(conditions, updateParams, {
        upsert: false,
        new: true
      })
      .exec()
      .catch(err => {
        akUtils.log(err);
      });
  }
  return bluebirdPromise.each(event.body.locations, locObj => {
    return bluebirdPromise
      .all([
        commonHelper.populateSingleLocation(locObj.location, false, false),
        commonHelper.populateSingleFloor(locObj.floor),
        commonHelper.populateSingleZone(locObj.zone)
      ])
      .then(populatedData => {
        let loc = {};
        loc = populatedData[0] || {};
        loc.address = populatedData[0].attributes || [];
        loc.floor = populatedData[1] || [];
        loc.floor.zone = populatedData[2] || [];
        locationObj.push(loc);
      });
  }).then( () => {
    let conditions = {
      _id: event.pathParameters.id
    };
    conditions = clientHandler.addClientFilterToConditions(conditions);
    const taskUpdateObj = {};

    taskUpdateObj.locations = locationObj;
    taskUpdateObj.code = event.body.code;
    taskUpdateObj.name = event.body.name;
    taskUpdateObj.status = event.body.status;

    taskUpdateObj.description = event.body.description || '';
    taskUpdateObj.from = event.body.from;
    taskUpdateObj.to = event.body.to;
    taskUpdateObj.images = event.body.images;
    taskUpdateObj.notes = event.body.notes;
    taskUpdateObj.attendees = event.body.attendees;

    taskUpdateObj.frequency = event.body.frequency || 0;
    taskUpdateObj.device = null;
    if ( event.body.device.hasOwnProperty('id') ) {
      taskUpdateObj.device = event.body.device;
    }
    taskUpdateObj.recur = event.body.recur || [];

    taskUpdateObj.startDate = event.body.startDate || null;

    taskUpdateObj.client = clientHandler.getClient();
    // taskUpdateObj.tags = populatedData[0];
    taskUpdateObj.updatedOn = Date.now();
    taskUpdateObj.updatedBy = currentUserHandler.getCurrentUser();
    taskUpdateObj.sysDefined = 0; // event.body.sysDefined;
    taskUpdateObj.scheduleType = event.body.scheduleType || 'fixed';

    if ( taskUpdateObj.scheduleType === 'fixed' ) {
      taskUpdateObj.startTime = event.body.from;
      taskUpdateObj.endTime = event.body.to;
    }

    const updateParams = {
      $set: taskUpdateObj,
      $inc: {
        __v: 1
      }
    };

    return taskmodel
    .findOneAndUpdate(conditions, updateParams, {
      upsert: false,
      new: true
    });
  }).then( () => {
    // delete future tours here
    return bluebirdPromise.all([
      tourmodel.remove(
        clientHandler.addClientFilterToConditions({
          'task.id': mongoose.Types.ObjectId(event.pathParameters.id),
          from: {
            $gt: new Date()
          }
        })
      ),
      touractionmodel.remove(
        clientHandler.addClientFilterToConditions({
          'task.id': mongoose.Types.ObjectId(event.pathParameters.id),
          'action.actionDate': {
            $gt: new Date()
          }
        })
      )
    ])
  }).then(() => {
    return cronHelper.scheduleTour(event.pathParameters.id);
  }).catch(err => {
    akUtils.log(err);
  });
};

taskService.prototype.getForPopulation = function(idValuePair, allowSysDefined = false) {
  idValuePair = idValuePair || [];
  const idValueMap = {};
  for (let i = 0; i < idValuePair.length; i++) {
    idValueMap[idValuePair[i].id] = idValuePair[i].value;
  }
  const idList = idValuePair.map(pair => mongoose.Types.ObjectId(pair.id));
  let conditions = {
    _id: {
      $in: idList
    },
    status: 1,
    sysDefined: 0
  };
  if (allowSysDefined) {
    conditions.sysDefined = 1;
  }
  conditions = clientHandler.addClientFilterToConditions(conditions);
  return taskmodel
    .find(conditions)
    .exec()
    .then(result =>
      result.sort((a, b) => idList.indexOf(a._id) - idList.indexOf(b._id)).map(result => ({
        id: result._id,
        name: result.name,
        status: result.status,
        sysDefined: result.sysDefined,
        value: idValueMap[String(result._id)] || ''
      }))
    );
};

taskService.prototype.validatePopulatable = function(idList) {
  const isPopulatable = idList.reduce(
    (isValid, id) => isValid && mongoose.Types.ObjectId.isValid(id),
    true
  );
  if (!isPopulatable) {
    return bluebirdPromise.resolve(false);
  }
  idList = idList.map(id => mongoose.Types.ObjectId(id));

  let conditions = {
    _id: {
      $in: idList
    },
    status: 1,
    sysDefined: 0
  };
  conditions = clientHandler.addClientFilterToConditions(conditions);
  return taskmodel
    .count(conditions)
    .exec()
    .then(count => {
      if (count === idList.length) {
        return bluebirdPromise.resolve(true);
      }
      return bluebirdPromise.resolve(false);
    });
};

taskService.prototype.validateInactive = function(taskid = '') {
  const modelpath = '../models/';

  const keys = Object.keys(taskDependent);
  // console.log(keys);
  return bluebirdPromise
    .map(keys, key => {
      // console.log(`in 1${key}`);
      const model = require(modelpath + key.split('.')[0]);
      const condition = taskDependent[key];
      const dict = {};
      dict[condition] = taskid;
      // console.log(JSON.stringify(dict));
      return model.findOne(dict).exec();
    })
    .then(result => {
      // console.log(result.length);
      for (let i = 0; i < result.length; i++) {
        if (result[i] === null) {
          result.splice(i, 1);
          i--;
        }
      }
      // console.log(result);
      if (result.length > 0) {
        return bluebirdPromise.resolve(true);
      }
      return bluebirdPromise.resolve(false);
    });
};

/**
 * start a tour
 * 
 * @param {Object} event Lambda Event
 * @return {Promise} Promise to represent the result of start a tour
 * 
 */
taskService.prototype.startTour = function(event) {
  let taskDetails = {};
  let tourDetails = {'id': '', 'tourId': ''};
  let tourActionDetails = {};
  let response = {task: '', tour: '', tourActions: []};
    return this.getById(event.body.taskId)
    .then(taskData => {
      taskDetails = taskData;
      const tourObj = new tourmodel();
      tourObj.code = null;
      tourObj.name = null;

      tourObj.from = Date.now();
      tourObj.to = null;
      tourObj.duration = null;
      tourObj.attendee = currentUserHandler.getCurrentUser();

      tourObj.task = taskDetails;

      tourObj.updatedOn = Date.now();
      tourObj.updatedBy = currentUserHandler.getCurrentUser();
      tourObj.client = clientHandler.getClient();

      return tourObj.save();
    }).then( (tourData) => {
      tourDetails = {'id': tourData._id, 'tourId': tourData.tourId};
      const tourActionObj = new touractionmodel();
      tourActionObj.action = {actionType: 'Start', actionDate: Date.now()};

      tourActionObj.attendee = currentUserHandler.getCurrentUser();

      tourActionObj.task = taskDetails;

      tourActionObj.tour = tourDetails;

      tourActionObj.additionalInfo = null;

      tourActionObj.updatedOn = Date.now();
      tourActionObj.updatedBy = currentUserHandler.getCurrentUser();
      tourActionObj.client = clientHandler.getClient();

      return tourActionObj.save();      
    }).then( (tourActionData) => {
      tourActionDetails = tourActionData;
      const conditions = {
        _id: tourDetails.id
      };
      const tourUpdateObj = {};
      tourUpdateObj.actions = [{
        id: tourActionDetails.id,
        action: tourActionDetails.action
      }];
      
      const updateParams = {
        $set: tourUpdateObj,
        $inc: {
          __v: 1
        }
      };
      return tourmodel
        .findOneAndUpdate(conditions, updateParams, {
          upsert: false,
          new: true
        })
        .exec()
        .catch(err => {
          akUtils.log(err);
        });
      }).then((updatedTourData) => {
        return bluebirdPromise.resolve(this.formatTourResponse(updatedTourData));
      }).catch((err)=> {
        akUtils.log(err);
        return bluebirdPromise.reject(err);
      });
};


/**
 * Fetch a particular tour by providing its ID
 * 
 * @param {String} tourId ID of the task to Fetch
 * @return {Promise} Promise to represent the result of get operation.
 * 
 */
taskService.prototype.getByTourId = function(tourId = 'default') {
  if (!mongoose.Types.ObjectId.isValid(tourId)) {
    return bluebirdPromise.reject();
  }

  let conditions = {
    _id: mongoose.Types.ObjectId(tourId)
  };
  conditions = clientHandler.addClientFilterToConditions(conditions);
  
  return tourmodel
    .find(conditions)
    .exec()
    .then(result => {
      if (result.length > 0) {
        return bluebirdPromise.resolve(this.formatTourResponse(result[0]));
      }
      return bluebirdPromise.reject();
    });
};


/**
 * end a tour
 * 
 * @param {Object} event Lambda Event
 * @return {Promise} Promise to represent the result of end a tour
 * 
 */
taskService.prototype.endTour = function(event) {
  let taskDetails = {};
  let tourDetails = {};
  let tourActionDetails = {};
  let response = {task: '', tour: '', tourActions: []};
    return this.getByTourId(event.body.tourId)
    .then( (tourData) => {
      tourDetails = tourData;
      const tourActionObj = new touractionmodel();
      tourActionObj.action = {actionType: 'End', actionDate: Date.now()};

      tourActionObj.attendee = currentUserHandler.getCurrentUser();
      tourActionObj.task = tourDetails.task;

      tourActionObj.tour = tourDetails;

      tourActionObj.additionalInfo = null;

      tourActionObj.updatedOn = Date.now();
      tourActionObj.updatedBy = currentUserHandler.getCurrentUser();
      tourActionObj.client = clientHandler.getClient();

      return tourActionObj.save();      
    }).then( (tourActionData) => {
      tourActionDetails = tourActionData;
      const conditions = {
        _id: tourDetails.id
      };
      const tourUpdateObj = {};
      tourUpdateObj.to = Date.now();
      tourUpdateObj.duration = timediff(tourDetails.from, tourUpdateObj.to, 's').milliseconds;
      const updateParams = {
        $push: {
          actions: {
            id: tourActionDetails.id,
            action: tourActionDetails.action
          }
        },
        $set: tourUpdateObj,
        $inc: {
          __v: 1
        }
      };
      return tourmodel
        .findOneAndUpdate(conditions, updateParams, {
          upsert: false,
          new: true
        })
        .exec()
        .catch(err => {
          akUtils.log(err);
        });
      }).then((updatedTourData) => {
        return bluebirdPromise.resolve(this.formatTourResponse(updatedTourData));
      }).catch((err)=> {
        akUtils.log(err);
        return bluebirdPromise.reject(err);
      });
};

/**
 * update a tour
 * 
 * @param {Object} event Lambda Event
 * @return {Promise} Promise to represent the result of update a tour
 * 
 */
taskService.prototype.updateTour = function(deviceId, timestamp, action, additionalInfo, eventData) {
  let taskDetails = {};
  let tourDetails = {};
  let tourActionDetails = {};
  let response = {task: '', tour: '', tourActions: []};
  return deviceHelper.getByCode(deviceId).then((deviceData) => {
    
    return bluebirdPromise.all([
      nearbyLocationHelper.getLocationFromLatLong({queryStringParameters: {
        latitude: eventData.lat, longitude: eventData.lng}}),
      this.getTourByDeviceInTime(deviceId, timestamp)
    ]).then(results => {
      let locationData = results[0];
      let tourData = results[1];
      tourDetails = tourData;
      const tourActionObj = new touractionmodel();
      if ( action === 'incident' ) { // add other actions later
        tourActionObj.action = {actionType: 'Incident', actionDate: Date.now()};

        tourActionObj.attendee = {};
        tourActionObj.currentUser = currentUserHandler.getCurrentUser();
        tourActionObj.task = {};
        tourActionObj.tour = {};
        if(tourDetails !== null) {
          tourActionObj.attendee = tourDetails.attendee;
          tourActionObj.task = tourDetails.task;
          tourActionObj.tour = {
            id: tourDetails._id,
            tourId: tourDetails.tourId
          };
        }
        
        // tourActionObj.device = tourDetails.task;
        
        tourActionObj.device = {
          id : mongoose.Types.ObjectId(deviceData._id),
          name : deviceData.name,
          code : deviceData.code,
          type : deviceData.type
        };

        tourActionObj.location = {
          id: locationData.id,
          code: locationData.code,
          name: locationData.name,
          address: [ locationData.address, locationData.city, locationData.state, locationData.country ].join(', '),
          pointCoordinates: {
            type: 'Point',
            coordinates: [eventData.lng, eventData.lat]
          },
          floor : {
            zone : {}
          }
        };
        tourActionObj.additionalInfo = {};
        tourActionObj.additionalInfo.incident = additionalInfo;

        tourActionObj.updatedOn = Date.now();
        tourActionObj.updatedBy = currentUserHandler.getCurrentUser();
        tourActionObj.client = clientHandler.getClient();
        return tourActionObj.save();
      } else {
        const err = new Error('Error during tour update');
        return bluebirdPromise.reject(err);
      }
    }).then( (tourActionData) => {
      tourActionDetails = tourActionData;
      if(tourDetails === null) {
        return true;
      }
      const conditions = {
        _id: tourDetails._id
      };
      const updateParams = {
        $push: {actions: {
          id: tourActionDetails.id,
          action: tourActionDetails.action
        }},
        $inc: {
          __v: 1
        }
      };
      return tourmodel
        .findOneAndUpdate(conditions, updateParams, {
          upsert: false,
          new: true
        })
        .exec()
        .catch(err => {
          akUtils.log(err);
        });
      }).then((updatedTourData) => {
        return bluebirdPromise.resolve(this.formatTourResponse(updatedTourData));
      }).catch((err)=> {
        akUtils.log(err);
        return bluebirdPromise.reject(err);
      });
    });
};

/**
 * Scan Location
 * 
 * @param {Object} event Lambda Event
 * @return {Promise} Promise to represent the result of end a tour
 * 
 */
taskService.prototype.scanLocation = function(event) {
  const self = this;
  let taskDetails = {};
  let tourDetails = {};
  let tourActionDetails = {};
  let response = {task: '', tour: '', tourActions: []};
  //console.log('Event')
  //console.log(JSON.stringify(event.body))
  const requestBody = event.body;
  const rawScanLocationObj = new rawScanLocationModel();
  rawScanLocationObj.dt = new Date();
  rawScanLocationObj.data = requestBody;
  return rawScanLocationObj.save().then(() => {
    const promises = requestBody.map((requestData) => {
      return self.scanLocationData(requestData);
    });
    
    return bluebirdPromise.all(promises);
  });
};

/**
 * Scan Location
 * 
 * @param {Object} event Lambda Event
 * @return {Promise} Promise to represent the result of end a tour
 * 
 */
taskService.prototype.scanLocationData = function(requestData) {
  const requestDataOrig = Object.assign({}, requestData);
  let conditions = {
    'device.code' : requestData.did,
    'from' : {$lt: new Date(requestData.ts)},
    'to' : {$gt: new Date(requestData.ts)}
  };
  return this.getTourByDeviceInTime(requestData.did, requestData.ts)
    .then( (tourDetails) => {
      return deviceHelper.getByCode(requestData.did).then((deviceData) => {
        requestData.deviceInfo = deviceData;
        const promises = requestData.sensors.map((sensorRow, sensorIdx) => {
          switch(sensorRow.type) {
            case "nfcTag":
              return bluebirdPromise
                .all([
                  thingsHelper.getByCode(sensorRow.uid),
                  findZoneHelper
                  .getZonesFromThings({
                    body: { things: [sensorRow.uid] }
                  })
                ]).then(results => {
                  requestData.sensors[sensorIdx].id = results[0].id;
                  requestData.sensors[sensorIdx].code = results[0].code;
                  requestData.sensors[sensorIdx].name = results[0].name;
                  requestData.sensors[sensorIdx].zone = results[1];
                  return requestData;
                });
              break;
            case "beacon":
              return thingsHelper.getFilterArrayThings(
                [{'uuid': sensorRow.uuid, 'major':sensorRow.maj,'minor':sensorRow.min}]
              ).then((results) => {
                requestData.sensors[sensorIdx].id = results[0].id;
                requestData.sensors[sensorIdx].code = results[0].code;
                requestData.sensors[sensorIdx].name = results[0].name;
                return findZoneHelper
                .getZonesFromThings({
                  body: { things: [results[0].code] }
                }).then((result) => {
                  requestData.sensors[sensorIdx].zone = result;
                }) 
              });
              break;
          }
        });
        
        return bluebirdPromise.all(promises).then(() => {
          
        });
      }).then(() => {
        const promises = requestData.sensors.map((sensorRow, sensorIdx) => {
          if(sensorRow.zone === null) {
            return false;
          } else {
            const tourActionObj = new touractionmodel();
            tourActionObj.action = {
              actionType: 'Scan',
              actionDate: new Date(requestData.ts),
            };
        
            if(sensorRow.zone[sensorRow.code].length === 0) {
              return false;
            }
            
            const zoneData = sensorRow.zone[sensorRow.code][0];
            tourActionObj.location = {
              id : zoneData.location.id,
              code : zoneData.location.code,
              name : zoneData.location.name,
              address : '',
              pointCoordinates: {
                type: 'Point',
                coordinates: [zoneData.location.coordinates.longitude, zoneData.location.coordinates.latitude]
              },
              floor : {
                id : zoneData.floor.id,
                code : zoneData.floor.code,
                name : zoneData.floor.name,
                zone : {
                  id : zoneData.id,
                  code : zoneData.code,
                  name : zoneData.name
                }
              }
            };
            
            tourActionObj.currentUser = currentUserHandler.getCurrentUser();
            tourActionObj.task = {};
            tourActionObj.tour = {};
            tourActionObj.attendee = {};
            if(tourDetails !== null) {
              tourActionObj.attendee = tourDetails.attendee;
              tourActionObj.task = tourDetails.task;
              tourActionObj.tour = {
                id: tourDetails.id,
                tourId: tourDetails.tourId,
                code: tourDetails.code,
                name: tourDetails.name
              };
            }
            tourActionObj.device = {
              id : requestData.deviceInfo.id,
              name : requestData.deviceInfo.name,
              code : requestData.deviceInfo.code,
              type : requestData.deviceInfo.type
            };
            tourActionObj.additionalInfo = {
              scan: {
                sensor: {
                  id: sensorRow.id,
                  code: sensorRow.code,
                  name: sensorRow.name
                },
                device: {
                  id : requestData.deviceInfo.id,
                  name : requestData.deviceInfo.name,
                  code : requestData.deviceInfo.code,
                  type : requestData.deviceInfo.type,
                  appName : requestData.deviceInfo.appName,
                  manufacturer : requestData.deviceInfo.manufacturer,
                  os : requestData.deviceInfo.os,
                  model : requestData.deviceInfo.model,
                  version : requestData.deviceInfo.version,
                  appVersion : requestData.deviceInfo.appVersion
                },
                // rawpacket: requestDataOrig
              }
            };
            tourActionObj.updatedOn = Date.now();
            tourActionObj.updatedBy = currentUserHandler.getCurrentUser();
            tourActionObj.client = clientHandler.getClient();
            return tourActionObj.save().then( (tourActionData) => {
              const conditions = {
                _id: tourDetails._id
              };
              const updateParams = {
                $push: {actions: {
                  id: tourActionData._id,
                  location: tourActionData.location.floor.zone,
                  action: tourActionData.action
                }},
                $inc: {
                  __v: 1
                }
              };
              return tourmodel
                .findOneAndUpdate(conditions, updateParams, {
                  upsert: false,
                  new: true
                })
                .exec()
                .catch(err => {
                  akUtils.log(err);
                });
              }).then((updatedTourData) => {
                return bluebirdPromise.resolve({});
              }).catch((err)=> {
                return bluebirdPromise.reject(err);
              });
            }
          });
          
          return bluebirdPromise.all(promises);
        });
      });
};


taskService.prototype.formatTourResponse = function(data) {
  const formattedResponse = {};
  formattedResponse.id = data._id;
  formattedResponse.tourId = data.tourId;
  formattedResponse.from = data.from;
  formattedResponse.tourStatus = data.tourStatus;
  formattedResponse.to = data.to;
  formattedResponse.duration = data.duration;
  formattedResponse.task = data.task;
  formattedResponse.device = data.device;
  formattedResponse.updatedOn = data.updatedOn;
  formattedResponse.updatedBy = `${((data || {}).updatedBy || '').firstName} ${((data || {})
    .updatedBy || ''
  ).lastName}`;
  formattedResponse.client = data.client;
  formattedResponse.actions = data.actions || [];
  return formattedResponse;
};


/**
 * Fetch a particular scanned locations by providing its ID
 * 
 * @param {String} tourId ID of the task to Fetch
 * @return {Promise} Promise to represent the result of get operation.
 * 
 */
taskService.prototype.getScannedLocations = function(tourId = 'default') {
  if (!mongoose.Types.ObjectId.isValid(tourId)) {
    return bluebirdPromise.reject();
  }

  let conditions = {
    'tour.id': mongoose.Types.ObjectId(tourId),
    'action.actionType': 'Scan'
  };
  conditions = clientHandler.addClientFilterToConditions(conditions);

  return touractionmodel
    .find(conditions)
    .exec()
    .then(result => {
      if (result.length > 0) {
        return bluebirdPromise.resolve(this.formatLocationResponse(result));
      }
      return bluebirdPromise.resolve();
    });
};

taskService.prototype.formatLocationResponse = function(data) {
  const formattedResponse = [];
  data.forEach( ( loc ) => {
    formattedResponse.push(loc.location);
  });
  return formattedResponse;
};


/**
 * start a tour
 * 
 * @param {Object}
 * @return {Promise} Create tours ( captures start and end event )
 * 
 */
taskService.prototype.scheduleTours = function(tours) {
  const self = this;
  const promises = tours.map((tour) => {
    let taskDetails = {
      id: '',
      name: '',
      code: '',
      attendees: [],
      device: {},
      locations: []
    };
    let tourDetails = {
      id: '',
      tourId: '',
      attendee: {}
    };
    let tourActionDetails = {};
    let response = {task: '', tour: '', tourActions: []};
    let tourActionsData = [];
    const conditions = {
      _id: tour.taskId
    };
    const tourUpdateObj = {
      startTime: tour.startTime,
      endTime: tour.endTime
    };
    const updateParams = {
      $set: tourUpdateObj
    };
    return taskmodel
    .findOneAndUpdate(conditions, updateParams, {
      upsert: false,
      new: true
    }).then( taskData => {
      taskDetails.id = taskData._id;
      taskDetails.name = taskData.name;
      taskDetails.code = taskData.code;
      taskDetails.attendees = taskData.attendees;
      taskDetails.device = taskData.device;
      taskDetails.locations = taskData.locations;

      const tourObj = new tourmodel();
      tourObj.code = null;
      tourObj.name = null;
      tourObj.tourStatus = 10;

      tourObj.from = tour.from;
      tourObj.to = tour.to;
      tourObj.duration = timediff(tour.from, tour.to, 's').milliseconds;
      
      tourObj.attendee = {};
      if ( taskDetails.attendees && taskDetails.attendees.length > 0 ) {
        tourObj.attendee = taskDetails.attendees[0];
      }

      tourObj.task = taskDetails;

      tourObj.device = taskDetails.device;

      tourObj.updatedOn = Date.now();
      tourObj.updatedBy = currentUserHandler.getCurrentUser();
      tourObj.client = clientHandler.getClient();

      return tourObj.save();      
    }).then( (tourData) => {
      // start tour here
      tourDetails.id = tourData._id;
      tourDetails.tourId = tourData.tourId;
      tourDetails.attendee = tourData.attendee;

      const tourActionObj = new touractionmodel();
      tourActionObj.action = {actionType: 'Start', actionDate: tour.from};

      tourActionObj.attendee = tourDetails.attendee;

      tourActionObj.currentUser = currentUserHandler.getCurrentUser();

      tourActionObj.task = taskDetails;

      tourActionObj.tour = tourDetails;

      tourActionObj.device = taskDetails.device;

      tourActionObj.additionalInfo = null;

      tourActionObj.updatedOn = tour.from;
      tourActionObj.updatedBy = currentUserHandler.getCurrentUser();
      tourActionObj.client = clientHandler.getClient();

      // set start location here. Assuming location will be there   
      let firstLoc = taskDetails.locations[0];
      tourActionObj.location = {};
      if (
        typeof firstLoc !== 'undefined' &&
        typeof firstLoc.floor !== 'undefined' &&
        typeof firstLoc.floor.zone !== 'undefined'
      ) {
        tourActionObj.location = {
          id : firstLoc.floor.zone.id,
          code : firstLoc.floor.zone.code,
          name : firstLoc.floor.zone.name,
          address : '',
          pointCoordinates: firstLoc.pointCoordinates,
          floor : {
            id : firstLoc.floor.id,
            code : firstLoc.floor.code,
            name : firstLoc.floor.name,
            zone : {
              id : firstLoc.id,
              code : firstLoc.code,
              name : firstLoc.name
            }
          }
        };
      }

      return tourActionObj.save();      
    }).then( (tourActionData) => {
      tourActionsData.push(tourActionData);
      // end tour here
      const tourActionObj = new touractionmodel();
      tourActionObj.action = {actionType: 'End', actionDate: tour.to};

      tourActionObj.attendee = tourDetails.attendee;

      tourActionObj.currentUser = currentUserHandler.getCurrentUser();

      tourActionObj.task = taskDetails;

      tourActionObj.tour = tourDetails;

      tourActionObj.device = taskDetails.device;

      tourActionObj.additionalInfo = null;

      tourActionObj.updatedOn = tour.to;
      tourActionObj.updatedBy = currentUserHandler.getCurrentUser();
      tourActionObj.client = clientHandler.getClient();

      // set end location here. Assuming location will be there
      let lastLoc = taskDetails.locations[taskDetails.locations.length - 1];

      tourActionObj.location = {};
      if (
        typeof lastLoc !== 'undefined' &&
        typeof lastLoc.floor !== 'undefined' &&
        typeof lastLoc.floor.zone !== 'undefined'
      ) {
        tourActionObj.location = {
          id : lastLoc.floor.zone.id,
          code : lastLoc.floor.zone.code,
          name : lastLoc.floor.zone.name,
          address : '',
          pointCoordinates: lastLoc.pointCoordinates,
          floor : {
            id : lastLoc.floor.id,
            code : lastLoc.floor.code,
            name : lastLoc.floor.name,
            zone : {
              id : lastLoc.id,
              code : lastLoc.code,
              name : lastLoc.name
            }
          }
        };
      }

      return tourActionObj.save();      
    }).then( (tourActionData) => {
      tourActionsData.push(tourActionData);
      const conditions = {
        _id: tourDetails.id
      };
      const tourUpdateObj = {};
      tourUpdateObj.actions = [];
      tourActionsData.forEach( (tourAction) => {
        tourUpdateObj.actions.push({
          id: tourAction.id,
          action: tourAction.action
        });
      });     
      const updateParams = {
        $set: tourUpdateObj,
        $inc: {
          __v: 1
        }
      };
      return tourmodel
        .findOneAndUpdate(conditions, updateParams, {
          upsert: false,
          new: true
        })
        .exec()
        .catch(err => {
          akUtils.log(err);
        });
      }).then((updatedTourData) => {
        return bluebirdPromise.resolve(self.formatTourResponse(updatedTourData));
      }).catch((err)=> {
        akUtils.log(err);
        return bluebirdPromise.reject(err);
      });
  });

  return bluebirdPromise.all(promises).then( res => {
    if ( !tours.length ) {
      console.log("No tours available");
    } else {
      console.log("tours created suscessfully");
    }
  }).catch( err => {
    akUtils.log(err);
  });



  // return bluebirdPromise.each(tours,function(tour){
  //   let taskDetails = {};
  //   let tourDetails = {
  //     id: '',
  //     tourId: '',
  //     attendee: {}
  //   };
  //   let tourActionDetails = {};
  //   let response = {task: '', tour: '', tourActions: []};
  //   let tourActionsData = [];
  //   return self.getById(tour.taskId)
  //   .then(taskData => {
  //     // console.log(taskData);
  //     taskDetails = taskData;
  //     const tourObj = new tourmodel();
  //     tourObj.code = null;
  //     tourObj.name = null;
  //     tourObj.tourStatus = 10;

  //     tourObj.from = tour.from;
  //     tourObj.to = tour.to;
  //     tourObj.duration = timediff(tour.from, tour.to, 's').milliseconds;
      
  //     tourObj.attendee = {};
  //     if ( taskDetails.attendees && taskDetails.attendees.length > 0 ) {
  //       tourObj.attendee = taskDetails.attendees[0];
  //     }

  //     tourObj.task = taskDetails;

  //     tourObj.device = taskDetails.device;

  //     tourObj.updatedOn = Date.now();
  //     tourObj.updatedBy = currentUserHandler.getCurrentUser();
  //     tourObj.client = clientHandler.getClient();

  //     return tourObj.save();
  //   }).then( (tourData) => {
  //     // start tour here
  //     tourDetails.id = tourData._id;
  //     tourDetails.tourId = tourData.tourId;
  //     tourDetails.attendee = tourData.attendee;

  //     const tourActionObj = new touractionmodel();
  //     tourActionObj.action = {actionType: 'Start', actionDate: tour.from};

  //     tourActionObj.attendee = tourDetails.attendee;

  //     tourActionObj.currentUser = currentUserHandler.getCurrentUser();

  //     tourActionObj.task = taskDetails;

  //     tourActionObj.tour = tourDetails;

  //     tourActionObj.device = taskDetails.device;

  //     tourActionObj.additionalInfo = null;

  //     tourActionObj.updatedOn = tour.from;
  //     tourActionObj.updatedBy = currentUserHandler.getCurrentUser();
  //     tourActionObj.client = clientHandler.getClient();

  //     return tourActionObj.save();      
  //   }).then( (tourActionData) => {
  //     tourActionsData.push(tourActionData);
  //     // end tour here
  //     const tourActionObj = new touractionmodel();
  //     tourActionObj.action = {actionType: 'End', actionDate: tour.to};

  //     tourActionObj.attendee = tourDetails.attendee;

  //     tourActionObj.currentUser = currentUserHandler.getCurrentUser();

  //     tourActionObj.task = taskDetails;

  //     tourActionObj.tour = tourDetails;

  //     tourActionObj.device = taskDetails.device;

  //     tourActionObj.additionalInfo = null;

  //     tourActionObj.updatedOn = tour.to;
  //     tourActionObj.updatedBy = currentUserHandler.getCurrentUser();
  //     tourActionObj.client = clientHandler.getClient();

  //     return tourActionObj.save();      
  //   }).then( (tourActionData) => {
  //     tourActionsData.push(tourActionData);
  //     const conditions = {
  //       _id: tourDetails.id
  //     };
  //     const tourUpdateObj = {};
  //     tourUpdateObj.actions = [];
  //     tourActionsData.forEach( (tourAction) => {
  //       tourUpdateObj.actions.push({
  //         id: tourAction.id,
  //         action: tourAction.action
  //       });
  //     });     
  //     const updateParams = {
  //       $set: tourUpdateObj,
  //       $inc: {
  //         __v: 1
  //       }
  //     };
  //     return tourmodel
  //       .findOneAndUpdate(conditions, updateParams, {
  //         upsert: false,
  //         new: true
  //       })
  //       .exec()
  //       .catch(err => {
  //         akUtils.log(err);
  //       });
  //     }).then((updatedTourData) => {
  //       return bluebirdPromise.resolve(self.formatTourResponse(updatedTourData));
  //     }).catch((err)=> {
  //       akUtils.log(err);
  //       return bluebirdPromise.reject(err);
  //     });

  // }).then(function(){
  //   console.log("ALL ARR DATA PRINTED");
  // });
};

/**
 * Fetch a particular tour by providing its ID
 * 
 * @param {String} tourId ID of the task to Fetch
 * @return {Promise} Promise to represent the result of get operation.
 * 
 */
taskService.prototype.getTourByDeviceInTime = function(deviceId, timestamp) {
  
  let conditions = {
    'device.code': deviceId, 
    'from' : {$lt: new Date(timestamp)},
    'to' : {$gt: new Date(timestamp)} 
  };
  conditions = clientHandler.addClientFilterToConditions(conditions);
  return tourmodel
    .find(conditions)
    .sort({'_id':-1})
    .limit(1)
    .exec()
    .then(result => {
      if (result.length > 0) {
        return bluebirdPromise.resolve(result[0]);
      }
      return bluebirdPromise.resolve(null);
    });
};

/**
 * Fetch a particular tour by providing its ID
 * 
 * @param {String} tourId ID of the task to Fetch
 * @return {Promise} Promise to represent the result of get operation.
 * 
 */
taskService.prototype.getTourByDevice = function(event) {
  if(!event.queryStringParameters.deviceId) {
    return bluebirdPromise.reject('Device Not found');
  }
  if(!event.queryStringParameters.ts) {
    return bluebirdPromise.reject('Ts not found');
  }
  
  event.queryStringParameters.ts = Number(event.queryStringParameters.ts);
  
  return this.getTourByDeviceInTime(event.queryStringParameters.deviceId, event.queryStringParameters.ts).then((result) => {
    if(result === null) {
      return {}; 
    }
    return {
      id: result._id,
      tourId: result.tourId
    }
  });
};

module.exports = new taskService();
