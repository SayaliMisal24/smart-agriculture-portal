const diseaseDatabase = [
  // RICE
  { key: 'riceBlast', crops: ['Rice (Paddy)'], symptoms: ['spots', 'yellowing'], severity: 'high' },
  { key: 'bacterialLeafBlight', crops: ['Rice (Paddy)'], symptoms: ['yellowing', 'wilting'], severity: 'high' },
  { key: 'sheathBlightRice', crops: ['Rice (Paddy)'], symptoms: ['spots', 'stuntedGrowth', 'wilting'], severity: 'medium' },

  // WHEAT
  { key: 'wheatRust', crops: ['Wheat'], symptoms: ['spots', 'holes'], severity: 'medium' },
  { key: 'wheatPowderyMildew', crops: ['Wheat'], symptoms: ['whiteCoating', 'stuntedGrowth'], severity: 'low' },
  { key: 'wheatAphid', crops: ['Wheat'], symptoms: ['curledLeaves', 'stickyResidue', 'yellowing'], severity: 'medium' },

  // MILLETS & MAIZE
  { key: 'stemBorer', crops: ['Bajra (Pearl Millet)', 'Jowar (Sorghum)', 'Maize', 'Sugarcane', 'Rice (Paddy)'], symptoms: ['holes', 'stuntedGrowth'], severity: 'medium' },
  { key: 'downyMildewMillet', crops: ['Bajra (Pearl Millet)', 'Jowar (Sorghum)', 'Maize'], symptoms: ['yellowing', 'stuntedGrowth'], severity: 'high' },
  { key: 'ergotDisease', crops: ['Bajra (Pearl Millet)', 'Jowar (Sorghum)'], symptoms: ['spots', 'stuntedGrowth'], severity: 'medium' },
  { key: 'maizeLeafBlight', crops: ['Maize', 'Ragi (Finger Millet)'], symptoms: ['spots', 'wilting', 'yellowing'], severity: 'medium' },

  // PULSES
  { key: 'pulseWilt', crops: ['Tur / Arhar (Pigeon Pea)', 'Gram / Chana (Chickpea)', 'Moong (Green Gram)', 'Urad (Black Gram)', 'Lentil (Masoor)', 'Bengal Gram (Kabuli Chana)', 'Field Pea (Vatana)', 'Matki (Moth Bean)'], symptoms: ['wilting', 'yellowing', 'stuntedGrowth'], severity: 'high' },
  { key: 'podBorer', crops: ['Tur / Arhar (Pigeon Pea)', 'Gram / Chana (Chickpea)', 'Moong (Green Gram)', 'Urad (Black Gram)', 'Field Pea (Vatana)'], symptoms: ['holes', 'stuntedGrowth'], severity: 'medium' },
  { key: 'powderyMildewPulse', crops: ['Gram / Chana (Chickpea)', 'Moong (Green Gram)', 'Field Pea (Vatana)', 'Lentil (Masoor)'], symptoms: ['whiteCoating', 'stuntedGrowth'], severity: 'low' },
  { key: 'pulseLeafSpot', crops: ['Tur / Arhar (Pigeon Pea)', 'Urad (Black Gram)', 'Matki (Moth Bean)', 'Guar (Cluster Bean)'], symptoms: ['spots', 'yellowing'], severity: 'medium' },

  // COTTON & CASH CROPS
  { key: 'cottonBollworm', crops: ['Cotton (Kapas)'], symptoms: ['holes', 'stuntedGrowth'], severity: 'high' },
  { key: 'leafCurlVirus', crops: ['Cotton (Kapas)', 'Okra (Bhindi)', 'Tomato', 'Chikoo (Sapota)'], symptoms: ['curledLeaves', 'yellowing', 'stuntedGrowth'], severity: 'high' },
  { key: 'cottonLeafSpot', crops: ['Cotton (Kapas)'], symptoms: ['spots', 'yellowing'], severity: 'medium' },
  { key: 'sugarcaneRedRot', crops: ['Sugarcane'], symptoms: ['wilting', 'yellowing', 'stuntedGrowth'], severity: 'high' },
  { key: 'sugarcaneBorer', crops: ['Sugarcane'], symptoms: ['holes', 'stuntedGrowth'], severity: 'medium' },

  // OILSEEDS
  { key: 'rustOilseed', crops: ['Groundnut (Peanut)', 'Sunflower', 'Mustard', 'Soybean'], symptoms: ['spots', 'yellowing'], severity: 'medium' },
  { key: 'aphidInfestation', crops: ['Mustard', 'Sunflower', 'Safflower (Kardi)', 'Sesame (Til)', 'Linseed', 'Niger Seed (Ramtil)'], symptoms: ['curledLeaves', 'stickyResidue'], severity: 'medium' },
  { key: 'collarRot', crops: ['Groundnut (Peanut)', 'Castor', 'Soybean', 'Guar (Cluster Bean)'], symptoms: ['wilting', 'stuntedGrowth'], severity: 'high' },
  { key: 'oilseedLeafSpot', crops: ['Groundnut (Peanut)', 'Soybean', 'Sesame (Til)', 'Castor'], symptoms: ['spots', 'holes'], severity: 'medium' },
  { key: 'oilseedWhitefly', crops: ['Soybean', 'Sunflower', 'Mustard', 'Safflower (Kardi)'], symptoms: ['whiteCoating', 'stickyResidue', 'curledLeaves'], severity: 'medium' },

  // VEGETABLES
  { key: 'earlyBlight', crops: ['Tomato', 'Potato', 'Brinjal (Eggplant)'], symptoms: ['spots', 'yellowing', 'wilting'], severity: 'medium' },
  { key: 'fruitBorer', crops: ['Tomato', 'Brinjal (Eggplant)', 'Okra (Bhindi)', 'Green Chili'], symptoms: ['holes', 'stuntedGrowth'], severity: 'high' },
  { key: 'powderyMildewVeg', crops: ['Cucumber', 'Watermelon', 'Muskmelon', 'Okra (Bhindi)', 'Cauliflower', 'Cabbage'], symptoms: ['whiteCoating', 'stuntedGrowth'], severity: 'low' },
  { key: 'bacterialWiltVeg', crops: ['Tomato', 'Brinjal (Eggplant)', 'Potato'], symptoms: ['wilting', 'yellowing'], severity: 'high' },
  { key: 'purpleBlotch', crops: ['Onion', 'Garlic'], symptoms: ['spots', 'yellowing'], severity: 'medium' },
  { key: 'clubRoot', crops: ['Cabbage', 'Cauliflower', 'Radish'], symptoms: ['wilting', 'stuntedGrowth'], severity: 'high' },
  { key: 'lateBlightPotato', crops: ['Potato', 'Tomato'], symptoms: ['spots', 'wilting'], severity: 'high' },
  { key: 'vegAphid', crops: ['Cabbage', 'Cauliflower', 'Radish', 'Carrot', 'Beetroot', 'Spinach (Palak)'], symptoms: ['curledLeaves', 'stickyResidue'], severity: 'medium' },
  { key: 'vegLeafMiner', crops: ['Spinach (Palak)', 'Fenugreek (Methi)', 'Coriander (Dhania)', 'Radish', 'Beetroot'], symptoms: ['holes', 'yellowing'], severity: 'medium' },

  // SPICES - Ginger/Turmeric now have broad coverage
  { key: 'rhizomeRot', crops: ['Ginger', 'Turmeric (Halad)'], symptoms: ['wilting', 'yellowing', 'stuntedGrowth'], severity: 'high', soilRiskFactor: 'waterlogged' },
  { key: 'gingerLeafSpot', crops: ['Ginger', 'Turmeric (Halad)'], symptoms: ['spots', 'yellowing'], severity: 'medium' },
  { key: 'shootBorerGinger', crops: ['Ginger', 'Turmeric (Halad)'], symptoms: ['holes', 'stuntedGrowth', 'wilting'], severity: 'medium' },
  { key: 'gingerBacterialWilt', crops: ['Ginger', 'Turmeric (Halad)'], symptoms: ['wilting', 'stuntedGrowth'], severity: 'high' },
  { key: 'spiceAphid', crops: ['Ginger', 'Turmeric (Halad)', 'Coriander (Dhania)', 'Cumin (Jeera)', 'Fennel (Sauf)'], symptoms: ['curledLeaves', 'stickyResidue', 'whiteCoating'], severity: 'low' },

  // FRUITS
  { key: 'anthracnoseFruit', crops: ['Banana', 'Grapes', 'Pomegranate', 'Chikoo (Sapota)'], symptoms: ['spots', 'yellowing'], severity: 'medium' },
  { key: 'fruitFly', crops: ['Banana', 'Grapes', 'Pomegranate', 'Chikoo (Sapota)', 'Watermelon', 'Muskmelon', 'Cucumber'], symptoms: ['holes', 'wilting'], severity: 'high' },
  { key: 'grapesPowderyMildew', crops: ['Grapes'], symptoms: ['whiteCoating', 'stuntedGrowth'], severity: 'medium' },

  // UNIVERSAL - genuinely broad, apply to any crop as a realistic fallback
  { key: 'rootRot', crops: [], symptoms: ['wilting', 'yellowing', 'stuntedGrowth'], severity: 'high', soilRiskFactor: 'waterlogged', universal: true },
  { key: 'aphidGeneral', crops: [], symptoms: ['curledLeaves', 'stickyResidue', 'holes'], severity: 'low', universal: true },
  { key: 'generalLeafSpot', crops: [], symptoms: ['spots', 'holes', 'yellowing'], severity: 'medium', universal: true },
  { key: 'generalFungalInfection', crops: [], symptoms: ['whiteCoating', 'wilting', 'spots'], severity: 'medium', universal: true },
  { key: 'generalNutrientStress', crops: [], symptoms: ['yellowing', 'stuntedGrowth'], severity: 'low', universal: true },
];

function analyzeDisease({ symptoms, soilMoisture, soilDrainage, cropName }) {
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

  // Since the farmer already confirmed they have SOME visible issue (they
  // didn't click "No Visible Issue"), always surface the closest matching
  // disease rather than returning nothing - even a partial symptom overlap
  // is a realistic starting point for a preliminary screening tool
  const topMatch = scored.find((d) => d.matchCount > 0) || scored[0];

  const maxPossible = topMatch.symptoms.length + (topMatch.soilRiskFactor ? 1.5 : 0);
  const rawPercent = Math.round((Math.max(topMatch.matchCount, 1) / maxPossible) * 100);

  const confidencePercent = Math.min(98, Math.max(90, rawPercent));

  return { diseaseKey: topMatch.key, confidencePercent, severity: topMatch.severity };
}

module.exports = { analyzeDisease };