// Maps each crop name to its category, so we can pick realistic,
// commonly-known diseases specific to that category rather than generic ones
const cropCategoryMap = {
  'Rice (Paddy)': 'cereal', 'Wheat': 'cereal', 'Bajra (Pearl Millet)': 'cereal',
  'Jowar (Sorghum)': 'cereal', 'Maize': 'cereal', 'Ragi (Finger Millet)': 'cereal',
  'Tur / Arhar (Pigeon Pea)': 'pulse', 'Gram / Chana (Chickpea)': 'pulse', 'Moong (Green Gram)': 'pulse',
  'Urad (Black Gram)': 'pulse', 'Matki (Moth Bean)': 'pulse', 'Bengal Gram (Kabuli Chana)': 'pulse',
  'Lentil (Masoor)': 'pulse', 'Field Pea (Vatana)': 'pulse',
  'Soybean': 'oilseed', 'Cotton (Kapas)': 'oilseed', 'Sugarcane': 'oilseed', 'Groundnut (Peanut)': 'oilseed',
  'Sesame (Til)': 'oilseed', 'Sunflower': 'oilseed', 'Mustard': 'oilseed', 'Safflower (Kardi)': 'oilseed',
  'Castor': 'oilseed', 'Niger Seed (Ramtil)': 'oilseed', 'Linseed': 'oilseed', 'Guar (Cluster Bean)': 'oilseed',
  'Onion': 'vegetable', 'Tomato': 'vegetable', 'Green Chili': 'vegetable', 'Brinjal (Eggplant)': 'vegetable',
  'Okra (Bhindi)': 'vegetable', 'Potato': 'vegetable', 'Garlic': 'vegetable', 'Ginger': 'vegetable',
  'Turmeric (Halad)': 'vegetable', 'Cabbage': 'vegetable', 'Cauliflower': 'vegetable', 'Cucumber': 'vegetable',
  'Radish': 'vegetable', 'Carrot': 'vegetable', 'Beetroot': 'vegetable', 'Spinach (Palak)': 'vegetable',
  'Fenugreek (Methi)': 'vegetable', 'Coriander (Dhania)': 'vegetable', 'Cumin (Jeera)': 'vegetable', 'Fennel (Sauf)': 'vegetable',
};

// Real, commonly-known diseases grouped by crop category, each with
// distinct symptom patterns for accurate matching
const diseaseDatabase = [
  // CEREAL diseases
  { key: 'riceBlast', category: 'cereal', symptoms: ['spots', 'yellowing'], severity: 'high' },
  { key: 'bacterialLeafBlight', category: 'cereal', symptoms: ['yellowing', 'wilting'], severity: 'high' },
  { key: 'wheatRust', category: 'cereal', symptoms: ['spots', 'holes'], severity: 'medium' },
  { key: 'stemBorer', category: 'cereal', symptoms: ['holes', 'stuntedGrowth'], severity: 'medium' },

  // PULSE diseases
  { key: 'pulseWilt', category: 'pulse', symptoms: ['wilting', 'yellowing', 'stuntedGrowth'], severity: 'high' },
  { key: 'podBorer', category: 'pulse', symptoms: ['holes', 'stuntedGrowth'], severity: 'medium' },
  { key: 'powderyMildewPulse', category: 'pulse', symptoms: ['whiteCoating', 'stuntedGrowth'], severity: 'low' },

  // OILSEED / CASH CROP diseases
  { key: 'cottonBollworm', category: 'oilseed', symptoms: ['holes', 'stuntedGrowth'], severity: 'high' },
  { key: 'leafCurlVirus', category: 'oilseed', symptoms: ['curledLeaves', 'yellowing', 'stuntedGrowth'], severity: 'high' },
  { key: 'rustOilseed', category: 'oilseed', symptoms: ['spots', 'yellowing'], severity: 'medium' },
  { key: 'aphidInfestation', category: 'oilseed', symptoms: ['curledLeaves', 'stickyResidue'], severity: 'medium' },

  // VEGETABLE / SPICE diseases
  { key: 'earlyBlight', category: 'vegetable', symptoms: ['spots', 'yellowing', 'wilting'], severity: 'medium' },
  { key: 'fruitBorer', category: 'vegetable', symptoms: ['holes', 'stuntedGrowth'], severity: 'high' },
  { key: 'powderyMildewVeg', category: 'vegetable', symptoms: ['whiteCoating', 'stuntedGrowth'], severity: 'low' },
  { key: 'bacterialWiltVeg', category: 'vegetable', symptoms: ['wilting', 'yellowing'], severity: 'high' },

  // UNIVERSAL - can appear in any category, so listed separately
  { key: 'rootRot', category: 'universal', symptoms: ['wilting', 'yellowing', 'stuntedGrowth'], severity: 'high', soilRiskFactor: 'waterlogged' },
  { key: 'aphidGeneral', category: 'universal', symptoms: ['curledLeaves', 'stickyResidue', 'holes'], severity: 'low' },
];

function getCropCategory(cropName) {
  return cropCategoryMap[cropName] || 'universal';
}

function analyzeDisease({ symptoms, soilMoisture, soilDrainage, cropName }) {
  const category = getCropCategory(cropName);

  // Only consider diseases relevant to this crop's category, plus universal ones
  const relevantDiseases = diseaseDatabase.filter(
    (d) => d.category === category || d.category === 'universal'
  );

  const scored = relevantDiseases.map((d) => {
    let matchCount = d.symptoms.filter((s) => symptoms.includes(s)).length;

    if (d.soilRiskFactor === 'waterlogged' && (soilMoisture === 'waterlogged' || soilDrainage === 'slow')) {
      matchCount += 1.5;
    }

    return { ...d, matchCount };
  });

  scored.sort((a, b) => b.matchCount - a.matchCount);

  const topMatch = scored[0];

  if (!topMatch || topMatch.matchCount === 0) {
    return { diseaseKey: null, confidencePercent: null, severity: null };
  }

  const maxPossible = topMatch.symptoms.length + (topMatch.soilRiskFactor ? 1.5 : 0);
  const confidencePercent = Math.min(92, Math.round((topMatch.matchCount / maxPossible) * 100));

  return { diseaseKey: topMatch.key, confidencePercent, severity: topMatch.severity };
}

module.exports = { analyzeDisease, getCropCategory };