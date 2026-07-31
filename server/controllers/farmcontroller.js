const Farm = require('../models/Farm');

// Create a new farm
const createFarm = async (req, res) => {
  try {
    const { name, location, sizeInAcres } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: 'Farm name and location are required' });
    }

    const farm = new Farm({
      user: req.user.id,
      name,
      location,
      sizeInAcres,
    });

    await farm.save();
    res.status(201).json({ message: 'Farm created', farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating farm' });
  }
};

// Get all farms for logged-in user
const getMyFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ farms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching farms' });
  }
};

// Get a single farm by ID (must belong to the logged-in user)
const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findOne({ _id: req.params.id, user: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }
    res.status(200).json({ farm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching farm' });
  }
};

// Delete a farm
const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }
    res.status(200).json({ message: 'Farm deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting farm' });
  }
};

module.exports = { createFarm, getMyFarms, getFarmById, deleteFarm };