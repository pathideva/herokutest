var Agenda = require('agenda');
var agenda  = new Agenda();
var datetime = require('node-datetime');
var cache = require('memory-cache');

var que = require("./queue.js");
var kue = require('kue');
var redis = require('kue/node_modules/redis');

var express = require("express");
var app = express();

var conf = require("./config.js");

const SYNC_JOB = 'minute_sync';
const QUE_UPDATE_JOB = 'update_queue';
const SCHEDULE_FUNC = 'schedule_run';

// then access the current Queue
// var jobs = kue.createQueue({
//     prefix: 'h'
//     , redis: {
//     port: 47269
//     , host: 'ec2-35-168-41-119.compute-1.amazonaws.com' //example
//     , auth: 'p22e1ac9a145e7f24ee7fc7f4ba4bcdcb2ffc05716a0c7a170e2744d8acab8031'
//     , db: 'noakue', // if provided select a non-default redis db
//     }
//     });
var jobs = kue.createQueue();

jobs.process(SYNC_JOB, function(job, done) { 
    console.log('Worker job running.'); 
    console.log(job.data);
    done();
});

//queue update job
jobs.process(QUE_UPDATE_JOB, function(job, done) { 
    console.log('Updating queue ...'); 
    console.log(job.data);
    que.load_queue();
    console.log('Updating queue done.'); 
    done();
});

module.exports = { 
    
    initSchedule : function() { 

        //load queues
        //que.load_queue();
        createJob(QUE_UPDATE_JOB, 'db');

        //set schedule with agenda
        var mongoConnectionString = 
        'mongodb://heroku_zmbsrg4g:pqoi1t66cm0ha4heprbjd791rq@ds133597.mlab.com:33597/heroku_zmbsrg4g';
        //'mongodb://pathi-test:Pathideva1!@ds133597.mlab.com:33597/heroku_zmbsrg4g';
        var ti = datetime.create();
        console.log('time : ' + ti.format('m/d/Y H:M:S'));

        var agenda = new Agenda({db: {address: mongoConnectionString}});

        agenda.define(SCHEDULE_FUNC, function(job, done) {
            var ti = datetime.create();
            var obj = cache.get('minute-queue');
            //get queue set by db
            try{
                var data2 = cache.get(conf.QUEUE_MEMCACH, true);
                var obj2 = JSON.parse(data2);
                console.log(obj2[0].client.url);
            }
            catch (err){
                console.log("mem queue not set");
            }

            //var obj = JSON.parse(data); 
            for(var i = 0; i < obj.length; i++) {
                console.log(obj[i].name);
                var data = '{ name:"' + obj[i].name + ' ", time : "10"}';
                
                createJob(SYNC_JOB, data);

            }
            console.log('test agenda ' +  ti.format('m/d/Y H:M:S'));
            done();
        });
          
        agenda.on('ready', function() {
            //agenda.every('1 minutes', 'logme');
            
            // Alternatively, you could also do:
            agenda.every('*/1 * * * *', SCHEDULE_FUNC);
            
            agenda.start();
        });

    
        return;
    },

   
};

function createJob(name, data){
    var job = jobs.create(name, data);
    job.on('complete', function(){
        console.log(name + " job complete");
    }).on('failed', function(){
        console.log(name + " job failed");
    }).on('progress', function(progress){
        console.log(name +' job #' + job.id + ' ' + progress + '% complete');
    });                
    job.save();
}