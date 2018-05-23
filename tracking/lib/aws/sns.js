/*jshint esversion: 6 */
/*jshint node: true */
'use strict';

const aws = require('aws-sdk');
const awsSns = new aws.SNS();

/**
 * AWS SNS Wrapper.Library
 * @constructor
 */
var sns = function() {};

/**
 * Publish on AWS SNS Topic
 * @param {string} topicArn - AWS SNS Topic ARN 
 * @param {object} data - Data to publish
 * @param {function} callback - callback function
 * @returns {void} 
 */
sns.prototype.publish = (topicArn, data, callback) => {
    var params = {
        Message: JSON.stringify(data), 
        //Subject: "LocationPoint From Lambda",
        TopicArn: topicArn
    };

    awsSns.publish(params, callback);
};

module.exports = sns;
