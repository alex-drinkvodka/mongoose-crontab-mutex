var MongooseMutex = require('mongoose-mutex'),
    mongoose = require('mongoose'),
    CronJob = require('cron').CronJob;

var crontabMongooseMutex = {
    
    initPassed : 0,
    
    mutexTime : 30,
    
    init : function(mongoConnectionString, mutexTime) {
        mongoose.connect(mongoConnectionString);
        initPassed = 1;
        crontabMongooseMutex.mutexTime = mutexTime;
    }, 
    
    main : function(code, mutexId, crontab) {
        if (crontabMongooseMutex.initPassed === 0) {
            //throw "Mongoose connection has not been initialized";
        }
        var mongooseMutexOptions = {
            connection: mongoose,
            idle: true,
            timeLimit: crontabMongooseMutex.mutexTime * 1000
        };
        new CronJob(crontab, function() {
                console.log('mutex here');
                var mutex = new MongooseMutex(mutexId, mongooseMutexOptions);
                mutex.claim().then(function(free) {
                    code();
                    // no need to free mutex because it will expire after timeLimit secs
                    //return free();
                }, function(err) {
                });
            }, null, true);
    }
};

module.exports = crontabMongooseMutex;
