// Required modules
var express = require('express');
var fs = require("fs");
var bodyParser = require('body-parser');
var PriorityQueue = require('priorityqueuejs');
var reservation = require('./reservation');
var confirmation = require('./confirmation');
var cancellation = require('./cancellation');

var travels;  // All the travels made by the company.
var requestsQueue; // Queue for all the requests.
var time_stamp; // Timestamp for event synchronization

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
   res.end(JSON.stringify(travels));
})

// Reserve a travel
app.post('/reservation', function (req, res) {
  console.log('[LOG] - Reservation received for travel '+req.body.travelId);
  time_stamp = Math.max(req.body.time_stamp, time_stamp) + 1;
  requestsQueue.enq(reservation.buildReservationRequest(req,res,time_stamp));
  processRequests();
})

// Confirm a travel
app.post('/confirmation', function (req, res) {
  console.log('[LOG] - Confirmation received for travel '+req.body.travelId);
  time_stamp = Math.max(req.body.time_stamp, time_stamp) + 1;
  requestsQueue.enq(confirmation.buildConfirmationRequest(req,res,time_stamp));
  processRequests();
})

// Cancel a travel
app.post('/cancellation', function (req, res) {
  console.log('[LOG] - Cancellation received for travel '+req.body.travelId);
  time_stamp = Math.max(req.body.time_stamp, time_stamp) + 1;
  requestsQueue.enq(cancellation.buildCancellationRequest(req,res,time_stamp));
  processRequests();
})

// Run the server
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
  initialize();
});

/**
 * initialize(): initialize all the global variables.
 */
function initialize() {
  // Initialize travels.
  fs.readFile( __dirname + "/data/" + "travels.json", 'utf8', function (err, data) {
    travels = JSON.parse(data);
  });
  // Initialize requests queue,
  requestsQueue = new PriorityQueue(function(a, b) {
    return b.time_stamp - a.time_stamp;
  });
  // Initialize timestamp
  time_stamp = 0;
}

/**
 * processRequests(): process all the current requests.
 */
function processRequests() {
  while (requestsQueue.size()>0) {
    var request = requestsQueue.deq();
    if (request.type === 'RESERVATION') {
      // The request is a reservation.
      reservation.processReservation(travels,request);
    }
    if (request.type === 'CONFIRMATION') {
      confirmation.processConfirmation(travels,request);
    }
    if (request.type === 'CANCELLATION') {
      cancellation.processCancellation(travels,request);
    }
  } 
}