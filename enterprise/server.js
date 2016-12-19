var express = require('express');
var app = express();
var fs = require("fs");


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/listTravels', function (req, res) {
   fs.readFile( __dirname + "/data/" + "travels.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

app.post('/reservation/:travelId', function (req, res) {
   // Get the travel, and make the reservation if it can be done.
   fs.readFile( __dirname + "/data/" + "travels.json", 'utf8', function (err, data) {
       data = JSON.parse( data );
       var selectedTravel = data["travel"+req.params.travelId];
       console.log(req.params);
       selectedTravel.reservedPlaces += 1;
       data["travel"+req.params.travelId] = selectedTravel;
       console.log(data);
       res.end( "ReservationOK");
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})
