const axios = require('axios');

const cache = new Map();

// Turns a place name into GPS coordinates using OpenWeatherMap's geocoding API
async function geocode(place) {
  if (!place) return null;
  const key = place.toLowerCase().trim();
  if (cache.has(key)) return cache.get(key);

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY?.trim();
    const res = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
      params: { q: `${place},IN`, limit: 1, appid: apiKey },
      timeout: 6000,
    });
    const hit = res.data && res.data[0];
    if (!hit) return null;
    const value = { lat: hit.lat, lon: hit.lon };
    cache.set(key, value);
    return value;
  } catch (err) {
    console.error('Geocode failed for', place, err.message);
    return null;
  }
}

// Straight-line distance between two GPS points, in kilometres
function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

module.exports = { geocode, haversineKm };