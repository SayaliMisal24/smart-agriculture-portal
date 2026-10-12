const axios = require('axios');
const { geocode, haversineKm } = require('./geo');
const { getFallbackMarkets } = require('./fallbackPrices');
const StoredMarketPrices = require('../models/StoredMarketPrices');

const cache = new Map();
const CACHE_MS = 6 * 60 * 60 * 1000;

const MANDI_API_URL = (process.env.MANDI_API_URL || 'https://mandi-api.onrender.com/v1').replace(/\/$/, '');
const DATA_GOV_RESOURCE = '9ef84268-d588-465a-a308-a864a43d0070';

let dataGovBlockedUntil = 0;
let mandiCommodities = null;
let mandiCommoditiesAt = 0;

const commodityNames = {
  'Rice (Paddy)': ['Paddy(Dhan)(Common)', 'Rice'],
  'Wheat': ['Wheat'],
  'Bajra (Pearl Millet)': ['Bajra(Pearl Millet/Cumbu)'],
  'Jowar (Sorghum)': ['Jowar(Sorghum)'],
  'Maize': ['Maize'],
  'Ragi (Finger Millet)': ['Ragi (Finger Millet)'],
  'Tur / Arhar (Pigeon Pea)': ['Red gram/Arhar/Tur(whole)', 'Arhar (Tur/Red Gram)(Whole)', 'Arhar Dal(Tur Dal)'],
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
  'Sugarcane': ['Sugarcane'],
};

const allCropNames = () => Object.keys(commodityNames);

const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ===== Name handling: lets "ginger", "GINGER", "rice" or "tur" find the right crop =====
const GENERIC_WORDS = ['seed', 'green', 'black', 'field', 'pearl', 'finger', 'bean', 'common'];

const aliasIndex = (() => {
  const owners = new Map();
  const add = (alias, crop) => {
    const n = norm(alias);
    if (n.length < 3 || GENERIC_WORDS.includes(n)) return;
    if (!owners.has(n)) owners.set(n, new Set());
    owners.get(n).add(crop);
  };
  for (const crop of Object.keys(commodityNames)) {
    add(crop, crop);
    add(crop.split('(')[0], crop);
    (crop.match(/[A-Za-z]+/g) || []).forEach((word) => add(word, crop));
  }
  const index = new Map();
  for (const [alias, crops] of owners) {
    if (crops.size === 1) index.set(alias, [...crops][0]); // skip names shared by several crops
  }
  return index;
})();

function canonicalCrop(input) {
  if (commodityNames[input]) return input;
  return aliasIndex.get(norm(input)) || String(input).trim();
}

function candidatesFor(input) {
  const crop = canonicalCrop(input);
  if (commodityNames[crop]) return commodityNames[crop];
  const clean = String(input).split('(')[0].trim();
  const title = clean.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase());
  return [...new Set([clean, title])];
}

// ===== Provider 1: Mandi Price API (keyless, synced daily from data.gov.in) =====
async function mandiGet(path, params, attempt = 1) {
  try {
    const res = await axios.get(`${MANDI_API_URL}${path}`, {
      params,
      timeout: 45000,
      headers: { Accept: 'application/json' },
    });
    return res.data;
  } catch (err) {
    const status = err.response?.status;
    const retryable = status === 502 || status === 503 || status === 504 || err.code === 'ECONNABORTED';
    if (retryable && attempt < 2) {
      await sleep(3000);
      return mandiGet(path, params, attempt + 1);
    }
    throw err;
  }
}

async function getMandiCommodities() {
  if (mandiCommodities && Date.now() - mandiCommoditiesAt < 24 * 60 * 60 * 1000) return mandiCommodities;
  const body = await mandiGet('/commodities', { state: 'Maharashtra' });
  const list = (body.data || [])
    .map((c) => (typeof c === 'string' ? c : c.commodity || c.name))
    .filter(Boolean);
  if (list.length > 0) {
    mandiCommodities = list;
    mandiCommoditiesAt = Date.now();
  }
  return list;
}

// Returns every API crop name that matches, best matches first
function matchMandiNames(wantedNames, available) {
  const wanted = wantedNames.map(norm);
  const found = [];
  for (const w of wanted) {
    available.forEach((a) => {
      if (norm(a) === w && !found.includes(a)) found.push(a);
    });
  }
  for (const w of wanted) {
    if (w.length < 5) continue;
    available.forEach((a) => {
      const n = norm(a);
      if ((n.includes(w) || (w.includes(n) && n.length >= 5)) && !found.includes(a)) found.push(a);
    });
  }
  return found;
}

async function fetchFromMandiApi(cropName) {
  const wantedNames = candidatesFor(cropName);
  let names = [];
  try {
    const available = await getMandiCommodities();
    names = matchMandiNames(wantedNames, available);
  } catch (err) {
    console.error('Mandi API commodity list failed, trying direct names:', err.message);
  }
  if (names.length === 0) names = wantedNames;
  names = [...new Set(names)].slice(0, 3);

  for (const name of names) {
    const body = await mandiGet('/prices', { state: 'Maharashtra', commodity: name });
    const records = (body.data || [])
      .map((r) => ({
        market: r.market,
        district: r.district,
        variety: r.variety,
        min: Number(r.min_price) || 0,
        max: Number(r.max_price) || 0,
        modal: Number(r.modal_price) || 0,
        date: r.arrival_date,
      }))
      .filter((r) => r.modal > 0);
    if (records.length > 0) return records;
  }
  return [];
}

