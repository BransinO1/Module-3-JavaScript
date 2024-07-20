// Javascript webpage

// Function for the weather button
document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const location = document.getElementById('locationInput').value.trim();
    if (location) {
        getWeather(location);
    } else {
        document.getElementById('weatherInfo').innerHTML = 'Please enter a location.';
    }
});

// Function to convert from C to F degrees - RECURSION
function recursivelyConvertToFahrenheit(data, index = 0) {
    if (index >= data.length) return data;
    
    data[index].main.temp = (data[index].main.temp - 273.15) * 9/5 + 32; // Convert to Fahrenheit - Recursive
    return recursivelyConvertToFahrenheit(data, index + 1);
}

// Function to pull weather data from openweather api
function getWeather(location) {
    const apiKey = '157deda1a07dac70ab1f5aea131edc08';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data); // Log the data for debugging
            if (data.cod === "200") {
                // Convert temperatures to Fahrenheit
                const convertedData = recursivelyConvertToFahrenheit(data.list);
                const groupedData = groupByDate(convertedData);
                displayWeather(groupedData, data.city.name);
            } else if (data.cod === "404") {
                // Handle the case where the location is not found
                document.getElementById('weatherInfo').innerHTML = `Location not found: ${data.message}`;
            } else {
                // Handle other cases
                document.getElementById('weatherInfo').innerHTML = `Error: ${data.message}`;
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            document.getElementById('weatherInfo').innerHTML = 'Error fetching the weather data.';
        });
}

// Function to group weather by date - LODASH
function groupByDate(data) {
    return _.groupBy(data, forecast => new Date(forecast.dt * 1000).toLocaleDateString());
}

// Function to display the weather in a grid format - MAP = ES6 Native Array Function
function displayWeather(groupedData, cityName) {
    let weatherInfo = `<h2>5-Day Weather Forecast for ${cityName}</h2>`;
    weatherInfo += `<div class="weather-grid">`;

    _.forEach(groupedData, (forecasts, date) => {
        weatherInfo += `
            <div class="weather-column">
                <h3>${date}</h3>
                ${forecasts.map(forecast => `
                    <div class="weather-entry">
                        <p><strong>${new Date(forecast.dt * 1000).toLocaleTimeString()}</strong></p>
                        <p>Temperature: ${forecast.main.temp.toFixed(2)} °F</p>
                        <p>Weather: ${forecast.weather[0].description}</p>
                        <p>Humidity: ${forecast.main.humidity}%</p>
                        <p>Wind Speed: ${forecast.wind.speed} m/s</p>
                    </div>
                `).join('')}
            </div>
        `;
    });

    weatherInfo += `</div>`;
    document.getElementById('weatherInfo').innerHTML = weatherInfo;
}