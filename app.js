var express = require("express");
var app = express();
var canv = require("./clients/canvas.js");
var sche = require("./scheduler.js");
var cors = require('cors');
var db = require("./db.js");
var bodyParser = require('body-parser');

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
  res.send('Welcome to NOA integration platform');
});
 
app.get('/updateNOA', function(req, res) {
    console.log("Updating NOA ...");
    var sm = canv.sum(1, 2);
    sche.initSchedule();
    res.send("Res: Updating NOA 1 ...");
});

app.get('/saveConnection/:name/:timeinterval', cors(), function(req, res) {
    db.save_connection(req, res);
});

app.post('/saveConnection2', function(req, res) {
    console.log(req.body);
    db.save_connection2(req, res);    
});

app.get('/find/:query', cors(), function(req, res) {
    db.find_connection(req, res);
});

app.get('/findall', cors(), function(req, res) {
    db.find_connection_all(req, res);    
});


var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);

  //start the schedule job
  sche.initSchedule();
  console.log("Starting schedule for NOA data sync ...");
});