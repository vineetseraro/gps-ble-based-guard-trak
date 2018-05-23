'use strict';
const mongoose = require('mongoose');
const subdocuments = require('./subdocuments');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
//const auditTrail = require('../helpers/auditTrail');

const RawScanLocationSchema = new Schema(
  {
    client: subdocuments.Client,
    data: { type: Schema.Types.Mixed },
    dt: { type: Date }
  },
  { collection: 'rawScanLocations' }
);

let rawScanLocationModel;

try {
  rawScanLocationModel = mongoose.model('rawScanLocations');
} catch (e) {
  rawScanLocationModel = mongoose.model('rawScanLocations', RawScanLocationSchema);
}

module.exports = rawScanLocationModel;
