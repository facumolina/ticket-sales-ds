// This module contains all the reservation functionality.

var max_reservation_time = 10; // Max reservation time in seconds.
var nextReserveId = 1;
var allReserves = [];

var PENDING_STATUS = 'WAITING_CONFIRMATION';
var CONFIRMED_STATUS = 'CONFIRMED';
var CANCELLED_STATUS = 'CANCELLED';
var FAILED_STATUS = 'FAILED';

module.exports = {
	
	/**
	 * buildReservationRequest(req,res,time_stamp): build a reservation from the given request and response
	 * to be enqueued in the requests queue.
	 */
	buildReservationRequest: function(req,res,time_stamp){
		var reservation = {};
		reservation.travelId = req.body.travelId;
		reservation.time_stamp = time_stamp;
		reservation.res = res;
		reservation.type = 'RESERVATION';
		return reservation; 
	},

	/**
	 * proccessReservation(travels,reservation): process the given reservation in the given travels
	 */
	processReservation: function(travels,reservation) {
	 	
	 	// Get the travel
	 	var travelId = reservation.travelId;
	 	var travel = travels[travelId-1];

	 	console.log('[LOG] - Processing reservation for travel '+travelId+' in time_stamp '+reservation.time_stamp);

	 	// Reserve the place
	 	reservation.res.end(JSON.stringify(reservePlace(travel))); 

	},

	/**
	 * getReserves(): return the reserves
	 */
	getReserves: function() {
		return allReserves;
	}
};

/**
 * reservePlace(travel): save the reservation and returns
 * true if the reservation can be performed, otherwise it returns false.
 */
function reservePlace(travel){
  var reserve = {};
	reserve.id = nextReserveId;
	nextReserveId++;
	reserve.travelId = travel.id;
  if (travel.places-travel.reservedPlaces>0) {
  	travel.reservedPlaces++;
  	reserve.status = PENDING_STATUS;
  	var reserveIndex = allReserves.push(reserve)-1;
  	reservationCancellation(travel,reserveIndex,reserve.id);
  	console.log('[LOG] - Reservation '+ reserve.id +' performed for travel '+travel.id+'. Total reserved places: '+travel.reservedPlaces);
  } else {
  	reserve.status = FAILED_STATUS;
  	console.log('[LOG] - Reservation '+ reserve.id +' failed for travel '+travel.id+'. Total reserved places: '+travel.reservedPlaces);
  }
  return reserve;
}

/**
 * reservationCancellation(travel,reserveIndex,reserveId): cancell a reservation in the given travel after the defined time.
 */
function reservationCancellation(travel,reserveIndex,reserveId){
	setTimeout(function(){
		var reserve = allReserves[reserveIndex];
		if (reserve.id === reserveId && reserve.status === PENDING_STATUS) {
			travel.reservedPlaces--;
			reserve.status = CANCELLED_STATUS;
			console.log('[LOG] - Reservation '+ reserve.id +' cancelled for travel '+travel.id+'. Total reserved places: '+travel.reservedPlaces);}
		}
		,max_reservation_time * 1000);
} 