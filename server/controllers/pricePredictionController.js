const MarketPricePrediction = require('../models/MarketPricePrediction');
const Farm = require('../models/Farm');
const { geocode } = require('../utils/geo');
const { fetchMarketRecords, groupByMarket, summarize, attachDistances, sortNearestFirst } = require('../utils/marketData');
const { recordSnapshot, buildForecast } = require('../utils/priceHistory');
const { canAccessStep, completeStep } = require('../utils/stepProgress');

const PRICE_PREDICTION_STEP = 10;

const place = (m, distanceKm) => ({ name: m.name, district: m.district, price: m.price, distanceKm: distanceKm ?? m.distanceKm ?? null });

const submitPricePrediction = async (req, res) => {
  try {
    const { farmId, cropName } = req.body;
    if (!farmId || !cropName) return res.status(400).json({ message: 'farmId and cropName are required' });

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (!farm.selectedCrops || !farm.selectedCrops.includes(cropName)) {
      return res.status(400).json({ message: 'This crop is not confirmed for this farm.' });
    }

    const existingForCrop = await MarketPricePrediction.findOne({ farm: farmId, cropName });
    if (existingForCrop) return res.status(403).json({ message: 'A price analysis already exists for this crop.' });

    const anyExisting = await MarketPricePrediction.findOne({ farm: farmId });
    if (!anyExisting) {
      const access = canAccessStep(farm, PRICE_PREDICTION_STEP);
      if (!access.allowed) return res.status(403).json({ message: 'Please complete the previous steps first.' });
    }

    const { records: rawRecords, isFallback } = await fetchMarketRecords(cropName);
    const markets = groupByMarket(rawRecords);
    const summary = summarize(markets);

    let record;
    if (!summary) {
      record = new MarketPricePrediction({ user: req.user.id, farm: farmId, cropName, noLiveData: true, historyDays: 0, projectedPrices: [] });
    } else {
      if (!isFallback) await recordSnapshot(cropName, summary);

      const origin = await geocode(farm.location);
      const nearestList = sortNearestFirst(await attachDistances(markets, origin));
      const nearest = nearestList[0];

      // Where the nearest market's price sits within the Maharashtra range (0 = lowest, 1 = highest)
      const prices = markets.map((m) => m.price);
      const below = prices.filter((p) => p < nearest.price).length;
      const pricePercentile = prices.length > 1 ? Math.round((below / (prices.length - 1)) * 100) / 100 : 0.5;

          const forecast = isFallback ? { historyDays: 0, trend: null, weeklyChangePercent: null, projectedPrices: [] } : await buildForecast(cropName, summary.median);

      let adviceKey;
      if (forecast.trend === 'up') adviceKey = 'adviceWait';
      else if (forecast.trend === 'down') adviceKey = 'adviceSellSoon';
      else if (forecast.trend === 'stable') adviceKey = 'adviceStable';
      else if (pricePercentile >= 0.66) adviceKey = 'adviceSellHere';
      else if (pricePercentile <= 0.33) adviceKey = 'adviceCompareMarkets';
      else adviceKey = 'adviceNearMedian';

      record = new MarketPricePrediction({
        user: req.user.id,
        farm: farmId,
        cropName,
        isFallback,
        priceDate: summary.latestDate,
        statePrice: summary.median,
        marketCount: summary.count,
        highest: place(summary.highest),
        lowest: place(summary.lowest),
        nearest: place(nearest),
        pricePercentile,
        marketPrices: nearestList.slice(0, 8).map((m) => place(m)),
        historyDays: forecast.historyDays,
        trend: forecast.trend,
        weeklyChangePercent: forecast.weeklyChangePercent,
        projectedPrices: forecast.projectedPrices,
        adviceKey,
      });
    }

    await record.save();

    let updatedFarm = null;
    if (!anyExisting) updatedFarm = await completeStep(farmId, PRICE_PREDICTION_STEP);

    res.status(201).json({ message: 'Price analysis generated', record, farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating price analysis' });
  }
};

const getMyPricePrediction = async (req, res) => {
  try {
    const { farmId } = req.query;
    const records = await MarketPricePrediction.find({ user: req.user.id, farm: farmId }).sort({ createdAt: 1 });
    res.status(200).json({ records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching price analyses' });
  }
};

module.exports = { submitPricePrediction, getMyPricePrediction };