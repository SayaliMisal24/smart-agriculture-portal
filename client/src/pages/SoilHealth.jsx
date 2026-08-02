import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaCheckCircle } from 'react-icons/fa';

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
  const navigate = useNavigate();

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [existingReport, setExistingReport] = useState(null);

  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStatusAndLoad();
  }, [farmId]);

  // First, check the farm's progress + fetch any existing report for this farm
  const checkStatusAndLoad = async () => {
    setCheckingStatus(true);
    try {
      const farmRes = await api.get(`/farms/${farmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const farm = farmRes.data.farm;
      const isDone = farm.completedSteps.includes(1);
      setAlreadyCompleted(isDone);

      if (isDone) {
        const reportRes = await api.get(`/soil?farmId=${farmId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const reports = reportRes.data.reports;
        if (reports && reports.length > 0) {
          setExistingReport(reports[0]); // most recent = the one that completed this step
        }
      }
    } catch (err) {
      console.error('Failed to check farm status', err);
    } finally {
      setCheckingStatus(false);
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

  // Still checking whether this step is already done — show a simple loading state
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

  // CASE 1: Step already completed before — show the saved report, no form at all
  if (alreadyCompleted && existingReport) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">
            ← {t('farmDetail.backToFarms')}
          </Link>

          <div className="bg-white rounded-xl shadow p-6 mt-4">
            <div className="flex items-center gap-2 mb-4">
              <FaCheckCircle className="text-green-600" size={20} />
              <h1 className="text-xl font-bold text-gray-800">{t('soilHealth.yourReport')}</h1>
              <span className={`ml-auto px-3 py-1 rounded-full text-sm font-semibold ${statusColor[existingReport.healthStatus]}`}>
                {existingReport.healthStatus}
              </span>
            </div>
            <p className="text-4xl font-bold text-green-700 mb-4">{existingReport.healthScore}/100</p>

            <h3 className="font-semibold text-gray-700 mb-2">{t('soilHealth.detailsSubmitted')}:</h3>
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('soilHealth.q.soilColor.label')}</p>
                <p className="font-medium text-gray-800">{t(`soilHealth.q.soilColor.${existingReport.soilColor}`)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('soilHealth.q.soilTexture.label')}</p>
                <p className="font-medium text-gray-800">{t(`soilHealth.q.soilTexture.${existingReport.soilTexture}`)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('soilHealth.q.moisture.label')}</p>
                <p className="font-medium text-gray-800">{t(`soilHealth.q.moisture.${existingReport.moisture}`)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('soilHealth.q.drainage.label')}</p>
                <p className="font-medium text-gray-800">{t(`soilHealth.q.drainage.${existingReport.drainage}`)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('soilHealth.q.pastCropGrowth.label')}</p>
                <p className="font-medium text-gray-800">{t(`soilHealth.q.pastCropGrowth.${existingReport.pastCropGrowth}`)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('soilHealth.q.organicMatter.label')}</p>
                <p className="font-medium text-gray-800">{t(`soilHealth.q.organicMatter.${existingReport.organicMatter}`)}</p>
              </div>
            </div>

            <h3 className="font-semibold text-gray-700 mb-2">{t('soilHealth.suggestions')}:</h3>
            <ul className="space-y-1 text-sm text-gray-600 mb-6">
              {existingReport.suggestions.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>

            <button
              onClick={() => navigate(`/dashboard/farms/${farmId}`)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              {t('wizard.continueToNext')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASE 2: Just submitted right now in this session — show result + continue button
  if (result) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{t('soilHealth.yourReport')}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[result.healthStatus]}`}>
                {result.healthStatus}
              </span>
            </div>
            <p className="text-4xl font-bold text-green-700 mb-4">{result.healthScore}/100</p>

            <h3 className="font-semibold text-gray-700 mb-2">{t('soilHealth.detailsSubmitted')}:</h3>
            <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('soilHealth.q.soilColor.label')}</p>
                <p className="font-medium text-gray-800">{t(`soilHealth.q.soilColor.${result.soilColor}`)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('soilHealth.q.soilTexture.label')}</p>
                <p className="font-medium text-gray-800">{t(`soilHealth.q.soilTexture.${result.soilTexture}`)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('soilHealth.q.moisture.label')}</p>
                <p className="font-medium text-gray-800">{t(`soilHealth.q.moisture.${result.moisture}`)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('soilHealth.q.drainage.label')}</p>
                <p className="font-medium text-gray-800">{t(`soilHealth.q.drainage.${result.drainage}`)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('soilHealth.q.pastCropGrowth.label')}</p>
                <p className="font-medium text-gray-800">{t(`soilHealth.q.pastCropGrowth.${result.pastCropGrowth}`)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs">{t('soilHealth.q.organicMatter.label')}</p>
                <p className="font-medium text-gray-800">{t(`soilHealth.q.organicMatter.${result.organicMatter}`)}</p>
              </div>
            </div>

            <h3 className="font-semibold text-gray-700 mb-2">{t('soilHealth.suggestions')}:</h3>
            <ul className="space-y-1 text-sm text-gray-600 mb-6">
              {result.suggestions.map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
            <button
              onClick={() => navigate(`/dashboard/farms/${farmId}`)}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
            >
              {t('wizard.continueToNext')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // CASE 3: Not completed yet — show the form
  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">
          ← {t('farmDetail.backToFarms')}
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{t('soilHealth.title')}</h1>
        <p className="text-gray-500 mb-6">{t('soilHealth.subtitle')}</p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 space-y-6">
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
      </div>
    </div>
  );
}

export default SoilHealth;