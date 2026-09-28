const { cropDatabase, getCropCategory } = require('./cropAnalysis');

const illustrativePricePerQuintal = {
  cereal: 2200, pulse: 6500, oilseed: 4800, vegetable: 1800, spice: 9000, fruit: 3500,
};

const expensePercentByCategory = {
  cereal: 0.35, pulse: 0.3, oilseed: 0.32, vegetable: 0.4, spice: 0.38, fruit: 0.42,
};

function analyzeYield({ cropName, farmSizeAcres, soilHealthScore }) {
  const cropInfo = cropDatabase.find((c) => c.name === cropName);
  const size = farmSizeAcres && farmSizeAcres > 0 ? farmSizeAcres : 1;

  let low = 10, high = 15, unit = 'quintal/acre';
  if (cropInfo && cropInfo.yield) {
    const match = cropInfo.yield.match(/(\d+)-(\d+)\s*(.+)/);
    if (match) {
      low = parseInt(match[1], 10);
      high = parseInt(match[2], 10);
      unit = match[3];
    }
  }

  const healthMultiplier = soilHealthScore ? 0.7 + (soilHealthScore / 100) * 0.5 : 1;

  const totalLow = Math.round(low * size * healthMultiplier);
  const totalHigh = Math.round(high * size * healthMultiplier);

  const category = getCropCategory(cropName);
  const pricePerUnit = illustrativePricePerQuintal[category] || 3000;
  const expensePercent = expensePercentByCategory[category] || 0.35;

  const avgYield = (totalLow + totalHigh) / 2;
  const estimatedIncome = Math.round(avgYield * pricePerUnit);
  const estimatedExpense = Math.round(estimatedIncome * expensePercent);
  const estimatedProfit = estimatedIncome - estimatedExpense;

  return {
    estimatedYieldLow: totalLow,
    estimatedYieldHigh: totalHigh,
    yieldUnit: unit,
    estimatedIncome,
    estimatedExpense,
    estimatedProfit,
  };
}

module.exports = { analyzeYield };