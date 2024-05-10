document.addEventListener("DOMContentLoaded", function () {
  const searchForm = document.getElementById("search-form");
  const cityInput = document.getElementById("search-input");
  const searchHistory = document.getElementById("search-history");
  const currentWeather = document.getElementById("weather-now");
  const forecast = document.getElementById("forecast");

  const city = cityInput.value;

  // API Guide

  const APIKey = "19c27de93d60766809ce3d1b94ccba82";
  const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}`;
  // fetch(queryURL);
  console.log(queryURL);
  //event listener for form submit
  console.log(searchForm);
  searchForm.addEventListener("submit", function (event) {
    const city = cityInput.value;
    event.preventDefault();
    if (city) {
      fetchWeather(city);
      cityInput.value = "";
    }
  });

  function fetchWeather(city) {
    currentWeather.innerHTML = "";
    forecast.innerHTML = "";

    fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKey}&units=metric`
    )
      .then((response) => {
        console.log('response', response);
        if (!response.ok) {
          throw new Error("No, put a real one >:(");
        }
        return response.json();
      })

      .then((data) => {
        console.log('data', data);
        showWeather(data);
        keepSearchHistory(city);
      })
      .catch((_error) => {
        alert("It broke :(");
      });
  }

  console.log(fetchWeather);

  function showWeather(data) {
    const { name, main, weather, wind, dt } = data;
    const weatherDescription = weather[0].description;
    const temperature = main.temp;
    const temperatureFahrenheit = (temperature * 9) / 5 + 32;
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const iconCode = weather[0].icon;
    const currentDate = new Date(dt * 1000);
    const formattedDate = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    const showWeatherHTML = `
        <div class="weather-info">
            <h3>${name}</h3>
            <p>${weatherDescription}</p>
            <p>Temperature: ${temperatureFahrenheit.toFixed(2)}°F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
            <p>Date: ${formattedDate}</p>
        </div>
    `;

    // Get the forecast-day element
    const forecastDay = document.querySelector(".forecast-day");

    // Insert the weather info into the forecast-day element
    forecastDay.insertAdjacentHTML("beforeend", showWeatherHTML);

    // Insert current weather card above the forecast
    currentWeather.insertAdjacentHTML("afterbegin", showWeatherHTML);

    forecast.innerHTML = showWeatherHTML;
  }

  function fetchForecast(city) {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${APIKey}&units=metric`
    )
    .then(response => response.json())
        .then(data => {
            // Display forecast
            displayForecast(data);
        })
        .catch(error => {
            console.error('Cannot', error);
        });
     
  }

  function showForecast(data) {
    const forecastData = data.list.slice(0, 5);
let forecastHTML = '';

forecastData.forEach((forecast, index) => {

    const { dt, main, weather, wind } = forecast;
    const forecastDate = dayjs().add(index + 1, 'day'); 
    const formattedDate = forecastDate.format('dddd, MMM D'); 
    const humidity = main.humidity;
    const windSpeed = wind.speed;
    const temperature = main.temp;
    const temperatureFahrenheit = (temperature * 9/5) + 32;
    const weatherDescription = weather[0].description;
    const iconCode = weather[0].icon;

    forecastHTML += `
        <div class="forecast-item">
            <h3>${formattedDate}</h3>
            <img src="http://openweathermap.org/img/wn/${iconCode}.png" alt="Weather Icon">
            <p>${weatherDescription}</p>
            <p>Temperature: ${temperatureFahrenheit.toFixed(1)}°F</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${windSpeed} m/s</p>
        </div>
    `;
});

forecast.innerHTML = forecastHTML;
}

  function keepSearchHistory(city) {
    let searchHistory = localStorage.getItem("searchHistory");
    if (!searchHistory) {
      searchHistory = [];
    } else {
      searchHistory = JSON.parse(searchHistory);
    }

    searchHistory = searchHistory.filter((item) => item !== city);
    searchHistory.unshift(city); // Add the new city at the beginning
    if (searchHistory.length > 10) {
      searchHistory = searchHistory.slice(0, 10); // Limit to the last 10 searches
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

    // Display search history
    loadSearchHistory();
  }

  function loadSearchHistory() {
    let searchHistory = localStorage.getItem("searchHistory");
    if (searchHistory) {
      searchHistory = JSON.parse(searchHistory);
      const searchHistoryContainer = document.getElementById("search-history");
      searchHistoryContainer.innerHTML = "";
      searchHistory.forEach((city) => {
        const button = document.createElement("button");
        button.textContent = city;
        button.classList.add("search-history-button");
        button.addEventListener("click", () => {
          fetchWeather(city);
        });
        searchHistoryContainer.appendChild(button);
      });
    }
  }

  // clear search history button
  const clearButton = document.getElementById("clear-history");
  const searchHistoryList = document.getElementById("searchHistoryList");
  console.log(searchHistoryList);
  clearButton.addEventListener("click", function () {
    localStorage.removeItem("searchHistoryList");
    searchHistory.innerHTML = "";
  });
});
