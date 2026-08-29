function calculateIrrigation({ soilMoisture, weatherCondition, temperature, lastIrrigationDate, rainExpectedSoon, cropWaterNeed }) {
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
    nextIrrigationDays = 6;
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

  // Adjust the interval based on the crop's own water requirement.
  // High-water crops (rice, sugarcane, banana) need more frequent watering
  // than the base calculation assumes; low-water crops can safely wait longer.
  if (cropWaterNeed === 'high') {
    nextIrrigationDays = Math.max(1, nextIrrigationDays - 1);
  } else if (cropWaterNeed === 'low') {
    nextIrrigationDays = nextIrrigationDays + 1;
  }

  const baseDate = lastIrrigationDate ? new Date(lastIrrigationDate) : new Date();
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + nextIrrigationDays);

  return { recommendationKey, waterAmountKey, nextIrrigationDays, nextIrrigationDate: nextDate };
}

module.exports = { calculateIrrigation };