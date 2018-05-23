/*jshint esversion: 6 */
/*jshint node: true */

"use strict";
var AppPromise = require("bluebird");
var ObjectID = require('mongodb').ObjectID;

/**
 * Points Model
 * @constructor
 */
var rawsensors = function(connection) {
    this.dbConnection = {};
};

/**
 * Set DB Connection
 * @param {object} dbConnection - DB Connection
 * @returns void
 */
rawsensors.prototype.setDbConnection = function(dbConnection) {
    this.dbConnection = dbConnection;
};

/**
 * Get DB Connection
 * @returns {object} dbConnection
 */
rawsensors.prototype.getDbConnection = function() {
    return this.dbConnection;
};

/**
 * Save Raw Points data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
rawsensors.prototype.save = function(data) {
    const rawsensorscollection = this.dbConnection.collection('rawsensors');
    if(typeof data._id !== "undefined" && data._id !== null && data._id !== "") {
        return rawsensorscollection.update(data, {"$set" : {"_id" : new ObjectID(data._id)}});
    } else {
        return rawsensorscollection.insert(data);
    }
};

/**
 * Save Raw Points data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
rawsensors.prototype.insertMany = function(data) {
    const rawsensorscollection = this.dbConnection.collection('rawsensors');
    return rawsensorscollection.insertMany(data);
};

module.exports = rawsensors;
