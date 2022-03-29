var searchEl = document.getElementById("searchBtn");
var cityInput = document.getElementById("cityInput");
var currentWeatherEl = document.getElementById("city-name");
var tempEl = document.getElementById("temp");
var humidityEl = document.getElementById("humidity");
var windSpeedEl = document.getElementById("windSpeed");
var UVIndexEl = document.getElementById("UV-index");

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

      var currentCity = response.name + " " + today;
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
        "&units=imperial" + /*<--convert units*/
        "&appid=" +
        APIKey;

        console.log(UVcall);

        fetch(UVcall)
        .then (function (UVresponse) {

          return UVresponse.json();
        })

        .then (function (UVresponse) {
          console.log(UVresponse);
          currentUVI = 'UV Index: ' + UVresponse.current.uvi;
          UVIndexEl.innerHTML = currentUVI;


        })
      



    });
}

searchEl.addEventListener("click", function () {
  const searchQ = cityInput.value;
  getWeather(searchQ); /*<--pass search query to call current weather */
  getForecast(searchQ); /*<--pass search query to call forecast */

  // console.log(searchQ);
});

//function for 5-day forcast

function getForecast(city) {
  var callURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    city +
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
    });
}
