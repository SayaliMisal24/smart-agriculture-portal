import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaChartLine, FaCheckCircle, FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';

function MarketPricePrediction() {
  const { t } = useTranslation();
  const { farmId } = useParams();
  const navigate = useNavigate();

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [existingRecord, setExistingRecord] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStatusAndLoad();
  }, [farmId]);

  const checkStatusAndLoad = async () => {
    setCheckingStatus(true);
    try {
      const farmRes = await api.get(`/farms/${farmId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      const isDone = farmRes.data.farm.completedSteps.includes(10);
      setAlreadyCompleted(isDone);
      if (isDone) {
        const res = await api.get(`/price-prediction?farmId=${farmId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
        setExistingRecord(res.data.record);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/price-prediction', { farmId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setResult(res.data.record);
    } catch (err) {
      setError(err.response?.data?.message || t('irrigation.error'));
    } finally {
      setLoading(false);
    }
  };

  const trendIcon = { up: <FaArrowUp className="text-green-600" />, down: <FaArrowDown className="text-red-600" />, stable: <FaMinus className="text-gray-400" /> };

  const renderResultCard = (record) => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FaChartLine className="text-green-600" size={22} />
        <h3 className="font-bold text-gray-800 text-lg">{t(`crop.cropNames.${record.cropName}`, record.cropName)}</h3>
      </div>

      <div className="flex items-end gap-6 mb-6">
        {[{ week: 0, price: record.currentPrice }, ...record.projectedPrices].map((p, i) => {
          const maxPrice = Math.max(record.currentPrice, ...record.projectedPrices.map((x) => x.price));
          const heightPercent = Math.max(20, (p.price / maxPrice) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-green-500 rounded-t-lg" style={{ height: `${heightPercent}px` }}></div>
              <p className="text-xs text-gray-500 mt-2">{p.week === 0 ? t('pricePred.now') : t('pricePred.week', { number: p.week })}</p>
              <p className="text-xs font-semibold text-gray-700">₹{p.price}</p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-3 mb-4">
        {trendIcon[record.trend]}
        <p className="text-sm font-medium text-gray-700">{t(`pricePred.trend.${record.trend}`)}</p>
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <p className="text-sm font-semibold text-blue-700 mb-1">{t('pricePred.bestTimeTitle')}</p>
        <p className="text-sm text-gray-600">{t(`pricePred.${record.adviceKey}`)}</p>
      </div>

      <p className="text-xs text-gray-400 mt-4">{t('pricePred.disclaimer')}</p>
    </div>
  );

  if (checkingStatus) {
    return <div><Navbar /><div className="max-w-2xl mx-auto p-6"><p className="text-gray-500">{t('wizard.loadingStatus')}</p></div></div>;
  }

  if (alreadyCompleted && existingRecord) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">← {t('farmDetail.backToFarms')}</Link>
          <div className="flex items-center gap-2 mt-4 mb-4">
            <FaCheckCircle className="text-green-600" size={20} />
            <h1 className="text-xl font-bold text-gray-800">{t('pricePred.title')}</h1>
          </div>
          {renderResultCard(existingRecord)}
          <p className="text-sm text-green-700 font-medium mt-6">{t('pricePred.wizardComplete')}</p>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">{t('pricePred.title')}</h1>
          {renderResultCard(result)}
          <Link to={`/dashboard/farms/${farmId}`} className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium mt-6">
            {t('farmDetail.backToFarms')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">← {t('farmDetail.backToFarms')}</Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{t('pricePred.title')}</h1>
        <p className="text-gray-500 mb-6">{t('pricePred.subtitle')}</p>
        {error && <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>}
        <button onClick={handleGenerate} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50">
          {loading ? t('pricePred.generating') : t('pricePred.generateButton')}
        </button>
      </div>
    </div>
  );
}

export default MarketPricePrediction;