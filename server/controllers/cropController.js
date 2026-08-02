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

    const updatedFarm = await completeStep(farmId, CROP_STEP);

    res.status(201).json({ message: 'Crop recommendation generated', record, farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating recommendation' });
  }
};

const selectCrop = async (req, res) => {
  try {
    const { cropName } = req.body;
    const record = await CropRecommendation.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { selectedCrop: cropName },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: 'Recommendation not found' });
    res.status(200).json({ record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error selecting crop' });
  }
};

module.exports = { getCropRecommendation, selectCrop };