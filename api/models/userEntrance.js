const mongoose = require('mongoose');

const Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
const subdocuments = require('./subdocuments');
// const auditTrail = require('../helpers/auditTrail');

const UserEntranceSchema = new Schema(
  {
    client: subdocuments.Client,
    type: { type: String },
    user: {
      id: Schema.Types.ObjectId,
      name: { type: String },
      code: { type: String }
    },
    location: {
      id: Schema.Types.ObjectId,
      code: { type: String },
      name: { type: String },
      address: [subdocuments.Attributes],
      zone: {
        id: Schema.Types.ObjectId,
        code: { type: String },
        name: { type: String }
      },
      floor: {
        id: Schema.Types.ObjectId,
        code: { type: String },
        name: { type: String }
      }
    },
    firstIn: { type: Date },
    lastOut: { type: Date },
    interval: { type: Number },
    dt: { type: Date }
  },
  { collection: 'userEntrance' }
);

// TrackingSchema.plugin(auditTrail.auditTrail,{ "model" : "Tracking"});

let userEntranceModel;

try {
  userEntranceModel = mongoose.model('userEntrance');
} catch (e) {
  userEntranceModel = mongoose.model('userEntrance', UserEntranceSchema);
}

module.exports = userEntranceModel;
