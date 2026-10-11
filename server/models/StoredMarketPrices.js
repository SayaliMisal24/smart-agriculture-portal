const mongoose = require('mongoose');

const storedMarketPricesSchema = new mongoose.Schema(
  {
    cropName: { type: String, required: true, unique: true },
    records: [
      {
        market: String,
        district: String,
        variety: String,
        min: Number,
        max: Number,
        modal: Number,
        date: String,
      },
    ],
    fetchedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StoredMarketPrices', storedMarketPricesSchema);