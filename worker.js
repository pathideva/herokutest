
var kue = require('kue');
var redis = require('kue/node_modules/redis');


var jobs = kue.createQueue({
    prefix: 'h'
    , redis: {
    port: 47269
    , host: 'ec2-35-168-41-119.compute-1.amazonaws.com' //example
    , auth: 'p22e1ac9a145e7f24ee7fc7f4ba4bcdcb2ffc05716a0c7a170e2744d8acab8031'
    , db: 'noakue', // if provided select a non-default redis db
    }
    });

jobs.process('minute_tasks', function(job, done) { 
    console.log('Worker job running.'); 
    console.log(job.data);
    done();
});