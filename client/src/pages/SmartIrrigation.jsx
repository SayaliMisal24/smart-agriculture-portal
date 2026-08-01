import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { FaTint, FaCalendarCheck } from 'react-icons/fa';

function SmartIrrigation() {
  const { t } = useTranslation();
  const { farmId } = useParams();
  const [farm, setFarm] = useState(null);
  const [advice, setAdvice] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadIrrigationAdvice();
  }, [farmId]);

  const loadIrrigationAdvice = async () => {
    setLoading(true);
    setError('');
    try {
      const farmRes = await api.get(`/farms/${farmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const farmData = farmRes.data.farm;
      setFarm(farmData);

      const res = await api.get(
        `/irrigation?city=${encodeURIComponent(farmData.location)}&farmId=${farmId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setAdvice(res.data);
    } catch (err) {
      setError(err.response?.data?.message || t('irrigation.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">
          ← {t('farmDetail.backToFarms')}
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{t('irrigation.title')}</h1>
        <p className="text-gray-500 mb-6">
          {farm ? `${t('irrigation.subtitle')} — ${farm.name} (${farm.location})` : t('irrigation.subtitle')}
        </p>

        {loading && <p className="text-gray-500">{t('irrigation.loading')}</p>}

        {error && (
          <div className="bg-yellow-100 text-yellow-800 text-sm p-4 rounded-lg mb-4 max-w-md">
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

        {advice && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg">
            <FaTint className="text-blue-500 mb-4" size={36} />
            <p className="text-lg font-semibold text-gray-800 mb-4">{advice.recommendation}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">{t('irrigation.waterAmount')}</p>
                <p className="font-bold text-blue-700">{advice.waterAmount}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">{t('irrigation.nextIrrigation')}</p>
                <p className="font-bold text-green-700 flex items-center gap-1">
                  <FaCalendarCheck size={14} /> {advice.nextIrrigationDays} {t('irrigation.days')}
                </p>
              </div>
            </div>

            <div className="border-t pt-4 text-sm text-gray-500">
              <p>{t('irrigation.currentConditions')}: {advice.currentWeather.condition}, {advice.currentWeather.temperature}°C</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SmartIrrigation;