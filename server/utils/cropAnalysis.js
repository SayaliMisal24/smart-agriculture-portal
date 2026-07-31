// Simple rule-based crop recommendation engine
const cropDatabase = [
  { name: 'Rice', season: 'kharif', soilType: ['clayey', 'loamy'], water: 'high', yield: '25-30 quintal/acre', duration: '120-150 days' },
  { name: 'Maize', season: 'kharif', soilType: ['loamy', 'sandy'], water: 'moderate', yield: '20-25 quintal/acre', duration: '90-100 days' },
  { name: 'Cotton', season: 'kharif', soilType: ['black', 'loamy'], water: 'moderate', yield: '8-10 quintal/acre', duration: '150-180 days' },
  { name: 'Soybean', season: 'kharif', soilType: ['black', 'loamy'], water: 'moderate', yield: '10-12 quintal/acre', duration: '90-110 days' },
  { name: 'Wheat', season: 'rabi', soilType: ['loamy', 'clayey'], water: 'moderate', yield: '18-22 quintal/acre', duration: '110-130 days' },
  { name: 'Gram (Chana)', season: 'rabi', soilType: ['sandy', 'loamy'], water: 'low', yield: '8-10 quintal/acre', duration: '90-100 days' },
  { name: 'Mustard', season: 'rabi', soilType: ['loamy', 'sandy'], water: 'low', yield: '6-8 quintal/acre', duration: '110-140 days' },
  { name: 'Watermelon', season: 'zaid', soilType: ['sandy', 'loamy'], water: 'high', yield: '80-100 quintal/acre', duration: '80-90 days' },
  { name: 'Cucumber', season: 'zaid', soilType: ['sandy', 'loamy'], water: 'moderate', yield: '40-50 quintal/acre', duration: '60-70 days' },
];

function recommendCrops({ season, soilType, waterAvailability }) {
  let matches = cropDatabase.filter(
    (crop) => crop.season === season && crop.soilType.includes(soilType)
  );

  // If nothing matches soil type exactly, relax the soil filter
  if (matches.length === 0) {
    matches = cropDatabase.filter((crop) => crop.season === season);
  }

  // Sort by how closely water need matches
  matches.sort((a, b) => {
    const score = (crop) => (crop.water === waterAvailability ? 0 : 1);
    return score(a) - score(b);
  });

  const recommendedCrops = matches.slice(0, 4).map((c) => ({
    name: c.name,
    expectedYield: c.yield,
    duration: c.duration,
    waterNeed: c.water,
  }));

  return recommendedCrops;
}

module.exports = { recommendCrops };