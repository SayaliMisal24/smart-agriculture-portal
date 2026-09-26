import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaStore, FaCheckCircle, FaMapMarkerAlt, FaTrophy } from 'react-icons/fa';

function MarketFinder() {
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
      const isDone = farmRes.data.farm.completedSteps.includes(9);
      setAlreadyCompleted(isDone);
      if (isDone) {
        const res = await api.get(`/market-finder?farmId=${farmId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
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
      const res = await api.post('/market-finder', { farmId }, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setResult(res.data.record);
    } catch (err) {
      setError(err.response?.data?.message || t('irrigation.error'));
    } finally {
      setLoading(false);
    }
  };

  const renderResultCard = (record) => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FaStore className="text-green-600" size={22} />
        <h3 className="font-bold text-gray-800 text-lg">{t(`crop.cropNames.${record.cropName}`, record.cropName)}</h3>
      </div>

      {record.markets.length === 0 ? (
        <p className="text-gray-500 text-sm">{t('marketFinder.noMarkets')}</p>
      ) : (
        <div className="space-y-3">
          {record.markets.map((m, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl ${i === 0 ? 'bg-yellow-50 border border-yellow-300' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                {i === 0 && <FaTrophy className="text-yellow-500" size={18} />}
                <div>
                  <p className="font-semibold text-gray-800">{m.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1"><FaMapMarkerAlt size={10} /> {m.distance}</p>
                </div>
              </div>
              <p className="font-bold text-green-700">₹{m.price}</p>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-4">{t('marketFinder.disclaimer')}</p>
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
            <h1 className="text-xl font-bold text-gray-800">{t('marketFinder.title')}</h1>
          </div>
          {renderResultCard(existingRecord)}
          <button onClick={() => navigate(`/dashboard/farms/${farmId}`)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium mt-6">{t('wizard.continueToNext')}</button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">{t('marketFinder.title')}</h1>
          {renderResultCard(result)}
          <button onClick={() => navigate(`/dashboard/farms/${farmId}`)} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium mt-6">{t('wizard.continueToNext')}</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">← {t('farmDetail.backToFarms')}</Link>
        <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{t('marketFinder.title')}</h1>
        <p className="text-gray-500 mb-6">{t('marketFinder.subtitle')}</p>
        {error && <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>}
        <button onClick={handleGenerate} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50">
          {loading ? t('marketFinder.loading') : t('marketFinder.generateButton')}
        </button>
      </div>
    </div>
  );
}

export default MarketFinder;