const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Parses a duration string like "90-100 days" into an approximate number of months
function durationToMonths(durationStr) {
  if (!durationStr) return 4;
  const match = durationStr.match(/(\d+)-(\d+)/);
  if (!match) return 4;
  const avgDays = (parseInt(match[1], 10) + parseInt(match[2], 10)) / 2;
  return Math.max(1, Math.round(avgDays / 30));
}

function generateCalendar(cropName, sowingMonth, cropDurationStr, cropWaterNeed) {
  const durationMonths = durationToMonths(cropDurationStr);
  const startIndex = monthNames.indexOf(sowingMonth);

  const activities = [];
  for (let i = 0; i < durationMonths; i++) {
    const monthIndex = (startIndex + i) % 12;
    const month = monthNames[monthIndex];

    let activityKey;
    if (i === 0) activityKey = 'sowing';
    else if (i === 1) activityKey = 'firstFertilizer';
    else if (i === durationMonths - 1) activityKey = 'harvesting';
    else if (i === durationMonths - 2) activityKey = 'pestMonitoring';
    else activityKey = 'regularCare';

    // Add a weather-awareness note key based on the crop's water need,
    // reminding the farmer to check live weather/irrigation during active growth
    const weatherNoteKey = (i > 0 && i < durationMonths - 1)
      ? (cropWaterNeed === 'high' ? 'checkWeatherHigh' : cropWaterNeed === 'low' ? 'checkWeatherLow' : 'checkWeatherModerate')
      : null;

    activities.push({ month, activityKey, weatherNoteKey });
  }

  return activities;
}

module.exports = { generateCalendar };