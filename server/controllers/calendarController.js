const CropCalendar = require('../models/CropCalendar');
const Farm = require('../models/Farm');
const { generateCalendar } = require('../utils/calendarGenerator');
const { cropDatabase } = require('../utils/cropAnalysis');
const { canAccessStep, completeStep } = require('../utils/stepProgress');

const CALENDAR_STEP = 5;

const createCropCalendar = async (req, res) => {
  try {
    const { farmId, selectedCrop } = req.body;
    if (!farmId || !selectedCrop) {
      return res.status(400).json({ message: 'farmId and selectedCrop are required' });
    }

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (!farm.sowingDate) return res.status(400).json({ message: 'Please set your sowing date in Smart Irrigation first.' });

    // First-ever calendar for this farm still follows the normal step-lock check
    const existingForThisCrop = await CropCalendar.findOne({ farm: farmId, selectedCrop });
    if (existingForThisCrop) {
      return res.status(403).json({ message: 'A calendar already exists for this crop on this farm.' });
    }

    const anyExisting = await CropCalendar.findOne({ farm: farmId });
    if (!anyExisting) {
      const access = canAccessStep(farm, CALENDAR_STEP);
      if (!access.allowed) return res.status(403).json({ message: 'Please complete the previous steps first.' });
    }
    // If a calendar already exists for another crop, we allow adding more freely -
    // the step is already unlocked/completed, this is an intentional exception
    // to the usual lock-forever rule so farmers can plan for multiple confirmed crops

    const cropInfo = cropDatabase.find((c) => c.name === selectedCrop);
    const cropDurationStr = cropInfo ? cropInfo.duration : null;
    const cropWaterNeed = cropInfo ? cropInfo.water : 'moderate';

    const activities = generateCalendar(selectedCrop, farm.sowingDate, cropDurationStr, cropWaterNeed);

    const calendar = new CropCalendar({ user: req.user.id, farm: farmId, selectedCrop, sowingDate: farm.sowingDate, activities });
    await calendar.save();

    let updatedFarm = null;
    if (!anyExisting) {
      updatedFarm = await completeStep(farmId, CALENDAR_STEP);
    }

    res.status(201).json({ message: 'Crop calendar generated', calendar, farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating crop calendar' });
  }
};

const getMyCropCalendars = async (req, res) => {
  try {
    const { farmId } = req.query;
    const calendars = await CropCalendar.find({ user: req.user.id, farm: farmId });
    res.status(200).json({ calendars });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching crop calendars' });
  }
};

module.exports = { createCropCalendar, getMyCropCalendars };