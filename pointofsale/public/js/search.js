function search() {
  var originSelect = document.getElementById("origin");
  var destinySelect = document.getElementById("destiny");
  
  var originCity = originSelect.options[originSelect.value].text;
  var destinyCity = destinySelect.options[destinySelect.value].text;
  
  console.log('Searching from '+originCity+' to '+destinyCity);

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log('response');
      console.log(this.responseText);
    }
  };
  xhttp.open("GET", "http://localhost:8081/listUsers", true);
  xhttp.send();
}
