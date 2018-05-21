var lunchLocations = [
  {id: 1, name: "Norweger"},
  {id: 2, name: "Bestell-Asiate"},
  {id: 3, name: "Cocktail-Inder"},
  {id: 4, name: "Döner"},
  {id: 5, name: "Eule"},
  {id: 6, name: "Taschen-Thai"},
  {id: 7, name: "Falafel"}
];

/*
get value from localStorage or sets value to empty Array if not defined
localStorage returns only Strings.
Therefor JSON.parse is needed to transform the String to Array Object
*/
var thisWeek = JSON.parse(localStorage.getItem("thisWeek")) || [];

function selectLocation(){
  var filteredLocations = filterVisitedLocations(lunchLocations, thisWeek);
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

function showWeeklySelection(thisWeek){
  thisWeek.forEach(function(id, index){
    var lunchLocation = lunchLocations.find(function(location){
      return id === location.id
    });
    document.getElementById(index).innerText = lunchLocation.name;
  });
};

function resetThisWeek() {
  thisWeek = [];
  localStorage.setItem("thisWeek", JSON.stringify(thisWeek));
  for(var i = 0; i < 5; i++){
    document.getElementById(i).innerText = "";
  }
  document.getElementById("chosenLocation").innerText = "";
};

function handleLocationButtonClick(){
  var chosenLocation = selectLocation();
  showWeeklySelection(thisWeek);
  if(chosenLocation){
    document.getElementById("chosenLocation").innerText = chosenLocation.name;
  };
};

document.getElementById("chooseLocationButton")
        .addEventListener("click", handleLocationButtonClick);

//displays the weekley selection initially 
showWeeklySelection(thisWeek);
