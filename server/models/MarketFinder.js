const mongoose = require('mongoose');

const marketFinderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    cropName: { type: String, required: true },
    markets: [{ name: String, distance: String, price: Number }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketFinder', marketFinderSchema);