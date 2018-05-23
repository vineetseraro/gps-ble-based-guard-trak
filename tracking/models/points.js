/*jshint esversion: 6 */
/*jshint node: true */

"use strict";
var AppPromise = require("bluebird");
var ObjectID = require('mongodb').ObjectID;

/**
 * Points Model
 * @constructor
 */
var points = function(connection) {
    this.dbConnection = {};
};

/**
 * Set DB Connection
 * @param {object} dbConnection - DB Connection
 * @returns void
 */
points.prototype.setDbConnection = function(dbConnection) {
    this.dbConnection = dbConnection;
};

/**
 * Get DB Connection
 * @returns {object} dbConnection
 */
points.prototype.getDbConnection = function() {
    return this.dbConnection;
};

/**
 * Save Points data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
points.prototype.save = function(data) {
    const pointcollection = this.dbConnection.collection('points');
    if(typeof data._id !== "undefined" && data._id !== null && data._id !== "") {
        return pointcollection.update(data, {"$set" : {"_id" : new ObjectID(data._id)}});
    } else {
        return pointcollection.insert(data);
    }
};

/**
 * Save Raw Points data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
 points.prototype.insertMany = function(data) {
   const pointcollection = this.dbConnection.collection('points');
   return pointcollection.insertMany(data);
 };


/**
 * Get Points data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
points.prototype.findOne = function(conditions) {
    const pointcollection = this.dbConnection.collection('points');
    return pointcollection.findOne(conditions);
};

module.exports = points;
