const Memcached = require('memcached');
var memcached = new Memcached('akguardcache.o5llwo.cfg.euw1.cache.amazonaws.com:11211');


memcached.set('foo', 'bar', 10, function (err) { console.log(err) });

/*

const Memcached = require('memcached');
   cacheClient = new Memcached("akguardcache.o5llwo.cfg.euw1.cache.amazonaws.com", 11211);
   cacheClient.on('failure', err => {
      console.log(`Error ${err}`);
   });

cacheClient.on('success', err => {
      console.log("dasda");
   });


cacheClient.set("DK", "DEEPAK");

cacheClient.get("DK", (err, result) => {
        console.log(result);
console.log(err);
      });


/*
// const Memcache = require('memcache');
     cacheClient = new Memcached("akguardcache.o5llwo.cfg.euw1.cache.amazonaws.com", 11211);
    cacheClient.on('connect', () => {
      // no arguments - we've connected
console.log("connected");
    });

    cacheClient.on('close', () => {
      // no arguments - connection has been closed
    });

    cacheClient.on('timeout', () => {
      // no arguments - socket timed out
    });

    cacheClient.on('error', e => {
      // there was an error - exception is 1st argument
console.log("error");
    });

    // connect to the memcache server after subscribing to some or all of these events
    cacheClient.connect();

*/
