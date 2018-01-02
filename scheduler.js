var Agenda = require('agenda');
var agenda  = new Agenda();
var datetime = require('node-datetime');
var cache = require('memory-cache');

var que = require("./queue.js");
var kue = require('kue');
var redis = require('kue/node_modules/redis');

var express = require("express");
var app = express();

// then access the current Queue
var jobs = kue.createQueue({
    prefix: 'h'
    , redis: {
    port: 47269
    , host: 'ec2-35-168-41-119.compute-1.amazonaws.com' //example
    , auth: 'p22e1ac9a145e7f24ee7fc7f4ba4bcdcb2ffc05716a0c7a170e2744d8acab8031'
    , db: 'noakue', // if provided select a non-default redis db
    }
    });
//var jobs = kue.createQueue();

jobs.process('minute_tasks', function(job, done) { 
    console.log('Worker job running.'); 
    console.log(job.data);
    done();
});

module.exports = { 
    
    agendatest : function() { 

        //load queues
        que.load_queue();

        //set schedule with agenda
        var mongoConnectionString = 
        'mongodb://heroku_zmbsrg4g:pqoi1t66cm0ha4heprbjd791rq@ds133597.mlab.com:33597/heroku_zmbsrg4g';
        //'mongodb://pathi-test:Pathideva1!@ds133597.mlab.com:33597/heroku_zmbsrg4g';
        var ti = datetime.create();
        console.log('time : ' + ti.format('m/d/Y H:M:S'));

        var agenda = new Agenda({db: {address: mongoConnectionString}});

        agenda.define('minute_schedule', function(job, done) {
            var ti = datetime.create();
            var obj = cache.get('minute-queue');

            //var obj = JSON.parse(data); 
            for(var i = 0; i < obj.length; i++) {
                console.log(obj[i].name);
                var data = '{ name:"' + obj[i].name + ' ", time : "10"}';
                
                var job = jobs.create('minute_tasks', data);
                job.on('complete', function(){
                    console.log("Job complete");
                }).on('failed', function(){
                    console.log("Job failed");
                }).on('progress', function(progress){
                    console.log('job #' + job.id + ' ' + progress + '% complete');
                });                
                job.save();

            }
            console.log('test agenda ' +  ti.format('m/d/Y H:M:S'));
            done();
        });
          
        agenda.on('ready', function() {
            //agenda.every('1 minutes', 'logme');
            
            // Alternatively, you could also do:
            agenda.every('*/1 * * * *', 'minute_schedule');
            
            agenda.start();
        });

       
        // wire up Kue (see /active for queue interface)
        // app.use(kue.app);

        // app.listen(3000);
        // console.log("Express server listening on port %d in %s mode", process.env.PORT, app.settings.env);
    


        return;
    },

   
};