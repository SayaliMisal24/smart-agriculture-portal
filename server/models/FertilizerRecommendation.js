const mongoose = require('mongoose');

const fertilizerRecommendationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    cropName: { type: String, required: true },
    ureaKg: Number,
    dapKg: Number,
    mopKg: Number,
    compostKg: Number,
    estimatedCost: Number,
    leansOrganic: Boolean,
    organicKey: String,
    chemicalKey: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('FertilizerRecommendation', fertilizerRecommendationSchema);