const SoilReport = require('../models/SoilReport');
const { analyzeSoil } = require('../utils/soilAnalysis');

const createSoilReport = async (req, res) => {
  try {
    const { soilColor, soilTexture, moisture, drainage, pastCropGrowth, organicMatter } = req.body;

    if (!soilColor || !soilTexture || !moisture || !drainage || !pastCropGrowth || !organicMatter) {
      return res.status(400).json({ message: 'Please answer all questions' });
    }

    const { score, status, suggestions } = analyzeSoil({
      soilColor, soilTexture, moisture, drainage, pastCropGrowth, organicMatter,
    });

    const report = new SoilReport({
      user: req.user.id,
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
    const reports = await SoilReport.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ reports });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching soil reports' });
  }
};

module.exports = { createSoilReport, getMySoilReports };