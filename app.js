var express = require("express");
var app = express();
var canv = require("./clients/canvas.js");
var sche = require("./scheduler.js");

app.get('/', function(req, res) {
  res.send('Welcome to NOA integration platform');
});
 
app.get('/updateNOA', function(req, res) {
    console.log("Updating NOA ...");
    var sm = canv.sum(1, 2);
    sche.agendatest();
    res.send("Res: Updating NOA 1 ...");
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});