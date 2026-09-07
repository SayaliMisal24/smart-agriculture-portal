// Each disease lists the SPECIFIC crops it applies to, so a millet
// like Bajra never gets a rice-specific or wheat-specific disease suggested
const diseaseDatabase = [
  // RICE-specific
  { key: 'riceBlast', crops: ['Rice (Paddy)'], symptoms: ['spots', 'yellowing'], severity: 'high' },
  { key: 'bacterialLeafBlight', crops: ['Rice (Paddy)'], symptoms: ['yellowing', 'wilting'], severity: 'high' },

  // WHEAT-specific
  { key: 'wheatRust', crops: ['Wheat'], symptoms: ['spots', 'holes'], severity: 'medium' },

  // MILLETS (Bajra, Jowar, Ragi) + Maize
  { key: 'stemBorer', crops: ['Bajra (Pearl Millet)', 'Jowar (Sorghum)', 'Maize', 'Sugarcane', 'Rice (Paddy)'], symptoms: ['holes', 'stuntedGrowth'], severity: 'medium' },
  { key: 'downyMildewMillet', crops: ['Bajra (Pearl Millet)', 'Jowar (Sorghum)', 'Maize'], symptoms: ['yellowing', 'stuntedGrowth'], severity: 'high' },
  { key: 'ergotDisease', crops: ['Bajra (Pearl Millet)', 'Jowar (Sorghum)'], symptoms: ['spots', 'stuntedGrowth'], severity: 'medium' },

  // PULSES
  { key: 'pulseWilt', crops: ['Tur / Arhar (Pigeon Pea)', 'Gram / Chana (Chickpea)', 'Moong (Green Gram)', 'Urad (Black Gram)', 'Lentil (Masoor)', 'Bengal Gram (Kabuli Chana)', 'Field Pea (Vatana)'], symptoms: ['wilting', 'yellowing', 'stuntedGrowth'], severity: 'high' },
  { key: 'podBorer', crops: ['Tur / Arhar (Pigeon Pea)', 'Gram / Chana (Chickpea)', 'Moong (Green Gram)', 'Urad (Black Gram)'], symptoms: ['holes', 'stuntedGrowth'], severity: 'medium' },
  { key: 'powderyMildewPulse', crops: ['Gram / Chana (Chickpea)', 'Moong (Green Gram)', 'Field Pea (Vatana)'], symptoms: ['whiteCoating', 'stuntedGrowth'], severity: 'low' },

  // COTTON-specific
  { key: 'cottonBollworm', crops: ['Cotton (Kapas)'], symptoms: ['holes', 'stuntedGrowth'], severity: 'high' },
  { key: 'leafCurlVirus', crops: ['Cotton (Kapas)', 'Okra (Bhindi)', 'Tomato'], symptoms: ['curledLeaves', 'yellowing', 'stuntedGrowth'], severity: 'high' },

  // OILSEEDS (Soybean, Groundnut, Sunflower, Mustard, Sesame, Safflower, Castor, Niger, Linseed)
  { key: 'rustOilseed', crops: ['Groundnut (Peanut)', 'Sunflower', 'Mustard', 'Soybean'], symptoms: ['spots', 'yellowing'], severity: 'medium' },
  { key: 'aphidInfestation', crops: ['Mustard', 'Sunflower', 'Safflower (Kardi)', 'Sesame (Til)'], symptoms: ['curledLeaves', 'stickyResidue'], severity: 'medium' },
  { key: 'collarRot', crops: ['Groundnut (Peanut)', 'Castor', 'Soybean'], symptoms: ['wilting', 'stuntedGrowth'], severity: 'high' },

  // VEGETABLES & SPICES
  { key: 'earlyBlight', crops: ['Tomato', 'Potato', 'Brinjal (Eggplant)'], symptoms: ['spots', 'yellowing', 'wilting'], severity: 'medium' },
  { key: 'fruitBorer', crops: ['Tomato', 'Brinjal (Eggplant)', 'Okra (Bhindi)', 'Green Chili'], symptoms: ['holes', 'stuntedGrowth'], severity: 'high' },
  { key: 'powderyMildewVeg', crops: ['Cucumber', 'Watermelon', 'Muskmelon', 'Okra (Bhindi)', 'Cauliflower', 'Cabbage'], symptoms: ['whiteCoating', 'stuntedGrowth'], severity: 'low' },
  { key: 'bacterialWiltVeg', crops: ['Tomato', 'Brinjal (Eggplant)', 'Potato', 'Ginger', 'Turmeric (Halad)'], symptoms: ['wilting', 'yellowing'], severity: 'high' },
  { key: 'purpleBlotch', crops: ['Onion', 'Garlic'], symptoms: ['spots', 'yellowing'], severity: 'medium' },
  { key: 'clubRoot', crops: ['Cabbage', 'Cauliflower', 'Radish'], symptoms: ['wilting', 'stuntedGrowth'], severity: 'high' },

  // FRUITS
  { key: 'anthracnoseFruit', crops: ['Banana', 'Grapes', 'Pomegranate', 'Chikoo (Sapota)'], symptoms: ['spots', 'yellowing'], severity: 'medium' },

  // UNIVERSAL - genuinely can affect almost any crop, applies regardless of crop name
  { key: 'rootRot', crops: [], symptoms: ['wilting', 'yellowing', 'stuntedGrowth'], severity: 'high', soilRiskFactor: 'waterlogged', universal: true },
  { key: 'aphidGeneral', crops: [], symptoms: ['curledLeaves', 'stickyResidue', 'holes'], severity: 'low', universal: true },
];

function analyzeDisease({ symptoms, soilMoisture, soilDrainage, cropName }) {
  // Only consider diseases that explicitly list this crop, plus genuinely universal ones
  const relevantDiseases = diseaseDatabase.filter(
    (d) => d.universal || d.crops.includes(cropName)
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

module.exports = { analyzeDisease };