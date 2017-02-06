/**
 * cancelConfirmation(path,reserves): cancell all the travels in the given path
 */
function cancelConfirmation(path,reserves){
	var totalTravels = path.length-1;
  var cancelledTravels = 0;
  var cancellationError = false;
	for(var i=0; i < totalTravels; i++) {
    var travelInPath = travels.edge({ v: path[i], w: path[i+1] });
    console.log("[LOG] - Sending cancellation request for travel");
    var reserve = getReserveAssociatedToTravel(travelInPath,reserves);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      	if (this.responseText === 'CANCELLATION_SUCCESS') {
      		cancelledTravels++;
      		console.log("[LOG] - Travel cancelled successfully");
      		if (cancelledTravels === totalTravels) {
            console.log("[LOG] - All travels cancelled successfully");
            alert('All the travels has been cancelled');
            cleanTable();
          }
      	} else {
      		if (!cancellationError) {
      			console.log("[LOG] - Travel cancellation error.");
            alert('A cancellation has failed.');
            cleanTable();
      		}
      	}
      }
    };
    xhttp.open("POST", travelInPath.providerUrl +"/cancellation", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    time_stamp++;
    xhttp.send(JSON.stringify({travelId:travelInPath.id, time_stamp:time_stamp, reserve: reserve}));
  }
}