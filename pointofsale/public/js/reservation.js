/**
 * reserveTravels(path): reserve the travels in the given path.
 */
function reserveTravels(path){
  var totalTravels = path.length-1;
  var travelPath = path;
  var reservationFailed = false;
  var reserves = [];

  for(var i=0; i < totalTravels; i++) {
    var travelInPath = travels.edge({ v: path[i], w: path[i+1] });
    console.log("[LOG] - Sending reservation request for travel");
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var reserve = JSON.parse(this.responseText);
        if (reserve.status === 'WAITING_CONFIRMATION') {
          reserves.push(reserve);
          console.log("[LOG] - Travel reserved successfully");
          if (reserves.length === totalTravels) {
            fillTableWithOneTravel(travelPath,reserves);
          }
        }
        if (reserve.status === 'FAILED' && !reservationFailed) {
          reservationFailed = true;
          console.log("[LOG] - Travel reservation has failed");
          alert('One reservation has failed. The operation has been cancelled.');
        }
      }
    };
    xhttp.open("POST", travelInPath.providerUrl +"/reservation", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    time_stamp++;
    xhttp.send(JSON.stringify({travelId:travelInPath.id, time_stamp:time_stamp}));
  }
}
