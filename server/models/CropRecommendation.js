const mongoose = require('mongoose');

const cropRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    season: {
      type: String,
      enum: ['kharif', 'rabi', 'zaid'],
      required: true,
    },
    soilType: {
      type: String,
      enum: ['sandy', 'clayey', 'loamy', 'black'],
      required: true,
    },
    waterAvailability: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      required: true,
    },
    recommendedCrops: [
      {
        name: String,
        expectedYield: String,
        duration: String,
        waterNeed: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('CropRecommendation', cropRecommendationSchema);