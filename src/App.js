document.addEventListener('DOMContentLoaded', () => {
  const apiKey = '3c5451d09de7040357d7d836c86479ba';
  const searchBtn = document.getElementById('search-btn');
  const cityInput = document.getElementById('city-input');

  searchBtn.addEventListener('click', () => {
      const city = cityInput.value.trim();
      if (city) {
          getWeatherData(city, apiKey);
      }
  });

  function getWeatherData(city, apiKey) {
      const apiUrlCurrent = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`;
      const apiUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`;

      // Fetch current weather
      fetch(apiUrlCurrent)
          .then(response => response.json())
          .then(data => {
              const currentTemp = document.getElementById('current-temp');
              const iconCode = data.weather[0].icon;
              const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

              const today = new Date();
              const todayDay = today.toLocaleDateString('pt-BR', { weekday: 'long' });

              currentTemp.innerHTML = `
                  <h2>${todayDay}</h2>
                  <p>${Math.round(data.main.temp)}°C</p>
                  <img src="${iconUrl}" alt="Weather Icon" class="weather-icon">
              `;
          })
          .catch(error => console.error('Error fetching current weather data:', error));

      // Fetch forecast
      fetch(apiUrlForecast)
          .then(response => response.json())
          .then(data => {
              const forecastElement = document.getElementById('forecast');
              forecastElement.innerHTML = ''; // Clear previous forecast

              const days = {};

              data.list.forEach(item => {
                  const date = new Date(item.dt_txt);
                  const day = date.toLocaleDateString('pt-BR', { weekday: 'long' });

                  if (!days[day]) {
                      days[day] = [];
                  }

                  days[day].push({
                      temp: item.main.temp,
                      icon: item.weather[0].icon
                  });
              });

              for (const [day, entries] of Object.entries(days)) {
                  const avgTemp = (entries.reduce((sum, entry) => sum + entry.temp, 0) / entries.length).toFixed(1);
                  const iconCode = entries[Math.floor(entries.length / 2)].icon; // Take the icon from the middle entry
                  const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

                  const card = document.createElement('div');
                  card.className = 'card';
                  card.innerHTML = `
                      <h2>${day}</h2>
                      <p>${avgTemp}°C</p>
                      <img src="${iconUrl}" alt="Weather Icon" class="weather-icon">
                  `;
                  forecastElement.appendChild(card);
              }
          })
          .catch(error => console.error('Error fetching forecast data:', error));
  }
});
