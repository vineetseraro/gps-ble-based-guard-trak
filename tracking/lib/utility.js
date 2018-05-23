/*jshint esversion: 6 */
/*jshint node: true */
'use strict';

/**
 * Utility.Library
 * @constructor
 */
var AppPromise = require("bluebird");
var utility = function() {};
const KmsLib = require("../lib/aws/kms");
const kms = new KmsLib();

/**
 * Common Success Response 
 * @param {object} data - data
 * @returns {object} response
 */
utility.prototype.successResponse = function(data) {
    const response = {
        statusCode: data.httpCode,
        headers: {
          "Content-Type" : "application/json"
        }, 
        body: JSON.stringify({
            code: data.code,
            message: data.message,
            results: data.results,
        })
    };
    return response;
};

/**
 * Common Error Response 
 * @param {object} data - data
 * @returns {object} response
 */
utility.prototype.errorResponse = function(data) {
    const response = {
        statusCode: data.httpCode ? data.httpCode : 200,
        headers: {
          "Content-Type" : "application/json"
        }, 
        body: JSON.stringify({
            code: data.errorCode,
            message: data.message,
            results: {}
        })
    };
    //return response;
    return new Error(data.message);
};

/**
 * Common Input Parse 
 * @param {object} data - data
 * @param {string} format - input data format APIPOST / APIGET / SNS
 * @returns {object}
 */
utility.prototype.parseInput = function(data, format, callback) {
    let promises;
    switch(format) {
        case "APIPOST":
            return JSON.parse(data.body);
        case "APIGET":
            return data.queryStringParameters;
        case "SNS":
            //return JSON.parse(data.Records[0].Sns.Message);
            
            promises = data.Records.map( (row, idx) => {
                try {
                    let parsedData = JSON.parse(row.Sns.Message);
                    return callback(parsedData);
                } catch (err) {
                    return callback([]);
                }
            });
            
            return AppPromise.all( promises);
            
        case "KINESISOLD":
            this.debug(data.Records);
            promises = data.Records.map( (row, idx) => {
                let parsedData = Buffer.from(row.kinesis.data, 'base64').toString();
                
                try {
                    let jParsedData = JSON.parse(parsedData);
                    this.debug(jParsedData);
                    return callback(jParsedData, {
                      "partitionKey" : row.kinesis.partitionKey,
                      "sequenceNumber" : row.kinesis.sequenceNumber,
                      "eventID" : row.eventID,
                      "approximateArrivalTimestamp" : row.kinesis.approximateArrivalTimestamp,
                    });
                } catch (err) {
                  this.debug(err)
                    return callback([]);
                }
                //return callback(JSON.parse(parsedData));
            });
            return AppPromise.all( promises);
        case "KINESIS":    
            
          const locations = data.Records.map( (row, idx) => {
              let parsedData = Buffer.from(row.kinesis.data, 'base64').toString();
              try {
                let jParsedData = JSON.parse(parsedData);
                // this.debug(jParsedData);
                return {"data": jParsedData, "metadata" : {
                    "partitionKey" : row.kinesis.partitionKey,
                    "sequenceNumber" : row.kinesis.sequenceNumber,
                    "eventID" : row.eventID,
                    "approximateArrivalTimestamp" : row.kinesis.approximateArrivalTimestamp
                  }
                };
              } catch (err) {
                this.debug(err)
                return [];
              }
          });
          return locations;
        case "STR":
            return JSON.parse(data);
        default: 
            return callback(data);
    }
};

/**
 * Parse environment variable
 * @param {string} envVar - environment variable
 * @returns {string}
 */
utility.prototype.parseEnvironmentVar = function(envVar) {
    return envVar;
};

/**
 * Message Handler
 * @param {string} envVar - environment variable
 * @returns {string}
 */
utility.prototype.getMessage = function(envVar) {
    return envVar;
};

/**
 * Message Handler
 * @param {string} envVar - environment variable
 * @returns {string}
 */
utility.prototype.decryptDbURI = function (dbURI) {

  if (process.env.kms === 1 || process.env.kms === '1') {
    return kmsLib.decrypt(dbURI);
  } else {
    return new AppPromise((resolve, reject) => {
      if (dbURI) {
        resolve(dbURI);
      }
      else {
        reject(false);
      }
    });
  }
};



/**
 * Debug messages Handler
 * @param {string} message - log message
 * @returns {string}
 */
utility.prototype.debug = function(message) {
    console.log(message);
};

module.exports = utility;
