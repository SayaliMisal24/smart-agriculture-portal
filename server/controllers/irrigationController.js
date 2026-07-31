const axios = require('axios');
const SoilReport = require('../models/SoilReport');
const { calculateIrrigation } = require('../utils/irrigationAnalysis');

const getIrrigationAdvice = async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }

    // Get latest soil report for this user
    const latestSoil = await SoilReport.findOne({ user: req.user.id }).sort({ createdAt: -1 });

    if (!latestSoil) {
      return res.status(400).json({ message: 'Please complete a Soil Health report first.' });
    }

    // Get current weather
    const apiKey = process.env.OPENWEATHER_API_KEY?.trim();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const weatherRes = await axios.get(url);
    const weatherData = weatherRes.data;

    const result = calculateIrrigation({
      soilMoisture: latestSoil.moisture,
      weatherCondition: weatherData.weather[0].main,
      temperature: weatherData.main.temp,
    });

    res.status(200).json({
      ...result,
      currentWeather: {
        condition: weatherData.weather[0].main,
        temperature: weatherData.main.temp,
      },
      soilMoisture: latestSoil.moisture,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Could not calculate irrigation advice.' });
  }
};

module.exports = { getIrrigationAdvice };