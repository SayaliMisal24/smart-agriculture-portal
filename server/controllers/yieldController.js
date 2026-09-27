const submitYieldPrediction = async (req, res) => {
  try {
    const { farmId, cropName: requestedCrop } = req.body;
    if (!farmId) return res.status(400).json({ message: 'farmId is required' });

    const farm = await Farm.findOne({ _id: farmId, user: req.user.id });
    if (!farm) return res.status(404).json({ message: 'Farm not found' });
    if (!farm.selectedCrops || farm.selectedCrops.length === 0) {
      return res.status(400).json({ message: 'Please confirm a crop in Crop Recommendation first.' });
    }

    const cropName = requestedCrop && farm.selectedCrops.includes(requestedCrop) ? requestedCrop : farm.selectedCrops[0];

    const access = canAccessStep(farm, YIELD_STEP);
    if (!access.allowed) return res.status(403).json({ message: 'Please complete the previous steps first.' });
    if (access.locked) return res.status(403).json({ message: 'Yield Prediction has already been completed for this farm.' });

    const latestSoil = await SoilReport.findOne({ user: req.user.id, farm: farmId }).sort({ createdAt: -1 });
    const result = analyzeYield({ cropName, farmSizeAcres: farm.sizeInAcres, soilHealthScore: latestSoil ? latestSoil.healthScore : null });

    const record = new YieldPrediction({ user: req.user.id, farm: farmId, cropName, ...result });
    await record.save();

    const updatedFarm = await completeStep(farmId, YIELD_STEP);
    res.status(201).json({ message: 'Yield prediction generated', record, farm: updatedFarm });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating yield prediction' });
  }
};