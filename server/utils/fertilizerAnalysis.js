const { getCropCategory } = require('./cropAnalysis');

// Realistic base NPK (nitrogen-phosphorus-potassium) recommendations per
// category, in kg per acre - actual real-world agronomic ranges
const fertilizerDatabase = {
  cereal: { n: 50, p: 25, k: 25, organicKey: 'cerealOrganic', chemicalKey: 'cerealChemical' },
  pulse: { n: 15, p: 40, k: 20, organicKey: 'pulseOrganic', chemicalKey: 'pulseChemical' },
  oilseed: { n: 40, p: 30, k: 20, organicKey: 'oilseedOrganic', chemicalKey: 'oilseedChemical' },
  vegetable: { n: 60, p: 40, k: 40, organicKey: 'vegetableOrganic', chemicalKey: 'vegetableChemical' },
  spice: { n: 45, p: 35, k: 35, organicKey: 'spiceOrganic', chemicalKey: 'spiceChemical' },
  fruit: { n: 70, p: 45, k: 60, organicKey: 'fruitOrganic', chemicalKey: 'fruitChemical' },
};

// Illustrative cost per kg for common fertilizers, used for a rough cost estimate
const costPerKg = { urea: 6.5, dap: 27, mop: 17, compost: 3 };

function analyzeFertilizer({ cropName, farmSizeAcres, organicMatter, pastCropGrowth }) {
  const category = getCropCategory(cropName);
  const base = fertilizerDatabase[category];

  const size = farmSizeAcres && farmSizeAcres > 0 ? farmSizeAcres : 1;

  // Adjust quantities based on soil health context - poor organic matter or
  // poor past growth suggests the soil needs a bit more support
  let adjustmentFactor = 1;
  if (organicMatter === 'very_little') adjustmentFactor += 0.15;
  if (pastCropGrowth === 'poor') adjustmentFactor += 0.15;

  const totalN = Math.round(base.n * size * adjustmentFactor);
  const totalP = Math.round(base.p * size * adjustmentFactor);
  const totalK = Math.round(base.k * size * adjustmentFactor);

  // Convert NPK into approximate real fertilizer quantities (Urea ~46% N, DAP ~46% P, MOP ~60% K)
  const ureaKg = Math.round(totalN / 0.46);
  const dapKg = Math.round(totalP / 0.46);
  const mopKg = Math.round(totalK / 0.60);
  const compostKg = Math.round(size * 200 * (adjustmentFactor > 1 ? 1.3 : 1));

  const estimatedCost = Math.round(
    ureaKg * costPerKg.urea + dapKg * costPerKg.dap + mopKg * costPerKg.mop + compostKg * costPerKg.compost * 0.3
  );

  // Lean recommendation toward organic if soil already has decent organic matter, else balanced
  const leansOrganic = organicMatter === 'lots';

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
  };
}

module.exports = { analyzeFertilizer };