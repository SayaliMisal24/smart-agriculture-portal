const axios = require('axios');
const { geocode, haversineKm } = require('./geo');

const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';
const cache = new Map();
const CACHE_MS = 30 * 60 * 1000;

// Agmarknet commodity spellings, written from memory - adjust any that return no data
const commodityNames = {
  'Rice (Paddy)': ['Paddy(Dhan)(Common)', 'Rice'],
  'Wheat': ['Wheat'],
  'Bajra (Pearl Millet)': ['Bajra(Pearl Millet/Cumbu)'],
  'Jowar (Sorghum)': ['Jowar(Sorghum)'],
  'Maize': ['Maize'],
  'Ragi (Finger Millet)': ['Ragi (Finger Millet)'],
  'Tur / Arhar (Pigeon Pea)': ['Arhar (Tur/Red Gram)(Whole)', 'Arhar Dal(Tur Dal)'],
  'Gram / Chana (Chickpea)': ['Bengal Gram(Gram)(Whole)', 'Gram Raw(Chholia)'],
  'Bengal Gram (Kabuli Chana)': ['Kabuli Chana(Chickpeas-White)', 'Bengal Gram(Gram)(Whole)'],
  'Moong (Green Gram)': ['Green Gram (Moong)(Whole)'],
  'Urad (Black Gram)': ['Black Gram (Urd Beans)(Whole)'],
  'Matki (Moth Bean)': ['Moath Dal', 'Moth'],
  'Lentil (Masoor)': ['Lentil (Masur)(Whole)'],
  'Field Pea (Vatana)': ['Peas(Dry)', 'Peas Wet'],
  'Soybean': ['Soyabean'],
  'Cotton (Kapas)': ['Cotton'],
  'Groundnut (Peanut)': ['Groundnut'],
  'Sesame (Til)': ['Sesamum(Sesame,Gingelly,Til)'],
  'Sunflower': ['Sunflower'],
  'Mustard': ['Mustard'],
  'Safflower (Kardi)': ['Safflower'],
  'Castor': ['Castor Seed'],
  'Niger Seed (Ramtil)': ['Niger Seed (Ramtil)'],
  'Linseed': ['Linseed'],
  'Guar (Cluster Bean)': ['Guar', 'Cluster beans'],
  'Onion': ['Onion'],
  'Tomato': ['Tomato'],
  'Green Chili': ['Green Chilli'],
  'Brinjal (Eggplant)': ['Brinjal'],
  'Okra (Bhindi)': ['Bhindi(Ladies Finger)'],
  'Potato': ['Potato'],
  'Garlic': ['Garlic'],
  'Ginger': ['Ginger(Green)', 'Ginger(Dry)'],
  'Turmeric (Halad)': ['Turmeric', 'Turmeric (raw)'],
  'Cabbage': ['Cabbage'],
  'Cauliflower': ['Cauliflower'],
  'Cucumber': ['Cucumbar(Kheera)'],
  'Radish': ['Raddish'],
  'Carrot': ['Carrot'],
  'Beetroot': ['Beetroot'],
  'Spinach (Palak)': ['Spinach'],
  'Fenugreek (Methi)': ['Methi(Leaves)'],
  'Coriander (Dhania)': ['Coriander(Leaves)'],
  'Cumin (Jeera)': ['Cummin Seed(Jeera)'],
  'Fennel (Sauf)': ['Fennel', 'Saunf'],
  'Watermelon': ['Water Melon'],
  'Muskmelon': ['Musk Melon'],
  'Banana': ['Banana'],
  'Grapes': ['Grapes'],
  'Pomegranate': ['Pomegranate'],
  'Chikoo (Sapota)': ['Chikoos(Sapota)'],
};

function candidatesFor(cropName) {
  return commodityNames[cropName] || [cropName.split('(')[0].trim()];
}

async function fetchOne(commodity) {
  const apiKey = process.env.DATA_GOV_API_KEY?.trim();
  const url = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${apiKey}&format=json&limit=100&filters[commodity]=${encodeURIComponent(commodity)}&filters[state]=Maharashtra`;
  const res = await axios.get(url, { timeout: 10000 });
  return res.data.records || [];
}

const normalize = (r) => ({
  market: r.market,
  district: r.district,
  variety: r.variety,
  min: Number(r.min_price) || 0,
  max: Number(r.max_price) || 0,
  modal: Number(r.modal_price) || 0,
  date: r.arrival_date,
});

// Real, live Maharashtra mandi records for a crop (prices are Rs per quintal)
async function fetchMarketRecords(cropName) {
  const cached = cache.get(cropName);
  if (cached && Date.now() - cached.time < CACHE_MS) return cached.records;

  for (const name of candidatesFor(cropName)) {
    try {
      const records = (await fetchOne(name)).map(normalize).filter((r) => r.modal > 0);
      if (records.length > 0) {
        cache.set(cropName, { time: Date.now(), records });
        return records;
      }
    } catch (err) {
      console.error('Market data fetch failed for', name, err.message);
    }
  }
  return [];
}

const avg = (list) => list.reduce((s, v) => s + v, 0) / list.length;

// One entry per market (a market may report several varieties)
function groupByMarket(records) {
  const groups = new Map();
  for (const r of records) {
    const key = `${r.market}|${r.district}`;
    if (!groups.has(key)) groups.set(key, { name: r.market, district: r.district, date: r.date, list: [] });
    groups.get(key).list.push(r);
  }
  return [...groups.values()].map((g) => ({
    name: g.name,
    district: g.district,
    date: g.date,
    price: Math.round(avg(g.list.map((x) => x.modal))),
    minPrice: Math.min(...g.list.map((x) => x.min || x.modal)),
    maxPrice: Math.max(...g.list.map((x) => x.max || x.modal)),
  }));
}

function summarize(markets) {
  if (!markets || markets.length === 0) return null;
  const sorted = [...markets].sort((a, b) => a.price - b.price);
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 ? sorted[mid].price : Math.round((sorted[mid - 1].price + sorted[mid].price) / 2);
  return {
    median,
    lowest: sorted[0],
    highest: sorted[sorted.length - 1],
    count: sorted.length,
    latestDate: markets[0].date,
  };
}

// Adds an approximate straight-line distance (km) from origin to each market's district
async function attachDistances(markets, origin) {
  if (!origin) return markets.map((m) => ({ ...m, distanceKm: null }));

  const districts = [...new Set(markets.map((m) => m.district).filter(Boolean))];
  const coords = {};
  for (let i = 0; i < districts.length; i += 8) {
    const chunk = districts.slice(i, i + 8);
    const found = await Promise.all(chunk.map((d) => geocode(d)));
    chunk.forEach((d, idx) => { coords[d] = found[idx]; });
  }

  return markets.map((m) => {
    const c = coords[m.district];
    return { ...m, distanceKm: c ? Math.round(haversineKm(origin, c)) : null };
  });
}

const sortNearestFirst = (markets) =>
  [...markets].sort((a, b) => {
    if (a.distanceKm == null && b.distanceKm == null) return b.price - a.price;
    if (a.distanceKm == null) return 1;
    if (b.distanceKm == null) return -1;
    return a.distanceKm - b.distanceKm;
  });

module.exports = { fetchMarketRecords, groupByMarket, summarize, attachDistances, sortNearestFirst };