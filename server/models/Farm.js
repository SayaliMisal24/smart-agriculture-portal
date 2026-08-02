const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    sizeInAcres: { type: Number },
    currentStep: { type: Number, default: 1 }, // which step is next to fill (1-11)
    completedSteps: [{ type: Number }], // list of step numbers already completed/locked
  },
  { timestamps: true }
);

module.exports = mongoose.model('Farm', farmSchema);