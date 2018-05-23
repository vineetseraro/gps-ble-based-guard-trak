/*jshint esversion: 6 */
/*jshint node: true */

"use strict";
var AppPromise = require("bluebird");
var ObjectID = require('mongodb').ObjectID;

/**
 * discardedSensors Model
 * @constructor
 */
var discardedSensors = function(connection) {
    this.dbConnection = {};
};

/**
 * Set DB Connection
 * @param {object} dbConnection - DB Connection
 * @returns void
 */
discardedSensors.prototype.setDbConnection = function(dbConnection) {
    this.dbConnection = dbConnection;
};

/**
 * Get DB Connection
 * @returns {object} dbConnection
 */
discardedSensors.prototype.getDbConnection = function() {
    return this.dbConnection;
};

/**
 * Save discardedSensors data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
discardedSensors.prototype.save = function(data) {
  const discardedSensorsCollection = this.dbConnection.collection('discardedSensors');
  if(typeof data._id !== "undefined" && data._id !== null && data._id !== "") {
      return discardedSensorsCollection.update(data, {"$set" : {"_id" : new ObjectID(data._id)}});
  } else {
      return discardedSensorsCollection.insertMany(data);
  }
};

module.exports = discardedSensors;
