const mongoose = require('mongoose');

const diseaseDetectionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    cropName: { type: String, default: null },
    photoPath: { type: String, default: null },
    symptoms: [{ type: String }],
    skippedNoIssue: { type: Boolean, default: false },
    diseaseKey: { type: String, default: null },
    confidencePercent: { type: Number, default: null },
    severity: { type: String, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DiseaseDetection', diseaseDetectionSchema);