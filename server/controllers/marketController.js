const axios = require('axios');
const { fetchMarketRecords, groupByMarket } = require('../utils/marketData');

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

// TEMPORARY: shows exactly why the live fetch fails (the API key is never returned)
const debugMarketFetch = async (req, res) => {
  const commodity = req.query.commodity || 'Wheat';
  const hasKey = !!process.env.DATA_GOV_API_KEY;
  try {
    const apiKey = process.env.DATA_GOV_API_KEY?.trim();
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=3&filters[commodity]=${encodeURIComponent(commodity)}&filters[state]=Maharashtra`;
    const r = await axios.get(url, { timeout: 20000 });
    res.json({
      hasKey,
      status: r.status,
      topLevelKeys: Object.keys(r.data),
      total: r.data.total,
      count: r.data.count,
      sampleRecord: (r.data.records || [])[0] || null,
    });
  } catch (err) {
    res.json({
      hasKey,
      failed: true,
      status: err.response?.status || null,
      code: err.code || null,
      message: err.message,
      bodyPreview: typeof err.response?.data === 'string' ? err.response.data.slice(0, 200) : err.response?.data || null,
    });
  }
};

module.exports = { getMarketPrices, debugMarketFetch };