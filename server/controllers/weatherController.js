const axios = require('axios');
const Farm = require('../models/Farm');
const { completeStep } = require('../utils/stepProgress');

const WEATHER_STEP = 3;

const getWeather = async (req, res) => {
  try {
    const { city, farmId } = req.query;

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

    let updatedFarm = null;
    if (farmId) {
      const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
      if (farm && !farm.completedSteps.includes(WEATHER_STEP) && farm.currentStep === WEATHER_STEP) {
        updatedFarm = await completeStep(farmId, WEATHER_STEP);
      }
    }

    res.status(200).json({ weather: weatherInfo, farm: updatedFarm });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Could not fetch weather data. Check city name and try again.' });
  }
};

// Public version - no login required, used for the homepage snapshot card
const getPublicWeather = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({ message: 'City or coordinates are required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY?.trim();

    // Build the OpenWeatherMap URL differently depending on what we received
    let url;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    }

    const response = await axios.get(url);
    const data = response.data;

    const weatherInfo = {
      city: data.name,
      temperature: data.main.temp,
      condition: data.weather[0].main,
      description: data.weather[0].description,
    };

    res.status(200).json({ weather: weatherInfo });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Could not fetch weather data.' });
  }
};
// Public 5-day forecast for the homepage detail page
const getPublicForecast = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({ message: 'City or coordinates are required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY?.trim();
    let url;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    }

    const response = await axios.get(url);
    const list = response.data.list;

    // Pick one entry per day (around midday) for a clean 5-day summary
    const dailyForecast = list
      .filter((entry) => entry.dt_txt.includes('12:00:00'))
      .slice(0, 5)
      .map((entry) => ({
        date: entry.dt_txt.split(' ')[0],
        temperature: entry.main.temp,
        condition: entry.weather[0].main,
        description: entry.weather[0].description,
        humidity: entry.main.humidity,
      }));

    res.status(200).json({ city: response.data.city.name, forecast: dailyForecast });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Could not fetch forecast data.' });
  }
};
// Returns the raw next-2-days forecast list (used for smart tip generation)
const getRawForecast = async (req, res) => {
  try {
    const { city, lat, lon } = req.query;

    if (!city && (!lat || !lon)) {
      return res.status(400).json({ message: 'City or coordinates are required' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY?.trim();
    let url;
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    }

    const response = await axios.get(url);
    res.status(200).json({ list: response.data.list.slice(0, 16) });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Could not fetch forecast data.' });
  }
};

module.exports = { getWeather, getPublicWeather, getPublicForecast, getRawForecast };