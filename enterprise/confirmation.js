// This module contains all the confirmation functionality.

module.exports = {

	/**
	 * buildConfirmationRequest(req,res,time_stamp): build a confirmation from the given request and response
	 * to be enqueued in the requests queue.
	 */
	buildConfirmationRequest: function(req,res,time_stamp){
		var confirmation = {};
		confirmation.travelId = req.body.travelId;
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

	 	console.log('[LOG] - Processing confirmation for travel '+travelId+' in time_stamp '+confirmation.time_stamp);

	 	// Confirm the place.
	 	confirmation.res.end("CONFIRMATION_SUCCESS");
	}
};