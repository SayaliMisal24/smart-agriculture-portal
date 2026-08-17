import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import {
  FaSun, FaCloudRain, FaCloud, FaWind, FaTint, FaMapMarkerAlt,
  FaTractor, FaArrowRight, FaCheckCircle
} from 'react-icons/fa';

function Weather() {
  const { t } = useTranslation();
  const { farmId } = useParams();
  const navigate = useNavigate();

  const [farm, setFarm] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [alreadyViewed, setAlreadyViewed] = useState(false);

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
      setAlreadyViewed(farmData.completedSteps.includes(3));

      const weatherRes = await api.get(
        `/weather?city=${encodeURIComponent(farmData.location)}&farmId=${farmId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setWeather(weatherRes.data.weather);
    } catch (err) {
      setError(t('weather.notFoundHint'));
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (condition, size = 64) => {
    if (condition === 'Rain' || condition === 'Drizzle') return <FaCloudRain className="text-blue-100" size={size} />;
    if (condition === 'Clouds') return <FaCloud className="text-gray-100" size={size} />;
    return <FaSun className="text-yellow-200" size={size} />;
  };

  const getGradient = (condition) => {
    if (condition === 'Rain' || condition === 'Drizzle') return 'from-blue-500 to-blue-700';
    if (condition === 'Clouds') return 'from-gray-400 to-gray-600';
    return 'from-orange-400 to-yellow-500';
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-3xl mx-auto p-6">
          <p className="text-gray-500">{t('weather.loading')}</p>
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
          <div className="flex items-center gap-2 mt-3 mb-4 text-gray-600">
            <FaTractor className="text-green-600" />
            <span className="font-medium">{farm.name}</span>
            <span className="text-gray-300">•</span>
            <FaMapMarkerAlt className="text-green-600" size={14} />
            <span>{farm.location}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {weather && (
          <>
            {/* Hero weather card */}
            <div className={`rounded-3xl p-8 text-white bg-gradient-to-br ${getGradient(weather.condition)} shadow-xl mb-6`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">{t('weather.title')}</p>
                  <h1 className="text-2xl font-bold mb-2">{weather.city}</h1>
                  <p className="text-6xl font-bold">{weather.temperature}°C</p>
                  <p className="capitalize text-white/90 mt-2">{weather.description}</p>
                </div>
                {getIcon(weather.condition)}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/20">
                <div className="flex items-center gap-2">
                  <FaTint className="text-white/80" />
                  <div>
                    <p className="text-xs text-white/70">{t('weather.humidity')}</p>
                    <p className="font-semibold">{weather.humidity}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaWind className="text-white/80" />
                  <div>
                    <p className="text-xs text-white/70">{t('weather.wind')}</p>
                    <p className="font-semibold">{weather.windSpeed} m/s</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Explanation + continue */}
            <div className="bg-white rounded-2xl shadow p-6">
              <div className="flex items-start gap-3 mb-4">
                {alreadyViewed ? (
                  <FaCheckCircle className="text-green-600 mt-1" size={20} />
                ) : (
                  <FaTint className="text-blue-500 mt-1" size={20} />
                )}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">{t('weather.nextStepTitle')}</h3>
                  <p className="text-sm text-gray-500">{t('weather.nextStepDesc')}</p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/dashboard/farms/${farmId}/irrigation`)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                {t('weather.goToIrrigation')} <FaArrowRight />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Weather;