const MarketFinder = require('../models/MarketFinder');
const Farm = require('../models/Farm');
const { geocode } = require('../utils/geo');
const { fetchMarketRecords, groupByMarket, summarize, attachDistances, sortNearestFirst } = require('../utils/marketData');
const { recordSnapshot } = require('../utils/priceHistory');
const { canAccessStep, completeStep } = require('../utils/stepProgress');

const MARKET_FINDER_STEP = 9;

const mapsUrl = (m) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${m.name}, ${m.district}, Maharashtra`)}`;

const submitMarketFinder = async (req, res) => {
  try {
    const { farmId, cropName, lat, lon } = req.body;
    if (!farmId || !cropName) return res.status(400).json({ message: 'farmId and cropName are required' });

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (!farm.selectedCrops || !farm.selectedCrops.includes(cropName)) {
      return res.status(400).json({ message: 'This crop is not confirmed for this farm.' });
    }

    const existingForCrop = await MarketFinder.findOne({ farm: farmId, cropName });
    if (existingForCrop) return res.status(403).json({ message: 'Markets were already found for this crop.' });

    const anyExisting = await MarketFinder.findOne({ farm: farmId });
    if (!anyExisting) {
      const access = canAccessStep(farm, MARKET_FINDER_STEP);
      if (!access.allowed) return res.status(403).json({ message: 'Please complete the previous steps first.' });
    }

    // Distance origin: the farmer's live GPS if provided, otherwise the farm's location
    let origin = null;
    let originSource = 'farm';
    if (typeof lat === 'number' && typeof lon === 'number') {
      origin = { lat, lon };
      originSource = 'gps';
    } else {
      origin = await geocode(farm.location);
    }

    const { records: rawRecords, isFallback } = await fetchMarketRecords(cropName);
    const markets = groupByMarket(rawRecords);
    const summary = summarize(markets);

    let record;
    if (!summary) {
      record = new MarketFinder({ user: req.user.id, farm: farmId, cropName, noLiveData: true, originSource, farmLocation: farm.location, markets: [] });
    } else {
      if (!isFallback) recordSnapshot(cropName, summary);
      const withDistance = await attachDistances(markets, origin);
      const nearest = sortNearestFirst(withDistance).slice(0, 8);
      const highestFull = withDistance.find((m) => m.name === summary.highest.name && m.district === summary.highest.district);

      record = new MarketFinder({
        user: req.user.id,
        farm: farmId,
        cropName,
        isFallback,
        originSource,
        farmLocation: farm.location,
        priceDate: summary.latestDate,
        statePrice: summary.median,
        marketCount: summary.count,
        highest: {
          name: summary.highest.name,
          district: summary.highest.district,
          price: summary.highest.price,
          distanceKm: highestFull ? highestFull.distanceKm : null,
        },
        markets: nearest.map((m) => ({
          name: m.name,
          district: m.district,
          distanceKm: m.distanceKm,
          price: m.price,
          minPrice: m.minPrice,
          maxPrice: m.maxPrice,
          date: m.date,
          mapsUrl: mapsUrl(m),
        })),
      });
    }

    await record.save();

    let updatedFarm = null;
    if (!anyExisting) updatedFarm = await completeStep(farmId, MARKET_FINDER_STEP);

    res.status(201).json({ message: 'Market finder generated', record, farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating market finder' });
  }
};

const getMyMarketFinder = async (req, res) => {
  try {
    const { farmId } = req.query;
    const records = await MarketFinder.find({ user: req.user.id, farm: farmId }).sort({ createdAt: 1 });
    res.status(200).json({ records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching market finder records' });
  }
};

module.exports = { submitMarketFinder, getMyMarketFinder };