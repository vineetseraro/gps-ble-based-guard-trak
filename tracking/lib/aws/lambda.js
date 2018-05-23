/*jshint esversion: 6 */
/*jshint node: true */
'use strict';
const AppPromise = require("bluebird");
const aws = require('aws-sdk');
const awsLambda = new aws.Lambda({
  region: process.env.AWS_REGION //change to your region
});

/**
 * AWS Lambda Wrapper.Library
 * @constructor
 */
var lambda = function() {};

/**
 * Call Lambda function
 * @param {string} functionName - AWS Lambda Name 
 * @param {object} payload - Input Payload
 * @param {function} callback - callback function
 * @returns {void} 
 */
lambda.prototype.execute = function(functionName, payload, callback) {
    return new AppPromise( (resolve, reject) => {
        awsLambda.invoke({
            FunctionName: functionName,
            Payload: JSON.stringify(payload, null, 2) // pass params
        }, (error, result) => {
            if (error) {
                reject(error);
            }
            
            if(!result.Payload) {
                reject("Invalid Results ");
            } else {
                var resultobj = JSON.parse(result.Payload);
                resolve(resultobj);
            }
        });
    }).then( (results) => {
        callback(results);
    }).catch( (err) => {
        callback(null);
    });
};

/**
 * Call Lambda function
 * @param {string} functionName - AWS Lambda Name 
 * @param {object} payload - Input Payload
 * @param {function} callback - callback function
 * @returns {void} 
 */
lambda.prototype.executeAsync = function(functionName, payload, callback) {
    return new AppPromise( (resolve, reject) => {
        awsLambda.invoke({
            FunctionName: functionName,
            InvocationType: 'Event',
            Payload: JSON.stringify(payload, null, 2) // pass params
        }, (error, result) => {
            resolve("OK");
        });
    }).then( (results) => {
        callback(results);
    }).catch( (err) => {
        callback(null);
    });
};

module.exports = lambda;
