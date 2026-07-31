const CropRecommendation = require('../models/CropRecommendation');
const { recommendCrops } = require('../utils/cropAnalysis');

const getCropRecommendation = async (req, res) => {
  try {
    const { season, soilType, waterAvailability } = req.body;

    if (!season || !soilType || !waterAvailability) {
      return res.status(400).json({ message: 'Please select all options' });
    }

    const recommendedCrops = recommendCrops({ season, soilType, waterAvailability });

    const record = new CropRecommendation({
      user: req.user.id,
      season,
      soilType,
      waterAvailability,
      recommendedCrops,
    });

    await record.save();

    res.status(201).json({ message: 'Crop recommendation generated', record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating recommendation' });
  }
};

module.exports = { getCropRecommendation };