const { fetchMarketRecords, groupByMarket, testProviders } = require('../utils/marketData');

const getMarketPrices = async (req, res) => {
  try {
    const { commodity } = req.query;
    if (!commodity) return res.status(400).json({ message: 'Commodity is required' });

    const { records, isFallback } = await fetchMarketRecords(commodity);
    const markets = groupByMarket(records).map((m) => ({
      market: m.name,
      district: m.district,
      commodity,
      variety: '-',
      minPrice: m.minPrice,
      maxPrice: m.maxPrice,
      modalPrice: m.price,
      date: m.date,
    }));

    res.status(200).json({ prices: markets, isFallback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not fetch market price data.' });
  }
};

// TEMPORARY: shows which price provider works (remove after testing)
const debugMarketFetch = async (req, res) => {
  const commodity = req.query.commodity || 'Onion';
  res.json(await testProviders(commodity));
};

module.exports = { getMarketPrices, debugMarketFetch };