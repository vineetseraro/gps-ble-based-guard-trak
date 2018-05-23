/*jshint esversion: 6 */
/*jshint node: true */
'use strict';

/**
 * Process Points Lambda Function
 * @constructor
 */
module.exports.handler = (event, context, callback) => {
    
    const UtilityLib = require("../lib/utility");
    const utility = new UtilityLib();

    const LambdaLib = require("../lib/aws/lambda");
    const lambda = new LambdaLib();

    try {
        event.trLbdTm = new Date();
        lambda.executeAsync(process.env.pointLocationLambda, event, () => {
          utility.debug("Request transferred");
          callback(null, utility.successResponse({
              httpCode: 200,
              message: 'Tracking function executed successfully!'
              //results: results
          }));
        });
        
        
    } catch(err) {
        callback(utility.errorResponse({
            httpCode: 502,
            errorCode: err.code,
            message: err.message
        }));
    }
};
