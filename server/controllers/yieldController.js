const YieldPrediction = require('../models/YieldPrediction');
const SoilReport = require('../models/SoilReport');
const Farm = require('../models/Farm');
const { analyzeYield } = require('../utils/yieldAnalysis');
const { fetchMarketRecords, groupByMarket, summarize } = require('../utils/marketData');
const { recordSnapshot } = require('../utils/priceHistory');
const { canAccessStep, completeStep } = require('../utils/stepProgress');

const YIELD_STEP = 8;

const submitYieldPrediction = async (req, res) => {
  try {
    const { farmId, cropName } = req.body;
    if (!farmId || !cropName) return res.status(400).json({ message: 'farmId and cropName are required' });

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (!farm.selectedCrops || !farm.selectedCrops.includes(cropName)) {
      return res.status(400).json({ message: 'This crop is not confirmed for this farm.' });
    }

    const existingForCrop = await YieldPrediction.findOne({ farm: farmId, cropName });
    if (existingForCrop) return res.status(403).json({ message: 'A yield prediction already exists for this crop.' });

    const existing = await YieldPrediction.find({ farm: farmId });
    if (existing.length === 0) {
      const access = canAccessStep(farm, YIELD_STEP);
      if (!access.allowed) return res.status(403).json({ message: 'Please complete the previous steps first.' });
    }

    // Area: the farm's total acres are shared between its crops - a crop can't get more than what's left
    const totalAcres = farm.sizeInAcres && farm.sizeInAcres > 0 ? farm.sizeInAcres : 1;
    const usedAcres = existing.reduce((s, r) => s + (r.areaAcres || 0), 0);
    const freeAcres = Math.max(0, totalAcres - usedAcres);
    const remainingCrops = Math.max(1, farm.selectedCrops.length - existing.length);

    let areaAcres = Number(req.body.areaAcres);
    if (!areaAcres || areaAcres <= 0) areaAcres = freeAcres / remainingCrops;
    areaAcres = Math.round(areaAcres * 100) / 100;
    if (areaAcres <= 0 || areaAcres > freeAcres + 0.01) {
      return res.status(400).json({ message: `Only ${freeAcres.toFixed(2)} acres of this farm are left to allocate.` });
    }

    const latestSoil = await SoilReport.findOne({ user: req.user.id, farm: farmId }).sort({ createdAt: -1 });

    // Real Maharashtra mandi price for income
    const { records, isFallback } = await fetchMarketRecords(cropName);
    const summary = summarize(groupByMarket(records));
    if (summary && !isFallback) recordSnapshot(cropName, summary);

    const result = analyzeYield({
      cropName,
      areaAcres,
      soilHealthScore: latestSoil ? latestSoil.healthScore : null,
      livePrice: summary ? summary.median : null,
      liveMarketCount: summary ? summary.count : 0,
    });

    const record = new YieldPrediction({ user: req.user.id, farm: farmId, cropName, isFallback, ...result });
    await record.save();

    let updatedFarm = null;
    if (existing.length === 0) updatedFarm = await completeStep(farmId, YIELD_STEP);

    res.status(201).json({ message: 'Yield prediction generated', record, farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating yield prediction' });
  }
};

const getMyYieldPrediction = async (req, res) => {
  try {
    const { farmId } = req.query;
    const records = await YieldPrediction.find({ user: req.user.id, farm: farmId }).sort({ createdAt: 1 });
    res.status(200).json({ records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching yield predictions' });
  }
};

module.exports = { submitYieldPrediction, getMyYieldPrediction };