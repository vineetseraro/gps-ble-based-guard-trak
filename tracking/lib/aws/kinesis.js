/*jshint esversion: 6 */
/*jshint node: true */
'use strict';

const aws = require('aws-sdk');
const awsKinesis = new aws.Kinesis();
const UtilityLib = require("../../lib/utility");
const utility = new UtilityLib();

/**
 * AWS Kinesis Wrapper.Library
 * @constructor
 */
var kinesis = function() {};

/**
 * Publish on AWS SNS Topic
 * @param {string} topicArn - AWS SNS Topic ARN 
 * @param {object} data - Data to publish
 * @param {function} callback - callback function
 * @returns {void} 
 */
kinesis.prototype.publish = (streamName, partitionKey, data, callback) => {
    var params = {
        Data: JSON.stringify(data),
        PartitionKey: partitionKey,
        StreamName: streamName
    };
    //utility.debug(params);
    awsKinesis.putRecord(params, function(err, data) {
        if (err) { 
            utility.debug("IN KIN ERR")
            throw new Error(err.message);
        } else { 
            utility.debug("IN KIN SUCC")
            callback(data);           // successful response
        }
    });
};

module.exports = kinesis;
