const Farm = require('../models/Farm');

// Call this after a step's data is successfully saved
async function completeStep(farmId, stepNumber) {
  const farm = await Farm.findById(farmId);
  if (!farm) return null;

  if (!farm.completedSteps.includes(stepNumber)) {
    farm.completedSteps.push(stepNumber);
  }
  // Unlock the next step
  if (farm.currentStep === stepNumber) {
    farm.currentStep = stepNumber + 1;
  }
  await farm.save();
  return farm;
}

// Call this before allowing a step's submission, to enforce strict order + lock-after-complete
function canAccessStep(farm, stepNumber) {
  if (farm.completedSteps.includes(stepNumber)) {
    return { allowed: true, locked: true }; // already done, view-only
  }
  if (stepNumber === farm.currentStep) {
    return { allowed: true, locked: false }; // this is the one to fill now
  }
  return { allowed: false, locked: false }; // not reached yet
}

module.exports = { completeStep, canAccessStep };