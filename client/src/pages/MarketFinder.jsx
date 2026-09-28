import MultiCropStep from '../components/MultiCropStep';
import { FaStore, FaMapMarkerAlt, FaTrophy, FaLocationArrow } from 'react-icons/fa';

const getPosition = () =>
  new Promise((resolve, reject) => {
    const fail = () => {
      const err = new Error('gps');
      err.i18nKey = 'marketFinder.gpsDenied';
      reject(err);
    };
    if (!navigator.geolocation) return fail();
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lon: p.coords.longitude }),
      fail,
      { timeout: 10000 }
    );
  });

const extra = {
  initial: () => ({ useGps: false }),
  payload: async (value) => (value?.useGps ? await getPosition() : {}),
  render: ({ value, setValue, t }) => (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
      <input
        type="checkbox"
        checked={!!value?.useGps}
        onChange={(e) => setValue({ useGps: e.target.checked })}
      />
      <FaLocationArrow size={12} className="text-green-600" /> {t('marketFinder.useGps')}
    </label>
  ),
};

const renderRecord = (record, t) => {
  const markets = record.markets || [];
  const bestIndex = markets.length ? markets.reduce((best, m, i) => (m.price > markets[best].price ? i : best), 0) : -1;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-1">
        <FaStore className="text-green-600" size={22} />
        <h3 className="font-bold text-gray-800 text-lg">{t(`crop.cropNames.${record.cropName}`, record.cropName)}</h3>
      </div>

      {record.noLiveData || markets.length === 0 ? (
        <p className="text-sm text-gray-500 mt-3">{t('marketFinder.noMarkets')}</p>
      ) : (
        <>
          <p className="text-xs text-gray-500 mb-4">
            {record.originSource === 'gps'
              ? t('marketFinder.originGps')
              : t('marketFinder.originFarm', { place: record.farmLocation })}
            {record.priceDate ? ` • ${t('marketFinder.priceDate', { date: record.priceDate })}` : ''}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-500">{t('marketFinder.statePriceLabel')}</p>
              <p className="font-bold text-blue-700">₹{record.statePrice}</p>
              <p className="text-xs text-gray-400">{t('marketFinder.marketsReporting', { count: record.marketCount })}</p>
            </div>
            {record.highest && (
              <div className="bg-yellow-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-500">{t('marketFinder.highestLabel')}</p>
                <p className="font-bold text-yellow-700">₹{record.highest.price}</p>
                <p className="text-xs text-gray-400">{record.highest.name}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {markets.map((m, i) => (
              <div key={i} className={`p-4 rounded-xl ${i === bestIndex ? 'bg-yellow-50 border border-yellow-300' : 'bg-gray-50'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {i === bestIndex && <FaTrophy className="text-yellow-500 mt-1" size={16} />}
                    <div>
                      <p className="font-semibold text-gray-800">{m.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt size={10} /> {m.district}
                        {m.distanceKm != null ? ` • ${t('marketFinder.distanceAway', { km: m.distanceKm })}` : ''}
                      </p>
                      {i === bestIndex && <p className="text-xs text-yellow-700 font-medium mt-1">{t('marketFinder.bestPrice')}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-700">₹{m.price}</p>
                    <p className="text-xs text-gray-400">{t('marketFinder.priceRange', { min: m.minPrice, max: m.maxPrice })}</p>
                  </div>
                </div>
                {m.mapsUrl && (
                  <a href={m.mapsUrl} target="_blank" rel="noreferrer" className="inline-block text-xs text-green-700 underline mt-2">
                    {t('marketFinder.openMap')}
                  </a>
                )}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mt-4">
            {t('marketFinder.sourceNote')} • {t('marketFinder.districtNote')}
          </p>
        </>
      )}
    </div>
  );
};

function MarketFinder() {
  return <MultiCropStep endpoint="/market-finder" i18nKey="marketFinder" renderRecord={renderRecord} extra={extra} />;
}

export default MarketFinder;