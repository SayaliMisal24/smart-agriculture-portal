// Generates generic but genuinely useful cultivation guidance based on
// a crop's water need and season - works for any crop without needing
// unique hand-written content for all 50+ crops
export function getCultivationTipKeys(waterNeed, season) {
  return {
    prepKey: `prep_${season}`,
    sowingKey: `sowing_${waterNeed}`,
    careKey: `care_${waterNeed}`,
    harvestKey: 'harvest_general',
  };
}