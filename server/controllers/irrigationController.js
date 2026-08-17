const axios = require('axios');
const SoilReport = require('../models/SoilReport');
const Farm = require('../models/Farm');
const IrrigationLog = require('../models/IrrigationLog');
const { calculateIrrigation } = require('../utils/irrigationAnalysis');
const { completeStep } = require('../utils/stepProgress');

const IRRIGATION_STEP = 4;

// Step A: Farmer sets the sowing date (only needs to be done once)
const setSowingDate = async (req, res) => {
  try {
    const { farmId, sowingDate } = req.body;

    if (!farmId || !sowingDate) {
      return res.status(400).json({ message: 'farmId and sowingDate are required' });
    }

    const farm = await Farm.findOneAndUpdate(
      { _id: farmId, user: req.user.id },
      { sowingDate },
      { new: true }
    );

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    res.status(200).json({ message: 'Sowing date saved', farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error saving sowing date' });
  }
};

// Step B: Get current irrigation advice (uses latest soil report + live weather + last log entry)
const getIrrigationAdvice = async (req, res) => {
  try {
    const { city, farmId } = req.query;

    if (!city || !farmId) {
      return res.status(400).json({ message: 'City and farmId are required' });
    }

    const latestSoil = await SoilReport.findOne({ user: req.user.id, farm: farmId }).sort({ createdAt: -1 });
    if (!latestSoil) {
      return res.status(400).json({ message: 'Please complete a Soil Health report first.' });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY?.trim();

    // Current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const weatherRes = await axios.get(currentUrl);
    const weatherData = weatherRes.data;

    // 5-day forecast (checked every 3 hours) - we scan the next ~3 days for any rain
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const forecastRes = await axios.get(forecastUrl);
    const forecastList = forecastRes.data.list.slice(0, 24); // next ~3 days (8 entries/day x 3)

    const rainExpectedSoon = forecastList.some((entry) =>
      ['Rain', 'Drizzle', 'Thunderstorm'].includes(entry.weather[0].main)
    );

    const lastLog = await IrrigationLog.findOne({ user: req.user.id, farm: farmId }).sort({ date: -1 });

    const result = calculateIrrigation({
      soilMoisture: latestSoil.moisture,
      weatherCondition: weatherData.weather[0].main,
      temperature: weatherData.main.temp,
      lastIrrigationDate: lastLog ? lastLog.date : null,
      rainExpectedSoon,
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
      rainExpectedSoon,
      soilMoisture: latestSoil.moisture,
      lastIrrigationDate: lastLog ? lastLog.date : null,
      farm: updatedFarm,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Could not calculate irrigation advice.' });
  }
};

// Step C: Farmer logs that they actually irrigated on a specific date
const logIrrigation = async (req, res) => {
  try {
    const { farmId, date } = req.body;

    if (!farmId || !date) {
      return res.status(400).json({ message: 'farmId and date are required' });
    }

    const log = new IrrigationLog({
      user: req.user.id,
      farm: farmId,
      date,
    });
    await log.save();

    res.status(201).json({ message: 'Irrigation logged', log });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error logging irrigation' });
  }
};

// Get the full irrigation history for a farm
const getIrrigationHistory = async (req, res) => {
  try {
    const { farmId } = req.query;
    const logs = await IrrigationLog.find({ user: req.user.id, farm: farmId }).sort({ date: -1 });
    res.status(200).json({ logs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching irrigation history' });
  }
};

module.exports = { setSowingDate, getIrrigationAdvice, logIrrigation, getIrrigationHistory };