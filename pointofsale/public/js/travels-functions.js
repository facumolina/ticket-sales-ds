var enterpriseServers = ["http://localhost:8081","http://localhost:8082","http://localhost:8083"];

var travels = new graphlib.Graph(); // creates a graph
var paths = [];

// Timestamp for event synchronization
var time_stamp=0;

/**
 * searchTravels(): this function call to all the enterprise servers searching for travels. And then each 
 * time that get the response of a server it tries to calculate if there is a possible way from the origin 
 * to the destiny.
 */
function searchTravels() {
  var originSelect = document.getElementById("origin");
  var destinySelect = document.getElementById("destiny");
  
  var originCity = originSelect.options[originSelect.value].text;
  var destinyCity = destinySelect.options[destinySelect.value].text;

  for (var i=0; i < enterpriseServers.length; i++) {
    var serverUrl = enterpriseServers[i];

    var xhttp = new XMLHttpRequest();
    xhttp.serverUrl = serverUrl;
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var jsonTravels = JSON.parse(this.responseText);
        findTravels(originCity,destinyCity,jsonTravels,this.serverUrl);
      }
    };
    xhttp.open("GET", serverUrl+"/listTravels", true);
    xhttp.send();
  }
}

/**
 * findTravels(originCity,destinyCity,jsonTravels,serverUrl): this function calculates all the possible ways
 * to go from the originCity to the destinyCity according the current travels information and the given
 * in jsonTravels.
 */
function findTravels(originCity,destinyCity,jsonTravels,serverUrl) {
  saveTravels(jsonTravels,serverUrl);
  paths = [];
  findAllPaths(travels,originCity,destinyCity,[originCity]);
  fillTableWithAllTravels(paths);
}

/**
 * saveTravels(originCity,destinyCity,jsonTravels): this function saves the given travels to the travels graph.
 */
function saveTravels(jsonTravels,serverUrl) {
  var i;
  for(i = 0; i < jsonTravels.length; i++) {
    var travel = jsonTravels[i];
    travel.providerUrl = serverUrl; 
    if (!travels.hasNode(travel.originCity))
      travels.setNode(travel.originCity);
    if (!travels.hasNode(travel.destinyCity))
      travels.setNode(travel.destinyCity);
    travels.setEdge(travel.originCity,travel.destinyCity,travel);
  }
}
