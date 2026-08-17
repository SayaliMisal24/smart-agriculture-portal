import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaCalendarAlt, FaCheckCircle, FaTractor, FaMapMarkerAlt } from 'react-icons/fa';

const monthKeys = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december',
];

function CropCalendar() {
  const { t } = useTranslation();
  const { farmId } = useParams();
  const navigate = useNavigate();

  const [farm, setFarm] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [existingCalendar, setExistingCalendar] = useState(null);

  const [selectedCropForCalendar, setSelectedCropForCalendar] = useState('');
  const [sowingMonth, setSowingMonth] = useState('');
  const [calendar, setCalendar] = useState(null);
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

      const isDone = farmData.completedSteps.includes(5);
      setAlreadyCompleted(isDone);

      if (isDone) {
        const calRes = await api.get(`/calendar?farmId=${farmId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setExistingCalendar(calRes.data.calendar);
      }
    } catch (err) {
      console.error('Failed to check farm status', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCropForCalendar || !sowingMonth) {
      setError(t('calendar.selectBoth'));
      return;
    }

    setLoading(true);
    try {
      const res = await api.post(
        '/calendar',
        { farmId, selectedCrop: selectedCropForCalendar, sowingMonth },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setCalendar(res.data.calendar);
    } catch (err) {
      setError(err.response?.data?.message || t('irrigation.error'));
    } finally {
      setLoading(false);
    }
  };

  const renderCalendarCard = (cal) => (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-2 mb-1">
        <FaCalendarAlt className="text-green-600" />
        <h2 className="font-bold text-gray-800 text-lg">
          {t(`crop.cropNames.${cal.selectedCrop}`, cal.selectedCrop)}
        </h2>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        {t('calendar.sowingMonthLabel')}: {t(`calendar.months.${cal.sowingMonth.toLowerCase()}`, cal.sowingMonth)}
      </p>

      <div className="space-y-3">
        {cal.activities.map((a, i) => (
          <div key={i} className="flex gap-4 items-start border-l-2 border-green-200 pl-4 relative">
            <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-green-600"></div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {t(`calendar.months.${a.month.toLowerCase()}`, a.month)}
              </p>
              <p className="text-sm text-gray-500">{t(`calendar.activities.${a.activityKey}`)}</p>
            </div>
          </div>
        ))}
      </div>
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

  // Already completed - show read-only calendar
  if (alreadyCompleted && existingCalendar) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">
            ← {t('farmDetail.backToFarms')}
          </Link>

          <div className="flex items-center gap-2 mt-4 mb-4">
            <FaCheckCircle className="text-green-600" size={20} />
            <h1 className="text-xl font-bold text-gray-800">{t('calendar.title')}</h1>
          </div>

          {renderCalendarCard(existingCalendar)}

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

  // Just generated in this session
  if (calendar) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">{t('calendar.title')}</h1>
          {renderCalendarCard(calendar)}
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

  // Not done yet - show the setup form
  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">
          ← {t('farmDetail.backToFarms')}
        </Link>

        {farm && (
          <div className="flex items-center gap-2 mt-3 mb-6 text-gray-600">
            <FaTractor className="text-green-600" />
            <span className="font-medium">{farm.name}</span>
            <span className="text-gray-300">•</span>
            <FaMapMarkerAlt className="text-green-600" size={14} />
            <span>{farm.location}</span>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('calendar.title')}</h1>
        <p className="text-gray-500 mb-6">{t('calendar.subtitle')}</p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {(!farm?.selectedCrops || farm.selectedCrops.length === 0) ? (
          <div className="bg-yellow-100 text-yellow-800 text-sm p-4 rounded-lg">
            {t('calendar.noCropsYet')}{' '}
            <Link to={`/dashboard/farms/${farmId}/crop-recommendation`} className="underline font-medium">
              {t('crop.title')}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="bg-white rounded-xl shadow p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('calendar.chooseCrop')}</label>
              <div className="flex flex-wrap gap-2">
                {farm.selectedCrops.map((cropName) => (
                  <button
                    type="button"
                    key={cropName}
                    onClick={() => setSelectedCropForCalendar(cropName)}
                    className={`px-4 py-2 rounded-lg text-sm border transition ${
                      selectedCropForCalendar === cropName
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {t(`crop.cropNames.${cropName}`, cropName)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('calendar.chooseSowingMonth')}</label>
              <select
                value={sowingMonth}
                onChange={(e) => setSowingMonth(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">--</option>
                {monthKeys.map((m) => (
                  <option key={m} value={m.charAt(0).toUpperCase() + m.slice(1)}>
                    {t(`calendar.months.${m}`)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? t('calendar.generating') : t('calendar.generateButton')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default CropCalendar;