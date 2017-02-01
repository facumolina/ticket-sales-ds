// Required modules
var express = require('express');
var fs = require("fs");
var bodyParser = require('body-parser');

// Include priority queue file.
var PriorityQueue = require('priorityqueuejs');

var requestsQueue = new PriorityQueue(function(a, b) {
  return b.time_stamp - a.time_stamp;
});

requestsQueue.enq({ time_stamp: 250, name: 'req1' });
requestsQueue.enq({ time_stamp: 251, name: 'req2' });
requestsQueue.enq({ time_stamp: 254, name: 'req3' });

// Timestamp for event synchronization
var time_stamp=0;

// Configure
var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Get the list of all travels made by this company.
app.get('/listTravels', function (req, res) {
   fs.readFile( __dirname + "/data/" + "travels.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

// Reserve a travel
app.post('/reservation', function (req, res) {
   // Enqueue the reservation
   requestsQueue.enq(buildReservationRequest(req,res));
   console.log('Reservation enqueued');
   console.log(requestsQueue);

   // Get the params
   var travelId = req.body.travelId;
   var receivedtimestamp = req.body.time_stamp;
   
   fs.readFile( __dirname + "/data/" + "travels.json", 'utf8', function (err, data) {
       // Get the travel, and make the reservation if it can be done.
       console.log("START RESERVATION");
       var travels = JSON.parse( data );
       var reserved = reservePlace(travels[travelId-1]); 
       if (reserved) {
        res.end("ReservationOK");
       } else {
        res.end("ReservationFAIL");
       }
   });
})

// Run the server
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)

  //while(true) {
  //  if (requestsQueue.size() > 0) {
      // There is at least one request to be processed.
  //    console.log('Processing request');
  //    console.log(requestsQueue.deq());
  //  }
  //}
});

/**
 * reservePlace(travel): save the reservation and returns
 * true if the reservation can be performed, otherwise it returns false.
 */
function reservePlace(travel){
  // SAVE THE RESERVATION WITH THE TIMESTAMP.
  console.log(travel);
  return (travel.places-travel.reservedPlaces)>0;
}

/**
 * buildReservation(req,res): build a reservation from the given request and response
 * to be enqueued in the requests queue.
 */
function buildReservationRequest(req,res){
  var request = new JSONObject();
  request.req = req;
  request.res = res;
  request.type = 'RESERVATION';
  console.log('Reservation built');
  console.log(request);
  return request;  
}