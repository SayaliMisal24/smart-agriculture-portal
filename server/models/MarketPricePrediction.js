const mongoose = require('mongoose');

const placeSchema = { name: String, district: String, price: Number, distanceKm: Number };

const marketPricePredictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    cropName: { type: String, required: true },
    noLiveData: { type: Boolean, default: false },
    isFallback: { type: Boolean, default: false },
    priceDate: String,
    statePrice: Number,
    marketCount: Number,
    highest: placeSchema,
    lowest: placeSchema,
    nearest: placeSchema,
    pricePercentile: Number,
    marketPrices: [placeSchema],
    historyDays: Number,
    trend: { type: String, default: null },
    weeklyChangePercent: Number,
    projectedPrices: [{ week: Number, price: Number }],
    adviceKey: String,
  },
  { timestamps: true }
);

marketPricePredictionSchema.index({ farm: 1 });

module.exports = mongoose.model('MarketPricePrediction', marketPricePredictionSchema);