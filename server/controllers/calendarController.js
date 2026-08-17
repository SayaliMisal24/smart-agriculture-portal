const CropCalendar = require('../models/CropCalendar');
const Farm = require('../models/Farm');
const { generateCalendar } = require('../utils/calendarGenerator');
const { canAccessStep, completeStep } = require('../utils/stepProgress');

const CALENDAR_STEP = 5;

const createCropCalendar = async (req, res) => {
  try {
    const { farmId, selectedCrop, sowingMonth } = req.body;

    if (!farmId || !selectedCrop || !sowingMonth) {
      return res.status(400).json({ message: 'farmId, selectedCrop, and sowingMonth are required' });
    }

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    const access = canAccessStep(farm, CALENDAR_STEP);
    if (!access.allowed) {
      return res.status(403).json({ message: 'Please complete the previous steps first.' });
    }
    if (access.locked) {
      return res.status(403).json({ message: 'Crop Calendar has already been completed for this farm.' });
    }

    const activities = generateCalendar(selectedCrop, sowingMonth);

    const calendar = new CropCalendar({
      user: req.user.id,
      farm: farmId,
      selectedCrop,
      sowingMonth,
      activities,
    });

    await calendar.save();

    const updatedFarm = await completeStep(farmId, CALENDAR_STEP);

    res.status(201).json({ message: 'Crop calendar generated', calendar, farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating crop calendar' });
  }
};

const getMyCropCalendar = async (req, res) => {
  try {
    const { farmId } = req.query;
    const calendar = await CropCalendar.findOne({ user: req.user.id, farm: farmId });
    res.status(200).json({ calendar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching crop calendar' });
  }
};

module.exports = { createCropCalendar, getMyCropCalendar };