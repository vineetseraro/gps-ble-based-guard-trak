/*jshint esversion: 6 */
/*jshint node: true */

"use strict";
var AppPromise = require("bluebird");
var ObjectID = require('mongodb').ObjectID;

/**
 * PointsThings Model
 * @constructor
 */
var sensorLocation = function(connection) {
    this.dbConnection = {};
};

/**
 * Set DB Connection
 * @param {object} dbConnection - DB Connection
 * @returns void
 */
sensorLocation.prototype.setDbConnection = function(dbConnection) {
    this.dbConnection = dbConnection;
};

/**
 * Get DB Connection
 * @returns {object} dbConnection
 */
sensorLocation.prototype.getDbConnection = function() {
    return this.dbConnection;
};

/**
 * Save PointsThings data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
sensorLocation.prototype.findOne = function(conditions) {
    const sensorLocationCollection = this.dbConnection.collection('sensorLocation');
    return sensorLocationCollection.findOne(conditions);
};

/**
 * Save PointsThings data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
sensorLocation.prototype.save = function(conditions, dbdata) {
    const sensorLocationCollection = this.dbConnection.collection('sensorLocation');
    /*return sensorLocationCollection.findOne(conditions).then((results) => {
      console.log('============================')
      console.log(results);
      if(results !== null) {
        return sensorLocationCollection.update(dbdata, {"$set" : conditions});
      } else {
        return sensorLocationCollection.insert(dbdata);
      }
    })
    */
    return sensorLocationCollection.findOneAndUpdate(conditions, {$set: dbdata}, {upsert: true} ).then((results) => {
      return true;
    });
};

module.exports = sensorLocation;
