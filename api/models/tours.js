/* jshint esversion: 6 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
const subdocuments = require('./subdocuments');
const clientHandler = require('../lib/clientHandler');
const autoIncrement = require('mongoose-auto-increment');

const TourSchema = new Schema({
  code: { type: String },
  name: { type: String },
  from: { type: Date },
  to: { type: Date },
  duration: { type: Number },
  attendee: subdocuments.User,
  task: subdocuments.Task,
  actions: [subdocuments.TourActions],
  updatedOn: { type: Date, default: Date.now() },
  updatedBy: subdocuments.UpdatedBy,
  client: subdocuments.Client,
  tourStatus: { type: Number },
  device: {
    id: Schema.Types.ObjectId,
    code: { type: String },
    name: { type: String }
  },
},{ collection: 'tours' });

TourSchema.pre('find', function() {
  this._conditions = clientHandler.addClientFilterToConditions(this._conditions);
});

TourSchema.pre('count', function() {
  this._conditions = clientHandler.addClientFilterToConditions(this._conditions);
});

let tourModel;

autoIncrement.initialize(mongoose.connection); 
TourSchema.plugin(autoIncrement.plugin, { model: 'tour', field: 'tourId', startAt: 1000, incrementBy: 1 });

try {
  tourModel = mongoose.model('tour');
} catch (error) {
  tourModel = mongoose.model('tour', TourSchema);
}

module.exports = tourModel;
