/**
 * fillTableWithAllTravels(paths): add the given travels to the table. 
 */
function fillTableWithAllTravels(paths){
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
    var buttonConfirm = document.createElement('BUTTON');
    buttonConfirm.appendChild(document.createTextNode('Reserve'));
    buttonConfirm.style.float='right';
    buttonConfirm.travel = path;
    buttonConfirm.onclick = function(){
      reserveTravels(this.travel);
    };
    //var inputAmountToReserve = document.createElement('INPUT');
    //inputAmountToReserve.style.float='right';
    tableDiv.appendChild(buttonConfirm);
    //tableDiv.appendChild(inputAmountToReserve);
    tableDiv.appendChild(document.createElement('BR'));
    tableDiv.appendChild(document.createElement('BR'));
  }

}

/**
 * fillTableWithOneTravel(): fill the table with the travel corresponding to the path 
 * for confirmation.
 */
function fillTableWithOneTravel(path,reserves) {
  console.log('[LOG] - All the travels has been reserved');
  console.log(path);

  var tableDiv = document.getElementById("travelsTable");
  while(tableDiv.firstChild){
    tableDiv.removeChild(tableDiv.firstChild);
  }
  tableDiv.style.width = "500px";

  var pathTr = document.createElement('TR');
  
  var pathTable = document.createElement('TABLE');
  pathTable.border='1';
    
  var pathTableCaption = document.createElement('CAPTION');
  pathTableCaption.appendChild(document.createTextNode("Confirmation"));
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
  var buttonConfirm = document.createElement('BUTTON');
  buttonConfirm.appendChild(document.createTextNode('Confirm'));
  buttonConfirm.style.float='right';
  buttonConfirm.travel = path;
  buttonConfirm.reserves = reserves;
  buttonConfirm.onclick = function(){
    confirmTravels(this.travel,this.reserves);
  };

  var buttonCancel = document.createElement('BUTTON');
  buttonCancel.appendChild(document.createTextNode('Cancel'));
  buttonCancel.style.float='left';
  buttonCancel.travel = path;
  buttonCancel.onclick = function(){
    reserveTravels(this.travel);
  };

  tableDiv.appendChild(document.createElement('BR'));
  tableDiv.appendChild(document.createElement('BR'));
  tableDiv.appendChild(buttonConfirm);
  tableDiv.appendChild(buttonCancel);
  tableDiv.appendChild(document.createElement('BR'));
  tableDiv.appendChild(document.createElement('BR'));

}
