// The fixed order of the 11-step farm wizard
const STEPS = [
  { step: 1, key: 'soilHealth', name: 'Soil Health Analyzer' },
  { step: 2, key: 'cropRecommendation', name: 'Crop Recommendation' },
  { step: 3, key: 'weather', name: 'Weather Based Farming' },
  { step: 4, key: 'irrigation', name: 'Smart Irrigation' },
  { step: 5, key: 'calendar', name: 'Crop Calendar' },
  { step: 6, key: 'diseaseDetection', name: 'Crop Disease Detection' },
  { step: 7, key: 'fertilizer', name: 'Fertilizer Recommendation' },
  { step: 8, key: 'pesticide', name: 'Pesticide Recommendation' },
  { step: 9, key: 'yieldPrediction', name: 'Yield Prediction' },
  { step: 10, key: 'marketFinder', name: 'Market Finder' },
  { step: 11, key: 'marketPricePrediction', name: 'Market Price Prediction' },
];

module.exports = { STEPS };