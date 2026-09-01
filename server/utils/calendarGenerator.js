// Parses a duration string like "90-100 days" into an approximate number of days and months
function durationToDays(durationStr) {
  if (!durationStr) return 120;
  const match = durationStr.match(/(\d+)-(\d+)/);
  if (!match) return 120;
  return Math.round((parseInt(match[1], 10) + parseInt(match[2], 10)) / 2);
}

function generateCalendar(cropName, sowingDate, cropDurationStr, cropWaterNeed, cropSeason) {
  const totalDays = durationToDays(cropDurationStr);
  const totalMonths = Math.max(1, Math.round(totalDays / 30));
  const startDate = new Date(sowingDate);

  const activities = [];
  for (let i = 0; i < totalMonths; i++) {
    const stageStart = new Date(startDate);
    stageStart.setDate(stageStart.getDate() + i * 30);
    const stageEnd = new Date(startDate);
    stageEnd.setDate(stageEnd.getDate() + Math.min((i + 1) * 30, totalDays) - 1);

    let activityKey;
    let stageKey;
    if (i === 0) {
      activityKey = 'sowing';
      stageKey = 'early';
    } else if (i === 1) {
      activityKey = 'firstFertilizer';
      stageKey = 'early';
    } else if (i === totalMonths - 1) {
      activityKey = 'harvesting';
      stageKey = 'late';
    } else if (i === totalMonths - 2) {
      activityKey = 'pestMonitoring';
      stageKey = 'late';
    } else {
      activityKey = 'regularCare';
      stageKey = 'mid';
    }

    const weatherNoteKey = (i > 0 && i < totalMonths - 1)
      ? (cropWaterNeed === 'high' ? 'checkWeatherHigh' : cropWaterNeed === 'low' ? 'checkWeatherLow' : 'checkWeatherModerate')
      : null;

    // Additional detail keys - assembled together on the frontend into a
    // fuller, multi-part write-up for each stage instead of one short line
    const irrigationFreqKey = cropWaterNeed === 'high' ? 'irrigationFreqHigh' : cropWaterNeed === 'low' ? 'irrigationFreqLow' : 'irrigationFreqModerate';
    const growthStageNoteKey = `growthStage_${stageKey}`;
    const pestWatchKey = `pestWatch_${stageKey}`;

    activities.push({
      monthNumber: i + 1,
      startDate: stageStart,
      endDate: stageEnd,
      activityKey,
      weatherNoteKey,
      irrigationFreqKey,
      growthStageNoteKey,
      pestWatchKey,
    });
  }

  return activities;
}

module.exports = { generateCalendar };