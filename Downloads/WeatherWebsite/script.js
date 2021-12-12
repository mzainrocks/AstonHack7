const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('weatherInfo');
const timeZoneEl = document.getElementById('timeZone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weatherForecast');
const currentTempEl = document.getElementById('currentTemp');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const API_key = 'df97d0adcb9e7482f9524c20b67dca07';


setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hours12hrsformat = hour >= 13 ? hour % 12 : hour
    const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
    const ampm = hour >= 12 ? 'PM' : 'AM'

    timeEl.innerHTML = hours12hrsformat + ':' + minutes + ' ' + `<span id="amORpm"> ${ampm} </span>`

    dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]

}, 1000);

getWeatherData();

function getWeatherData() {
    navigator.geolocation.getCurrentPosition((success) => {
        console.log(success);

        let { latitude, longitude } = success.coords;

        fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_key}`).then(res => res.json()).then(data => {
            console.log(data);
            showWeatherData(data);
        })
    })
}

function showWeatherData(data) {
    let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
    timeZoneEl.innerHTML = data.timezone;
    countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E';

    currentWeatherItemsEl.innerHTML =
        `<div class="weatherItem">
    <div>Humidity</div>
    <div>${humidity}%</div>
</div>
<div class="weatherItem">
    <div>Pressure</div>
    <div>${pressure} hPa</div>
</div>
<div class="weatherItem">
    <div>Wind speed</div>
    <div>${wind_speed} m/s</div>
</div>
<div class="weatherItem">
    <div>sunrise</div>
    <div>${moment(sunrise*1000).format('HH:mm a')}</div>
</div>
<div class="weatherItem">
    <div>sunset</div>
    <div>${moment(sunset*1000).format('HH:mm a')}</div>
</div>`



    ;


    let nextDayForecast = "";
    data.daily.forEach((day, idx) => {
        if (idx == 0) {
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@4x.png" alt="Weather Icon" class="wIcon">
            <div class="other">
                <div class="day">${moment(day.dt*1000).format('ddd')}</div>
                <div class="temp">Night -${day.temp.night}&#176;C </div>
                <div class="temp">Day - ${day.temp.day}&#176;C </div>

            </div>
            
            `

        } else {
            nextDayForecast +=
                `<div class="weatherForecastItem">
        <div class="day">${moment(day.dt*1000).format('ddd')}</div>
        <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="Weather Icon" class="wIcon">
        <div class="temp">Night - ${day.temp.night}&#176;C </div>
        <div class="temp">Day - ${day.temp.day}&#176;C </div>
    </div>`

        }

    })
    weatherForecastEl.innerHTML = nextDayForecast;

}