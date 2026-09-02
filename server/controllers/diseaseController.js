const DiseaseDetection = require('../models/DiseaseDetection');
const SoilReport = require('../models/SoilReport');
const Farm = require('../models/Farm');
const { analyzeDisease } = require('../utils/diseaseAnalysis');
const { canAccessStep, completeStep } = require('../utils/stepProgress');

const DISEASE_STEP = 6;

const submitDiseaseCheck = async (req, res) => {
  try {
    const { farmId, symptoms, skippedNoIssue } = req.body;

    if (!farmId) {
      return res.status(400).json({ message: 'farmId is required' });
    }

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    const access = canAccessStep(farm, DISEASE_STEP);
    if (!access.allowed) {
      return res.status(403).json({ message: 'Please complete the previous steps first.' });
    }
    if (access.locked) {
      return res.status(403).json({ message: 'Disease Detection has already been completed for this farm.' });
    }

    let diseaseKey = null;
    let confidencePercent = null;
    let symptomList = [];

    const isSkipped = skippedNoIssue === 'true' || skippedNoIssue === true;

    if (!isSkipped) {
      symptomList = symptoms ? JSON.parse(symptoms) : [];

      const latestSoil = await SoilReport.findOne({ user: req.user.id, farm: farmId }).sort({ createdAt: -1 });

      const result = analyzeDisease({
        symptoms: symptomList,
        soilMoisture: latestSoil ? latestSoil.moisture : null,
        soilDrainage: latestSoil ? latestSoil.drainage : null,
      });

      diseaseKey = result.diseaseKey;
      confidencePercent = result.confidencePercent;
    }

    const photoPath = req.file ? `/uploads/${req.file.filename}` : null;

    const record = new DiseaseDetection({
      user: req.user.id,
      farm: farmId,
      photoPath,
      symptoms: symptomList,
      skippedNoIssue: isSkipped,
      diseaseKey,
      confidencePercent,
    });

    await record.save();

    const updatedFarm = await completeStep(farmId, DISEASE_STEP);

    res.status(201).json({ message: 'Disease check submitted', record, farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error submitting disease check' });
  }
};

const getMyDiseaseCheck = async (req, res) => {
  try {
    const { farmId } = req.query;
    const record = await DiseaseDetection.findOne({ user: req.user.id, farm: farmId });
    res.status(200).json({ record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching disease check' });
  }
};

module.exports = { submitDiseaseCheck, getMyDiseaseCheck };