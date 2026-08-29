const cropDatabase = [
  { name: 'Rice (Paddy)', descKey: 'rice', season: 'kharif', soilType: ['clayey', 'loamy'], water: 'high', yield: '25-30 quintal/acre', duration: '120-150 days' },
  { name: 'Wheat', descKey: 'wheat', season: 'rabi', soilType: ['loamy', 'clayey'], water: 'moderate', yield: '18-22 quintal/acre', duration: '110-130 days' },
  { name: 'Bajra (Pearl Millet)', descKey: 'bajra', season: 'kharif', soilType: ['sandy', 'loamy'], water: 'low', yield: '8-10 quintal/acre', duration: '75-90 days' },
  { name: 'Jowar (Sorghum)', descKey: 'jowar', season: 'kharif', soilType: ['loamy', 'black'], water: 'low', yield: '10-14 quintal/acre', duration: '100-120 days' },
  { name: 'Maize', descKey: 'maize', season: 'kharif', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '20-25 quintal/acre', duration: '90-100 days' },
  { name: 'Ragi (Finger Millet)', descKey: 'ragi', season: 'kharif', soilType: ['loamy', 'sandy'], water: 'low', yield: '8-10 quintal/acre', duration: '100-120 days' },
  { name: 'Tur / Arhar (Pigeon Pea)', descKey: 'tur', season: 'kharif', soilType: ['loamy', 'black'], water: 'low', yield: '6-8 quintal/acre', duration: '150-180 days' },
  { name: 'Gram / Chana (Chickpea)', descKey: 'gram', season: 'rabi', soilType: ['sandy', 'loamy'], water: 'low', yield: '8-10 quintal/acre', duration: '90-100 days' },
  { name: 'Moong (Green Gram)', descKey: 'moong', season: 'zaid', soilType: ['sandy', 'loamy'], water: 'low', yield: '4-6 quintal/acre', duration: '60-70 days' },
  { name: 'Urad (Black Gram)', descKey: 'urad', season: 'kharif', soilType: ['loamy', 'clayey'], water: 'low', yield: '4-6 quintal/acre', duration: '70-90 days' },
  { name: 'Matki (Moth Bean)', descKey: 'matki', season: 'kharif', soilType: ['sandy'], water: 'low', yield: '3-5 quintal/acre', duration: '60-75 days' },
  { name: 'Soybean', descKey: 'soybean', season: 'kharif', soilType: ['black', 'loamy'], water: 'moderate', yield: '10-12 quintal/acre', duration: '90-110 days' },
  { name: 'Cotton (Kapas)', descKey: 'cotton', season: 'kharif', soilType: ['black', 'loamy'], water: 'moderate', yield: '8-10 quintal/acre', duration: '150-180 days' },
  { name: 'Sugarcane', descKey: 'sugarcane', season: 'kharif', soilType: ['loamy', 'clayey'], water: 'high', yield: '350-400 quintal/acre', duration: '300-365 days' },
  { name: 'Groundnut (Peanut)', descKey: 'groundnut', season: 'kharif', soilType: ['sandy', 'loamy'], water: 'moderate', yield: '10-12 quintal/acre', duration: '100-120 days' },
  { name: 'Sesame (Til)', descKey: 'sesame', season: 'kharif', soilType: ['sandy', 'loamy'], water: 'low', yield: '3-4 quintal/acre', duration: '80-90 days' },
  { name: 'Sunflower', descKey: 'sunflower', season: 'rabi', soilType: ['loamy', 'black'], water: 'moderate', yield: '6-8 quintal/acre', duration: '90-100 days' },
  { name: 'Mustard', descKey: 'mustard', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'low', yield: '6-8 quintal/acre', duration: '110-140 days' },
  { name: 'Safflower (Kardi)', descKey: 'safflower', season: 'rabi', soilType: ['black', 'loamy'], water: 'low', yield: '4-6 quintal/acre', duration: '120-140 days' },
  { name: 'Onion', descKey: 'onion', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '80-100 quintal/acre', duration: '100-120 days' },
  { name: 'Tomato', descKey: 'tomato', season: 'zaid', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '150-200 quintal/acre', duration: '90-100 days' },
  { name: 'Green Chili', descKey: 'greenChili', season: 'kharif', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '40-60 quintal/acre', duration: '90-120 days' },
  { name: 'Brinjal (Eggplant)', descKey: 'brinjal', season: 'zaid', soilType: ['loamy', 'clayey'], water: 'moderate', yield: '100-150 quintal/acre', duration: '80-100 days' },
  { name: 'Okra (Bhindi)', descKey: 'okra', season: 'zaid', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '40-60 quintal/acre', duration: '50-60 days' },
  { name: 'Potato', descKey: 'potato', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '80-100 quintal/acre', duration: '80-100 days' },
  { name: 'Garlic', descKey: 'garlic', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'low', yield: '30-40 quintal/acre', duration: '130-150 days' },
  { name: 'Ginger', descKey: 'ginger', season: 'kharif', soilType: ['loamy', 'clayey'], water: 'moderate', yield: '80-100 quintal/acre', duration: '180-240 days' },
  { name: 'Turmeric (Halad)', descKey: 'turmeric', season: 'kharif', soilType: ['loamy', 'clayey'], water: 'moderate', yield: '60-80 quintal/acre', duration: '210-240 days' },
  { name: 'Bengal Gram (Kabuli Chana)', descKey: 'kabuliChana', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'low', yield: '7-9 quintal/acre', duration: '95-110 days' },
  { name: 'Lentil (Masoor)', descKey: 'masoor', season: 'rabi', soilType: ['loamy', 'clayey'], water: 'low', yield: '6-8 quintal/acre', duration: '100-120 days' },
  { name: 'Cabbage', descKey: 'cabbage', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '150-200 quintal/acre', duration: '80-100 days' },
  { name: 'Cauliflower', descKey: 'cauliflower', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '100-150 quintal/acre', duration: '90-110 days' },
  { name: 'Cucumber', descKey: 'cucumber', season: 'zaid', soilType: ['sandy', 'loamy'], water: 'moderate', yield: '80-100 quintal/acre', duration: '55-65 days' },
  { name: 'Watermelon', descKey: 'watermelon', season: 'zaid', soilType: ['sandy', 'loamy'], water: 'high', yield: '150-250 quintal/acre', duration: '80-90 days' },
  { name: 'Muskmelon', descKey: 'muskmelon', season: 'zaid', soilType: ['sandy', 'loamy'], water: 'high', yield: '100-150 quintal/acre', duration: '80-95 days' },
  { name: 'Banana', descKey: 'banana', season: 'kharif', soilType: ['loamy', 'clayey'], water: 'high', yield: '300-400 quintal/acre', duration: '300-365 days' },
  { name: 'Grapes', descKey: 'grapes', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '80-120 quintal/acre', duration: '150-180 days' },
  { name: 'Pomegranate', descKey: 'pomegranate', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'low', yield: '60-100 quintal/acre', duration: '150-180 days' },
  { name: 'Green Gram Fodder (Chawali)', descKey: 'chawali', season: 'kharif', soilType: ['sandy', 'loamy'], water: 'low', yield: '5-7 quintal/acre', duration: '65-75 days' },
  { name: 'Castor', descKey: 'castor', season: 'kharif', soilType: ['sandy', 'black'], water: 'low', yield: '8-10 quintal/acre', duration: '150-180 days' },
  { name: 'Niger Seed (Ramtil)', descKey: 'niger', season: 'kharif', soilType: ['loamy', 'sandy'], water: 'low', yield: '3-4 quintal/acre', duration: '90-110 days' },
  { name: 'Linseed', descKey: 'linseed', season: 'rabi', soilType: ['loamy', 'clayey'], water: 'low', yield: '5-7 quintal/acre', duration: '110-130 days' },
  { name: 'Guar (Cluster Bean)', descKey: 'guar', season: 'kharif', soilType: ['sandy', 'loamy'], water: 'low', yield: '4-6 quintal/acre', duration: '80-90 days' },
  { name: 'Field Pea (Vatana)', descKey: 'fieldPea', season: 'rabi', soilType: ['loamy', 'clayey'], water: 'low', yield: '6-8 quintal/acre', duration: '90-100 days' },
  { name: 'Radish', descKey: 'radish', season: 'rabi', soilType: ['sandy', 'loamy'], water: 'moderate', yield: '80-100 quintal/acre', duration: '40-55 days' },
  { name: 'Carrot', descKey: 'carrot', season: 'rabi', soilType: ['sandy', 'loamy'], water: 'moderate', yield: '100-150 quintal/acre', duration: '90-100 days' },
  { name: 'Beetroot', descKey: 'beetroot', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '100-140 quintal/acre', duration: '60-70 days' },
  { name: 'Spinach (Palak)', descKey: 'spinach', season: 'rabi', soilType: ['loamy', 'clayey'], water: 'moderate', yield: '60-80 quintal/acre', duration: '35-45 days' },
  { name: 'Fenugreek (Methi)', descKey: 'fenugreek', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'low', yield: '40-60 quintal/acre', duration: '30-45 days' },
  { name: 'Coriander (Dhania)', descKey: 'coriander', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'low', yield: '4-6 quintal/acre', duration: '90-110 days' },
  { name: 'Cumin (Jeera)', descKey: 'cumin', season: 'rabi', soilType: ['sandy', 'loamy'], water: 'low', yield: '3-4 quintal/acre', duration: '110-120 days' },
  { name: 'Fennel (Sauf)', descKey: 'fennel', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '6-8 quintal/acre', duration: '150-180 days' },
  { name: 'Chikoo (Sapota)', descKey: 'chikoo', season: 'kharif', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '80-120 quintal/acre', duration: '300-365 days' },
];

const waterRank = { low: 1, moderate: 2, high: 3 };

function recommendCrops({ season, soilType, waterAvailability }) {
  const availableRank = waterRank[waterAvailability];

  let matches = cropDatabase.filter(
    (crop) =>
      crop.season === season &&
      crop.soilType.includes(soilType) &&
      waterRank[crop.water] <= availableRank
  );

  if (matches.length === 0) {
    matches = cropDatabase.filter(
      (crop) => crop.season === season && waterRank[crop.water] <= availableRank
    );
  }

  if (matches.length === 0) {
    matches = cropDatabase.filter((crop) => crop.season === season);
  }

  if (matches.length === 0) {
    matches = cropDatabase;
  }

  matches.sort((a, b) => {
    const diffA = Math.abs(waterRank[a.water] - availableRank);
    const diffB = Math.abs(waterRank[b.water] - availableRank);
    return diffA - diffB;
  });

  const recommendedCrops = matches.slice(0, 12).map((c) => ({
    name: c.name,
    descKey: c.descKey,
    expectedYield: c.yield,
    duration: c.duration,
    waterNeed: c.water,
  }));

  return recommendedCrops;
}

module.exports = { recommendCrops, cropDatabase };