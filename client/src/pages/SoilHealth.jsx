import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import { useParams, useNavigate, Link } from 'react-router-dom';

const questionKeys = ['soilColor', 'soilTexture', 'moisture', 'drainage', 'pastCropGrowth', 'organicMatter'];

const optionValues = {
  soilColor: ['dark_black', 'brown', 'reddish', 'grayish_white'],
  soilTexture: ['sandy', 'clayey', 'loamy'],
  moisture: ['dry_cracked', 'slightly_moist', 'waterlogged'],
  drainage: ['fast', 'moderate', 'slow'],
  pastCropGrowth: ['good', 'average', 'poor'],
  organicMatter: ['lots', 'some', 'very_little'],
};

function SoilHealth() {
  const { t } = useTranslation();
  const { farmId } = useParams();
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/soil?farmId=${farmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setHistory(res.data.reports);
    } catch (err) {
      console.error('Failed to fetch history', err);
    }
  };

  const handleSelect = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Object.keys(formData).length < questionKeys.length) {
      setError(t('soilHealth.fillAllError'));
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/soil', { ...formData, farmId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setResult(res.data.report);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    Excellent: 'bg-green-100 text-green-800',
    Good: 'bg-blue-100 text-blue-800',
    Average: 'bg-yellow-100 text-yellow-800',
    Poor: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{t('soilHealth.title')}</h1>
        <p className="text-gray-500 mb-6">{t('soilHealth.subtitle')}</p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4 max-w-2xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-2xl space-y-6">
          {questionKeys.map((key) => (
            <div key={key}>
              <p className="font-medium text-gray-700 mb-2">{t(`soilHealth.q.${key}.label`)}</p>
              <div className="flex flex-wrap gap-2">
                {optionValues[key].map((val) => (
                  <button
                    type="button"
                    key={val}
                    onClick={() => handleSelect(key, val)}
                    className={`px-4 py-2 rounded-lg text-sm border transition ${
                      formData[key] === val
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {t(`soilHealth.q.${key}.${val}`)}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? t('soilHealth.analyzing') : t('soilHealth.getReport')}
          </button>
        </form>

        {result && (
          <div className="bg-white rounded-xl shadow p-6 max-w-2xl mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{t('soilHealth.yourReport')}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[result.healthStatus]}`}>
                {result.healthStatus}
              </span>
            </div>
            <p className="text-4xl font-bold text-green-700 mb-4">{result.healthScore}/100</p>
            <h3 className="font-semibold text-gray-700 mb-2">{t('soilHealth.suggestions')}:</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {result.suggestions.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
        )}

        {history.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 max-w-2xl mt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">{t('soilHealth.pastReports')}</h2>
            <div className="space-y-3">
              {history.map((h) => (
                <div key={h._id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </p>
                    <p className="font-medium text-gray-700">{h.healthStatus}</p>
                  </div>
                  <span className="text-lg font-bold text-green-700">{h.healthScore}/100</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SoilHealth;