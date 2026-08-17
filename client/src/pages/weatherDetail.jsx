import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { FaSun, FaCloudRain, FaCloud, FaTint } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
function WeatherDetail() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [current, setCurrent] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [cityName, setCityName] = useState('');
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
      const [currentRes, forecastRes] = await Promise.all([
        api.get(`/weather/public?lat=${lat}&lon=${lon}`),
        api.get(`/weather/public/forecast?lat=${lat}&lon=${lon}`),
      ]);
      setCurrent(currentRes.data.weather);
      setForecast(forecastRes.data.forecast);
      setCityName(forecastRes.data.city);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCity = async (city) => {
    try {
      const [currentRes, forecastRes] = await Promise.all([
        api.get(`/weather/public?city=${city}`),
        api.get(`/weather/public/forecast?city=${city}`),
      ]);
      setCurrent(currentRes.data.weather);
      setForecast(forecastRes.data.forecast);
      setCityName(forecastRes.data.city);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (condition, size = 28) => {
    if (condition === 'Rain' || condition === 'Drizzle') return <FaCloudRain className="text-blue-500" size={size} />;
    if (condition === 'Clouds') return <FaCloud className="text-gray-400" size={size} />;
    return <FaSun className="text-yellow-500" size={size} />;
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/" className="text-sm text-green-700 hover:underline">← {t('nav.home')}</Link>

        <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-6">{t('weatherDetail.title')}</h1>

        {loading && <p className="text-gray-500">{t('weather.loading')}</p>}

        {current && (
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-3xl p-8 shadow-xl mb-8">
            <p className="text-white/80 text-sm mb-1">{cityName}</p>
            <div className="flex items-center justify-between">
              <p className="text-6xl font-bold">{current.temperature}°C</p>
              {getIcon(current.condition, 64)}
            </div>
            <p className="capitalize text-white/90 mt-2">{current.description}</p>
          </div>
        )}

        {forecast.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-gray-800 mb-4">{t('weatherDetail.forecastTitle')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-8">
              {forecast.map((f, i) => (
                <div key={i} className="bg-white rounded-xl shadow p-4 text-center">
                  <p className="text-sm text-gray-500 mb-2">{new Date(f.date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</p>
                  <div className="flex justify-center mb-2">{getIcon(f.condition)}</div>
                  <p className="font-bold text-gray-800">{f.temperature}°C</p>
                  <p className="text-xs text-gray-400 capitalize mt-1">{f.description}</p>
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-1 mt-2">
                    <FaTint size={10} /> {f.humidity}%
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
{!token && (
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-3">{t('weatherDetail.ctaText')}</p>
            <Link to="/signup" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">
              {t('home.getStarted')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherDetail;