/*jshint esversion: 6 */
'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
const subdocuments = require('./subdocuments');
const propogationHelper = require('../helpers/propogationHelper');
const auditTrail = require('../helpers/auditTrail');
const clientHandler = require('../lib/clientHandler');

const IncidentSchema = new Schema({
  status: { type: Number },
  incidentStatus: { type: Number },
  incidentType: { type: String, default: '' },
  createdOn: { type: Date, default: Date.now() },
  createdBy: subdocuments.User,
  assignee: subdocuments.User,
  task: subdocuments.Task,
  tour: subdocuments.Tour,
  comments: [
    {
      _id: false,
      data: { type: String },
      images: [subdocuments.Image],
      reporter: subdocuments.User,
      reportedOn: { type: Date, default: new Date() }
    }
  ],
  updatedOn: { type: Date, default: new Date() },
  updatedBy: subdocuments.UpdatedBy,
  client: subdocuments.Client
});

IncidentSchema.pre('find', function() {
  this._conditions = clientHandler.addClientFilterToConditions(this._conditions);
});

IncidentSchema.pre('count', function() {
  this._conditions = clientHandler.addClientFilterToConditions(this._conditions);
});

IncidentSchema.plugin(auditTrail.auditTrail, { model: 'incidents' });

IncidentSchema.post('findOneAndUpdate', function(result, next) {
  propogationHelper
    .propagate({ hook: 'findOneAndUpdate', collection: 'incidents', result: result })
    .then(() => {
      next();
    })
    .catch(() => {
      // console.log('Error encountered while propagating changes');
      next();
    });
});

let incidentModel;

try {
  incidentModel = mongoose.model('incidents');
} catch (error) {
  incidentModel = mongoose.model('incidents', IncidentSchema);
}

module.exports = incidentModel;
