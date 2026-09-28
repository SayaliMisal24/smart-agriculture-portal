const MarketFinder = require('../models/MarketFinder');
const Farm = require('../models/Farm');
const axios = require('axios');
const { canAccessStep, completeStep } = require('../utils/stepProgress');

const MARKET_FINDER_STEP = 9;

const submitMarketFinder = async (req, res) => {
  try {
    const { farmId, cropName: requestedCrop } = req.body;
    if (!farmId) return res.status(400).json({ message: 'farmId is required' });

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (!farm.selectedCrops || farm.selectedCrops.length === 0) {
      return res.status(400).json({ message: 'Please confirm a crop in Crop Recommendation first.' });
    }

    const cropName = requestedCrop && farm.selectedCrops.includes(requestedCrop) ? requestedCrop : farm.selectedCrops[0];

    const access = canAccessStep(farm, MARKET_FINDER_STEP);
    if (!access.allowed) return res.status(403).json({ message: 'Please complete the previous steps first.' });
    if (access.locked) return res.status(403).json({ message: 'Market Finder has already been completed for this farm.' });

    const apiKey = process.env.DATA_GOV_API_KEY?.trim();
    const resourceId = '9ef84268-d588-465a-a308-a864a43d0070';
    const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=8&filters[commodity]=${encodeURIComponent(cropName)}&filters[state]=Maharashtra`;

    let markets = [];
    try {
      const response = await axios.get(url, { timeout: 8000 });
      markets = (response.data.records || []).map((r, i) => ({
        name: r.market,
        distance: `${(i + 1) * 12} km`,
        price: Number(r.modal_price) || 0,
      }));
    } catch (err) {
      console.error('Market Finder price lookup failed', err.message);
    }

    markets.sort((a, b) => b.price - a.price);

    const record = new MarketFinder({ user: req.user.id, farm: farmId, cropName, markets });
    await record.save();

    const updatedFarm = await completeStep(farmId, MARKET_FINDER_STEP);
    res.status(201).json({ message: 'Market finder generated', record, farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating market finder' });
  }
};

const getMyMarketFinder = async (req, res) => {
  try {
    const { farmId } = req.query;
    const record = await MarketFinder.findOne({ user: req.user.id, farm: farmId });
    res.status(200).json({ record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching market finder' });
  }
};

module.exports = { submitMarketFinder, getMyMarketFinder };