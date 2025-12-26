import { formatTempC, formatWindKmh } from "./utils.js";

const cityEl = document.getElementById("city");
const btn = document.getElementById("btn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const errorEl = document.getElementById("error");

const placeEl = document.getElementById("place");
const timeEl = document.getElementById("time");
const conditionEl = document.getElementById("condition");
const tempEl = document.getElementById("temp");
const windEl = document.getElementById("wind");

function setStatus(msg) {
  statusEl.textContent = msg || "";
}

function showError(msg) {
  errorEl.textContent = msg;
  errorEl.classList.remove("d-none");
  resultEl.classList.add("d-none");
}

function clearError() {
  errorEl.classList.add("d-none");
  errorEl.textContent = "";
}

function weatherCodeToText(code) {
  const map = new Map([
    [0, "Clear"],
    [1, "Mainly clear"],
    [2, "Partly cloudy"],
    [3, "Overcast"],
    [45, "Fog"],
    [48, "Rime fog"],
    [51, "Light drizzle"],
    [53, "Drizzle"],
    [55, "Dense drizzle"],
    [61, "Slight rain"],
    [63, "Rain"],
    [65, "Heavy rain"],
    [71, "Slight snow"],
    [73, "Snow"],
    [75, "Heavy snow"],
    [80, "Rain showers"],
    [95, "Thunderstorm"],
  ]);
  return map.get(code) ?? `Code ${code}`;
}

async function geocodeCity(name) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;
  return data.results[0];
}

async function getCurrentWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Weather API failed");
  return res.json();
}

async function run() {
  clearError();
  const city = cityEl.value.trim();
  if (!city) return showError("Please enter a city name.");

  setStatus("Searching city…");
  btn.disabled = true;

  try {
    const geo = await geocodeCity(city);
    if (!geo) return showError("City not found. Try a different name.");

    setStatus("Fetching weather…");
    const w = await getCurrentWeather(geo.latitude, geo.longitude);
    const cw = w.current_weather;

    placeEl.textContent = `${geo.name}${geo.country ? ", " + geo.country : ""}`;
    timeEl.textContent = `Updated: ${cw.time}`;
    conditionEl.textContent = weatherCodeToText(cw.weathercode);
    tempEl.textContent = formatTempC(cw.temperature);
    windEl.textContent = formatWindKmh(cw.windspeed);

    resultEl.classList.remove("d-none");
    setStatus("");
  } catch (e) {
    showError(e?.message || "Something went wrong.");
    setStatus("");
  } finally {
    btn.disabled = false;
  }
}

btn.addEventListener("click", run);
cityEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") run();
});
