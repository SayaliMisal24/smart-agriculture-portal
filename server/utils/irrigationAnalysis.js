// Simple rule-based irrigation recommendation
function calculateIrrigation({ soilMoisture, weatherCondition, temperature }) {
  let recommendation = '';
  let waterAmount = '';
  let nextIrrigationDays = 0;

  const isRaining = weatherCondition === 'Rain' || weatherCondition === 'Drizzle' || weatherCondition === 'Thunderstorm';

  if (isRaining) {
    recommendation = 'Skip irrigation today — rain is expected/occurring.';
    waterAmount = 'None needed';
    nextIrrigationDays = 3;
  } else if (soilMoisture === 'waterlogged') {
    recommendation = 'Soil is already waterlogged. Do not irrigate.';
    waterAmount = 'None needed';
    nextIrrigationDays = 4;
  } else if (soilMoisture === 'dry_cracked') {
    if (temperature > 32) {
      recommendation = 'Soil is dry and temperature is high. Irrigate today, preferably early morning or evening.';
      waterAmount = 'Heavy (25-30mm)';
      nextIrrigationDays = 2;
    } else {
      recommendation = 'Soil is dry. Irrigate today.';
      waterAmount = 'Moderate (15-20mm)';
      nextIrrigationDays = 3;
    }
  } else {
    // slightly_moist
    if (temperature > 32) {
      recommendation = 'Soil moisture is okay, but high temperature increases evaporation. Light irrigation recommended.';
      waterAmount = 'Light (10mm)';
      nextIrrigationDays = 3;
    } else {
      recommendation = 'Soil moisture is adequate. No irrigation needed today.';
      waterAmount = 'None needed';
      nextIrrigationDays = 4;
    }
  }

  return { recommendation, waterAmount, nextIrrigationDays };
}

module.exports = { calculateIrrigation };