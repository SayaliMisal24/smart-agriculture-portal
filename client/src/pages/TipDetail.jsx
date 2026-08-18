import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { getTipKeyFromWeather } from '../utils/tipHelper';
import { FaLightbulb, FaMapMarkerAlt } from 'react-icons/fa';

function TipDetail() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = () => {
    if (!navigator.geolocation) {
      fetchByCity('Nagpur');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => fetchByCoords(position.coords.latitude, position.coords.longitude),
      () => fetchByCity('Nagpur')
    );
  };

  const fetchByCoords = async (lat, lon) => {
    try {
      const res = await api.get(`/weather/public?lat=${lat}&lon=${lon}`);
      setWeather(res.data.weather);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCity = async (city) => {
    try {
      const res = await api.get(`/weather/public?city=${city}`);
      setWeather(res.data.weather);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const todaysTipKey = getTipKeyFromWeather(weather);

  return (
    <div>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/" className="text-sm text-green-700 hover:underline">← {t('nav.home')}</Link>

        <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-6">{t('tipDetail.title')}</h1>

        {loading ? (
          <p className="text-gray-500 mb-6">{t('weather.loading')}</p>
        ) : (
          <>
            {weather && (
              <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                <FaMapMarkerAlt size={12} /> {weather.city} — {weather.temperature}°C, {weather.description}
              </p>
            )}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 mb-8">
              <FaLightbulb className="text-yellow-500 mb-4" size={36} />
              <p className="text-xs text-gray-500 mb-2">{t('tipDetail.liveTip')}</p>
              <p className="text-base text-gray-800 leading-relaxed">{t(`home.tips.${todaysTipKey}Long`)}</p>
            </div>
          </>
        )}

        {!token && (
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-3">{t('tipDetail.ctaText')}</p>
            <Link to="/signup" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">
              {t('home.getStarted')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default TipDetail;