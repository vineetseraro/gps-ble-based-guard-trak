/* jshint esversion: 6 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
const subdocuments = require('./subdocuments');
const propogationHelper = require('../helpers/propogationHelper');
const auditTrail = require('../helpers/auditTrail');
const clientHandler = require('../lib/clientHandler');
const GeoJSON = require('mongoose-geojson-schema');

const TaskSchema = new Schema({
  code: { type: String },
  name: { type: String },
  sysDefined: { type: Number },
  status: { type: Number },
  description: { type: String },
  from: { type: Date },
  to: { type: Date },
  images: [subdocuments.Image],
  locations: [{
    _id: false,
    id: Schema.Types.ObjectId,
    code: { type: String },
    name: { type: String },
    address: [subdocuments.Attributes],
    pointCoordinates: Schema.Types.Point,
    floor: {
      _id: false,
      id: Schema.Types.ObjectId,
      code: { type: String },
      name: { type: String },
      zone: {
        _id: false,
        id: Schema.Types.ObjectId,
        code: { type: String },
        name: { type: String },
        pointCoordinates: Schema.Types.Point,
      }
    }
  }],
  attendees: [subdocuments.User],
  notes: { type: String },
  updatedOn: { type: Date, default: Date.now() },
  updatedBy: subdocuments.UpdatedBy,
  client: subdocuments.Client,
  tags: [subdocuments.Tags],
  frequency: { type: Number },
  scheduleType: { type: String },
  startDate: { type: Date },
  startTime: { type: Date },
  endTime: { type: Date },
  device: {
    id: Schema.Types.ObjectId,
    code: { type: String },
    name: { type: String }
  },
  recur: {}
});

TaskSchema.pre('find', function() {
  this._conditions = clientHandler.addClientFilterToConditions(this._conditions);
});

TaskSchema.pre('count', function() {
  this._conditions = clientHandler.addClientFilterToConditions(this._conditions);
});

TaskSchema.plugin(auditTrail.auditTrail, { model: 'tasks' });

TaskSchema.post('findOneAndUpdate', (result, next) => {
  propogationHelper
    .propagate({ hook: 'findOneAndUpdate', collection: 'tasks', result })
    .then(() => {
      next();
    })
    .catch(() => {
      console.log('Error encountered while propagating changes');
      next();
    });
});

let taskModel;

try {
  taskModel = mongoose.model('task');
} catch (error) {
  taskModel = mongoose.model('task', TaskSchema);
}

module.exports = taskModel;
