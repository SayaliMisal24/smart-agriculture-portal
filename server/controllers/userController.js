const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Update profile info (name)
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select('-password');
    res.status(200).json({ message: 'Profile updated', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Upload/update profile photo
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const photoPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: photoPath },
      { new: true }
    ).select('-password');
    res.status(200).json({ message: 'Photo updated', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error uploading photo' });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error changing password' });
  }
};

module.exports = { updateProfile, uploadProfilePhoto, changePassword };