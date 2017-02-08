// This module contains all the confirmation functionality.

var reservation = require('./reservation');

module.exports = {

	/**
	 * buildConfirmationRequest(req,res,time_stamp): build a confirmation from the given request and response
	 * to be enqueued in the requests queue.
	 */
	buildConfirmationRequest: function(req,res,time_stamp){
		var confirmation = {};
		confirmation.travelId = req.body.travelId;
		confirmation.reserve = req.body.reserve;
		confirmation.time_stamp = time_stamp;
		confirmation.res = res;
		confirmation.type = 'CONFIRMATION';
		return confirmation; 
	},

	/**
	 * processConfirmation(travels,confirmation): process the given confirmation in the given travels
	 */
	processConfirmation: function(travels,confirmation) {
	 	
	 	// Get the travel
	 	var travelId = confirmation.travelId;
	 	var travel = travels[travelId-1];

	 	// Get reserve
	 	var reserve = getCorrespondingReserve(confirmation.reserve.id);
	  
	 	if (reserve.status === 'WAITING_CONFIRMATION') {
	 		reserve.status = 'CONFIRMED';
			console.log('[LOG] - Confirming reservation '+ reserve.id +' for travel '+travelId+' from '+travel.originCity+' to '+travel.destinyCity+' in time_stamp '+confirmation.time_stamp+'. Total available places: '+(travel.places-travel.reservedPlaces));
			
			// Confirm the place.
	 		confirmation.res.end("CONFIRMATION_SUCCESS");
	 	} else {
	 		console.log('[LOG] - Reservation '+ reserve.id +' for travel '+travelId+' from '+travel.originCity+' to '+travel.destinyCity+' in time_stamp '+confirmation.time_stamp+' can not be confirmed. Total available places: '+(travel.places-travel.reservedPlaces));
	 		confirmation.res.end("CONFIRMATION_ERROR");	
	 	}
	  
	}
};

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