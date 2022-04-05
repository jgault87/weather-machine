var searchEl = document.getElementById("searchBtn");
var cityInput = document.getElementById("cityInput");
var currentWeatherEl = document.getElementById("city-name");
var tempEl = document.getElementById("temp");
var humidityEl = document.getElementById("humidity");
var iconEl = document.getElementById("weather-icon");
var windSpeedEl = document.getElementById("windSpeed");
var UVIndexEl = document.getElementById("UV-index");
var forecastElHead = document.getElementById("forecast-head");
var forecastElBody = document.querySelectorAll(".forecast");

var historyEl = document.getElementById("search-list");

// var searchHistoryEl = document.getElementById("history");

var unhide = document.getElementById("results");
var unhide2 = document.getElementById("foot");

var previousSearches = [];

init();

// onecall weather apikey var
var APIKey = "d11b55d32ed7a61161ed887f7799ce29";

// get current date
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0");
var yyyy = today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

today = "(" + mm + "/" + dd + "/" + yyyy + ")";

var timeEl = document.getElementById('time');
 



//function for current weather
function getWeather(city) {
  var callURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&lat=&lon=" +
    "&units=imperial" /*<--convert units*/ +
    "&appid=" +
    APIKey;
  // &units=imperial added to query URL for the US antiquated measurement system

  console.log(callURL);

  fetch(callURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })

    .then(function (response) {
      console.log(response); //check results

      //parse results to page

      var currentCity =
        response.name + "," + " " + response.sys.country + " " + today;
      // render weather icon below this line

      let description = "Condition: " + response.weather[0].main;
      let imageURL =
        "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      let weatherIcon = document.createElement("img");
      weatherIcon.setAttribute("src", imageURL);
      iconEl.append(description, weatherIcon);

      var currentHumidity = "Humidity: " + response.main.humidity + "%";
      var currentTemp = "Temperature: " + response.main.temp + " ℉";
      var currentWind = "Wind: " + response.wind.speed + " MPH";

      var UVCoordLat = response.coord.lat;
      var UVCoordLon = response.coord.lon;

      currentWeatherEl.innerHTML = currentCity;
      tempEl.innerHTML = currentTemp;
      windSpeedEl.innerHTML = currentWind;
      humidityEl.innerHTML = currentHumidity;
      

      var UVcall =
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        UVCoordLat +
        "&lon=" +
        UVCoordLon +
        "&units=imperial" /*<--convert units*/ +
        "&appid=" +
        APIKey;

      console.log(UVcall);

      fetch(UVcall)
        .then(function (UVresponse) {
          return UVresponse.json();
        })

        //color coding for UVI response severity
        .then(function (UVresponse) {
          console.log(UVresponse);
          UVeye = UVresponse.current.uvi;
          currentUVI = "UV Index: " + UVresponse.current.uvi;
          UVIndexEl.innerHTML = currentUVI;
          

          if (UVeye >= 0 && UVeye < 3) {
            console.log("yep");
            
            UVIndexEl.className = "uvi-low";
          } else if (UVeye >= 3 && UVeye < 6) {
            UVIndexEl.className = "uvi-med";
          } else if (UVeye >= 6 && UVeye < 8) {
            UVIndexEl.className = "uvi-high";
          } else if (UVeye >= 8) {
            UVIndexEl.className = "uvi-vhigh";
          }
        });
    });
}

//function for 5-day forcast

function getForecast(city) {
  var castURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
    "&units=imperial" /*<--convert units*/ +
    "&appid=" +
    APIKey;

  console.log(castURL);

  fetch(castURL)
    .then(function (response) {
      if (!response.ok) {
        throw response.json();
      }

      return response.json();
    })

    .then(function (response) {
      console.log(response); //check results

      //parse results to page
      printForecast(response);
    });
}

