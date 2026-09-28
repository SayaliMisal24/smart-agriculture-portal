import MultiCropStep from '../components/MultiCropStep';
import { FaSeedling, FaRupeeSign } from 'react-icons/fa';

const totalAcres = (farm) => (farm?.sizeInAcres && farm.sizeInAcres > 0 ? farm.sizeInAcres : 1);
const usedAcres = (records) => records.reduce((s, r) => s + (r.areaAcres || 0), 0);
const freeAcres = (farm, records) => Math.max(0, totalAcres(farm) - usedAcres(records));

// The area input: defaults to an equal share of the unallocated land, and can't exceed what's left
const extra = {
  initial: (farm, crop, records, remaining) => {
    const share = freeAcres(farm, records) / Math.max(1, remaining.length);
    return String(Math.round(share * 100) / 100);
  },
  validate: (value, farm, records) => {
    const area = Number(value);
    if (!area || area <= 0) return { key: 'yieldPred.areaInvalid' };
    const free = freeAcres(farm, records);
    if (area > free + 0.01) return { key: 'yieldPred.areaTooLarge', params: { free: free.toFixed(2) } };
    return null;
  },
  payload: (value) => ({ areaAcres: Number(value) }),
  render: ({ value, setValue, farm, records, t }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{t('yieldPred.areaLabel')}</label>
      <input
        type="number"
        step="0.01"
        min="0"
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
        className="w-40 border border-gray-300 rounded-lg px-3 py-2"
      />
      <p className="text-xs text-gray-500 mt-1">{t('yieldPred.areaHint', { free: freeAcres(farm, records).toFixed(2) })}</p>
    </div>
  ),
};

const money = (n) => `₹${(n ?? 0).toLocaleString('en-IN')}`;

const renderRecord = (record, t) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex items-center gap-2 mb-1">
      <FaSeedling className="text-green-600" size={22} />
      <h3 className="font-bold text-gray-800 text-lg">{t(`crop.cropNames.${record.cropName}`, record.cropName)}</h3>
    </div>
    {record.areaAcres != null && (
      <p className="text-sm text-gray-500 mb-4">{t('yieldPred.areaUsed', { area: record.areaAcres })}</p>
    )}

    <div className="bg-green-50 rounded-xl p-5 mb-4 text-center">
      <p className="text-xs text-gray-500 mb-1">{t('yieldPred.expectedYieldLabel')}</p>
      <p className="text-3xl font-bold text-green-700">
        {record.estimatedYieldLow}–{record.estimatedYieldHigh} {t('yieldPred.quintal')}
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      <div className="bg-blue-50 rounded-lg p-4 text-center">
        <p className="text-xs text-gray-500">{t('yieldPred.incomeLabel')}</p>
        <p className="font-bold text-blue-700">{money(record.estimatedIncome)}</p>
      </div>
      <div className="bg-orange-50 rounded-lg p-4 text-center">
        <p className="text-xs text-gray-500">{t('yieldPred.expenseLabel')}</p>
        <p className="font-bold text-orange-700">{money(record.estimatedExpense)}</p>
      </div>
      <div className="bg-green-50 rounded-lg p-4 text-center">
        <p className="text-xs text-gray-500">{t('yieldPred.profitLabel')}</p>
        <p className={`font-bold ${record.estimatedProfit < 0 ? 'text-red-600' : 'text-green-700'}`}>{money(record.estimatedProfit)}</p>
      </div>
    </div>

    {record.profitPerAcre != null && (
      <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
        <FaRupeeSign size={11} /> {t('yieldPred.perAcreProfit')}: <span className="font-semibold">{money(record.profitPerAcre)}</span>
      </p>
    )}

    <div className="text-xs text-gray-500 space-y-1">
      {record.pricePerQuintal != null && (
        <p>
          {record.priceSource === 'live'
            ? t('yieldPred.priceBasisLive', { price: record.pricePerQuintal.toLocaleString('en-IN'), count: record.priceMarketCount })
            : t('yieldPred.priceBasisEstimate', { price: record.pricePerQuintal.toLocaleString('en-IN') })}
        </p>
      )}
      {record.costPerAcre != null && <p>{t('yieldPred.costBasis', { cost: record.costPerAcre.toLocaleString('en-IN') })}</p>}
    </div>
  </div>
);

function YieldPrediction() {
  return <MultiCropStep endpoint="/yield" i18nKey="yieldPred" renderRecord={renderRecord} extra={extra} />;
}

export default YieldPrediction;