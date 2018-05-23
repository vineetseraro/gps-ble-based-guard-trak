/*jshint esversion: 6 */
/* jshint node: true */
'use strict';

module.exports.handler = (event, context, callback) => {
    try {
        //var fs = require('fs');
        //var contents = fs.readFileSync('test/test.txt').toString();
        //const UtilityLib = require("../lib/utility");
        //const utility = new UtilityLib(); 
        //console.log("1")
        console.log(event);
        //console.log(event.Records.length);
        //console.log(event.detail);
        //console.log(event.Records[0].Sns.Message);

        //console.log(event.Records[0].kinesis);

        //var data = Buffer.from(contents, 'base64').toString(); 
        if(event.Records.length > 0) {
            var db = require("../lib/db");
            var dbObj = new db();
            dbObj.connect("mongodb://127.0.0.1:27017/trackingtestdb").then(function(conn){
                console.log("HERE");
                const collection = conn.collection('testcollection');
                for(var i in event.Records) {
                    console.log(event.Records[i]);
                    var data = Buffer.from(event.Records[i].kinesis.data, 'base64').toString();
                    console.log(data);
                    
                    collection.insert({ "data" : JSON.parse(data), 'gts' : new Date()}, function() {
                        if( i == event.Records.length - 1 ) {
                            conn.close();
                            callback(null, "success");
                        }
                    });
                }
            });
        } else {
            callback(null, "success");
        }
        
        //console.log(Buffer.from(event.Records[0].kinesis.data, 'base64')); 
        //var request = utility.parseInput(event, "SNS");
        //var request = utility.parseInput(data, "STR");
        
        
        /*console.log("IN START");
        var AWS = require('aws-sdk');
        var kinesis = new AWS.Kinesis();
        console.log("IN FUN");
        */
        
        /*var params = {
          ExclusiveStartStreamName: 'LocationPointStream',
          Limit: 1
        };
        kinesis.listStreams(params, function(err, data) {
            console.log("IN SIDE");
          if (err) console.log(err, err.stack); // an error occurred
          else     console.log(data);           // successful response
        });
        */
        
        
        /*kinesis.describeStream({
            StreamName: "LocationPointStream" 
        }, function(err, result){
            console.log(result);
            var shards = result.StreamDescription.Shards;
            console.log(shards);
            
            for(var i=0;i<shards.length;i++) {
                var shardId = shards[i].ShardId;
                var params = {
                    ShardId : shardId,
                    ShardIteratorType: "TRIM_HORIZON",
                    StreamName: "LocationPointStream"
                };

                kinesis.getShardIterator(params, function(err, result) {
                    if (err) console.log(err, err); // an error occurred
                    else   {
                        
                        console.log("N HERE");
                        console.log(result);
                        kinesis.getRecords({
                            ShardIterator: result.ShardIterator,
                            Limit: 10000
                        }, function(err, results){
                            if (err) console.log(err, err); // an error occurred
                            else {
                                console.log("M HERE");
                                console.log(results);
                                if(results.Records.length) {
                                    for(var j=0;j<results.Records.length;j++) {
                                        console.log ( shardId + ',' + results.Records[j].PartitionKey + ',' + results.Records[j].SequenceNumber + ',' + results.Records[j].Data );
                                    }
                                }
                            }
                            
                        })
                    }
                });
            }
        });*/
        
        //console.log(request);
        
    
    } catch(err) {
        console.log("IN ERR");
        callback(new Error("failure : " + err.message));
    }
};
