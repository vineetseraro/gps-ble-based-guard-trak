/*jshint esversion: 6 */
/*jshint node: true */
'use strict';
const UtilityLib = require("./utility");
const utility = new UtilityLib();

module.exports = function() {
    this.cacheClient = {};
    this.cacheDriver = {};
    this.cacheType = "memcached";
    //this.config = require("../config").config;
    
    if(this.cacheType === "redis") {
        let redis = require("redis");
        this.cacheClient = redis.createClient(process.env.cacheHost, process.env.cachePort);
        this.cacheClient.on("error", (err) => {
            utility.debug("Error " + err);
        });
        
    } else if(this.cacheType === "memcached") {
        let Memcached = require("memcached");
        this.cacheClient = new Memcached(process.env.cacheHost, process.env.cachePort);
        this.cacheClient.on("failure", (err) => {
            utility.debug("Error " + err);
        });
    } else if(this.cacheType === "memcache") {
        let Memcache = require("memcache");
        this.cacheClient = new Memcache.Client(process.env.cacheHost, process.env.cachePort);
        this.cacheClient.on('connect', () => {
        	// no arguments - we've connected
        });

        this.cacheClient.on('close', () => {
        	// no arguments - connection has been closed
        });

        this.cacheClient.on('timeout', () => {
        	// no arguments - socket timed out
        });

        this.cacheClient.on('error', (e) => {
        	// there was an error - exception is 1st argument
        });

        // connect to the memcache server after subscribing to some or all of these events
        this.cacheClient.connect();

    }
    
    this.getClient = function() {
        return this.cacheClient;
    };
    
    this.set = function(key, value, callback) {
        if(this.cacheType === "memcache") {
            this.cacheClient.set(key, value, 3600, callback);
        } if(this.cacheType === "memcached") {
            this.cacheClient.set(key, value, 3600, callback);
        }
    };
    
    this.getData = function(key, callback) {
        var res = {};
        if(this.cacheType === "memcache") {
            this.cacheClient.get(key, (err, result) => {
                res = result;
                callback(null, result);
            });
            return res;
        } else if(this.cacheType === "memcached") {
            
            //utility.debug(this.cacheClient)
            this.cacheClient.get(key, (err, result) => {
                //utility.debug("IN RES")
                //utility.debug(result)
                res = result;
                callback(null, result);
            });
            return res;
        } else {
            var data = this.cacheClient.get(key, callback);
            return ( (typeof data !== "undefined") ? data : null);    
        }
        
    };
    
    this.remove = function() {
        
    };
    
    this.close = function() {
        if(this.cacheType === "memcache") {
            this.cacheClient.close();
        } 
    };
    
};
