var MongooseMutex = require('mongoose-mutex'),
    mongoose = require('mongoose'),
    CronJob = require('cron').CronJob;

/**
 * Crontab mongoose mutex wrapper
 */
var crontabMongooseMutex = {
    
    /**
     * @type Number Mutex time in seconds; 30 secs by default
     */
    mutexTime : 30,
    
    /**
     * Function to init mongoose mutex and mutex lock time
     * 
     * @param string mongoConnectionString Connection string to put mutex to
     * @param {type} mutexTime Mutex lock time in seconds; 30 by default
     */
    init : function(mongoConnectionString, mutexTime) {
        mongoose.connect(mongoConnectionString);
        if (typeof mutexTime !== 'undefined') {
            crontabMongooseMutex.mutexTime = mutexTime;
        }
    }, 
    
    /**
     * Function to start cron task with mongoose mutex
     * 
     * @param mixed code Function to execute
     * @param string mutexId String to identify function
     * @param string crontab Crontab schedule
     */
    main : function(code, mutexId, crontab) {
        var mongooseMutexOptions = {
            connection: mongoose,
            idle: true,
            timeLimit: crontabMongooseMutex.mutexTime * 1000
        };
        new CronJob(crontab, function() {
            var mutex = new MongooseMutex(mutexId, mongooseMutexOptions);
            mutex.claim().then(function(free) {
                code();
                // no need to free mutex because it will expire after timeLimit secs
                //return free();
            }, function(err) {
                throw err;
            });
        }, null, true);
    }
};

module.exports = crontabMongooseMutex;
