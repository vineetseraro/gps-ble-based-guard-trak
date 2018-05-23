/*jshint esversion: 6 */
/*jshint node: true */
'use strict';
const promise = require("bluebird");
const UtilityLib = require("./utility");
const utility = new UtilityLib();

/**
 * DB.Library
 * @constructor
 */
var db = function() {
    const mongoDB = require('mongodb');
    const collection = mongoDB.Collection;
    promise.promisifyAll(mongoDB);
    promise.promisifyAll(collection.prototype);
    this.mongoClient = promise.promisifyAll(mongoDB.MongoClient);
};

/**
 * Connect and return db connection
 * @param {string} dsn - db connection string
 * @returns {object} DB Connection
 */
db.prototype.connect = function(dsn) {
  return utility.decryptDbURI(process.env.dbURI).then( (dsn) => { 
      let conn = this.mongoClient.connectAsync(dsn, { promiseLibrary: promise });
      return conn;
  }).catch((err) => {
      utility.debug("IN catch");
      utility.debug(err);
      throw new (err.message)
  });
};

/**
 * Close db connection
 * @param {object} connection - db connection
 * @returns {boolean} 
 */
db.prototype.close = function(connection) {
    utility.debug("IN DB END");
    return connection.close();
};

module.exports = db;
