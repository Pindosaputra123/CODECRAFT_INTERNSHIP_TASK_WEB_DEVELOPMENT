    async function getCoordsFromCity(city) {
      const geoUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`;
      const response = await fetch(geoUrl);
      const data = await response.json();
      if (!data[0]) throw new Error("Location not found.");
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        name: data[0].display_name
      };
    }

    async function getWeather(lat, lon, locationLabel = "") {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

      const weatherInfo = document.getElementById("weatherInfo");
      const errorInfo = document.getElementById("errorInfo");
      weatherInfo.innerHTML = "Loading...";
      errorInfo.textContent = "";

      try {
        const response = await fetch(url);
        const data = await response.json();
        const weather = data.current_weather;

        const conditionText = interpretWeatherCode(weather.weathercode);

       weatherInfo.innerHTML = `
  <h2>Weather for ${locationLabel || `Lat: ${lat}, Lon: ${lon}`}</h2>
  <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
  <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
  <p><strong>Condition:</strong> ${conditionText}</p>
  <p><strong>Time:</strong> ${weather.time}</p>
`;
      } catch (err) {
        errorInfo.textContent = "Failed to fetch weather data.";
        weatherInfo.innerHTML = "";
      }
    }

   function interpretWeatherCode(code) {
  const codes = {
    0: { text: "Clear sky", icon: "☀️" },
    1: { text: "Mainly clear", icon: "🌤️" },
    2: { text: "Partly cloudy", icon: "⛅" },
    3: { text: "Overcast", icon: "☁️" },
    45: { text: "Fog", icon: "🌫️" },
    48: { text: "Rime fog", icon: "🌫️" },
    51: { text: "Light drizzle", icon: "🌦️" },
    53: { text: "Moderate drizzle", icon: "🌦️" },
    55: { text: "Dense drizzle", icon: "🌧️" },
    61: { text: "Light rain", icon: "🌧️" },
    63: { text: "Moderate rain", icon: "🌧️" },
    65: { text: "Heavy rain", icon: "🌧️" },
    71: { text: "Light snow", icon: "🌨️" },
    73: { text: "Moderate snow", icon: "🌨️" },
    75: { text: "Heavy snow", icon: "❄️" },
    80: { text: "Rain showers", icon: "🌦️" },
    81: { text: "Heavy showers", icon: "🌧️" },
    82: { text: "Violent showers", icon: "🌧️" },
    95: { text: "Thunderstorm", icon: "⛈️" },
    96: { text: "Thunderstorm with hail", icon: "⛈️" },
    99: { text: "Severe thunderstorm", icon: "🌩️" },
  };

  const result = codes[code] || { text: "Unknown", icon: "❓" };
  return `${result.icon} ${result.text}`;
}

    async function getWeatherByCity() {
      const city = document.getElementById("cityInput").value.trim();
      if (!city) {
        document.getElementById("errorInfo").textContent = "Please enter a city name.";
        return;
      }

      try {
        const coords = await getCoordsFromCity(city);
        await getWeather(coords.lat, coords.lon, coords.name);
      } catch (err) {
        document.getElementById("errorInfo").textContent = err.message;
      }
    }

    function getWeatherByLocation() {
      if (!navigator.geolocation) {
        document.getElementById("errorInfo").textContent = "Geolocation is not supported by your browser.";
        return;
      }

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          getWeather(latitude, longitude, "Your Location");
        },
        () => {
          document.getElementById("errorInfo").textContent = "Failed to get your location.";
        }
      );
    }
