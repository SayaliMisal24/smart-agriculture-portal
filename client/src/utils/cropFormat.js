// Translates the unit words inside duration/yield strings (e.g. "120-150 days"
// becomes "120-150 दिवस"), since these are stored as plain English strings
// with the number range and unit combined together
export function formatDuration(duration, t) {
  if (!duration) return duration;
  return duration.replace('days', t('crop.daysUnit'));
}

export function formatYield(yieldStr, t) {
  if (!yieldStr) return yieldStr;
  return yieldStr.replace('quintal/acre', t('crop.quintalPerAcreUnit'));
}