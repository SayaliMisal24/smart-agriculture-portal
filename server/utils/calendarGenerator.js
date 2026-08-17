const cropDurations = {
  Rice: 5, Maize: 4, Cotton: 6, Soybean: 4,
  Wheat: 5, 'Gram (Chana)': 4, Mustard: 5,
  Watermelon: 3, Cucumber: 3,
};

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function generateCalendar(cropName, sowingMonth) {
  const durationMonths = cropDurations[cropName] || 4;
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

    activities.push({ month, activityKey });
  }

  return activities;
}

module.exports = { generateCalendar };