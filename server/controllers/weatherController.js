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
      condition: data.weather[0].main,
      description: data.weather[0].description,
    };

    res.status(200).json({ weather: weatherInfo });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Could not fetch weather data.' });
  }
};

module.exports = { getWeather, getPublicWeather };