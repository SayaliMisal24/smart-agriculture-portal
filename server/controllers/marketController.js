const axios = require('axios');

// Public endpoint - fetches real, live mandi (market) prices from data.gov.in
const getMarketPrices = async (req, res) => {
  try {
    const { commodity } = req.query;

    if (!commodity) {
      return res.status(400).json({ message: 'Commodity (crop name) is required' });
    }

    const apiKey = process.env.DATA_GOV_API_KEY?.trim();
    const resourceId = '9ef84268-d588-465a-a308-a864a43d0070';

    const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=20&filters[commodity]=${encodeURIComponent(commodity)}&filters[state]=Maharashtra`;

    const response = await axios.get(url);
    const records = response.data.records || [];

    const prices = records.map((r) => ({
      market: r.market,
      state: r.state,
      district: r.district,
      commodity: r.commodity,
      variety: r.variety,
      minPrice: r.min_price,
      maxPrice: r.max_price,
      modalPrice: r.modal_price,
      date: r.arrival_date,
    }));

    res.status(200).json({ prices });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Could not fetch market price data.' });
  }
};

module.exports = { getMarketPrices };