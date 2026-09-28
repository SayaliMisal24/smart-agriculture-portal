const mongoose = require('mongoose');

const priceSnapshotSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true },
    dateKey: { type: String, required: true },
    medianPrice: Number,
    lowestPrice: Number,
    highestPrice: Number,
    marketCount: Number,
  },
  { timestamps: true }
);

priceSnapshotSchema.index({ cropName: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model('PriceSnapshot', priceSnapshotSchema);