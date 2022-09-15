var search = document.getElementById("search");
var autocomplete = document.getElementById("autocomplete");
var trainInfo = document.getElementById("train-info");
var trainRoute = document.getElementById("train-route");

search.addEventListener("keyup", function () {
  var searchtext = search.value.toLowerCase();
  // check if searchtext is empty
  if (searchtext.length === 0) {
    autocomplete.innerHTML = "";
    return;
  } else {
    var result = trainList.filter(function (item) {
      return item.toLowerCase().indexOf(searchtext) > -1;
    });
    autocomplete.innerHTML = "";
    result.map(function (item) {
      var li = document.createElement("li");
      li.innerHTML = item;
      li.className = "autocomplete-item";
      li.onclick = function () {
        search.value = this.innerHTML;
        autocomplete.innerHTML = "";
        search.focus();
      };
      autocomplete.appendChild(li);
    });
  }
});

// when user clicks outside the search box, hide the autocomplete box
document.addEventListener("click", function (e) {
  if (e.target !== search) {
    autocomplete.innerHTML = "";
  }
});

// when user clicks on cross button, clear the search box and hide the autocomplete box
search.addEventListener("search", function () {
  autocomplete.innerHTML = "";
  // check if searchtext is as same as in the trainList
  if (search.value.length > 0) {
    if (trainList.indexOf(search.value) > -1) {
        // remove search focus
        search.blur();
        autocomplete.innerHTML = "";
        // get train number from 12345 - ABC EXPRESS to 12345
        var trainNumber = search.value.split(" - ")[0];
        getRoute(trainNumber);
    } else {
      alert("enter a valid train name, or select from the list");
    }
  }
});

search.addEventListener("clear", function (e) {
  autocomplete.innerHTML = "";
});


function getRoute(trainNumber) {
    var epochTime = new Date().getTime();
    var url = "https://www.irctc.co.in/eticketing/protected/mapps1/trnscheduleenquiry/"+trainNumber;
    fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "greq": epochTime,
        }
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        console.log(data);
        trainInfo.innerHTML = "";
        trainRoute.innerHTML = "";
        if (data.errorMessage) {
            alert(data.errorMessage);
            return;
        }
        var trainName = data.trainName;
        var trainNumber = data.trainNumber;
        var stationFrom = data.stationFrom;
        var stationTo = data.stationTo;
        trainInfo.innerHTML = "<h2>"+trainNumber+" - "+trainName+"</h2><p>"+stationFrom+" to "+stationTo+"</p>";
        var schedule = document.createElement("div");
        schedule.className = "schedule";
        if(data.trainRunsOnMon == "Y") {
            var mon = document.createElement("div");
            mon.classList.add("day-yes");
            mon.innerHTML = "Mon";
            schedule.appendChild(mon);
        }
        else if(data.trainRunsOnMon == "N") {
            var mon = document.createElement("div");
            mon.classList.add("day-no");
            mon.innerHTML = "Mon";
            schedule.appendChild(mon);
        }
        if(data.trainRunsOnTue == "Y") {
            var tue = document.createElement("div");
            tue.classList.add("day-yes");
            tue.innerHTML = "Tue";
            schedule.appendChild(tue);
        }
        else if(data.trainRunsOnTue == "N") {
            var tue = document.createElement("div");
            tue.classList.add("day-no");
            tue.innerHTML = "Tue";
            schedule.appendChild(tue);
        }
        if(data.trainRunsOnWed == "Y") {
            var wed = document.createElement("div");
            wed.classList.add("day-yes");
            wed.innerHTML = "Wed";
            schedule.appendChild(wed);
        }
        else if(data.trainRunsOnWed == "N") {
            var wed = document.createElement("div");
            wed.classList.add("day-no");
            wed.innerHTML = "Wed";
            schedule.appendChild(wed);
        }
        if(data.trainRunsOnThu == "Y") {
            var thu = document.createElement("div");
            thu.classList.add("day-yes");
            thu.innerHTML = "Thu";
            schedule.appendChild(thu);
        }
        else if(data.trainRunsOnThu == "N") {
            var thu = document.createElement("div");
            thu.classList.add("day-no");
            thu.innerHTML = "Thu";
            schedule.appendChild(thu);
        }
        if(data.trainRunsOnFri == "Y") {
            var fri = document.createElement("div");
            fri.classList.add("day-yes");
            fri.innerHTML = "Fri";
            schedule.appendChild(fri);
        }
        else if(data.trainRunsOnFri == "N") {
            var fri = document.createElement("div");
            fri.classList.add("day-no");
            fri.innerHTML = "Fri";
            schedule.appendChild(fri);
        }
        if(data.trainRunsOnSat == "Y") {
            var sat = document.createElement("div");
            sat.classList.add("day-yes");
            sat.innerHTML = "Sat";
            schedule.appendChild(sat);
        }
        else if(data.trainRunsOnSat == "N") {
            var sat = document.createElement("div");
            sat.classList.add("day-no");
            sat.innerHTML = "Sat";
            schedule.appendChild(sat);
        }
        if(data.trainRunsOnSun == "Y") {
            var sun = document.createElement("div");
            sun.classList.add("day-yes");
            sun.innerHTML = "Sun";
            schedule.appendChild(sun);
        }
        else if(data.trainRunsOnSun == "N") {
            var sun = document.createElement("div");
            sun.classList.add("day-no");
            sun.innerHTML = "Sun";
            schedule.appendChild(sun);
        }
        trainInfo.appendChild(schedule);
        var th1 = document.createElement("th");
        th1.innerHTML = "Station";
        trainRoute.appendChild(th1);
        var th2 = document.createElement("th");
        th2.innerHTML = "Arrival";
        trainRoute.appendChild(th2);
        var th3 = document.createElement("th");
        th3.innerHTML = "Departure";
        trainRoute.appendChild(th3);
        var th4 = document.createElement("th");
        th4.innerHTML = "Distance";
        trainRoute.appendChild(th4);
        var th5 = document.createElement("th");
        th5.innerHTML = "Halt";
        trainRoute.appendChild(th5);

        for(var i=0; i<data.stationList.length; i++) {
            var route = document.createElement("tr");
            route.className = "route";
            var station = document.createElement("td");
            station.className = "station";
            station.innerHTML = data.stationList[i].stationName;
            var arrival = document.createElement("td");
            arrival.className = "arrival";
            arrival.innerHTML = data.stationList[i].arrivalTime;
            var departure = document.createElement("td");
            departure.className = "departure";
            departure.innerHTML = data.stationList[i].departureTime;
            var distance = document.createElement("td");
            distance.className = "distance";
            distance.innerHTML = data.stationList[i].distance + " km";
            var halt = document.createElement("td");
            halt.className = "halt";
            if(data.stationList[i].haltTime != "--") {
                halt.innerHTML = data.stationList[i].haltTime + " mins";
            }else {
                halt.innerHTML = data.stationList[i].haltTime;
            }
            route.appendChild(station);
            route.appendChild(arrival);
            route.appendChild(departure);
            route.appendChild(distance);
            route.appendChild(halt);
            trainRoute.appendChild(route);
        }


    }).catch(function (error) {
        console.log(error);
    });
}