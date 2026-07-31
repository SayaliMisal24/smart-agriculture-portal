// Simple observation-based soil health analysis (farmer-friendly, no lab values needed)
function analyzeSoil({ soilColor, soilTexture, moisture, drainage, pastCropGrowth, organicMatter }) {
  let score = 100;
  const suggestions = [];

  // Soil color
  if (soilColor === 'grayish_white') {
    score -= 15;
    suggestions.push('Grayish-white soil often lacks nutrients. Add compost or organic manure.');
  } else if (soilColor === 'reddish') {
    score -= 5;
    suggestions.push('Reddish soil may lack organic matter. Consider adding compost regularly.');
  }

  // Texture
  if (soilTexture === 'sandy') {
    score -= 10;
    suggestions.push('Sandy soil drains too fast and loses nutrients. Add organic matter to help retain water and nutrients.');
  } else if (soilTexture === 'clayey') {
    score -= 10;
    suggestions.push('Clayey soil holds too much water. Improve drainage and mix in sand/organic matter.');
  }

  // Moisture
  if (moisture === 'dry_cracked') {
    score -= 15;
    suggestions.push('Soil is too dry. Increase irrigation frequency.');
  } else if (moisture === 'waterlogged') {
    score -= 15;
    suggestions.push('Soil is waterlogged. Improve drainage to avoid root rot.');
  }

  // Drainage
  if (drainage === 'slow') {
    score -= 15;
    suggestions.push('Poor drainage detected. Consider raised beds or drainage channels.');
  }

  // Past crop growth
  if (pastCropGrowth === 'poor') {
    score -= 20;
    suggestions.push('Poor past crop growth suggests low fertility. Get a proper soil test done at a nearby Krishi Kendra.');
  } else if (pastCropGrowth === 'average') {
    score -= 10;
    suggestions.push('Average crop growth. Adding balanced fertilizer could improve yield.');
  }

  // Organic matter
  if (organicMatter === 'very_little') {
    score -= 15;
    suggestions.push('Very little organic matter present. Add compost, cow dung manure, or green manure.');
  } else if (organicMatter === 'some') {
    score -= 5;
  }

  score = Math.max(0, Math.min(100, score));

  let status;
  if (score >= 80) status = 'Excellent';
  else if (score >= 60) status = 'Good';
  else if (score >= 40) status = 'Average';
  else status = 'Poor';

  if (suggestions.length === 0) {
    suggestions.push('Your soil health looks great! Maintain current practices.');
  }

  return { score, status, suggestions };
}

module.exports = { analyzeSoil };