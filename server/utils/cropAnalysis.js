// Full crop database organized by your categories, with season/soil/water suitability
const cropDatabase = [
  // Cereals & Millets
  { name: 'Rice (Paddy)', season: 'kharif', soilType: ['clayey', 'loamy'], water: 'high', yield: '25-30 quintal/acre', duration: '120-150 days' },
  { name: 'Wheat', season: 'rabi', soilType: ['loamy', 'clayey'], water: 'moderate', yield: '18-22 quintal/acre', duration: '110-130 days' },
  { name: 'Bajra (Pearl Millet)', season: 'kharif', soilType: ['sandy', 'loamy'], water: 'low', yield: '8-10 quintal/acre', duration: '75-90 days' },
  { name: 'Jowar (Sorghum)', season: 'kharif', soilType: ['loamy', 'black'], water: 'low', yield: '10-14 quintal/acre', duration: '100-120 days' },
  { name: 'Maize', season: 'kharif', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '20-25 quintal/acre', duration: '90-100 days' },
  { name: 'Ragi (Finger Millet)', season: 'kharif', soilType: ['loamy', 'sandy'], water: 'low', yield: '8-10 quintal/acre', duration: '100-120 days' },

  // Pulses
  { name: 'Tur / Arhar (Pigeon Pea)', season: 'kharif', soilType: ['loamy', 'black'], water: 'low', yield: '6-8 quintal/acre', duration: '150-180 days' },
  { name: 'Gram / Chana (Chickpea)', season: 'rabi', soilType: ['sandy', 'loamy'], water: 'low', yield: '8-10 quintal/acre', duration: '90-100 days' },
  { name: 'Moong (Green Gram)', season: 'zaid', soilType: ['sandy', 'loamy'], water: 'low', yield: '4-6 quintal/acre', duration: '60-70 days' },
  { name: 'Urad (Black Gram)', season: 'kharif', soilType: ['loamy', 'clayey'], water: 'low', yield: '4-6 quintal/acre', duration: '70-90 days' },
  { name: 'Matki (Moth Bean)', season: 'kharif', soilType: ['sandy'], water: 'low', yield: '3-5 quintal/acre', duration: '60-75 days' },

  // Cash & Oilseed Crops
  { name: 'Soybean', season: 'kharif', soilType: ['black', 'loamy'], water: 'moderate', yield: '10-12 quintal/acre', duration: '90-110 days' },
  { name: 'Cotton (Kapas)', season: 'kharif', soilType: ['black', 'loamy'], water: 'moderate', yield: '8-10 quintal/acre', duration: '150-180 days' },
  { name: 'Sugarcane', season: 'kharif', soilType: ['loamy', 'clayey'], water: 'high', yield: '350-400 quintal/acre', duration: '300-365 days' },
  { name: 'Groundnut (Peanut)', season: 'kharif', soilType: ['sandy', 'loamy'], water: 'moderate', yield: '10-12 quintal/acre', duration: '100-120 days' },
  { name: 'Sesame (Til)', season: 'kharif', soilType: ['sandy', 'loamy'], water: 'low', yield: '3-4 quintal/acre', duration: '80-90 days' },
  { name: 'Sunflower', season: 'rabi', soilType: ['loamy', 'black'], water: 'moderate', yield: '6-8 quintal/acre', duration: '90-100 days' },
  { name: 'Mustard', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'low', yield: '6-8 quintal/acre', duration: '110-140 days' },
  { name: 'Safflower (Kardi)', season: 'rabi', soilType: ['black', 'loamy'], water: 'low', yield: '4-6 quintal/acre', duration: '120-140 days' },

  // Vegetables & Spices
  { name: 'Onion', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '80-100 quintal/acre', duration: '100-120 days' },
  { name: 'Tomato', season: 'zaid', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '150-200 quintal/acre', duration: '90-100 days' },
  { name: 'Green Chili', season: 'kharif', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '40-60 quintal/acre', duration: '90-120 days' },
  { name: 'Brinjal (Eggplant)', season: 'zaid', soilType: ['loamy', 'clayey'], water: 'moderate', yield: '100-150 quintal/acre', duration: '80-100 days' },
  { name: 'Okra (Bhindi)', season: 'zaid', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '40-60 quintal/acre', duration: '50-60 days' },
  { name: 'Potato', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '80-100 quintal/acre', duration: '80-100 days' },
  { name: 'Garlic', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'low', yield: '30-40 quintal/acre', duration: '130-150 days' },
  { name: 'Ginger', season: 'kharif', soilType: ['loamy', 'clayey'], water: 'moderate', yield: '80-100 quintal/acre', duration: '180-240 days' },
  { name: 'Turmeric (Halad)', season: 'kharif', soilType: ['loamy', 'clayey'], water: 'moderate', yield: '60-80 quintal/acre', duration: '210-240 days' },
];

// Ranks water levels so we can compare "does this farm have enough water for this crop?"
const waterRank = { low: 1, moderate: 2, high: 3 };

function recommendCrops({ season, soilType, waterAvailability }) {
  const availableRank = waterRank[waterAvailability];

  let matches = cropDatabase.filter(
    (crop) =>
      crop.season === season &&
      crop.soilType.includes(soilType) &&
      waterRank[crop.water] <= availableRank // exclude crops needing MORE water than available
  );

  // If nothing matches soil type exactly, relax the soil filter (but keep the water rule)
  if (matches.length === 0) {
    matches = cropDatabase.filter(
      (crop) => crop.season === season && waterRank[crop.water] <= availableRank
    );
  }

  // Still nothing? Relax the water rule too, but only as an absolute last resort,
  // and clearly sort so the closest water-need crops still appear first
  if (matches.length === 0) {
    matches = cropDatabase.filter((crop) => crop.season === season);
  }

  if (matches.length === 0) {
    matches = cropDatabase;
  }

  // Sort by exact water match first, then by how close the water need is
  matches.sort((a, b) => {
    const diffA = Math.abs(waterRank[a.water] - availableRank);
    const diffB = Math.abs(waterRank[b.water] - availableRank);
    return diffA - diffB;
  });

  const recommendedCrops = matches.slice(0, 12).map((c) => ({
    name: c.name,
    expectedYield: c.yield,
    duration: c.duration,
    waterNeed: c.water,
  }));

  return recommendedCrops;
}

module.exports = { recommendCrops };