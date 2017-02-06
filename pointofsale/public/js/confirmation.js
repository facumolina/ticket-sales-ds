/**
 * confirmTravels(path): confirm the travels in the given path.
 */
function confirmTravels(path){
  var totalTravels = path.length-1;
  var confirmedTravels = 0;
  var travelPath = path;
  
  for(var i=0; i < totalTravels; i++) {
    var travelInPath = travels.edge({ v: path[i], w: path[i+1] });
    console.log("[LOG] - Sending confirmation request for travel");
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log(this.responseText);
        if (this.responseText === 'CONFIRMATION_SUCCESS') {
          confirmedTravels++;
          console.log("[LOG] - Travel confirmed successfully");
          if (confirmedTravels === totalTravels) {
            console.log("[LOG] - All travels confirmed successfully");
          }
        }
      }
    };
    xhttp.open("POST", travelInPath.providerUrl +"/confirmation", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    time_stamp++;
    xhttp.send(JSON.stringify({travelId:travelInPath.id, time_stamp:time_stamp}));
  }
}