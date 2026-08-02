const SoilReport = require('../models/SoilReport');
const Farm = require('../models/Farm');
const { analyzeSoil } = require('../utils/soilAnalysis');
const { canAccessStep, completeStep } = require('../utils/stepProgress');

const SOIL_HEALTH_STEP = 1;

const createSoilReport = async (req, res) => {
  try {
    const { farmId, soilColor, soilTexture, moisture, drainage, pastCropGrowth, organicMatter } = req.body;

    if (!farmId) {
      return res.status(400).json({ message: 'farmId is required' });
    }
    if (!soilColor || !soilTexture || !moisture || !drainage || !pastCropGrowth || !organicMatter) {
      return res.status(400).json({ message: 'Please answer all questions' });
    }

    // Find the farm and confirm it belongs to this logged-in user
    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Check whether this farm is allowed to fill Step 1 right now
    const access = canAccessStep(farm, SOIL_HEALTH_STEP);
    if (!access.allowed) {
      return res.status(403).json({ message: 'This step is not available yet for this farm.' });
    }
    if (access.locked) {
      return res.status(403).json({ message: 'Soil Health has already been completed for this farm and cannot be redone.' });
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

    // Mark Step 1 as completed for this farm, which also unlocks Step 2
    const updatedFarm = await completeStep(farmId, SOIL_HEALTH_STEP);

    res.status(201).json({ message: 'Soil report created', report, farm: updatedFarm });
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