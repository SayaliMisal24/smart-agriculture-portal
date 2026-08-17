const mongoose = require('mongoose');

const cropCalendarSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    selectedCrop: { type: String, required: true },
    sowingMonth: { type: String, required: true },
    activities: [
      {
        month: String,
        activityKey: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CropCalendar', cropCalendarSchema);