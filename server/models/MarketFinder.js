const mongoose = require('mongoose');

const marketFinderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
    cropName: { type: String, required: true },
    noLiveData: { type: Boolean, default: false },
    originSource: String,
    farmLocation: String,
    priceDate: String,
    statePrice: Number,
    marketCount: Number,
    highest: { name: String, district: String, price: Number, distanceKm: Number },
    markets: [
      {
        name: String,
        district: String,
        distanceKm: Number,
        price: Number,
        minPrice: Number,
        maxPrice: Number,
        date: String,
        mapsUrl: String,
      },
    ],
  },
  { timestamps: true }
);

marketFinderSchema.index({ farm: 1 });

module.exports = mongoose.model('MarketFinder', marketFinderSchema);