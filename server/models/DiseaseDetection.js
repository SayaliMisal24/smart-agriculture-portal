const mongoose = require('mongoose');

const diseaseDetectionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    photoPath: { type: String, default: null }, // null if farmer chose "no visible issue"
    symptoms: [{ type: String }], // symptom keys the farmer checked
    skippedNoIssue: { type: Boolean, default: false },
    diseaseKey: { type: String, default: null }, // null if no issue / healthy
    confidencePercent: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DiseaseDetection', diseaseDetectionSchema);