// ===== Provider 2: data.gov.in directly =====
async function fetchFromDataGov(commodityName) {
  const apiKey = process.env.DATA_GOV_API_KEY?.trim();
  const url = `https://api.data.gov.in/resource/${DATA_GOV_RESOURCE}?api-key=${apiKey}&format=json&limit=100&filters[commodity]=${encodeURIComponent(commodityName)}&filters[state]=Maharashtra`;
  const res = await axios.get(url, { timeout: 15000 });
  return (res.data.records || []).map((r) => ({
    market: r.market,
    district: r.district,
    variety: r.variety,
    min: Number(r.min_price) || 0,
    max: Number(r.max_price) || 0,
    modal: Number(r.modal_price) || 0,
    date: r.arrival_date,
  }));
}

async function fetchFromDataGovForCrop(cropName) {
  if (Date.now() < dataGovBlockedUntil) return [];
  for (const name of candidatesFor(cropName)) {
    try {
      const records = (await fetchFromDataGov(name)).filter((r) => r.modal > 0);
      if (records.length > 0) return records;
    } catch (err) {
      console.error('data.gov.in fetch failed for', name, err.message);
      if (err.code === 'ECONNREFUSED') {
        dataGovBlockedUntil = Date.now() + 10 * 60 * 1000;
        return [];
      }
    }
  }
  return [];
}

// Live data only, no fallback. Also used by scripts/syncPrices.js
async function fetchLiveRecords(cropName) {
  try {
    const records = await fetchFromMandiApi(cropName);
    if (records.length > 0) return records;
  } catch (err) {
    console.error('Mandi API failed for', cropName, err.message);
  }
  return fetchFromDataGovForCrop(cropName);
}

// Order: live data -> real prices stored in MongoDB -> estimated dummy prices
async function fetchMarketRecords(input) {
  const crop = canonicalCrop(input);

  const cached = cache.get(crop);
  if (cached && Date.now() - cached.time < CACHE_MS) return { records: cached.records, isFallback: false };

  const live = await fetchLiveRecords(crop);
  if (live.length > 0) {
    cache.set(crop, { time: Date.now(), records: live });
    return { records: live, isFallback: false };
  }

  try {
    const stored = await StoredMarketPrices.findOne({ cropName: crop }).lean();
    if (stored && stored.records && stored.records.length > 0) {
      return { records: stored.records, isFallback: false };
    }
  } catch (err) {
    console.error('Stored price lookup failed', err.message);
  }

  if (cached) return { records: cached.records, isFallback: false };

  const fallback = getFallbackMarkets(crop);
  return {
    records: fallback.map((m) => ({ market: m.name, district: m.district, min: m.minPrice, max: m.maxPrice, modal: m.price, date: m.date })),
    isFallback: fallback.length > 0,
  };
}

// ===== Diagnostics (used by the temporary debug routes) =====
async function testProviders(cropName) {
  const out = { resolvedCrop: canonicalCrop(cropName), triedNames: candidatesFor(cropName) };
  try {
    const records = await fetchFromMandiApi(cropName);
    out.mandiApi = { ok: records.length > 0, count: records.length, sample: records[0] || null };
  } catch (err) {
    out.mandiApi = { ok: false, status: err.response?.status || null, code: err.code || null, message: err.message };
  }
  try {
    const records = (await fetchFromDataGov(candidatesFor(cropName)[0])).filter((r) => r.modal > 0);
    out.dataGov = { ok: records.length > 0, count: records.length };
  } catch (err) {
    out.dataGov = { ok: false, code: err.code || null, message: err.message };
  }
  return out;
}

// Shows which of our crops match a crop name the price API knows (one API call)
async function coverageReport() {
  const available = await getMandiCommodities();
  const rows = Object.keys(commodityNames).map((crop) => ({
    crop,
    matchedNames: matchMandiNames(commodityNames[crop], available),
  }));
  return {
    apiCropCount: available.length,
    unmatchedCrops: rows.filter((r) => r.matchedNames.length === 0).map((r) => r.crop),
    matchedCrops: rows.filter((r) => r.matchedNames.length > 0),
    apiCropNames: available,
  };
}

const avg = (list) => list.reduce((s, v) => s + v, 0) / list.length;

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
  return { median, lowest: sorted[0], highest: sorted[sorted.length - 1], count: sorted.length, latestDate: markets[0].date };
}

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

module.exports = {
  fetchMarketRecords,
  fetchLiveRecords,
  testProviders,
  coverageReport,
  allCropNames,
  groupByMarket,
  summarize,
  attachDistances,
  sortNearestFirst,
};