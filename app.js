var express = require("express");
var app = express();
 
app.get('/', function(req, res) {
  res.send('Every day in every way I\'m serving more requests');
});
 
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});