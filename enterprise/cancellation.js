// This module contains all the cancellation functionality.
var reservation = require('./reservation');

module.exports = {

	/**
	 * buildCancellationRequest(req,res,time_stamp): build a cancellation from the given request and response
	 * to be enqueued in the requests queue.
	 */
	buildCancellationRequest: function(req,res,time_stamp){
		var cancellation = {};
		cancellation.travelId = req.body.travelId;
		cancellation.reserve = req.body.reserve;
		cancellation.time_stamp = time_stamp;
		cancellation.res = res;
		cancellation.type = 'CANCELLATION';
		return cancellation; 
	},

	/**
	 * processCancellation(travels,cancellation): process the given cancellation in the given travels
	 */
	processCancellation: function(travels,cancellation) {
	 	
	 	// Get the travel
	 	var travelId = cancellation.travelId;
	 	var travel = travels[travelId-1];

	 	// Get reserve
	 	var reserve = getCorrespondingReserve(cancellation.reserve.id);
	  
	 	if (reserve.status === 'CONFIRMED') {
	 		travel.reservedPlaces--;
	 		reserve.status = 'CANCELLED';
			console.log('[LOG] - Cancelling reservation '+ reserve.id +' for travel '+travelId+' from '+travel.originCity+' to '+travel.destinyCity+' in time_stamp '+cancellation.time_stamp+'. Total available places: '+(travel.places-travel.reservedPlaces));
			
			// Confirm the place.
	 		cancellation.res.end("CANCELLATION_SUCCESS");
	 	} else {
	 		console.log('[LOG] - Cancellation '+ reserve.id +' for travel '+travelId+' from '+travel.originCity+' to '+travel.destinyCity+' in time_stamp '+cancellation.time_stamp+' can not be performed. Total available places: '+(travel.places-travel.reservedPlaces));
	 		cancellation.res.end("CANCELLATION_ERROR");	
	 	}
	  
	}
}

/**
 * getCorrespondingReserve(reserveId): returns the reserve with the given id
 */
function getCorrespondingReserve(reserveId) {
	var reserves = reservation.getReserves();
	for (var i = 0; i < reserves.length; i ++) {
		if (reserves[i].id === reserveId) {
			return reserves[i];
		}
	}
}