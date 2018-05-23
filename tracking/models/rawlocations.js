/*jshint esversion: 6 */
/*jshint node: true */

"use strict";
var AppPromise = require("bluebird");
var ObjectID = require('mongodb').ObjectID;

/**
 * Points Model
 * @constructor
 */
var rawlocations = function(connection) {
    this.dbConnection = {};
};

/**
 * Set DB Connection
 * @param {object} dbConnection - DB Connection
 * @returns void
 */
rawlocations.prototype.setDbConnection = function(dbConnection) {
    this.dbConnection = dbConnection;
};

/**
 * Get DB Connection
 * @returns {object} dbConnection
 */
rawlocations.prototype.getDbConnection = function() {
    return this.dbConnection;
};

/**
 * Save Raw Points data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
rawlocations.prototype.save = function(data) {
    const rawpointcollection = this.dbConnection.collection('rawlocations');
    if(typeof data._id !== "undefined" && data._id !== null && data._id !== "") {
        return rawpointcollection.update(data, {"$set" : {"_id" : new ObjectID(data._id)}});
    } else {
        return rawpointcollection.insert(data);
    }
};

module.exports = rawlocations;
