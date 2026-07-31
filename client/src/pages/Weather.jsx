import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { FaSun, FaCloudRain, FaCloud, FaWind, FaTint } from 'react-icons/fa';

function Weather() {
  const { t } = useTranslation();
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');

    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/weather?city=${encodeURIComponent(city)}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setWeather(res.data.weather);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not fetch weather data.');
      setWeather(null);
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
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Weather Based Farming</h1>
        <p className="text-gray-500 mb-6">Check live weather for your farm's location.</p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-6 max-w-md">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name (e.g. Nagpur)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </form>

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
                <span>Humidity: {weather.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <FaWind className="text-gray-400" />
                <span>Wind: {weather.windSpeed} m/s</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Weather;