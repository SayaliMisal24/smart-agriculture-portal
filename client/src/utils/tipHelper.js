// Picks a relevant farming tip key based on real current weather conditions
export function getTipKeyFromWeather(weather) {
  if (!weather) return 'default';

  const condition = weather.condition;
  const temp = weather.temperature;

  if (condition === 'Rain' || condition === 'Drizzle' || condition === 'Thunderstorm') {
    return 'rainy';
  }
  if (temp >= 33) {
    return 'hot';
  }
  if (temp <= 15) {
    return 'cold';
  }
  if (weather.windSpeed && weather.windSpeed > 8) {
    return 'windy';
  }
  if (condition === 'Clouds') {
    return 'cloudy';
  }
  if (condition === 'Clear') {
    return 'clear';
  }
  return 'default';
}