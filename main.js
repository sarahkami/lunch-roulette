var lunchLocations = [];

fetch("http://localhost:8000/locations.json")
  .then(function(response) {
    return response.json();
})
.then(function(locations) {
  lunchLocations = locations;
  //displays the weekley selection initially
  showWeeklySelection(thisWeek);
  showAvaliableLocations(lunchLocations, thisWeek);
  populateSelect(lunchLocations, thisWeek);
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

function showAvaliableLocations(lunchLocations, thisWeek){
  var includeVisitedLocations = document.getElementById("includeVisitedLocations").checked;
  var availableTime = parseInt(document.getElementById("chooseAvailableTime").value);
  var availableLocations = lunchLocations.map(function(location){
    var locationSpan = document.createElement("span");
    locationSpan.innerText = location.name;
    if(thisWeek.includes(location.id) && !includeVisitedLocations){
      locationSpan.classList.add("notAvailable");
    }
    if(availableTime < location.duration){
      locationSpan.classList.add("notInTime");
    }
    return locationSpan.outerHTML;
  });
  document.getElementById("availableLocations").innerHTML = availableLocations.join(" ");
};

function populateSelect(lunchLocations, thisWeek) {
  var availableTime = parseInt(document.getElementById("chooseAvailableTime").value);
  var includeVisitedLocations = document.getElementById("includeVisitedLocations").checked;
  var filteredLocations = filterVisitedLocations(filterByDuration(lunchLocations, availableTime), includeVisitedLocations ? [] : thisWeek);


  var selectOptionsString = filteredLocations.map(function(location) {
    return "<option>" + location.name + "</option>";
  }).join("");

  document.getElementById("select1").innerHTML = selectOptionsString;
  document.getElementById("select2").innerHTML = selectOptionsString;
  document.getElementById("select3").innerHTML = selectOptionsString;
}


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
    showAvaliableLocations(lunchLocations, thisWeek);
    if(chosenLocation){
      document.getElementById("chosenLocation").innerText = chosenLocation.name;
    };
  } catch(error) {
    alert(error);
  }
};

function handleSelectButtonClick(){
  var selection1 = document.getElementById("select1");
  var selection2 = document.getElementById("select2");
  var selection3 = document.getElementById("select3");

  var selectionText1 = selection1.options[selection1.selectedIndex].text;
  var selectionText2 = selection2.options[selection2.selectedIndex].text;
  var selectionText3 = selection3.options[selection3.selectedIndex].text;

  //fetch mit Post - Daten zum Server schicken, Name der Person muss noch mit rein, beim Format Markus fragen, wie es sein soll
  console.log(JSON.stringify({value1 : selectionText1, value2 : selectionText2, value3: selectionText3}));
  return JSON.stringify({value1 : selectionText1, value2 : selectionText2, value3: selectionText3});
};

document.getElementById("chooseLocationButton")
        .addEventListener("click", handleLocationButtonClick);

document.getElementById("sendSelection")
        .addEventListener("click", handleSelectButtonClick);

document.getElementById("chooseAvailableTime")
        .addEventListener("change", function(e){
          showAvaliableLocations(lunchLocations, thisWeek);
          document.getElementById("availableTime").innerText = e.target.value + " min";
        });

document.getElementById("includeVisitedLocations")
        .addEventListener("change", function(){
          showAvaliableLocations(lunchLocations, thisWeek);
        });

/*
TODO: Array mit Menschen. Alle haben drei Wahlmöglichkeiten (Hardcoded)
gewichtete Zufalls-Auswahl
 */
