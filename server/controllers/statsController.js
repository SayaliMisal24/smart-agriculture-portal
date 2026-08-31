const User = require('../models/User');
const Farm = require('../models/Farm');
const SoilReport = require('../models/SoilReport');
const CropRecommendation = require('../models/CropRecommendation');
const Visitor = require('../models/Visitor');
const getStats = async (req, res) => {
  try {
    const existingFarmIds = await Farm.find({}).distinct('_id');

    const [userCount, farmCount, soilReportCount, cropConfirmedCount, uniqueVisitorCount] = await Promise.all([
      User.countDocuments(),
      Farm.countDocuments(),
      SoilReport.countDocuments({ farm: { $in: existingFarmIds } }),
      CropRecommendation.countDocuments({ farm: { $in: existingFarmIds }, selectedCrops: { $exists: true, $ne: [] } }),
      Visitor.countDocuments(),
    ]);

    res.status(200).json({
      userCount,
      farmCount,
      soilReportCount,
      cropConfirmedCount,
      uniqueVisitorCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};
// Records a visit ONLY if this visitorId hasn't been seen before -
// this is what makes the count genuinely "unique visitors" rather than raw page loads
const recordVisit = async (req, res) => {
  try {
    const { visitorId } = req.body;

    if (!visitorId) {
      return res.status(400).json({ message: 'visitorId is required' });
    }

    try {
      await Visitor.create({ visitorId });
    } catch (err) {
      // Duplicate key error means this visitor was already counted before - that's fine, not an error
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