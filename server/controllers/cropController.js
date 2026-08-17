const CropRecommendation = require('../models/CropRecommendation');
const Farm = require('../models/Farm');
const { recommendCrops } = require('../utils/cropAnalysis');
const { canAccessStep, completeStep } = require('../utils/stepProgress');

const CROP_STEP = 2;

const getCropRecommendation = async (req, res) => {
  try {
    const { farmId, season, soilType, waterAvailability } = req.body;

    if (!farmId) {
      return res.status(400).json({ message: 'farmId is required' });
    }
    if (!season || !soilType || !waterAvailability) {
      return res.status(400).json({ message: 'Please select all options' });
    }

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    const access = canAccessStep(farm, CROP_STEP);
    if (!access.allowed) {
      return res.status(403).json({ message: 'Please complete the Soil Health step first.' });
    }
    if (access.locked) {
      return res.status(403).json({ message: 'Crop Recommendation has already been completed for this farm.' });
    }

    const recommendedCrops = recommendCrops({ season, soilType, waterAvailability });

    const record = new CropRecommendation({
      user: req.user.id,
      farm: farmId,
      season, soilType, waterAvailability,
      recommendedCrops,
    });

    await record.save();

    res.status(201).json({ message: 'Crop recommendation generated', record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating recommendation' });
  }
};

// Farmer confirms one OR MORE crops - this locks Step 2
const selectCrops = async (req, res) => {
  try {
    const { cropNames, farmId } = req.body; // cropNames is now an ARRAY

    if (!cropNames || !Array.isArray(cropNames) || cropNames.length === 0 || !farmId) {
      return res.status(400).json({ message: 'Please select at least one crop.' });
    }

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    const access = canAccessStep(farm, CROP_STEP);
    if (access.locked) {
      return res.status(403).json({ message: 'Crop selection has already been confirmed and locked for this farm.' });
    }

    // Save the selected crops on the latest recommendation record too, for history
    const latestRecord = await CropRecommendation.findOne({ user: req.user.id, farm: farmId }).sort({ createdAt: -1 });
    if (latestRecord) {
      latestRecord.selectedCrops = cropNames;
      await latestRecord.save();
    }

    // Save directly on the Farm - this is what later steps will read
    farm.selectedCrops = cropNames;
    await farm.save();

    // Lock Step 2, unlock Step 3
    const updatedFarm = await completeStep(farmId, CROP_STEP);

    res.status(200).json({ message: 'Crops confirmed', farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error confirming crop selection' });
  }
};

const getLatestCropRecommendation = async (req, res) => {
  try {
    const { farmId } = req.query;
    const record = await CropRecommendation.findOne({ user: req.user.id, farm: farmId }).sort({ createdAt: -1 });
    res.status(200).json({ record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching crop recommendation' });
  }
};

module.exports = { getCropRecommendation, selectCrops, getLatestCropRecommendation };