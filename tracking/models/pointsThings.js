/*jshint esversion: 6 */
/*jshint node: true */

"use strict";
var AppPromise = require("bluebird");
var ObjectID = require('mongodb').ObjectID;

/**
 * PointsThings Model
 * @constructor
 */
var pointsThings = function(connection) {
    this.dbConnection = {};
};

/**
 * Set DB Connection
 * @param {object} dbConnection - DB Connection
 * @returns void
 */
pointsThings.prototype.setDbConnection = function(dbConnection) {
    this.dbConnection = dbConnection;
};

/**
 * Get DB Connection
 * @returns {object} dbConnection
 */
pointsThings.prototype.getDbConnection = function() {
    return this.dbConnection;
};

/**
 * Save PointsThings data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
pointsThings.prototype.save = function(dbdata) {
    const pointsThingsCollection = this.dbConnection.collection('pointsThings');
    if(typeof dbdata._id !== "undefined" && dbdata._id !== null && dbdata._id !== "") {
        return pointsThingsCollection.update(dbdata, {"$set" : {"_id" : ObjectID(dbdata._id)}});
    } else {
        return pointsThingsCollection.insert(dbdata);
    }
};
/**
 * Save PointsThings data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
pointsThings.prototype.insertMany = function(dbdata) {
  const pointsThingsCollection = this.dbConnection.collection('pointsThings');
  return pointsThingsCollection.insertMany(dbdata);
};

module.exports = pointsThings;
