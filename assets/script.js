var searchEl = document.getElementById('searchBtn');
var cityInput = document.getElementById('cityInput');

var APIKey='d11b55d32ed7a61161ed887f7799ce29';



function getWeather(city) {
    var callURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + '&units=imperial&appid=' + APIKey
  console.log(callURL);
  
    fetch(callURL)
      .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }
  
        return response.json();
      })

      .then(function () { 



      
})};
      


searchEl.addEventListener("click", function () {
    const searchQ = cityInput.value;
    getWeather(searchQ); 

    console.log(searchQ);
});


// https://api.openweathermap.org/data/2.5/onecall?lat= {lat} &lon= {lon} &exclude= {part} &appid= {API key}
// API CALL EXAMPLE https://api.openweathermap.org/data/2.5/onecall?lat= {33.44} &lon= {-94.04} &exclude= {hourly,daily} &appid={API key}

