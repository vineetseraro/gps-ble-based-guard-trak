/*jshint esversion: 6 */
/*jshint node: true */
'use strict';

/**
 * Process Points Lambda Function
 * @constructor
 */
module.exports.handler = (event, context, callback) => {
    
    var AppPromise = require("bluebird");

    const UtilityLib = require("../lib/utility");
    const utility = new UtilityLib();

    const ProcessLib = require("./helpers/process");
    var processLib = new ProcessLib();

    const DbLib = require("../lib/db");
    const db = new DbLib();

    try {
        
        utility.debug("IN PROCESS");
        db.connect().then( (dbConn) => {
          const data = utility.parseInput(event, "KINESIS", null);
          // console.log(data);
          // throw new Error();
          //metadata = kdata.metadata;
          //data = kdata.data;
          
          //metadata.locStrmTm = new Date(metadata.approximateArrivalTimestamp * 1000);
          //metadata.trLbdTm = new Date(event.trLbdTm);
          //metadata.ptLbdTm = new Date();
          
          return processLib.prepareData(dbConn, data, event.trLbdTm);
        })
        .then( (results) => {
            utility.debug("IN SUCCSSS");
            processLib.done();
            callback(null, utility.successResponse({
                httpCode: 200,
                message: 'ProcessPointData function executed successfully!'
                //results: results
            }));
        }).catch( (err) => {
            utility.debug("IN FAILURE IN");
            utility.debug(err);
            processLib.done();
            callback(utility.errorResponse({
                httpCode: 501,
                errorCode: err.code,
                message: err.message
            }));
        });
    } catch(err) {
        
        utility.debug("IN FAILURE OUT");
        utility.debug(err)
        processLib.done();
        callback(utility.errorResponse({
            httpCode: 502,
            errorCode: err.code,
            message: err.message
        }));
    }
};
