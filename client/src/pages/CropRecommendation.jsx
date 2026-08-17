import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaLeaf, FaCheckCircle, FaCheck } from 'react-icons/fa';

function CropRecommendation() {
  const { t } = useTranslation();
  const { farmId } = useParams();
  const navigate = useNavigate();

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [existingRecord, setExistingRecord] = useState(null);

  const [formData, setFormData] = useState({ season: '', soilType: '', waterAvailability: '' });
  const [crops, setCrops] = useState([]);
  const [selectedCrops, setSelectedCrops] = useState([]); // crops the farmer has checked
  const [confirmed, setConfirmed] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [latestSoilReport, setLatestSoilReport] = useState(null);

  useEffect(() => {
    checkStatusAndLoad();
  }, [farmId]);

  const checkStatusAndLoad = async () => {
    setCheckingStatus(true);
    try {
      const farmRes = await api.get(`/farms/${farmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const farm = farmRes.data.farm;
      const isDone = farm.completedSteps.includes(2);
      setAlreadyCompleted(isDone);

      if (isDone) {
        await loadExistingCropRecord();
      } else {
        const soilRes = await api.get(`/soil?farmId=${farmId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const reports = soilRes.data.reports;
        if (reports && reports.length > 0) {
          const latest = reports[0];
          setLatestSoilReport(latest);
          setFormData((prev) => ({ ...prev, soilType: latest.soilTexture }));
        }
      }
    } catch (err) {
      console.error('Failed to check farm status', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const loadExistingCropRecord = async () => {
    try {
      const res = await api.get(`/crop/latest?farmId=${farmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setExistingRecord(res.data.record);
    } catch (err) {
      console.error('Failed to load existing crop recommendation', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.season || !formData.soilType || !formData.waterAvailability) {
      setError('Please select all options.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/crop', { ...formData, farmId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCrops(res.data.record.recommendedCrops);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle a crop's checkbox on/off
  const toggleCropSelection = (cropName) => {
    setSelectedCrops((prev) =>
      prev.includes(cropName)
        ? prev.filter((c) => c !== cropName) // uncheck: remove it
        : [...prev, cropName] // check: add it
    );
  };

  const handleConfirmSelection = async () => {
    if (selectedCrops.length === 0) {
      setError(t('crop.selectAtLeastOne'));
      return;
    }
    setConfirming(true);
    setError('');
    try {
      await api.post('/crop/select', { cropNames: selectedCrops, farmId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setConfirmed(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong confirming your selection.');
    } finally {
      setConfirming(false);
    }
  };

  if (checkingStatus) {
    return (
      <div>
        <Navbar />
        <div className="max-w-3xl mx-auto p-6">
          <p className="text-gray-500">{t('wizard.loadingStatus')}</p>
        </div>
      </div>
    );
  }

  // Already completed before (in an earlier visit) - read only
  if (alreadyCompleted && existingRecord) {
    return (
      <div>
        <Navbar />
        <div className="max-w-3xl mx-auto p-6">
          <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">
            ← {t('farmDetail.backToFarms')}
          </Link>

          <div className="flex items-center gap-2 mt-4 mb-4">
            <FaCheckCircle className="text-green-600" size={20} />
            <h1 className="text-xl font-bold text-gray-800">{t('crop.recommended')}</h1>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">{t('crop.yourSelections')}:</h3>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('crop.season')}</p>
                <p className="font-medium text-gray-800">{t(`crop.seasons.${existingRecord.season}`)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('crop.soilType')}</p>
                <p className="font-medium text-gray-800">{t(`crop.soilTypes.${existingRecord.soilType}`)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('crop.water')}</p>
                <p className="font-medium text-gray-800">{t(`crop.waterLevels.${existingRecord.waterAvailability}`)}</p>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-700 mb-3">{t('crop.confirmedCrops')}:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {existingRecord.recommendedCrops
              .filter((c) => existingRecord.selectedCrops?.includes(c.name))
              .map((c, i) => (
                <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-5">
                  <FaCheckCircle className="text-green-600 mb-2" size={20} />
                  <h3 className="font-semibold text-gray-800">{t(`crop.cropNames.${c.name}`, c.name)}</h3>
                  <p className="text-sm text-gray-500 mt-2">{t('crop.expectedYield')}: {c.expectedYield}</p>
                  <p className="text-sm text-gray-500">{t('crop.duration')}: {c.duration}</p>
                  <p className="text-sm text-gray-500">{t('crop.waterNeed')}: {c.waterNeed}</p>
                </div>
              ))}
          </div>

          <button
            onClick={() => navigate(`/dashboard/farms/${farmId}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            {t('wizard.continueToNext')}
          </button>
        </div>
      </div>
    );
  }

  // Just confirmed right now in this session
  if (confirmed) {
    return (
      <div>
        <Navbar />
        <div className="max-w-3xl mx-auto p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaCheckCircle className="text-green-600" size={20} />
            <h1 className="text-xl font-bold text-gray-800">{t('crop.selectionConfirmed')}</h1>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {crops.filter((c) => selectedCrops.includes(c.name)).map((c, i) => (
              <div key={i} className="bg-green-50 border border-green-200 rounded-xl p-5">
                <FaCheckCircle className="text-green-600 mb-2" size={20} />
                <h3 className="font-semibold text-gray-800">{t(`crop.cropNames.${c.name}`, c.name)}</h3>
                <p className="text-sm text-gray-500 mt-2">{t('crop.expectedYield')}: {c.expectedYield}</p>
                <p className="text-sm text-gray-500">{t('crop.duration')}: {c.duration}</p>
                <p className="text-sm text-gray-500">{t('crop.waterNeed')}: {c.waterNeed}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate(`/dashboard/farms/${farmId}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            {t('wizard.continueToNext')}
          </button>
        </div>
      </div>
    );
  }

  // Crops generated, waiting for the farmer to check some and confirm
  if (crops.length > 0) {
    return (
      <div>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-2">{t('crop.recommended')}</h1>
          <p className="text-gray-500 mb-4">{t('crop.selectMultipleHint')}</p>

          {error && (
            <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {crops.map((c, i) => {
              const isChecked = selectedCrops.includes(c.name);
              return (
                <div
                  key={i}
                  onClick={() => toggleCropSelection(c.name)}
                  className={`rounded-xl p-5 cursor-pointer border-2 transition ${
                    isChecked ? 'border-green-600 bg-green-50' : 'border-gray-100 bg-white hover:border-green-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <FaLeaf className="text-green-600" size={20} />
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                      isChecked ? 'bg-green-600 border-green-600' : 'border-gray-300'
                    }`}>
                      {isChecked && <FaCheck className="text-white" size={12} />}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800">{t(`crop.cropNames.${c.name}`, c.name)}</h3>
                  <p className="text-sm text-gray-500 mt-2">{t('crop.expectedYield')}: {c.expectedYield}</p>
                  <p className="text-sm text-gray-500">{t('crop.duration')}: {c.duration}</p>
                  <p className="text-sm text-gray-500">{t('crop.waterNeed')}: {c.waterNeed}</p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleConfirmSelection}
              disabled={confirming || selectedCrops.length === 0}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {confirming
                ? t('crop.confirming')
                : `${t('crop.confirmSelection')} (${selectedCrops.length})`}
            </button>
            <p className="text-sm text-gray-500">{t('crop.lockWarning')}</p>
          </div>
        </div>
      </div>
    );
  }

  // Not started yet - show the season/soil/water form
  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">
          ← {t('farmDetail.backToFarms')}
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{t('crop.title')}</h1>
        <p className="text-gray-500 mb-6">{t('crop.subtitle')}</p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('crop.season')}</label>
              <select
                name="season"
                value={formData.season}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">--</option>
                <option value="kharif">{t('crop.seasons.kharif')}</option>
                <option value="rabi">{t('crop.seasons.rabi')}</option>
                <option value="zaid">{t('crop.seasons.zaid')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('crop.soilType')}</label>
              {latestSoilReport ? (
                <div className="w-full border border-green-300 bg-green-50 rounded-lg px-3 py-2 text-green-800 font-medium">
                  {t(`crop.soilTypes.${formData.soilType}`)}
                  <span className="text-xs block text-green-600">{t('crop.autoDetected')}</span>
                </div>
              ) : (
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">--</option>
                  <option value="sandy">{t('crop.soilTypes.sandy')}</option>
                  <option value="clayey">{t('crop.soilTypes.clayey')}</option>
                  <option value="loamy">{t('crop.soilTypes.loamy')}</option>
                  <option value="black">{t('crop.soilTypes.black')}</option>
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('crop.water')}</label>
              <select
                name="waterAvailability"
                value={formData.waterAvailability}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">--</option>
                <option value="low">{t('crop.waterLevels.low')}</option>
                <option value="moderate">{t('crop.waterLevels.moderate')}</option>
                <option value="high">{t('crop.waterLevels.high')}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? t('crop.loading') : t('crop.getRecommendation')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CropRecommendation;