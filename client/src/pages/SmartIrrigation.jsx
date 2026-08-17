import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaTint, FaCalendarCheck, FaCalendarPlus, FaHistory, FaTractor, FaMapMarkerAlt } from 'react-icons/fa';

function SmartIrrigation() {
  const { t } = useTranslation();
  const { farmId } = useParams();

  const [farm, setFarm] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [sowingDateInput, setSowingDateInput] = useState('');
  const [savingSowingDate, setSavingSowingDate] = useState(false);

  const [logDateInput, setLogDateInput] = useState('');
  const [loggingIrrigation, setLoggingIrrigation] = useState(false);

  useEffect(() => {
    loadEverything();
  }, [farmId]);

  const loadEverything = async () => {
    setLoading(true);
    setError('');
    try {
      const farmRes = await api.get(`/farms/${farmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const farmData = farmRes.data.farm;
      setFarm(farmData);

      // If a sowing date already exists, load advice + history right away
      if (farmData.sowingDate) {
        await loadAdviceAndHistory(farmData.location);
      }
    } catch (err) {
      setError(err.response?.data?.message || t('irrigation.error'));
    } finally {
      setLoading(false);
    }
  };

  const loadAdviceAndHistory = async (city) => {
    try {
      const adviceRes = await api.get(
        `/irrigation?city=${encodeURIComponent(city)}&farmId=${farmId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAdvice(adviceRes.data);

      const historyRes = await api.get(`/irrigation/history?farmId=${farmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setHistory(historyRes.data.logs);
    } catch (err) {
      setError(err.response?.data?.message || t('irrigation.error'));
    }
  };

  const handleSaveSowingDate = async (e) => {
    e.preventDefault();
    if (!sowingDateInput) return;

    setSavingSowingDate(true);
    setError('');
    try {
      const res = await api.post(
        '/irrigation/sowing-date',
        { farmId, sowingDate: sowingDateInput },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setFarm(res.data.farm);
      await loadAdviceAndHistory(res.data.farm.location);
    } catch (err) {
      setError(err.response?.data?.message || t('irrigation.error'));
    } finally {
      setSavingSowingDate(false);
    }
  };

  const handleLogIrrigation = async (e) => {
    e.preventDefault();
    if (!logDateInput) return;

    setLoggingIrrigation(true);
    setError('');
    try {
      await api.post(
        '/irrigation/log',
        { farmId, date: logDateInput },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setLogDateInput('');
      await loadAdviceAndHistory(farm.location);
    } catch (err) {
      setError(err.response?.data?.message || t('irrigation.error'));
    } finally {
      setLoggingIrrigation(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-3xl mx-auto p-6">
          <p className="text-gray-500">{t('irrigation.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
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

        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('irrigation.title')}</h1>

        {error && (
          <div className="bg-yellow-100 text-yellow-800 text-sm p-4 rounded-lg mb-4">
            {error}
            {error.toLowerCase().includes('soil') && (
              <>
                {' '}
                <Link to={`/dashboard/farms/${farmId}/soil-health`} className="underline font-medium">
                  {t('crop.goToSoilHealth')}
                </Link>
              </>
            )}
          </div>
        )}

        {/* CASE 1: No sowing date yet - ask for it */}
        {!farm?.sowingDate && (
          <form onSubmit={handleSaveSowingDate} className="bg-white rounded-xl shadow p-6 max-w-md">
            <div className="flex items-center gap-2 mb-3">
              <FaCalendarPlus className="text-green-600" size={20} />
              <h3 className="font-semibold text-gray-800">{t('irrigation.sowingDateTitle')}</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">{t('irrigation.sowingDateDesc')}</p>
            <input
              type="date"
              value={sowingDateInput}
              onChange={(e) => setSowingDateInput(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4"
              required
            />
            <button
              type="submit"
              disabled={savingSowingDate}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {savingSowingDate ? t('irrigation.saving') : t('irrigation.saveSowingDate')}
            </button>
          </form>
        )}

        {/* CASE 2: Sowing date exists - show advice + log form + history */}
        {farm?.sowingDate && advice && (
          <>
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <FaCalendarPlus className="text-green-600" />
                <span>{t('irrigation.sowingDateLabel')}: <span className="font-medium text-gray-700">{formatDate(farm.sowingDate)}</span></span>
              </div>
              <FaTint className="text-blue-500 mb-4" size={36} />
              <p className="text-lg font-semibold text-gray-800 mb-4">{t(`irrigation.codes.${advice.recommendationKey}`)}</p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">{t('irrigation.waterAmount')}</p>
                  <p className="font-bold text-blue-700">{t(`irrigation.waterAmounts.${advice.waterAmountKey}`)}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    {advice.waterAmountKey.includes('none')
                      ? t('irrigation.checkAgainDate')
                      : t('irrigation.nextIrrigationDate')}
                  </p>
                  <p className="font-bold text-green-700 flex items-center gap-1">
                    <FaCalendarCheck size={14} /> {formatDate(advice.nextIrrigationDate)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 text-sm text-gray-500">
                <p>{t('irrigation.currentConditions')}: {t(`weather.conditions.${advice.currentWeather.condition}`, advice.currentWeather.condition)}, {advice.currentWeather.temperature}°C</p>
                {advice.lastIrrigationDate && (
                  <p className="mt-1">{t('irrigation.lastIrrigated')}: {formatDate(advice.lastIrrigationDate)}</p>
                )}
              </div>
            </div>

            <form onSubmit={handleLogIrrigation} className="bg-white rounded-xl shadow p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">{t('irrigation.logTitle')}</h3>
              <div className="flex gap-3 items-end flex-wrap">
                <input
                  type="date"
                  value={logDateInput}
                  onChange={(e) => setLogDateInput(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
                <button
                  type="submit"
                  disabled={loggingIrrigation}
                  className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
                >
                  {loggingIrrigation ? t('irrigation.logging') : t('irrigation.logButton')}
                </button>
              </div>
            </form>

            {history.length > 0 && (
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaHistory className="text-gray-400" />
                  <h3 className="font-semibold text-gray-800">{t('irrigation.historyTitle')}</h3>
                </div>
                <ul className="space-y-2">
                  {history.map((log) => (
                    <li key={log._id} className="text-sm text-gray-600 flex items-center gap-2">
                      <FaCalendarCheck className="text-green-500" size={12} />
                      {formatDate(log.date)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SmartIrrigation;