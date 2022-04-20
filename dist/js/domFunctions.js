export const addSpinner = (element) => {
  animIcon(element);
  setTimeout(animIcon, 1000, element);
};
const animIcon = (el) => {
  el.classList.toggle("none");
  el.nextElementSibling.classList.toggle("block");
  el.nextElementSibling.classList.toggle("none");
};
export const displayError = (msg) => {
  displayErrorHeader(msg);
};
const displayErrorHeader = (msg) => {
  const headerName = document.getElementById("currentLocationInfo__name");
  headerName.textContent = firstBigLetterCase(msg);
};
export const updateDisplay = (weatherJson, currentLoc) => {
  //clean conditions
  cleanConditins();
  setBackgroundImage(weatherJson);
  const ccArray = createDivs(weatherJson, currentLoc);
  displayConditions(ccArray);
  updateHeader(currentLoc);
  displayWeekDayForecast(weatherJson);
};

const createDivs = (weatherJson, currentLoc) => {
  const tempUnit = currentLoc.getUnit() === "metric" ? "C" : "F";
  const windUnit = currentLoc.getUnit() === "metric" ? "m/s" : "mph";

  const icon = document.createElement("img");
  icon.setAttribute(
    "src",
    `./weatherIcons/${weatherJson.current.weather[0].icon}.png`
  );
  icon.className = "icon";
  const temp = createElem(
    "div",
    "temp",
    `${Number(Math.round(weatherJson.current.temp))}°`,
    tempUnit
  );
  const desc = createElem(
    "div",
    "disc",
    firstBigLetterCase(`${weatherJson.current.weather[0].description}`)
  );
  const lowTemp = createElem(
    "div",
    "lowTemp",
    `${Number(Math.round(weatherJson.daily[0].temp.min))}°`
  );
  lowTemp.innerHTML += '<i class="fa fa-temperature-down title"></i>';
  const highTemp = createElem(
    "div",
    "highTemp",
    `${Number(Math.round(weatherJson.daily[0].temp.max))}°`
  );
  highTemp.innerHTML += '<i class="fa fa-temperature-up title"></i>';
  const sunrise = createElem("div", "sunrise", getSunriseTime(weatherJson));
  sunrise.innerHTML += '<i class="fa fa-sun title"><i class="fa fa-arrow-up "></i></i>';
  const sunset = createElem("div", "sunset", getSunsetTime(weatherJson));
  sunset.innerHTML += '<i class="fa fa-sun title"><i class="fa fa-arrow-down "></i></i>';
  const humidity = createElem(
    "div",
    "humidity",
    `${weatherJson.current.humidity}%`
  );
  humidity.innerHTML += '<i class="fa fa-tint title"></i>';
  const wind = createElem(
    "div",
    "wind",
    `${Number(Math.round(weatherJson.current.wind_speed))}`,
    windUnit
  );
  wind.innerHTML += '<i class="fa fa-wind title"></i>';

  return [icon, temp, desc, lowTemp, highTemp, sunrise, sunset, humidity, wind];
};

const firstBigLetterCase = (string) => {
  const strArr = string.split(" ");
  const firstBigLetter = strArr.map((x) => {
    const firstLetter = x.slice(0, 1).toUpperCase();
    const nextLetter = x.slice(1);
    return firstLetter + nextLetter;
  });
  return firstBigLetter.join(" ");
};

const getSunriseTime = (weatherJson) => {
  const date = new Date(
    (weatherJson.current.sunrise + weatherJson.timezone_offset) * 1000
  );
  const sunriseHours = date.getUTCHours();
  const sunriseMinutes =
    date.getUTCMinutes() <= 9
      ? `0${date.getUTCMinutes()}`
      : date.getUTCMinutes();
  return `${sunriseHours}:${sunriseMinutes}`;
};
const getSunsetTime = (weatherJson) => {
  const date = new Date(
    (weatherJson.current.sunset + weatherJson.timezone_offset) * 1000
  );
  const sunsetHours = date.getUTCHours();
  const sunsetMinutes =
    date.getUTCMinutes() < 10
      ? `0${date.getUTCMinutes()}`
      : date.getUTCMinutes();
  return `${sunsetHours}:${sunsetMinutes}`;
};
const displayConditions = (arr) => {
  const container = document.getElementById("currentConditions__container");
  for (let i = 0; i < arr.length; i++) {
    container.appendChild(arr[i]);
  }
};
const updateHeader = (currentLoc) => {
  const positionName = document.getElementById("currentLocationInfo__name");
  positionName.textContent = currentLoc.getName();
  const dateInfo = document.getElementById("currentLocationInfo__time");
  const date = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  dateInfo.textContent = `${days[date.getDay()]}, ${date.getDate()} ${
    months[date.getMonth()]
  }`;
};
const cleanConditins = () => {
  const currentConditionsContainer = document.getElementById(
    "currentConditions__container"
  );
  const dailyWeatherContainer = document.getElementById(
    "dailyConditions__container"
  );
  currentConditionsContainer.innerHTML = "";
  dailyWeatherContainer.innerHTML = "";
};
const setBackgroundImage = (weatherJson) => {
  const dayTime = weatherJson.current.weather[0].icon.slice(2);
  const conditon = weatherJson.current.weather[0].icon.slice(0, 2);
  console.log(conditon);
  const background = document.querySelector("body");
  background.className = "";
  if (dayTime === "n") {
    background.classList.add("night");
  } else {
    switch (conditon) {
      case "09":
        background.classList.add("rain");
        break;
      case "10":
        background.classList.add("rain");
        break;
      case "11":
        background.classList.add("strom");
        break;
      case "13":
        background.classList.add("snow");
        break;
      case "50":
        background.classList.add("fog");
        break;
      default:
        background.classList.add("default");
    }
  }
};
const displayWeekDayForecast = (weatherJson) => {
  for (let i = 1; i < 7; i++) {
    let dayConditionsArr = createDailyConditions(weatherJson.daily[i]);
    displayDailyForecast(dayConditionsArr);
  }
};
const createDailyConditions = (dailyConditions) => {
  const abbriviationText = createElem(
    "div",
    "abbriviation",
    getAbbriviationText(dailyConditions.dt)
  );
  const icon = document.createElement("img");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${dailyConditions.weather[0].icon}.png`
  );
  const maxTemp = createElem(
    "div",
    "maxTemp",
    Number(Math.round(dailyConditions.temp.max))
  );
  const minTemp = createElem(
    "div",
    "minTemp",
    Number(Math.round(dailyConditions.temp.min))
  );
  return [abbriviationText, icon, maxTemp, minTemp];
};
const getAbbriviationText = (date) => {
  const dateObject = new Date(date * 1000);
  const utcStr = dateObject.toUTCString();

  return utcStr.slice(0, 3).toUpperCase();
};
const displayDailyForecast = (arrOfConditions) => {
  const dailyForecastConatiner = document.getElementById(
    "dailyConditions__container"
  );
  const div = createElem("div", "forecastDay");
  arrOfConditions.forEach((item) => {
    div.appendChild(item);
  });

  dailyForecastConatiner.appendChild(div);
};
const createElem = (elemName, elemClass, elemText, elemUnit) => {
  const div = document.createElement(elemName);
  div.className = elemClass;
  div.textContent = elemText;
  if (elemClass === "temp" || elemClass === "wind") {
    const span = document.createElement("span");
    span.className = "unit";
    span.textContent = elemUnit;
    div.appendChild(span);
  }
  return div;
};
