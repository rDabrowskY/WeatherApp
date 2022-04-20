import {
  setLocationObj,
  getWeatherFromCoords,
  getHomeLocation,
  trimText,
  getCoordsFormApi,
} from "./dataFunctions.js";
import CurrentLocation from "./CurrentLocation.js";
import { addSpinner, displayError, updateDisplay } from "./domFunctions.js";

const currentLoc = new CurrentLocation();

const initApp = () => {
  const getLocationBtn = document.getElementById("getLocation");
  getLocationBtn.addEventListener("click", geoLocationWeather);
  const homeBtn = document.getElementById("home");
  homeBtn.addEventListener("click", loadWeather);
  const saveBtn = document.getElementById("saveLocation");
  saveBtn.addEventListener("click", saveLocation);
  const unitBtn = document.getElementById("toggleMeasurements");
  unitBtn.addEventListener("click", toggleMeasurements);
  const refreshBtn = document.getElementById("refresh");
  refreshBtn.addEventListener("click", refreshWeather);
  const entryData = document.getElementById("headerContainer__form");
  entryData.addEventListener("submit", submitLocationByName);
  loadWeather();
};
const geoLocationWeather = (e) => {
  if (e && e.type === "click") {
    const locIcon = document.querySelector(".fa-map-marker-alt");
    addSpinner(locIcon);
  }
  if (!navigator.geolocation) return geoError();
  navigator.geolocation.getCurrentPosition(geoSuccess, geoError);
};
const geoError = (msg) => {
  const message = msg ? msg.message : "Geolocation is not working.";
  displayError(message);
};

const geoSuccess = (pos) => {
  const myCoordsObj = {
    lon: pos.coords.longitude,
    lat: pos.coords.latitude,
    name: `Lat: ${pos.coords.latitude} • Long: ${pos.coords.longitude}`,
  };
  setLocationObj(myCoordsObj, currentLoc);
  updateDataAndDisplay(currentLoc);
};
const saveLocation = () => {
  if (currentLoc.getLat() && currentLoc.getLon()) {
    const saveIcon = document.querySelector(".fa-save");
    addSpinner(saveIcon);
    const location = {
      name: currentLoc.getName(),
      lat: currentLoc.getLat(),
      lon: currentLoc.getLon(),
      unit: currentLoc.getUnit(),
    };
    localStorage.setItem("homeWeatherCoords", JSON.stringify(location));
  }
};
const loadWeather = (e) => {
  const savedLocation = getHomeLocation();
  if (!savedLocation && !e) return geoLocationWeather();
  if (!savedLocation && e.type === "click")
    return displayError("No home location saved.");
  else if (savedLocation && !e) return displayHomeWeather(savedLocation);
  else {
    const homeIcon = document.querySelector(".fa-home");
    addSpinner(homeIcon);
    displayHomeWeather(savedLocation);
  }
};
const displayHomeWeather = (homeLoc) => {
  if (typeof homeLoc === "string") {
    const homeObjJson = JSON.parse(homeLoc);
    const coords = {
      lat: homeObjJson.lat,
      lon: homeObjJson.lon,
      name: homeObjJson.name,
      unit: homeObjJson.unit,
    };
    setLocationObj(coords, currentLoc);
    updateDataAndDisplay(currentLoc);
  }
};
const refreshWeather = () => {
  const refreshIcon = document.querySelector(".fa-refresh");
  addSpinner(refreshIcon);
  updateDataAndDisplay(currentLoc);
};
const toggleMeasurements = () => {
  const unitIcon = document.querySelector(".fa-ruler");
  addSpinner(unitIcon);
  currentLoc.toggleUnit();
  updateDataAndDisplay(currentLoc);
};
const submitLocationByName = async (e) => {
  e.preventDefault();
  const text = document.getElementById("headerContainer__text");
  const entryText = trimText(text.value);
  if (!entryText.length) return;
  const coordsData = await getCoordsFormApi(entryText, currentLoc.getUnit());
  if (coordsData) {
    if (coordsData.cod === 200) {
      const coords = {
        lat: coordsData.coord.lat,
        lon: coordsData.coord.lon,
        name: coordsData.sys.country
          ? `${coordsData.sys.country}, ${coordsData.name}`
          : coordsData.name,
      };

      setLocationObj(coords, currentLoc);
      updateDataAndDisplay(currentLoc);
      text.value = "";
    } else {
      displayError(coordsData.message);
      text.value = "";
    }
  } else {
    displayError("Connection not working.");
  }
};

const updateDataAndDisplay = async (currentLoc) => {
  const weatherJson = await getWeatherFromCoords(currentLoc);
  if (weatherJson) updateDisplay(weatherJson, currentLoc);
};
document.addEventListener("DOMContentLoaded", initApp);
