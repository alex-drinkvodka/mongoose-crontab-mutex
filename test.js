var mcm = require('./index');

var mongooseConnectionString = 'mongodb://localhost/exampleMutexDb';
var mutexTimeInSeconds = 10;

// initialize module
mcm.init(mongooseConnectionString, mutexTimeInSeconds);

// function to be tested
function testFunc() {
    console.log('test Func');
}

// start crontab with mongoose mutex
var mutexId = 'test';
var crontab = '* * * * * *';
mcm.main(testFunc, mutexId, crontab);
