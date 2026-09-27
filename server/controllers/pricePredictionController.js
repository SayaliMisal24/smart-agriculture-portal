const MarketPricePrediction = require('../models/MarketPricePrediction');
const MarketFinder = require('../models/MarketFinder');
const Farm = require('../models/Farm');
const { predictPriceTrend } = require('../utils/pricePredictionAnalysis');
const { canAccessStep, completeStep } = require('../utils/stepProgress');

const PRICE_PREDICTION_STEP = 10;

const submitPricePrediction = async (req, res) => {
  try {
    const { farmId, cropName: requestedCrop } = req.body;
    if (!farmId) return res.status(400).json({ message: 'farmId is required' });

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (!farm.selectedCrops || farm.selectedCrops.length === 0) {
      return res.status(400).json({ message: 'Please confirm a crop in Crop Recommendation first.' });
    }

    const cropName = requestedCrop && farm.selectedCrops.includes(requestedCrop) ? requestedCrop : farm.selectedCrops[0];

    const access = canAccessStep(farm, PRICE_PREDICTION_STEP);
    if (!access.allowed) return res.status(403).json({ message: 'Please complete the previous steps first.' });
    if (access.locked) return res.status(403).json({ message: 'Market Price Prediction has already been completed for this farm.' });

    const marketRecord = await MarketFinder.findOne({ user: req.user.id, farm: farmId });
    const currentPrice = marketRecord && marketRecord.markets.length > 0 ? marketRecord.markets[0].price : 2000;

    const result = predictPriceTrend(currentPrice);

    const record = new MarketPricePrediction({ user: req.user.id, farm: farmId, cropName, currentPrice, ...result });
    await record.save();

    const updatedFarm = await completeStep(farmId, PRICE_PREDICTION_STEP);
    res.status(201).json({ message: 'Price prediction generated', record, farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating price prediction' });
  }
};
const getMyPricePrediction = async (req, res) => {
  try {
    const { farmId } = req.query;
    const record = await MarketPricePrediction.findOne({ user: req.user.id, farm: farmId });
    res.status(200).json({ record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching price prediction' });
  }
};

module.exports = { submitPricePrediction, getMyPricePrediction };