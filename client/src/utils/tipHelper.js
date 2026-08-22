// Analyzes the next ~2 days of forecast data (16 entries, 3-hour intervals)
// and picks the most relevant, forward-looking farming tip key
export function getTipKeyFromForecast(forecastList) {
  if (!forecastList || forecastList.length === 0) return 'default';

  const next48h = forecastList.slice(0, 16); // roughly 2 days of 3-hour data points

  const rainCount = next48h.filter((entry) =>
    ['Rain', 'Drizzle', 'Thunderstorm'].includes(entry.weather[0].main)
  ).length;

  const temps = next48h.map((entry) => entry.main.temp);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const avgWind = next48h.reduce((sum, e) => sum + (e.wind?.speed || 0), 0) / next48h.length;

  // Priority order: rain first (most actionable), then heat, cold, wind, cloud, clear
  if (rainCount >= 3) return 'rainy'; // rain expected across multiple periods in the next 2 days
  if (maxTemp >= 33) return 'hot';
  if (minTemp <= 15) return 'cold';
  if (avgWind > 8) return 'windy';

  const cloudyCount = next48h.filter((e) => e.weather[0].main === 'Clouds').length;
  const clearCount = next48h.filter((e) => e.weather[0].main === 'Clear').length;

  if (cloudyCount > clearCount) return 'cloudy';
  if (clearCount > 0) return 'clear';

  return 'default';
}