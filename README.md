Mongoose crontab mutex
======================

This package is a simple wrapper for mongoose-mutex and cron packages from npm.

Installation
============

```
npm install mongoose-crontab-mutex --save
```

Usage
======================


```
var mcm = require('mongoose-crontab-mutex');

var mongooseConnectionString = 'mongodb://localhost/exampleMutexDb';
var mutexTimeInSeconds = 10;

// initialize module
mcm.init(mongooseConnectionString, mutexTimeInSeconds);
// or use 30 secs by default
// mcm.init(mongooseConnectionString);

// function to be tested
function testFunc() {
    console.log('test Func');
}

// start crontab with mongoose mutex
var mutexId = 'test';
var crontab = '* * * * * *';
mcm.main(testFunc, mutexId, crontab);
```

