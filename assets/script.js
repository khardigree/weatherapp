// local storage and today's date
const cities = JSON.parse(localStorage.getItem("cities")) || [];
const today = dayjs().format("MM/DD/YYYY");

// function to make weather card
function createWeatherCard(city, state, weatherData, isFirstCard = false) {
  const card = $("<div>")
    .addClass("card border-white")
    .append(
      $("<div>")
        .addClass("card-header")
        .append($("<div>").text(`${city}, ${state}`).addClass("city-name"))
        .append($("<div>").text(weatherData.date).addClass("date"))
    )
    .append(
      $("<div>")
        .addClass("card-body")
        .append(
          $("<p>")
            .addClass("card-text")
            .append(
              $("<img>")
                .addClass("weather-icon")
                .attr(
                  "src",
                  "https://openweathermap.org/img/w/" +
                    weatherData.weatherIcon +
                    ".png"
                )
                .attr("alt", weatherData.weatherDescription.toUpperCase()),
              $("<span>").text(weatherData.weatherDescription.toUpperCase())
            )
        )
        .append(
          $("<p>")
            .addClass("card-text")
            .text("High: " + weatherData.highTemperature)
        )
        .append(
          $("<p>")
            .addClass("card-text")
            .text("Low: " + weatherData.lowTemperature)
        )
        .append(
          $("<p>")
            .addClass("card-text")
            .text("Wind: " + weatherData.windSpeed)
        )
        .append(
          $("<p>")
            .addClass("card-text")
            .text("Humidity: " + weatherData.humidity)
        )
        .append(
          $("<p>")
            .addClass("card-text")
            .text("Feels Like Temperature: " + weatherData.feelsLikeTemperature)
        )
    );

  // Add the first-card class if it's the first card
  if (isFirstCard) {
    card.addClass("first-card");
  } else {
    card.addClass("other-cards");
  }

  return card;
}

//store city info
function storeCity(evt) {
  evt.preventDefault();
  const city = $("#search-input").val();
  console.log(city);
  //check for real city
  if (!city) {
    alert("Put a real one >:(");
    return;
  }

  //call to fetch city
  getCity(city);

  //clear input
  $("#search-input").val("");
  console.log(city);
}

//to get city info
function getCity(cityName) {
  const country = "US";
  const limit = 1;
  const apiKey = "19c27de93d60766809ce3d1b94ccba82";
  const queryURL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${country}&limit=${limit}&appid=${apiKey}`;

  //fetch city info
  fetch(queryURL)
    //check to see if response is valid
    .then((response) => {
      if (!response.ok) {
        throw new Error("No response :(");
      }
      return response.json();
    })
    //check to see if city name is valid
    .then((data) => {
      if (!data) {
        throw new Error("Pick a real city >:(");
      }
      console.log(data);
      let cityObj = {
        city: data[0].name,
        state: data[0].state,
        countryCode: data[0].country,
        latitude: data[0].lat,
        longitude: data[0].lon,
      };

      const citiesList = JSON.parse(localStorage.getItem("cities")) || [];
      citiesList.push(cityObj);
      localStorage.setItem("cities", JSON.stringify(citiesList));

      getWeather(cityObj);
    });

  //store city info in an object

  // displayCityButtons();

  try {
    // code that may throw an error
  } catch (error) {
    console.error("Error:", error);
    alert("Fetch did not work, throw stick again later");
  }
}

function getWeather(cityObj) {
  const city = encodeURIComponent(cityObj.city);
  const state = cityObj.state;
  const lat = cityObj.latitude;
  const lon = cityObj.longitude;
  const apiKey = "19c27de93d60766809ce3d1b94ccba82";

  const queryURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;

  fetch(queryURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("No response :(");
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !data.list) {
        throw new Error("No data :(");
      }

      $("#other-cards-container").empty();

      const weatherCards = [];
      console.log(data);

      // let cardCount = 0;
      data.list.forEach((day, index) => {
        // if (cardCount >= 4) {
        //   return;
        // }
        if (index === 0 || (index + 1) % 8 === 0) {
          const weatherData = {
            date: dayjs.unix(day.dt).format("dddd MM/DD/YYYY"),
            highTemperature: `${Math.round(day.main.temp_max)} °F`,
            lowTemperature: `${Math.round(day.main.temp_min)} °F`,
            windSpeed: `${Math.round(day.wind.speed)} mph`,
            humidity: `${Math.round(day.main.humidity)}%`,
            feelsLikeTemperature: `${Math.round(day.main.feels_like)} °F`,
            weatherDescription: day.weather[0].description,
            weatherIcon: day.weather[0].icon,
          };

          const card = createWeatherCard(city, state, weatherData, index === 0);

          if (index === 0) {
            $("#first-card-container").empty(); // Clear the forecast area for the first card
            $("#first-card-container").append(card); // Append the first card directly
          } else {
            weatherCards.push(card); // Push other cards to the array
          }
        }
      });

      // Append remaining cards to the forecast container
      weatherCards.forEach((card) => {
        $("#other-cards-container").append($(card).addClass("card"));
      });
    });
}

try {
  // Code that may throw an error
} catch (error) {
  alert("There was a problem with the fetch operation:\n" + error.message);
}

function grabHistory() {
  const cities = JSON.parse(localStorage.getItem("cities")) || [];
  $("#search-history-list").empty(); // Empty the div once before the loop
  cities.forEach((cityObj) => {
    const cityButton = $("<button>")
      .addClass("btn btn-info city-button")
      .text(cityObj.city + ", " + cityObj.state); // Use the city and state properties of each city object
    cityButton.on("click", function () {
      getWeather(cityObj);
    });
    $("#search-history-list").append(cityButton); // Append each city button to the div
  });
}

grabHistory();
//event listeners for search button
const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", storeCity);

let clearHistoryButton = document.getElementById("clear-history");

clearHistoryButton.addEventListener("click", function () {
  localStorage.removeItem("cities");
  $("#search-history-list").empty();
});

//fix styling on cards
