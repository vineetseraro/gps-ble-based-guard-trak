/*jshint esversion: 6 */
/*jshint node: true */
'use strict';
const AppPromise = require("bluebird");
const UtilityLib = require("./utility");
const utility = new UtilityLib();

/**
 * API Request.Library
 * @constructor
 */
var apirequest = function() {
    
};

/**
 * Make HTTP(S) Request
 * @param {object} data - http request data
 * @param {object} headers - http request headers
 * @returns {promise} Promise
 */
apirequest.prototype.doRequest = function(data, headers) {
    return new AppPromise( (resolve, reject) => {
    
        var http;
        if(data.port === 80) {
            http = require('http');
        } else {
            http = require('https');
        }
        
        var options = {
            hostname: data.host,
            method: data.method, 
            port: data.port ? data.port : 443,
            path: data.uri
        };
        
        //utility.debug(options);
        
        if(typeof headers !== "undefined") {
            options.headers = headers;
        } else {
            options.headers = {
                "Accept" : "application/json",
                "authorization" : "noauth"
            };
        }
        //utility.debug(options)
        let body = '';
        let requestObj = http.request(options, (response) => {
          //utility.debug(options);
          //utility.debug(data);
            if (response.statusCode < 200 || response.statusCode >= 300) {
                // First reject
                reject(new Error('A statusCode=' + response.statusCode + ' statusMessage=' + response.statusMessage));
                return;
            }
            response.setEncoding('utf8');
            response.on('error', () => {
                reject(new Error('er statusCode=' + response.message));
                //resolve(JSON.parse(body));
            });
            response.on('timeout', () => {
                reject(new Error('tm statusCode=' + response.statusCode));
                //resolve(JSON.parse(body));
            });
            response.on('data', (chunk) => {
                body += chunk;
                //utility.debug('CHUNK: ' + chunk);
            });
            response.on('end', () => {
                resolve(JSON.parse(body));
            });
        }).on('error', (e) => {
            reject(new Error('msg=' + e.message));
            //resolve(JSON.parse(body));
        });
        
        if(data.method == "POST") {
          //utility.debug(data);
          requestObj.write(JSON.stringify(data.data));
        }
        
        //utility.debug("IN END")
        requestObj.end();
    });
};

module.exports = apirequest;
