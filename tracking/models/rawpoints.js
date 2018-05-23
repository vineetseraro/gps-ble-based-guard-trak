/*jshint esversion: 6 */
/*jshint node: true */

"use strict";
var AppPromise = require("bluebird");
var ObjectID = require('mongodb').ObjectID;

/**
 * Points Model
 * @constructor
 */
var rawpoints = function(connection) {
    this.dbConnection = {};
};

/**
 * Set DB Connection
 * @param {object} dbConnection - DB Connection
 * @returns void
 */
rawpoints.prototype.setDbConnection = function(dbConnection) {
    this.dbConnection = dbConnection;
};

/**
 * Get DB Connection
 * @returns {object} dbConnection
 */
rawpoints.prototype.getDbConnection = function() {
    return this.dbConnection;
};

/**
 * Save Raw Points data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
rawpoints.prototype.save = function(data) {
    const rawpointcollection = this.dbConnection.collection('rawpoints');
    if(typeof data._id !== "undefined" && data._id !== null && data._id !== "") {
        return rawpointcollection.update(data, {"$set" : {"_id" : new ObjectID(data._id)}});
    } else {
        return rawpointcollection.insert(data);
    }
};

/**
 * Save Raw Points data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
rawpoints.prototype.insertMany = function(data) {
    const rawpointcollection = this.dbConnection.collection('rawpoints');
    return rawpointcollection.insertMany(data);
};

module.exports = rawpoints;
