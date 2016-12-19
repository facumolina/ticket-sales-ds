var travels = new graphlib.Graph(); // creates a graph
var paths = [];

/**
 * searchTravels(): this function call to all the enterprise servers seaching for travels. And then each 
 * time that get the response of a server it tries to calculate if there is a possible way from the origin 
 * to the destiny.
 */
function search() {
  var originSelect = document.getElementById("origin");
  var destinySelect = document.getElementById("destiny");
  
  var originCity = originSelect.options[originSelect.value].text;
  var destinyCity = destinySelect.options[destinySelect.value].text;
  
  console.log('Searching from '+originCity+' to '+destinyCity);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var jsonTravels = JSON.parse(this.responseText);
      findTravels(originCity,destinyCity,jsonTravels);
    }
  };
  xhttp.open("GET", "http://localhost:8081/listTravels", true);
  xhttp.send();
}

/**
 * findTravels(originCity,destinyCity,jsonTravels): this function calculates all the possible ways
 * to go from the originCity to the destinyCity according the current travels information and the given
 * in jsonTravels.
 */
function findTravels(originCity,destinyCity,jsonTravels) {
  saveTravels(jsonTravels);
  paths = [];
  findAllPaths(originCity,destinyCity,[originCity]);
  fillTravelsTable(paths);
}

/**
 * findAllPaths(originCity,destinyCity): find all paths between originCity and destinyCity
 */
function findAllPaths(originCity,destinyCity,visited){
  var i;
  var successors = travels.successors(originCity);
  for(i = 0; i < successors.length; i++) {
    var successor = successors[i];
    if (successor === destinyCity) {
      var pathFound = visited.concat([destinyCity]);
      paths.push(pathFound);
    } else {
      if (!cityVisited(visited,successor)) {
        findAllPaths(successor,destinyCity,visited.concat([successor]));
      }
    }
  }
}

/*
 * cityVisited(visited,city): determine if the given city was already visited
 */
function cityVisited(visited,city) {
  var i;
  for (i = 0; i < visited.length ; i++) {
    if (visited[i] === city)
      return true;
  }
  return false;
}

/**
 * saveTravels(originCity,destinyCity,jsonTravels): this functios saves the given travels to the travels graph.
 */
 function saveTravels(jsonTravels) {
  var i;
  for(i = 0; i < jsonTravels.length; i++) {
    var travel = jsonTravels[i]; 
    if (!travels.hasNode(travel.originCity))
      travels.setNode(travel.originCity);
    if (!travels.hasNode(travel.destinyCity))
      travels.setNode(travel.destinyCity);
    travels.setEdge(travel.originCity,travel.destinyCity,travel);
  }
}

/**
 * fillTravelsTable(paths): add the given travels to the table. 
 */
function fillTravelsTable(paths){
  var tableDiv = document.getElementById("travelsTable");
  while(tableDiv.firstChild){
    tableDiv.removeChild(tableDiv.firstChild);
  }
  tableDiv.style.width = "500px";

  for (var i=0; i<paths.length; i++){
    var pathTr = document.createElement('TR');
    
    var path = paths[i];
    var pathTable = document.createElement('TABLE');
    pathTable.border='1';
    
    var pathTableCaption = document.createElement('CAPTION');
    pathTableCaption.appendChild(document.createTextNode("Option "+(i+1)));
    pathTable.appendChild(pathTableCaption);

    var pathTableBody = document.createElement('TBODY');
    pathTable.appendChild(pathTableBody);

    var pathTd = document.createElement('TD');
    pathTd.width='1000';
    pathTd.appendChild(pathTable);
    
    
    for (var j=0; j<path.length-1; j++){

      var travelInPath = travels.edge({ v: path[j], w: path[j+1] });
      var travelTr = document.createElement('TR');
      pathTableBody.appendChild(travelTr);

      var originTd = document.createElement('TD');
      var destinyTd = document.createElement('TD');
      originTd.style.paddingTop='10px';
      originTd.width='100';
      originTd.appendChild(document.createTextNode(path[j]));
      destinyTd.style.paddingTop='10px';
      destinyTd.width='100';
      destinyTd.appendChild(document.createTextNode(path[j+1]));
      travelTr.appendChild(originTd);
      travelTr.appendChild(destinyTd);
    }

    pathTr.appendChild(pathTd);
    tableDiv.appendChild(pathTable);
    var buttonSelect = document.createElement('BUTTON');
    buttonSelect.appendChild(document.createTextNode('Reserve'));
    buttonSelect.style.float='right';
    tableDiv.appendChild(buttonSelect);
    tableDiv.appendChild(document.createElement('BR'));
    tableDiv.appendChild(document.createElement('BR'));
  }

}