function printForecast(forecast) {
  console.log(forecast.list[0].weather[0].icon);

  //loop through 5 classes to match response.index value for 5 day forecast

  for (i = 0; i < forecastElBody.length; i++) {
    let forecastResult = i * 8 + 4;

    //translate date from response to proper format
    let forecastDate = new Date(forecast.list[forecastResult].dt * 1000);
    let forecastDay = forecastDate.getDate();
    let forecastMonth = forecastDate.getMonth() + 1;
    let forecastYear = forecastDate.getFullYear();

    // continue use of looping forecastEl index to parse/print responses into div else
    let forecastDateEl = document.createElement("p");
    forecastDateEl.setAttribute("class", "mt-3 forecast-date");
    forecastDateEl.innerHTML =
      forecastMonth + "/" + forecastDay + "/" + forecastYear;
    forecastElBody[i].append(forecastDateEl);

    //insert icon elements
    let imageURL =
      "https://openweathermap.org/img/w/" +
      forecast.list[forecastResult].weather[0].icon +
      ".png";
    let weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", imageURL);
    forecastElBody[i].append(weatherIcon);

    //render 5 day temp elements
    let forecastTempEl = document.createElement("p");
    forecastTempEl.innerHTML =
      "Temp: " + forecast.list[forecastResult].main.temp + " ℉";
    forecastElBody[i].append(forecastTempEl);

    //render 5 day wind elements
    let forecastWindEl = document.createElement("p");
    forecastWindEl.innerHTML =
      "Wind: " + forecast.list[forecastResult].wind.speed + " MPH";
    forecastElBody[i].append(forecastWindEl);
    //render 5 day humidity elements
    let forecastHumEl = document.createElement("p");
    forecastHumEl.innerHTML =
      "Humidity: " + forecast.list[forecastResult].main.humidity + " %";
    forecastElBody[i].append(forecastHumEl);
  }
}

// search query click event

cityInput.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    document.getElementById("searchBtn").click();
  }
});

searchEl.addEventListener("click", function () {
  if (!cityInput.value) {
    return;
  } else {
    const searchQ = cityInput.value.trim();
    getWeather(searchQ); /*<--pass search query to call current weather */
    getForecast(searchQ); /*<--pass search query to call 5day forecast */
    unhide.classList.remove("d-none"); /* unhide main results div & children */
    // console.log(searchQ);
    previousSearches.push(searchQ);
    resetInput(searchQ);

    //push string into previous searches array and render any history
    renderHistory();
    storeHistory();

    //keeps icon from stacking on multiple search
    iconEl.innerHTML = " ";

    // clear if there was a previously rendered five day forecast
    for (i = 0; i < forecastElBody.length; i++) {
      forecastElBody[i].textContent = " ";
    }
  }
});

//check/retreive stored searches if none exist begin entry
function init() {
  var storedPreviousSearches = JSON.parse(
    localStorage.getItem("previousSearches")
  );

  if (storedPreviousSearches !== null) {
    previousSearches = storedPreviousSearches;
  }

  renderHistory();
}

function renderHistory() {
  historyEl.innerHTML = "";
  for (var i = 0; i < previousSearches.length; i++) {
    var previousSearch = previousSearches[i];

    var li = document.createElement("li");
    li.textContent = previousSearch;
    li.setAttribute("data-index", i);
    li.addEventListener("click", function () {
      //  searchReturn = li.textContent.split('clear');
      searchReturn = this.textContent.split("clear");
      console.log(searchReturn[0]);

      //keeps icon from stacking on multiple search
      iconEl.innerHTML = " ";

      // clear if there was a previously rendered five day forecast
      for (i = 0; i < forecastElBody.length; i++) {
        forecastElBody[i].textContent = " ";
      }
      unhide.classList.remove("d-none");

      getWeather(searchReturn[0]);
      getForecast(searchReturn[0]);
    });

    var button = document.createElement("button");
    button.textContent = "clear";

    historyEl.appendChild(li);
    li.appendChild(button);
    
  }
}

function storeHistory() {
  // Stringify and set key in localStorage array
  localStorage.setItem("previousSearches", JSON.stringify(previousSearches));
}

//appends clear button to each stored search
historyEl.addEventListener("click", function (event) {
  var element = event.target;
  // Checks if element is a button
  if (element.matches("button") === true) {
    var index = element.parentElement.getAttribute("data-index");
    previousSearches.splice(index, 1);

    storeHistory();
    renderHistory();
  }
});

// clear input field after submission
function resetInput() {
  cityInput.value = "";

  //unhide footer
  unhide2.classList.remove("d-none");
}

//clear history
var clearHistory = document.getElementById("clear-history");
clearHistory.addEventListener("click", function () {
  console.log("Clear History");
  localStorage.removeItem("previousSearches");
  previousSearches = [];
  renderHistory();
});
