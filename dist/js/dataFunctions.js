const WEATHER_API_KEY = "3384403aa544e3cfb9a6dd1f53104f9b";

export const setLocationObj = (coordsObj, currentLoc) => {
  const { lat, lon, name, unit } = coordsObj;
  currentLoc.setLat(lat);
  currentLoc.setLon(lon);
  currentLoc.setName(name);
  if (unit) {
    currentLoc.setUnit(unit);
  }
  return currentLoc;
};
export const getWeatherFromCoords = async (currentLoc) => {
  let lon = currentLoc.getLon();
  let lat = currentLoc.getLat();
  let units = currentLoc.getUnit();

  const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${WEATHER_API_KEY}`;
  try {
    const weatherData = await fetch(url);
    const weatherJson = await weatherData.json();
    return weatherJson;
  } catch (err) {
    console.error(err);
  }
};

export const trimText = (string) => {
  const regexp = / {2,}/g;
  const entryText = string.replace(regexp, " ").trim();
  return entryText;
};
export const getCoordsFormApi = async (entryTxt, units) => {
  const regexp = /^\d$/g;
  const flag = regexp.test(entryTxt) ? "zip" : "q";
  const url = `https://api.openweathermap.org/data/2.5/weather?${flag}=${entryTxt}&units=${units}&appid=${WEATHER_API_KEY}`;
  const encodeUrl = encodeURI(url);
  console.log(encodeUrl);
  try {
    const data = await fetch(encodeUrl);
    const dataJson = await data.json();
    console.log(dataJson);
    return dataJson;
  } catch (err) {
    console.error(err);
  }
};
export const getHomeLocation = () => {
  return localStorage.getItem("homeWeatherCoords");
};
