require('dotenv').config();
const mongoose = require('mongoose');
const StoredMarketPrices = require('../models/StoredMarketPrices');
const { fetchLiveRecords, allCropNames } = require('../utils/marketData');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  const crops = allCropNames();
  let saved = 0;

  for (const crop of crops) {
    const records = await fetchLiveRecords(crop);
    if (records.length > 0) {
      await StoredMarketPrices.findOneAndUpdate(
        { cropName: crop },
        { cropName: crop, records, fetchedAt: new Date() },
        { upsert: true }
      );
      saved++;
      console.log(`Saved ${records.length} real records for ${crop}`);
    } else {
      console.log(`No live data returned for ${crop}`);
    }
    await new Promise((r) => setTimeout(r, 1500));
  }

  console.log(`Done. Saved real prices for ${saved} of ${crops.length} crops.`);
  await mongoose.disconnect();
})();