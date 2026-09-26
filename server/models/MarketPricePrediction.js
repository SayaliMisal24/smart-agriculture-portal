const mongoose = require('mongoose');

const marketPricePredictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    cropName: { type: String, required: true },
    currentPrice: Number,
    trend: { type: String, enum: ['up', 'down', 'stable'] },
    projectedPrices: [{ week: Number, price: Number }],
    adviceKey: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketPricePrediction', marketPricePredictionSchema);