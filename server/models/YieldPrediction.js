const mongoose = require('mongoose');

const yieldPredictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    cropName: { type: String, required: true },
    areaAcres: Number,
    estimatedYieldLow: Number,
    estimatedYieldHigh: Number,
    yieldUnit: String,
    pricePerQuintal: Number,
    priceSource: String,
    priceMarketCount: Number,
    costPerAcre: Number,
    estimatedIncome: Number,
    estimatedExpense: Number,
    estimatedProfit: Number,
    profitPerAcre: Number,
  },
  { timestamps: true }
);

yieldPredictionSchema.index({ farm: 1 });

module.exports = mongoose.model('YieldPrediction', yieldPredictionSchema);