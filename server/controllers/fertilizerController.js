const FertilizerRecommendation = require('../models/FertilizerRecommendation');
const SoilReport = require('../models/SoilReport');
const Farm = require('../models/Farm');
const { analyzeFertilizer } = require('../utils/fertilizerAnalysis');
const { canAccessStep, completeStep } = require('../utils/stepProgress');

const FERTILIZER_STEP = 7;

const submitFertilizerCheck = async (req, res) => {
  try {
    const { farmId } = req.body;

    if (!farmId) {
      return res.status(400).json({ message: 'farmId is required' });
    }

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    if (!farm.selectedCrops || farm.selectedCrops.length === 0) {
      return res.status(400).json({ message: 'Please confirm a crop in Crop Recommendation first.' });
    }

    const access = canAccessStep(farm, FERTILIZER_STEP);
    if (!access.allowed) {
      return res.status(403).json({ message: 'Please complete the previous steps first.' });
    }
    if (access.locked) {
      return res.status(403).json({ message: 'Fertilizer Recommendation has already been completed for this farm.' });
    }

    const cropName = farm.selectedCrops[0];
    const latestSoil = await SoilReport.findOne({ user: req.user.id, farm: farmId }).sort({ createdAt: -1 });

    const result = analyzeFertilizer({
      cropName,
      farmSizeAcres: farm.sizeInAcres,
      organicMatter: latestSoil ? latestSoil.organicMatter : null,
      pastCropGrowth: latestSoil ? latestSoil.pastCropGrowth : null,
    });

    const record = new FertilizerRecommendation({
      user: req.user.id,
      farm: farmId,
      cropName,
      ...result,
    });

    await record.save();

    const updatedFarm = await completeStep(farmId, FERTILIZER_STEP);

    res.status(201).json({ message: 'Fertilizer recommendation generated', record, farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating fertilizer recommendation' });
  }
};

const getMyFertilizerCheck = async (req, res) => {
  try {
    const { farmId } = req.query;
    const record = await FertilizerRecommendation.findOne({ user: req.user.id, farm: farmId });
    res.status(200).json({ record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching fertilizer recommendation' });
  }
};

module.exports = { submitFertilizerCheck, getMyFertilizerCheck };