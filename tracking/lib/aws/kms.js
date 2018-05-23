/*jshint esversion: 6 */
/*jshint node: true */
'use strict';

const AppPromise = require('bluebird');
const aws = require('aws-sdk');
const awsKms = new aws.KMS();

/**
 * AWS KMS Wrapper.Library
 * @constructor
 */
var kms = function() {};

/**
 * Decrypt KMS Data
 * @param {string} envVariable - Encrypted Data  
 * @returns {promise} Promise 
 */
kms.prototype.decrypt = (envVariable) => {
    return new AppPromise((resolve, reject) => {
        awsKms.decrypt({CiphertextBlob: new Buffer(envVariable, 'base64')}, (err, data) => {
            if (err) { 
                reject(err);
            } else {
                resolve(data.Plaintext.toString('ascii'));
            } 
        });
    });
};

module.exports = kms;
