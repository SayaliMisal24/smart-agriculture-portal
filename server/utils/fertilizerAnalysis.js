const { getCropCategory } = require('./cropAnalysis');

const fertilizerDatabase = {
  cereal: { n: 50, p: 25, k: 25, organicKey: 'cerealOrganic', chemicalKey: 'cerealChemical', microKey: 'cerealMicro' },
  pulse: { n: 15, p: 40, k: 20, organicKey: 'pulseOrganic', chemicalKey: 'pulseChemical', microKey: 'pulseMicro' },
  oilseed: { n: 40, p: 30, k: 20, organicKey: 'oilseedOrganic', chemicalKey: 'oilseedChemical', microKey: 'oilseedMicro' },
  vegetable: { n: 60, p: 40, k: 40, organicKey: 'vegetableOrganic', chemicalKey: 'vegetableChemical', microKey: 'vegetableMicro' },
  spice: { n: 45, p: 35, k: 35, organicKey: 'spiceOrganic', chemicalKey: 'spiceChemical', microKey: 'spiceMicro' },
  fruit: { n: 70, p: 45, k: 60, organicKey: 'fruitOrganic', chemicalKey: 'fruitChemical', microKey: 'fruitMicro' },
};

const costPerKg = { urea: 6.5, dap: 27, mop: 17, compost: 3 };

// Maps a detected disease to a disease-specific organic soil amendment note,
// so the fertilizer plan actively responds to whatever was found in Disease Detection
const diseaseFertilizerNotes = {
  rootRot: 'diseaseNoteRootRot',
  rhizomeRot: 'diseaseNoteRootRot',
  collarRot: 'diseaseNoteRootRot',
  pulseWilt: 'diseaseNoteWilt',
  bacterialWiltVeg: 'diseaseNoteWilt',
  gingerBacterialWilt: 'diseaseNoteWilt',
  generalNutrientStress: 'diseaseNoteNutrientStress',
};

function analyzeFertilizer({ cropName, farmSizeAcres, organicMatter, pastCropGrowth, diseaseKey }) {
  const category = getCropCategory(cropName);
  const base = fertilizerDatabase[category];
  const size = farmSizeAcres && farmSizeAcres > 0 ? farmSizeAcres : 1;

  let adjustmentFactor = 1;
  if (organicMatter === 'very_little') adjustmentFactor += 0.15;
  if (pastCropGrowth === 'poor') adjustmentFactor += 0.15;

  const totalN = Math.round(base.n * size * adjustmentFactor);
  const totalP = Math.round(base.p * size * adjustmentFactor);
  const totalK = Math.round(base.k * size * adjustmentFactor);

  const ureaKg = Math.round(totalN / 0.46);
  const dapKg = Math.round(totalP / 0.46);
  const mopKg = Math.round(totalK / 0.60);
  const compostKg = Math.round(size * 200 * (adjustmentFactor > 1 ? 1.3 : 1));

  const estimatedCost = Math.round(
    ureaKg * costPerKg.urea + dapKg * costPerKg.dap + mopKg * costPerKg.mop + compostKg * costPerKg.compost * 0.3
  );

  const leansOrganic = organicMatter === 'lots';
  const diseaseNoteKey = diseaseKey ? diseaseFertilizerNotes[diseaseKey] || null : null;

  return {
    category,
    ureaKg,
    dapKg,
    mopKg,
    compostKg,
    estimatedCost,
    leansOrganic,
    organicKey: base.organicKey,
    chemicalKey: base.chemicalKey,
    microKey: base.microKey,
    diseaseNoteKey,
    diseaseKey: diseaseKey || null,
  };
}

module.exports = { analyzeFertilizer };