import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { FaLeaf } from 'react-icons/fa';

function CropRecommendation() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ season: '', soilType: '', waterAvailability: '' });
  const [crops, setCrops] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [latestSoilReport, setLatestSoilReport] = useState(null);
  const [checkingSoil, setCheckingSoil] = useState(true);

  useEffect(() => {
    fetchLatestSoilReport();
  }, []);

  const fetchLatestSoilReport = async () => {
    try {
      const res = await api.get('/soil', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const reports = res.data.reports;
      if (reports && reports.length > 0) {
        const latest = reports[0];
        setLatestSoilReport(latest);
        setFormData((prev) => ({ ...prev, soilType: latest.soilTexture }));
      }
    } catch (err) {
      console.error('Failed to fetch soil report', err);
    } finally {
      setCheckingSoil(false);
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
      const res = await api.post('/crop', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCrops(res.data.record.recommendedCrops);
      localStorage.setItem('recommendedCrops', JSON.stringify(res.data.record.recommendedCrops));
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('crop.title')}</h1>
        <p className="text-gray-500 mb-6">{t('crop.subtitle')}</p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4 max-w-3xl">
            {error}
          </div>
        )}

        {!checkingSoil && !latestSoilReport && (
          <div className="bg-yellow-100 text-yellow-800 text-sm p-4 rounded-lg mb-4 max-w-3xl">
            {t('crop.noSoilReport')}{' '}
            <Link to="/dashboard/soil-health" className="underline font-medium">
              {t('crop.goToSoilHealth')}
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-3xl mb-6">
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

        {crops.length > 0 && (
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">{t('crop.recommended')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {crops.map((c, i) => (
                <Link
                  key={i}
                  to={`/dashboard/crop-recommendation/details/${i}`}
                  className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition block"
                >
                  <FaLeaf className="text-green-600 mb-2" size={22} />
                  <h3 className="font-semibold text-gray-800">{t(`crop.cropNames.${c.name}`, c.name)}</h3>
                  <p className="text-sm text-gray-500 mt-2">{t('crop.expectedYield')}: {c.expectedYield}</p>
                  <p className="text-sm text-gray-500">{t('crop.duration')}: {c.duration}</p>
                  <p className="text-sm text-gray-500">{t('crop.waterNeed')}: {c.waterNeed}</p>
                  <p className="text-xs text-green-600 mt-2 font-medium">{t('crop.viewDetails')} →</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default CropRecommendation;