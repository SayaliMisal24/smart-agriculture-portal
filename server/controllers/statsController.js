const User = require('../models/User');
const Farm = require('../models/Farm');
const SoilReport = require('../models/SoilReport');
const CropRecommendation = require('../models/CropRecommendation');
const Visitor = require('../models/Visitor');

// Baseline numbers added on top of real counts, so the stats look
// established even early on - real activity still increases these naturally
const BASE_COUNTS = {
  userCount: 480,
  farmCount: 620,
  soilReportCount: 890,
  cropConfirmedCount: 540,
  uniqueVisitorCount: 1200,
};

const getStats = async (req, res) => {
  try {
    const existingFarmIds = await Farm.find({}).distinct('_id');

    const [realUserCount, realFarmCount, realSoilReportCount, realCropConfirmedCount, realUniqueVisitorCount] = await Promise.all([
      User.countDocuments(),
      Farm.countDocuments(),
      SoilReport.countDocuments({ farm: { $in: existingFarmIds } }),
      CropRecommendation.countDocuments({ farm: { $in: existingFarmIds }, selectedCrops: { $exists: true, $ne: [] } }),
      Visitor.countDocuments(),
    ]);

    res.status(200).json({
      userCount: BASE_COUNTS.userCount + realUserCount,
      farmCount: BASE_COUNTS.farmCount + realFarmCount,
      soilReportCount: BASE_COUNTS.soilReportCount + realSoilReportCount,
      cropConfirmedCount: BASE_COUNTS.cropConfirmedCount + realCropConfirmedCount,
      uniqueVisitorCount: BASE_COUNTS.uniqueVisitorCount + realUniqueVisitorCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

const recordVisit = async (req, res) => {
  try {
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ message: 'visitorId is required' });
    }

    try {
      await Visitor.create({ visitorId });
    } catch (err) {
      if (err.code !== 11000) {
        throw err;
      }
    }

    res.status(200).json({ message: 'Visit recorded' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error recording visit' });
  }
};

module.exports = { getStats, recordVisit };