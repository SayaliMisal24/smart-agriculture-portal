import MultiCropStep from '../components/MultiCropStep';
import { FaChartLine, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

const trendIcon = {
  up: <FaArrowUp className="text-green-600" />,
  down: <FaArrowDown className="text-red-600" />,
  stable: <FaMinus className="text-gray-400" />,
};

const Bars = ({ items, labelOf, colour }) => {
  const max = Math.max(...items.map((i) => i.price), 1);
  return (
    <div className="flex items-end gap-2">
      {items.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center min-w-0">
          <p className="text-[10px] font-semibold text-gray-700 mb-1">₹{item.price}</p>
          <div className={`w-full rounded-t-lg ${colour}`} style={{ height: `${Math.max(12, (item.price / max) * 110)}px` }}></div>
          <p className="text-[10px] text-gray-500 mt-1 truncate w-full text-center">{labelOf(item, i)}</p>
        </div>
      ))}
    </div>
  );
};

const renderRecord = (record, t) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex items-center gap-2 mb-1">
      <FaChartLine className="text-green-600" size={22} />
      <h3 className="font-bold text-gray-800 text-lg">{t(`crop.cropNames.${record.cropName}`, record.cropName)}</h3>
    </div>

    {record.noLiveData ? (
      <p className="text-sm text-gray-500 mt-3">{t('pricePred.noLiveData')}</p>
    ) : (
      <>
        {record.priceDate && <p className="text-xs text-gray-500 mb-4">{t('pricePred.priceDate', { date: record.priceDate })}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">{t('pricePred.stateMedian')}</p>
            <p className="font-bold text-blue-700">₹{record.statePrice}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">{t('pricePred.highestMarket')}</p>
            <p className="font-bold text-green-700">₹{record.highest?.price}</p>
            <p className="text-[10px] text-gray-400 truncate">{record.highest?.name}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">{t('pricePred.lowestMarket')}</p>
            <p className="font-bold text-orange-700">₹{record.lowest?.price}</p>
            <p className="text-[10px] text-gray-400 truncate">{record.lowest?.name}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-500">{t('pricePred.marketsReporting')}</p>
            <p className="font-bold text-gray-800">{record.marketCount}</p>
          </div>
        </div>

        {record.nearest && (
          <p className="text-sm text-gray-700 mb-5">
            {t('pricePred.nearestMarket')}: <span className="font-semibold">{record.nearest.name}</span> ({record.nearest.district}) —{' '}
            <span className="font-bold text-green-700">₹{record.nearest.price}</span>
            {record.nearest.distanceKm != null ? ` • ${t('marketFinder.distanceAway', { km: record.nearest.distanceKm })}` : ''}
          </p>
        )}

        {record.marketPrices?.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">{t('pricePred.marketComparisonTitle')}</p>
            <Bars items={record.marketPrices} labelOf={(m) => m.name} colour="bg-green-500" />
          </div>
        )}

        {record.trend ? (
          <div className="mb-5">
            <p className="text-sm font-semibold text-gray-700 mb-3">{t('pricePred.trendTitle')}</p>
            <Bars
              items={[{ price: record.statePrice }, ...(record.projectedPrices || [])]}
              labelOf={(p, i) => (i === 0 ? t('pricePred.now') : t('pricePred.week', { number: p.week }))}
              colour="bg-blue-500"
            />
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 mt-4">
              {trendIcon[record.trend]}
              <p className="text-sm font-medium text-gray-700">
                {t(`pricePred.trend.${record.trend}`)} — {t('pricePred.weeklyChange', { pct: record.weeklyChangePercent, days: record.historyDays })}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-3 mb-5">
            <p className="text-xs text-gray-600">{t('pricePred.historyBuilding', { days: record.historyDays ?? 0, needed: 5 })}</p>
          </div>
        )}

        {record.adviceKey && (
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-sm font-semibold text-blue-700 mb-1">{t('pricePred.bestTimeTitle')}</p>
            <p className="text-sm text-gray-600">{t(`pricePred.${record.adviceKey}`)}</p>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">{t('pricePred.source')}</p>
      </>
    )}
  </div>
);

function MarketPricePrediction() {
  return <MultiCropStep endpoint="/price-prediction" i18nKey="pricePred" renderRecord={renderRecord} isFinal />;
}

export default MarketPricePrediction;