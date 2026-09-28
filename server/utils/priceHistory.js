const PriceSnapshot = require('../models/PriceSnapshot');
const Farm = require('../models/Farm');
const { fetchMarketRecords, groupByMarket, summarize } = require('./marketData');

const MIN_DAYS = 5;
const todayKey = () => new Date().toISOString().slice(0, 10);

// Saves today's real median price for a crop (one snapshot per crop per day)
async function recordSnapshot(cropName, summary) {
  if (!summary) return;
  try {
    await PriceSnapshot.findOneAndUpdate(
      { cropName, dateKey: todayKey() },
      {
        cropName,
        dateKey: todayKey(),
        medianPrice: summary.median,
        lowestPrice: summary.lowest.price,
        highestPrice: summary.highest.price,
        marketCount: summary.count,
      },
      { upsert: true }
    );
  } catch (err) {
    console.error('Snapshot save failed', err.message);
  }
}

// Linear trend over the stored real snapshots - returns no trend until enough days exist
async function buildForecast(cropName, currentPrice) {
  const snaps = await PriceSnapshot.find({ cropName }).sort({ dateKey: 1 }).limit(60).lean();
  const historyDays = snaps.length;

  if (historyDays < MIN_DAYS) {
    return { historyDays, trend: null, weeklyChangePercent: null, projectedPrices: [] };
  }

  const day0 = new Date(snaps[0].dateKey).getTime();
  const pts = snaps.map((s) => ({ x: (new Date(s.dateKey).getTime() - day0) / 86400000, y: s.medianPrice }));
  const n = pts.length;
  const sumX = pts.reduce((s, p) => s + p.x, 0);
  const sumY = pts.reduce((s, p) => s + p.y, 0);
  const sumXY = pts.reduce((s, p) => s + p.x * p.y, 0);
  const sumXX = pts.reduce((s, p) => s + p.x * p.x, 0);
  const denom = n * sumXX - sumX * sumX;
  const slope = denom === 0 ? 0 : (n * sumXY - sumX * sumY) / denom;

  const weeklyChangePercent = Math.round(((slope * 7) / currentPrice) * 1000) / 10;
  const clamp = (v) => Math.round(Math.min(currentPrice * 1.3, Math.max(currentPrice * 0.7, v)));
  const projectedPrices = [1, 2, 3, 4].map((week) => ({ week, price: clamp(currentPrice + slope * 7 * week) }));

  let trend = 'stable';
  if (weeklyChangePercent > 1.5) trend = 'up';
  else if (weeklyChangePercent < -1.5) trend = 'down';

  return { historyDays, trend, weeklyChangePercent, projectedPrices };
}

// Once a day, record real prices for every crop farmers have confirmed
async function snapshotAllConfirmedCrops() {
  try {
    const farms = await Farm.find({ selectedCrops: { $exists: true, $ne: [] } }).select('selectedCrops').lean();
    const crops = [...new Set(farms.flatMap((f) => f.selectedCrops))];
    for (const crop of crops) {
      const summary = summarize(groupByMarket(await fetchMarketRecords(crop)));
      await recordSnapshot(crop, summary);
    }
    console.log(`Price snapshots recorded for ${crops.length} crops`);
  } catch (err) {
    console.error('Daily snapshot job failed', err.message);
  }
}

function startDailySnapshots() {
  setTimeout(snapshotAllConfirmedCrops, 20000);
  setInterval(snapshotAllConfirmedCrops, 24 * 60 * 60 * 1000);
}

module.exports = { recordSnapshot, buildForecast, startDailySnapshots };