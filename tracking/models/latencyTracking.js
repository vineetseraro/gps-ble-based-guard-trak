/*jshint esversion: 6 */
/*jshint node: true */

"use strict";
var AppPromise = require("bluebird");
var ObjectID = require('mongodb').ObjectID;

/**
 * Points Model
 * @constructor
 */
var latencyTracking = function(connection) {
    this.dbConnection = {};
};

/**
 * Set DB Connection
 * @param {object} dbConnection - DB Connection
 * @returns void
 */
latencyTracking.prototype.setDbConnection = function(dbConnection) {
    this.dbConnection = dbConnection;
};

/**
 * Get DB Connection
 * @returns {object} dbConnection
 */
latencyTracking.prototype.getDbConnection = function() {
    return this.dbConnection;
};

/**
 * Save Points data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
latencyTracking.prototype.save = function(data) {
    const latencytrackingcollection = this.dbConnection.collection('latencyTracking');
    return latencytrackingcollection.findOneAndUpdate({"pkid" : data.pkid}, {$set: data}, {upsert: true});
    /*if(typeof data.pkid !== "undefined" && data.pkid !== null && data.pkid !== "") {
        return latencytrackingcollection.update(data, {"$set" : {"pkid" : data.pkid}});
    } else {
        return latencytrackingcollection.insert(data);
    }*/
};

/**
 * Get Points data
 * @param {object} data - Data to save
 * @returns {object} save result set
 */
latencyTracking.prototype.findOne = function(conditions) {
    const latencytrackingcollection = this.dbConnection.collection('latencyTracking');
    return latencytrackingcollection.findOne(conditions);
};

module.exports = latencyTracking;
