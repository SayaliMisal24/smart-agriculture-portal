const axios = require('axios');
const SoilReport = require('../models/SoilReport');
const Farm = require('../models/Farm');
const { calculateIrrigation } = require('../utils/irrigationAnalysis');
const { completeStep } = require('../utils/stepProgress');

const IRRIGATION_STEP = 4;

const getIrrigationAdvice = async (req, res) => {
  try {
    const { city, farmId } = req.query;

    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }
    if (!farmId) {
      return res.status(400).json({ message: 'farmId is required' });
    }

    const latestSoil = await SoilReport.findOne({ user: req.user.id, farm: farmId }).sort({ createdAt: -1 });
    if (!latestSoil) {
      return res.status(400).json({ message: 'Please complete a Soil Health report first.' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY?.trim();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const weatherRes = await axios.get(url);
    const weatherData = weatherRes.data;

    const result = calculateIrrigation({
      soilMoisture: latestSoil.moisture,
      weatherCondition: weatherData.weather[0].main,
      temperature: weatherData.main.temp,
    });

    let updatedFarm = null;
    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (farm && !farm.completedSteps.includes(IRRIGATION_STEP) && farm.currentStep === IRRIGATION_STEP) {
      updatedFarm = await completeStep(farmId, IRRIGATION_STEP);
    }

    res.status(200).json({
      ...result,
      currentWeather: {
        condition: weatherData.weather[0].main,
        temperature: weatherData.main.temp,
      },
      soilMoisture: latestSoil.moisture,
      farm: updatedFarm,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Could not calculate irrigation advice.' });
  }
};

module.exports = { getIrrigationAdvice };