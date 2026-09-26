import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaChartLine, FaCheckCircle, FaRupeeSign, FaSeedling } from 'react-icons/fa';

function YieldPrediction() {
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
      const farmRes = await api.get(`/farms/${farmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const isDone = farmRes.data.farm.completedSteps.includes(8);
      setAlreadyCompleted(isDone);

      if (isDone) {
        const res = await api.get(`/yield?farmId=${farmId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setExistingRecord(res.data.record);
      }
    } catch (err) {
      console.error('Failed to check farm status', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await api.post(
        '/yield',
        { farmId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
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
        <FaSeedling className="text-green-600" size={22} />
        <h3 className="font-bold text-gray-800 text-lg">
          {t(`crop.cropNames.${record.cropName}`, record.cropName)}
        </h3>
      </div>

      <div className="bg-green-50 rounded-xl p-5 mb-4 text-center">
        <p className="text-xs text-gray-500 mb-1">{t('yieldPred.expectedYieldLabel')}</p>
        <p className="text-3xl font-bold text-green-700">
          {record.estimatedYieldLow}–{record.estimatedYieldHigh} {record.yieldUnit}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500">{t('yieldPred.incomeLabel')}</p>
          <p className="font-bold text-blue-700 flex items-center justify-center gap-1">
            <FaRupeeSign size={12} />{record.estimatedIncome.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500">{t('yieldPred.expenseLabel')}</p>
          <p className="font-bold text-orange-700 flex items-center justify-center gap-1">
            <FaRupeeSign size={12} />{record.estimatedExpense.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-xs text-gray-500">{t('yieldPred.profitLabel')}</p>
          <p className="font-bold text-green-700 flex items-center justify-center gap-1">
            <FaRupeeSign size={12} />{record.estimatedProfit.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400">{t('yieldPred.disclaimer')}</p>
    </div>
  );

  if (checkingStatus) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <p className="text-gray-500">{t('wizard.loadingStatus')}</p>
        </div>
      </div>
    );
  }

  if (alreadyCompleted && existingRecord) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">
            ← {t('farmDetail.backToFarms')}
          </Link>
          <div className="flex items-center gap-2 mt-4 mb-4">
            <FaCheckCircle className="text-green-600" size={20} />
            <h1 className="text-xl font-bold text-gray-800">{t('yieldPred.title')}</h1>
          </div>
          {renderResultCard(existingRecord)}
          <button
            onClick={() => navigate(`/dashboard/farms/${farmId}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium mt-6"
          >
            {t('wizard.continueToNext')}
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">{t('yieldPred.title')}</h1>
          {renderResultCard(result)}
          <button
            onClick={() => navigate(`/dashboard/farms/${farmId}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium mt-6"
          >
            {t('wizard.continueToNext')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">
          ← {t('farmDetail.backToFarms')}
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{t('yieldPred.title')}</h1>
        <p className="text-gray-500 mb-6">{t('yieldPred.subtitle')}</p>

        {error && <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          <FaChartLine /> {loading ? t('yieldPred.generating') : t('yieldPred.generateButton')}
        </button>
      </div>
    </div>
  );
}

export default YieldPrediction;