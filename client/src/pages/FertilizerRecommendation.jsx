import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaFlask, FaCheckCircle, FaLeaf, FaRupeeSign, FaCalendarCheck } from 'react-icons/fa';

function FertilizerRecommendation() {
  const { t } = useTranslation();
  const { farmId } = useParams();
  const navigate = useNavigate();

  const [farm, setFarm] = useState(null);
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
      const farmData = farmRes.data.farm;
      setFarm(farmData);

      const isDone = farmData.completedSteps.includes(7);
      setAlreadyCompleted(isDone);

      if (isDone) {
        const res = await api.get(`/fertilizer?farmId=${farmId}`, {
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
        '/fertilizer',
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaFlask className="text-green-600" size={22} />
          <h3 className="font-bold text-gray-800 text-lg">
            {t(`crop.cropNames.${record.cropName}`, record.cropName)}
          </h3>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          record.leansOrganic ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {record.leansOrganic ? t('fertilizer.organicLean') : t('fertilizer.balancedLean')}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400">{t('fertilizer.urea')}</p>
          <p className="font-bold text-gray-800">{record.ureaKg} kg</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400">{t('fertilizer.dap')}</p>
          <p className="font-bold text-gray-800">{record.dapKg} kg</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400">{t('fertilizer.mop')}</p>
          <p className="font-bold text-gray-800">{record.mopKg} kg</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400">{t('fertilizer.compost')}</p>
          <p className="font-bold text-gray-800">{record.compostKg} kg</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-yellow-50 rounded-lg p-3 mb-5">
        <FaRupeeSign className="text-yellow-600" size={16} />
        <p className="text-sm text-gray-700">
          {t('fertilizer.estimatedCost')}: <span className="font-bold">₹{record.estimatedCost}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold text-sm">
            <FaLeaf /> {t('fertilizer.organicOption')}
          </div>
          <p className="text-sm text-gray-600">{t(`fertilizer.${record.organicKey}`)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold text-sm">
            <FaFlask /> {t('fertilizer.chemicalOption')}
          </div>
          <p className="text-sm text-gray-600">{t(`fertilizer.${record.chemicalKey}`)}</p>
        </div>
      </div>

      <div className="bg-purple-50 rounded-xl p-4 flex items-start gap-2 mb-4">
        <FaCalendarCheck className="text-purple-600 mt-0.5 shrink-0" size={16} />
        <p className="text-sm text-gray-600">{t('fertilizer.applicationGuide')}</p>
      </div>

      <div className="bg-teal-50 rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold text-teal-700 mb-1">{t('fertilizer.micronutrientsTitle')}</p>
        <p className="text-sm text-gray-600">{t(`fertilizer.${record.microKey}`)}</p>
      </div>

      {record.diseaseNoteKey && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <p className="text-sm font-semibold text-orange-700 mb-1">{t('fertilizer.diseaseAwareTitle')}</p>
          <p className="text-sm text-gray-600">{t(`fertilizer.${record.diseaseNoteKey}`)}</p>
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4">{t('fertilizer.disclaimer')}</p>
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
            <h1 className="text-xl font-bold text-gray-800">{t('fertilizer.title')}</h1>
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
          <h1 className="text-xl font-bold text-gray-800 mb-4">{t('fertilizer.title')}</h1>
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

        <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{t('fertilizer.title')}</h1>
        <p className="text-gray-500 mb-6">{t('fertilizer.subtitle')}</p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>
        )}

        {farm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <p className="text-sm text-gray-500 mb-1">{t('fertilizer.forFarm')}</p>
            <p className="font-semibold text-gray-800">
              {farm.name} • {farm.sizeInAcres || 1} {t('farms.acres')}
            </p>
            {farm.selectedCrops && farm.selectedCrops.length > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                {t('fertilizer.forCrop')}: <span className="font-medium text-gray-700">{t(`crop.cropNames.${farm.selectedCrops[0]}`, farm.selectedCrops[0])}</span>
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? t('fertilizer.generating') : t('fertilizer.generateButton')}
        </button>
      </div>
    </div>
  );
}

export default FertilizerRecommendation;