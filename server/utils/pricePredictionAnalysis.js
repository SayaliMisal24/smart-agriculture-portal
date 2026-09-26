function predictPriceTrend(currentPrice) {
  if (!currentPrice || currentPrice <= 0) currentPrice = 2000;

  // Simple, clearly-labeled illustrative simulation - not real forecasting
  const trendRoll = Math.random();
  let trend, weeklyChangePercent;
  if (trendRoll < 0.4) {
    trend = 'up'; weeklyChangePercent = 2 + Math.random() * 3;
  } else if (trendRoll < 0.7) {
    trend = 'stable'; weeklyChangePercent = -0.5 + Math.random();
  } else {
    trend = 'down'; weeklyChangePercent = -(2 + Math.random() * 3);
  }

  const projectedPrices = [];
  let price = currentPrice;
  for (let week = 1; week <= 4; week++) {
    price = Math.round(price * (1 + weeklyChangePercent / 100));
    projectedPrices.push({ week, price });
  }

  let adviceKey;
  if (trend === 'up') adviceKey = 'adviceWait';
  else if (trend === 'down') adviceKey = 'adviceSellSoon';
  else adviceKey = 'adviceStable';

  return { trend, projectedPrices, adviceKey };
}

module.exports = { predictPriceTrend };