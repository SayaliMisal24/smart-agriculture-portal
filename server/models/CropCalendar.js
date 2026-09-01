const mongoose = require('mongoose');

const cropCalendarSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    selectedCrop: { type: String, required: true },
    sowingDate: { type: Date, required: true },
    activities: [
      {
        monthNumber: Number,
        startDate: Date,
        endDate: Date,
        activityKey: String,
        weatherNoteKey: String,
        irrigationFreqKey: String,
        growthStageNoteKey: String,
        pestWatchKey: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CropCalendar', cropCalendarSchema);