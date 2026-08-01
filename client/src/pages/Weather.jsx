import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { FaSun, FaCloudRain, FaCloud, FaWind, FaTint } from 'react-icons/fa';

function Weather() {
  const { t } = useTranslation();
  const { farmId } = useParams();
  const [farm, setFarm] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFarmAndWeather();
  }, [farmId]);

  const loadFarmAndWeather = async () => {
    setLoading(true);
    setError('');
    try {
      const farmRes = await api.get(`/farms/${farmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const farmData = farmRes.data.farm;
      setFarm(farmData);

      const weatherRes = await api.get(`/weather?city=${encodeURIComponent(farmData.location)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setWeather(weatherRes.data.weather);
    } catch (err) {
      setError(err.response?.data?.message || t('weather.error'));
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (condition) => {
    if (condition === 'Rain' || condition === 'Drizzle') return <FaCloudRain className="text-blue-500" size={48} />;
    if (condition === 'Clouds') return <FaCloud className="text-gray-400" size={48} />;
    return <FaSun className="text-yellow-500" size={48} />;
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">
          ← {t('farmDetail.backToFarms')}
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{t('weather.title')}</h1>
        <p className="text-gray-500 mb-6">
          {farm ? `${t('weather.subtitle')} — ${farm.name} (${farm.location})` : t('weather.subtitle')}
        </p>

        {loading && <p className="text-gray-500">{t('weather.loading')}</p>}

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4 max-w-md">
            {error}
          </div>
        )}

        {weather && (
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{weather.city}</h2>
                <p className="text-gray-500 capitalize">{weather.description}</p>
              </div>
              {getIcon(weather.condition)}
            </div>

            <p className="text-5xl font-bold text-gray-800 mb-6">{weather.temperature}°C</p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <FaTint className="text-blue-400" />
                <span>{t('weather.humidity')}: {weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaWind className="text-gray-400" />
                <span>{t('weather.wind')}: {weather.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Weather;