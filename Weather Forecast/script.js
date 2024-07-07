const apiKey = "3a6a01992f514fc0df61cf6f886e1b2a";

// Mapping of weather conditions to icon file names
const weatherIcons = {
    Clear: 'clear.png',
    Clouds: 'clouds.png',
    Drizzle: 'drizzle.png',
    Mist: 'mist.png',
    Rain: 'rain.png',
    Snow: 'snow.png'
};

async function checkWeather() {
     const city = document.getElementById('city').value || "Sangli";
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${apiKey}`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?units=metric&q=${city}&appid=${apiKey}`;
     
    document.querySelector('.loading').style.display = 'block'; // Show loading indicator
     
    try {
         const weatherResponse = await fetch(weatherApiUrl);
         const forecastResponse = await fetch(forecastApiUrl);
         document.querySelector('.loading').style.display = 'none'; // Hide loading indicator
     
         if (weatherResponse.ok && forecastResponse.ok) {
             const weatherData = await weatherResponse.json();
             const forecastData = await forecastResponse.json();
           console.log(weatherData); // Log the weather data to debug
             console.log(forecastData); // Log the forecast data to debug

            // Update weather information
             document.querySelector('.city').innerHTML = weatherData.name;
             document.querySelector('.temp').innerHTML = Math.round(weatherData.main.temp) + "°C";
             document.querySelector('.humidity').innerHTML = weatherData.main.humidity + "%";
             document.querySelector('.windspeed').innerHTML = weatherData.wind.speed + " km/hr";
             document.querySelector('.pressure').innerHTML = weatherData.main.pressure + " mb";

             // Determine the weather condition
             const weatherMain = weatherData.weather[0].main;
            
           // Fetch the appropriate icon filename
             const iconFileName = weatherIcons[weatherMain] || 'clear.png'; // Default to 'clear.png' if condition not found
            
             // Update the weather icon
             document.querySelector('.weather_icon').src = `/images/${iconFileName}`;

             // Clear the input field
             document.getElementById('city').value = '';

             // Update 5-day forecast
            updateFiveDayForecast(forecastData);
         } else {
             alert('City not found');
         }
    } catch (error) {
         console.error('Error fetching the weather data:', error);
         alert('Failed to fetch weather data. Please try again later.');
     }
}

function updateFiveDayForecast(data) {
    const forecastContainer = document.querySelector('.day-forecast');
    forecastContainer.innerHTML = '';

     // Filter the forecast to get one entry per day (e.g., at 12:00 PM each day)
     const dailyForecasts = data.list.filter(entry => entry.dt_txt.includes("12:00:00"));

     dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt_txt);
        const options = { weekday: 'long', month:'short',day:'numeric' };
        const formattedDate=new Intl.DateTimeFormat('en-US',options).format(date);

         const temp = Math.round(forecast.main.temp);
         const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;
         const forecastItem = `
             <div class="forecast-item">
                <div class="icon-wrapper">
                    <img src="${iconUrl}" alt="weather icon">
                </div>
                <div class="date">${formattedDate}</div>
                <div class="temp">${temp}&deg;C</div>
             </div>
         `;

        forecastContainer.innerHTML += forecastItem;
     });
}

window.onload = function() {
     checkWeather();
}