export default class CurrentLocation {
  constructor() {
    this._name = "Current Location";
    this._lat = null;
    this._lon = null;
    this._unit = "metric";
  }
  setName(name) {
    this._name = name;
  }
  getName() {
    return this._name;
  }
  setLon(lon) {
    this._lon = lon;
  }
  getLon() {
    return this._lon;
  }
  setLat(lat) {
    this._lat = lat;
  }
  getLat() {
    return this._lat;
  }
  setUnit(unit) {
    this._unit = unit;
  }
  getUnit() {
    return this._unit;
  }
  toggleUnit() {
    this._unit = this._unit === "metric" ? "imperial" : "metric";
  }
}
