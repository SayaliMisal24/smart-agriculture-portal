const mongoose = require('mongoose');

const yieldPredictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    cropName: { type: String, required: true },
    estimatedYieldLow: Number,
    estimatedYieldHigh: Number,
    yieldUnit: String,
    estimatedIncome: Number,
    estimatedExpense: Number,
    estimatedProfit: Number,
  },
  { timestamps: true }
);
yieldPredictionSchema.index({ farm: 1 });
module.exports = mongoose.model('YieldPrediction', yieldPredictionSchema);