var searchEl = document.getElementById("searchBtn");
var cityInput = document.getElementById("cityInput");
var currentWeatherEl = document.getElementById("city-name");
var tempEl = document.getElementById("temp");
var humidityEl = document.getElementById("humidity");
var windSpeedEl = document.getElementById("windSpeed");
var UVIndexEl = document.getElementById("UV-index");
var forecastElHead = document.getElementById("forecast-head");
var forecastElBody = document.querySelectorAll(".forecast");


var searchHistoryEl = document.getElementById("history");


var unhide = document.getElementById("results");
var unhide2 = document.getElementById("foot");

// onecall weather apikey var
var APIKey = "d11b55d32ed7a61161ed887f7799ce29";

// get current date
var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0");
var yyyy = today.getFullYear();

today = "(" + mm + "/" + dd + "/" + yyyy + ")";

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

            UVIndexEl.classList.add("uvi-low");
          } else if (UVeye >= 3 && UVeye < 6) {
            UVIndexEl.classList.add("uvi-med");
          } else if (UVeye >= 6 && UVeye < 8) {
            UVIndexEl.classList.add("uvi-high");
          } else if (UVeye >= 8) {
            UVIndexEl.classList.add("uvi-vhigh");
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
  console.log(forecast);

  //loop through 5 classes to match response.index value for 5 day forecast

  for (i = 0; i < forecastElBody.length; i++) {
    let forecastResult = i * 8 + 4;

    //translate date from response to proper format
    let forecastDate = new Date(forecast.list[forecastResult].dt * 1000);
    let forecastDay = forecastDate.getDate();
    let forecastMonth = forecastDate.getMonth() + 1;
    let forecastYear = forecastDate.getFullYear();

    // continue use of looping forecastEl index to parse/print responses into div els
    let forecastDateEl = document.createElement("p");
    forecastDateEl.setAttribute("class", "mt-3 forecast-date");
    forecastDateEl.innerHTML =
      forecastMonth + "/" + forecastDay + "/" + forecastYear;
    forecastElBody[i].append(forecastDateEl);

    //insert icon els

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
searchEl.addEventListener("click", function () {
  if (!cityInput.value) {
    return;
  } else {
    const searchQ = cityInput.value;
    getWeather(searchQ); /*<--pass search query to call current weather */
    getForecast(searchQ); /*<--pass search query to call 5day forecast */
    unhide.classList.remove("d-none"); /* unhide main results div & children */
    // console.log(searchQ);
    resetInput(searchQ);

    // clear if there was a previously rendered five day forecast
    for (i = 0; i < forecastElBody.length; i++) {
      forecastElBody[i].textContent = " ";
    }
  }
});

// clear input field after submission
function resetInput() {
  cityInput.value = "";

  //unhide footer
  unhide2.classList.remove("d-none");
}
