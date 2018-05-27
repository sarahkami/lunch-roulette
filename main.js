var lunchLocations = [];

fetch("http://localhost:8000/locations.json")
  .then(function(response) {
    return response.json();
})
.then(function(locations) {
  lunchLocations = locations;
  //displays the weekley selection initially
  showWeeklySelection(thisWeek);
})

/*
get value from localStorage or sets value to empty Array if not defined
localStorage returns only Strings.
Therefor JSON.parse is needed to transform the String to Array Object
*/
var thisWeek = JSON.parse(localStorage.getItem("thisWeek")) || [];

function selectLocation(lunchLocations, thisWeek, includeVisitedLocations){
  var filteredLocations = filterVisitedLocations(lunchLocations, includeVisitedLocations ? [] : thisWeek);
  //if there are no more options left, an empty Array will be returned
  if(filteredLocations.length == 0){
    throw new Error("leider keine Optionen mehr verfügbar");
    return;
  };
  var chosenLocationIndex = Math.round(Math.random() * (filteredLocations.length-1));
  var chosenLocation = filteredLocations[chosenLocationIndex];
  thisWeek.push(chosenLocation.id);
  localStorage.setItem("thisWeek", JSON.stringify(thisWeek));
  if(thisWeek.length > 5){
    resetThisWeek();
    return;
  }
  return chosenLocation;
};

function filterVisitedLocations(lunchLocations, thisWeek){
  return lunchLocations.filter(function(location){
    return !thisWeek.includes(location.id);
  });
};

function filterByDuration(lunchLocations, availableTime){
  return lunchLocations.filter(function(location){
    return location.duration <= availableTime;
  });
};

function showWeeklySelection(thisWeek){
  thisWeek.forEach(function(id, index){
    var lunchLocation = lunchLocations.find(function(location){
      return id === location.id
    });
    document.getElementById(index).innerText = lunchLocation.name;
  });
};

/* funktion wo ich alle objekte aus lunchLocations in dem div (id="availableLocations") als einzelne span ausgeben lassen.
mit Hilfe von .map funktion wird ein neues Array erzeugt
map.(...ein <span> pro Element ausgeben...).join()
innerhalb der .map funktion brauche ich eine bedingung, ob das Objekt auch in thisWeek ist, dann setze eine bestimmte Klasse
*/

function resetThisWeek() {
  thisWeek = [];
  localStorage.setItem("thisWeek", JSON.stringify(thisWeek));
  for(var i = 0; i < 5; i++){
    document.getElementById(i).innerText = "";
  }
  document.getElementById("chosenLocation").innerText = "";
};

function handleLocationButtonClick(){
  try {
    var availableTime = parseInt(document.getElementById("chooseAvailableTime").value);
    var chosenLocation = selectLocation(filterByDuration(lunchLocations, availableTime), thisWeek, document.getElementById("includeVisitedLocations").checked);
    showWeeklySelection(thisWeek);
    if(chosenLocation){
      document.getElementById("chosenLocation").innerText = chosenLocation.name;
    };
  } catch(error) {
    alert(error);
  }
};

document.getElementById("chooseLocationButton")
        .addEventListener("click", handleLocationButtonClick);
