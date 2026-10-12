const { fetchMarketRecords, groupByMarket, testProviders, coverageReport } = require('../utils/marketData');

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

// TEMPORARY: shows which price provider works for one crop (remove after testing)
const debugMarketFetch = async (req, res) => {
  const commodity = req.query.commodity || 'Onion';
  res.json(await testProviders(commodity));
};

// TEMPORARY: shows which of our crops match the price API's crop names (remove after testing)
const marketCoverage = async (req, res) => {
  try {
    res.json(await coverageReport());
  } catch (err) {
    res.json({ failed: true, message: err.message });
  }
};

module.exports = { getMarketPrices, debugMarketFetch, marketCoverage };