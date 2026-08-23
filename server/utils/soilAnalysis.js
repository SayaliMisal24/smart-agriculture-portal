function analyzeSoil({ soilColor, soilTexture, moisture, drainage, pastCropGrowth, organicMatter }) {
  let score = 100;
  const suggestions = [];

  if (soilColor === 'grayish_white') {
    score -= 15;
    suggestions.push('grayishWhite');
  } else if (soilColor === 'reddish') {
    score -= 5;
    suggestions.push('reddish');
  }

  if (soilTexture === 'sandy') {
    score -= 10;
    suggestions.push('sandy');
  } else if (soilTexture === 'clayey') {
    score -= 10;
    suggestions.push('clayey');
  }

  if (moisture === 'dry_cracked') {
    score -= 15;
    suggestions.push('dryCracked');
  } else if (moisture === 'waterlogged') {
    score -= 15;
    suggestions.push('waterlogged');
  }

  if (drainage === 'slow') {
    score -= 15;
    suggestions.push('poorDrainage');
  }

  if (pastCropGrowth === 'poor') {
    score -= 20;
    suggestions.push('poorGrowth');
  } else if (pastCropGrowth === 'average') {
    score -= 10;
    suggestions.push('averageGrowth');
  }

  if (organicMatter === 'very_little') {
    score -= 15;
    suggestions.push('lowOrganicMatter');
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
    suggestions.push('greatSoil');
  }

  return { score, status, suggestions };
}

module.exports = { analyzeSoil };