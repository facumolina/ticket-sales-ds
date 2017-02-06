// This module contains all the reservation functionality.

var max_reservation_time = 10; // Max reservation time in seconds.

module.exports = {
	
	/**
	 * buildReservation(req,res,time_stamp): build a reservation from the given request and response
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

	 	console.log('[LOG]: Processing reservation for travel: '+travelId+' in time_stamp '+reservation.time_stamp);

	 	// Reserve the place
	 	var reserved = reservePlace(travel); 
	 	if (reserved) {
	 		reservationCancellation(travel);
	 		reservation.res.end("ReservationOK");
	 	} else {
	 		reservation.res.end("ReservationFAIL");
	 	}
	}
};

/**
 * reservePlace(travel): save the reservation and returns
 * true if the reservation can be performed, otherwise it returns false.
 */
function reservePlace(travel){
  if (travel.places-travel.reservedPlaces>0) {
  	travel.reservedPlaces++;
  	console.log('[LOG]: Reservation performed for travel: '+travel.id+'. Total reserved places: '+travel.reservedPlaces);
  	return true;
  } else {
  	console.log('[LOG]: Reservation failed for travel: '+travel.id+'. Total reserved places: '+travel.reservedPlaces);
  	return false;
  }
}

/**
 * reservationCancellation(travel): cancell a reservation in the given travel after the defined time.
 */
function reservationCancellation(travel){
	setTimeout(function(){travel.reservedPlaces--;console.log('[LOG]: Reservation cancelled for travel : '+travel.id+'. Total reserved places: '+travel.reservedPlaces);},max_reservation_time * 1000);
} 