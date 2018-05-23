/*jshint esversion: 6 */
/*jshint node: true */

"use strict";
var AppPromise = require("bluebird");
var ObjectID = require('mongodb').ObjectID;

/**
 * DiscardedPoints Model
 * @constructor
 */
var discardedPoints = function(connection) {
    this.dbConnection = {};
};

/**
 * Set DB Connection
 * @param {object} dbConnection - DB Connection
 * @returns void
 */
discardedPoints.prototype.setDbConnection = function(dbConnection) {
    this.dbConnection = dbConnection;
};

/**
 * Get DB Connection
 * @returns {object} dbConnection
 */
discardedPoints.prototype.getDbConnection = function() {
    return this.dbConnection;
};

/**
 * Save DiscardedPoints data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
discardedPoints.prototype.save = function(data) {
  const discardedPointsCollection = this.dbConnection.collection('discardedPoints');
  if(typeof data._id !== "undefined" && data._id !== null && data._id !== "") {
      return discardedPointsCollection.update(data, {"$set" : {"_id" : new ObjectID(data._id)}});
  } else {
      return discardedPointsCollection.insertMany(data);
  }
};

module.exports = discardedPoints;
