const FertilizerRecommendation = require('../models/FertilizerRecommendation');
const SoilReport = require('../models/SoilReport');
const DiseaseDetection = require('../models/DiseaseDetection');
const Farm = require('../models/Farm');
const { analyzeFertilizer } = require('../utils/fertilizerAnalysis');
const { canAccessStep, completeStep } = require('../utils/stepProgress');

const FERTILIZER_STEP = 7;

const submitFertilizerCheck = async (req, res) => {
  try {
    const { farmId, cropName } = req.body;
    if (!farmId || !cropName) return res.status(400).json({ message: 'farmId and cropName are required' });

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (!farm.selectedCrops || !farm.selectedCrops.includes(cropName)) {
      return res.status(400).json({ message: 'This crop is not confirmed for this farm.' });
    }

    const existingForCrop = await FertilizerRecommendation.findOne({ farm: farmId, cropName });
    if (existingForCrop) return res.status(403).json({ message: 'A fertilizer plan already exists for this crop.' });

    const anyExisting = await FertilizerRecommendation.findOne({ farm: farmId });
    if (!anyExisting) {
      const access = canAccessStep(farm, FERTILIZER_STEP);
      if (!access.allowed) return res.status(403).json({ message: 'Please complete the previous steps first.' });
    }

    const latestSoil = await SoilReport.findOne({ user: req.user.id, farm: farmId }).sort({ createdAt: -1 });
    const diseaseRecord = await DiseaseDetection.findOne({ user: req.user.id, farm: farmId, cropName, diseaseKey: { $ne: null } });

    // Each crop gets an equal share of the farm's area
    const totalAcres = farm.sizeInAcres && farm.sizeInAcres > 0 ? farm.sizeInAcres : 1;
    const areaAcres = Math.round((totalAcres / farm.selectedCrops.length) * 100) / 100;

    const result = analyzeFertilizer({
      cropName,
      farmSizeAcres: areaAcres,
      organicMatter: latestSoil ? latestSoil.organicMatter : null,
      pastCropGrowth: latestSoil ? latestSoil.pastCropGrowth : null,
      diseaseKey: diseaseRecord ? diseaseRecord.diseaseKey : null,
    });

    const record = new FertilizerRecommendation({ user: req.user.id, farm: farmId, cropName, areaAcres, ...result });
    await record.save();

    let updatedFarm = null;
    if (!anyExisting) updatedFarm = await completeStep(farmId, FERTILIZER_STEP);

    res.status(201).json({ message: 'Fertilizer recommendation generated', record, farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating fertilizer recommendation' });
  }
};

const getMyFertilizerCheck = async (req, res) => {
  try {
    const { farmId } = req.query;
    const records = await FertilizerRecommendation.find({ user: req.user.id, farm: farmId }).sort({ createdAt: 1 });
    res.status(200).json({ records });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching fertilizer recommendations' });
  }
};

module.exports = { submitFertilizerCheck, getMyFertilizerCheck };