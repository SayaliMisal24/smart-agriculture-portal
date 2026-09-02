// Simple rule-based disease matching using symptom overlap + soil context.
// This is a transparent simulation, not real image analysis - the frontend
// clearly labels it as a preliminary screening tool.

const diseaseDatabase = [
  {
    key: 'leafSpot',
    symptoms: ['yellowing', 'spots', 'wilting'],
    category: 'fungal',
  },
  {
    key: 'powderyMildew',
    symptoms: ['whiteCoating', 'spots', 'stuntedGrowth'],
    category: 'fungal',
  },
  {
    key: 'bacterialWilt',
    symptoms: ['wilting', 'yellowing', 'stuntedGrowth'],
    category: 'bacterial',
  },
  {
    key: 'aphidInfestation',
    symptoms: ['holes', 'stickyResidue', 'curledLeaves'],
    category: 'pest',
  },
  {
    key: 'rust',
    symptoms: ['spots', 'yellowing', 'holes'],
    category: 'fungal',
  },
  {
    key: 'rootRot',
    symptoms: ['wilting', 'yellowing', 'stuntedGrowth'],
    category: 'fungal',
    soilRiskFactor: 'waterlogged', // boosted if soil report shows this
  },
];

function analyzeDisease({ symptoms, soilMoisture, soilDrainage }) {
  // Score each disease by how many of the farmer's checked symptoms match
  const scored = diseaseDatabase.map((d) => {
    let matchCount = d.symptoms.filter((s) => symptoms.includes(s)).length;

    // Boost root rot specifically if the farm's soil data suggests waterlogging
    if (d.soilRiskFactor === 'waterlogged' && (soilMoisture === 'waterlogged' || soilDrainage === 'slow')) {
      matchCount += 1.5;
    }

    return { ...d, matchCount };
  });

  scored.sort((a, b) => b.matchCount - a.matchCount);

  const topMatch = scored[0];

  if (!topMatch || topMatch.matchCount === 0) {
    return { diseaseKey: null, confidencePercent: null };
  }

  // Convert match count into an illustrative confidence percentage
  const maxPossible = topMatch.symptoms.length + (topMatch.soilRiskFactor ? 1.5 : 0);
  const confidencePercent = Math.min(92, Math.round((topMatch.matchCount / maxPossible) * 100));

  return { diseaseKey: topMatch.key, confidencePercent };
}

module.exports = { analyzeDisease };