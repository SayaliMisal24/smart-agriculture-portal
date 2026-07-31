const mongoose = require('mongoose');

const soilReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    soilColor: {
      type: String,
      enum: ['dark_black', 'brown', 'reddish', 'grayish_white'],
      required: true,
    },
    soilTexture: {
      type: String,
      enum: ['sandy', 'clayey', 'loamy'],
      required: true,
    },
    moisture: {
      type: String,
      enum: ['dry_cracked', 'slightly_moist', 'waterlogged'],
      required: true,
    },
    drainage: {
      type: String,
      enum: ['fast', 'moderate', 'slow'],
      required: true,
    },
    pastCropGrowth: {
      type: String,
      enum: ['good', 'average', 'poor'],
      required: true,
    },
    organicMatter: {
      type: String,
      enum: ['lots', 'some', 'very_little'],
      required: true,
    },
    healthScore: { type: Number, required: true },
    healthStatus: { type: String, required: true },
    suggestions: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('SoilReport', soilReportSchema);