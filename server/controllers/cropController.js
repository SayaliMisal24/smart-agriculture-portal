const CropRecommendation = require('../models/CropRecommendation');
const { recommendCrops } = require('../utils/cropAnalysis');

const getCropRecommendation = async (req, res) => {
  try {
    const { farmId, season, soilType, waterAvailability } = req.body;

    if (!farmId) {
      return res.status(400).json({ message: 'farmId is required' });
    }
    if (!season || !soilType || !waterAvailability) {
      return res.status(400).json({ message: 'Please select all options' });
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

// Save which crop the farmer selected for this recommendation
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