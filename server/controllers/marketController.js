const axios = require('axios');

// Crops that are typically sold via mill/factory contracts rather than daily mandis,
// so they won't appear in the live mandi dataset — handled with an explanatory note instead
const contractCrops = {
  Sugarcane: {
    reason: 'contract',
    note: 'Sugarcane is usually sold directly to sugar mills under contract at a government-announced Fair and Remunerative Price (FRP), rather than through daily mandi auctions.',
  },
};

const getMarketPrices = async (req, res) => {
  try {
    const { commodity } = req.query;

    if (!commodity) {
      return res.status(400).json({ message: 'Commodity (crop name) is required' });
    }

    // Check if this is a known contract-sold crop before hitting the mandi API at all
    const contractInfo = contractCrops[commodity];
    if (contractInfo) {
      return res.status(200).json({ prices: [], usedFallback: false, contractNote: contractInfo.note });
    }

    const apiKey = process.env.DATA_GOV_API_KEY?.trim();
    const resourceId = '9ef84268-d588-465a-a308-a864a43d0070';

    const maharashtraUrl = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=20&filters[commodity]=${encodeURIComponent(commodity)}&filters[state]=Maharashtra`;

    const maharashtraRes = await axios.get(maharashtraUrl);
    let records = maharashtraRes.data.records || [];
    let usedFallback = false;

    if (records.length === 0) {
      const allIndiaUrl = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=20&filters[commodity]=${encodeURIComponent(commodity)}`;
      const allIndiaRes = await axios.get(allIndiaUrl);
      records = allIndiaRes.data.records || [];
      usedFallback = true;
    }

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

    res.status(200).json({ prices, usedFallback, contractNote: null });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ message: 'Could not fetch market price data.' });
  }
};

module.exports = { getMarketPrices };