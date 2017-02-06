/**
 * reserveTravels(path): reserve the travels in the given path.
 */
function reserveTravels(path){
  var totalTravels = path.length-1;
  var reservedTravels = 0;
  var travelPath = path;
  
  for(var i=0; i < totalTravels; i++) {
    var travelInPath = travels.edge({ v: path[i], w: path[i+1] });
    console.log("[LOG] - Sending reservation request for travel");
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        if (this.responseText === 'RESERVATION_SUCCESS') {
          reservedTravels++;
          console.log("[LOG] - Travel reserved successfuly");
          if (reservedTravels === totalTravels) {
            fillTableWithOneTravel(travelPath);
          }
        }
        if (this.responseText === 'RESERVATION_FAILURE') {
          console.log("[LOG] - Travel reservation has failed");
        }
      }
    };
    xhttp.open("POST", travelInPath.providerUrl +"/reservation", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    time_stamp++;
    xhttp.send(JSON.stringify({travelId:travelInPath.id, time_stamp:time_stamp}));
  }
}
