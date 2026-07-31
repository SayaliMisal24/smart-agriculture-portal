const axios = require('axios');

const getWeather = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY?.trim();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;

    const weatherInfo = {
      city: data.name,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      windSpeed: data.wind.speed,
    };

    res.status(200).json({ weather: weatherInfo });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Could not fetch weather data. Check city name and try again.' });
  }
};

module.exports = { getWeather };