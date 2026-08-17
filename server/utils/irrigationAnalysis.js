// Calculates irrigation advice using codes/keys instead of hardcoded English sentences,
// so the frontend can translate them into any language
function calculateIrrigation({ soilMoisture, weatherCondition, temperature, lastIrrigationDate, rainExpectedSoon }) {
  let recommendationKey = '';
  let waterAmountKey = '';
  let nextIrrigationDays = 0;

  const isRainingNow = weatherCondition === 'Rain' || weatherCondition === 'Drizzle' || weatherCondition === 'Thunderstorm';

  if (isRainingNow) {
    recommendationKey = 'skipRainNow';
    waterAmountKey = 'none';
    nextIrrigationDays = 3;
  } else if (rainExpectedSoon && soilMoisture !== 'dry_cracked') {
    recommendationKey = 'skipRainSoon';
    waterAmountKey = 'noneRainExpected';
    nextIrrigationDays = 5;
  } else if (soilMoisture === 'waterlogged') {
    recommendationKey = 'skipWaterlogged';
    waterAmountKey = 'none';
    nextIrrigationDays = 4;
  } else if (soilMoisture === 'dry_cracked') {
    if (rainExpectedSoon) {
      recommendationKey = 'irrigateDryRainSoon';
      waterAmountKey = 'light1015';
      nextIrrigationDays = 2;
    } else if (temperature > 32) {
      recommendationKey = 'irrigateDryHot';
      waterAmountKey = 'heavy2530';
      nextIrrigationDays = 2;
    } else {
      recommendationKey = 'irrigateDry';
      waterAmountKey = 'moderate1520';
      nextIrrigationDays = 3;
    }
  } else {
    if (temperature > 32) {
      recommendationKey = 'irrigateHot';
      waterAmountKey = 'light10';
      nextIrrigationDays = 3;
    } else {
      recommendationKey = 'adequate';
      waterAmountKey = 'none';
      nextIrrigationDays = 4;
    }
  }

  const baseDate = lastIrrigationDate ? new Date(lastIrrigationDate) : new Date();
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + nextIrrigationDays);

  return { recommendationKey, waterAmountKey, nextIrrigationDays, nextIrrigationDate: nextDate };
}

module.exports = { calculateIrrigation };