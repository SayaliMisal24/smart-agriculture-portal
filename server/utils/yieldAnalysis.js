const { cropDatabase, getCropCategory } = require('./cropAnalysis');

// Only used when no live mandi price exists for a crop
const fallbackPriceByCategory = { cereal: 2200, pulse: 6500, oilseed: 5200, vegetable: 1800, spice: 9000, fruit: 3500 };
const fallbackPriceByCrop = { Sugarcane: 340 };

// Typical cultivation cost in Rs per acre
const costByCategory = { cereal: 20000, pulse: 15000, oilseed: 22000, vegetable: 50000, spice: 90000, fruit: 70000 };
const costByCrop = {
  Sugarcane: 65000, 'Cotton (Kapas)': 32000, Banana: 120000, Grapes: 200000, Pomegranate: 100000,
  Onion: 55000, Potato: 60000, Tomato: 70000, Ginger: 150000, 'Turmeric (Halad)': 110000,
};

const round1 = (n) => Math.round(n * 10) / 10;

function analyzeYield({ cropName, areaAcres, soilHealthScore, livePrice, liveMarketCount }) {
  const cropInfo = cropDatabase.find((c) => c.name === cropName);
  const category = getCropCategory(cropName);

  let low = 10, high = 15;
  if (cropInfo && cropInfo.yield) {
    const match = cropInfo.yield.match(/(\d+)-(\d+)/);
    if (match) {
      low = parseInt(match[1], 10);
      high = parseInt(match[2], 10);
    }
  }

  // Healthier soil gets closer to the typical range; farm-level yields also run
  // below best-case figures, so a realization factor is applied
  const healthFactor = soilHealthScore ? 0.75 + 0.25 * (soilHealthScore / 100) : 0.85;
  const realization = 0.85;

  const yieldLow = round1(low * areaAcres * healthFactor * realization);
  const yieldHigh = round1(high * areaAcres * healthFactor * realization);

  let pricePerQuintal, priceSource, priceMarketCount = 0;
  if (livePrice) {
    pricePerQuintal = livePrice;
    priceSource = 'live';
    priceMarketCount = liveMarketCount || 0;
  } else {
    pricePerQuintal = fallbackPriceByCrop[cropName] || fallbackPriceByCategory[category] || 3000;
    priceSource = 'estimate';
  }

  const costPerAcre = costByCrop[cropName] || costByCategory[category] || 30000;
  const avgYield = (yieldLow + yieldHigh) / 2;
  const estimatedIncome = Math.round(avgYield * pricePerQuintal);
  const estimatedExpense = Math.round(costPerAcre * areaAcres);
  const estimatedProfit = estimatedIncome - estimatedExpense;

  return {
    areaAcres,
    estimatedYieldLow: yieldLow,
    estimatedYieldHigh: yieldHigh,
    yieldUnit: 'quintal',
    pricePerQuintal,
    priceSource,
    priceMarketCount,
    costPerAcre,
    estimatedIncome,
    estimatedExpense,
    estimatedProfit,
    profitPerAcre: Math.round(estimatedProfit / areaAcres),
  };
}

module.exports = { analyzeYield };