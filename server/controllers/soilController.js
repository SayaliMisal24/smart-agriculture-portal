const SoilReport = require('../models/SoilReport');
const { analyzeSoil } = require('../utils/soilAnalysis');

const createSoilReport = async (req, res) => {
  try {
    const { farmId, soilColor, soilTexture, moisture, drainage, pastCropGrowth, organicMatter } = req.body;

    if (!farmId) {
      return res.status(400).json({ message: 'farmId is required' });
    }
    if (!soilColor || !soilTexture || !moisture || !drainage || !pastCropGrowth || !organicMatter) {
      return res.status(400).json({ message: 'Please answer all questions' });
    }

    const { score, status, suggestions } = analyzeSoil({
      soilColor, soilTexture, moisture, drainage, pastCropGrowth, organicMatter,
    });

    const report = new SoilReport({
      user: req.user.id,
      farm: farmId,
      soilColor, soilTexture, moisture, drainage, pastCropGrowth, organicMatter,
      healthScore: score,
      healthStatus: status,
      suggestions,
    });

    await report.save();
    res.status(201).json({ message: 'Soil report created', report });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating soil report' });
  }
};

const getMySoilReports = async (req, res) => {
  try {
    const { farmId } = req.query;
    const filter = { user: req.user.id };
    if (farmId) filter.farm = farmId;

    const reports = await SoilReport.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching soil reports' });
  }
};

module.exports = { createSoilReport, getMySoilReports };