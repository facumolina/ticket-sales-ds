var express = require('express');
var app = express();
var fs = require("fs");

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies

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

app.post('/reservation', function (req, res) {
   // Get the travel, and make the reservation if it can be done.
   console.log("STARTING RESERVATION");
   console.log(req.params);
   console.log(req.body);
   fs.readFile( __dirname + "/data/" + "travels.json", 'utf8', function (err, data) {
       console.log("START RESERVATION");
       var travels = JSON.parse( data );
       var travelId = req.body.travelId;
       var reserved = reservationCanBePerformed(travels[travelId-1]); 
       if (reserved) {
        res.end("ReservationOK");
       } else {
        res.end("ReservationFAIL");
       }
   });
})

var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)

})

/**
 * reservePlace(travels,travelId): save the reservation and returns
 * true if the reservation can be performed, otherwise it returns false.
 */
function reservationCanBePerformed(travel){
  // SAVE THE RESERVATION WITH THE TIMESTAMP.
  console.log(travel);
  return (travel.places-travel.reservedPlaces)>0;
}