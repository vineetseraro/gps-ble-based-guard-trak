/* jshint esversion: 6 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
const subdocuments = require('./subdocuments');
const clientHandler = require('../lib/clientHandler');

const TourActionSchema = new Schema({
  action: { actionType: { type: String}, actionDate: { type: Date, default: Date.now()}  },
  attendee: subdocuments.User,
  currentUser: subdocuments.User,
  task: subdocuments.Task,
  tour: subdocuments.Tour,
  updatedOn: { type: Date, default: Date.now() },
  updatedBy: subdocuments.UpdatedBy,
  client: subdocuments.Client,
  device: {
    id: Schema.Types.ObjectId,
    code: { type: String },
    name: { type: String }
  },
  location: {
    _id: false,
    id: Schema.Types.ObjectId,
    code: { type: String },
    name: { type: String },
    address: { type: String },
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
        name: { type: String }
      }
    }
  },
  additionalInfo: {}
});

TourActionSchema.pre('find', function() {
  this._conditions = clientHandler.addClientFilterToConditions(this._conditions);
});

TourActionSchema.pre('count', function() {
  this._conditions = clientHandler.addClientFilterToConditions(this._conditions);
});

let tourModel;

try {
  tourModel = mongoose.model('touractions');
} catch (error) {
  tourModel = mongoose.model('touractions', TourActionSchema);
}

module.exports = tourModel;
