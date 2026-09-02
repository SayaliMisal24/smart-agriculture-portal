import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaBug, FaCheckCircle, FaCamera, FaExclamationTriangle, FaLeaf, FaFlask } from 'react-icons/fa';

const symptomOptions = [
  'yellowing', 'spots', 'wilting', 'whiteCoating',
  'holes', 'stickyResidue', 'curledLeaves', 'stuntedGrowth',
];

function DiseaseDetection() {
  const { t } = useTranslation();
  const { farmId } = useParams();
  const navigate = useNavigate();

  const [farm, setFarm] = useState(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [existingRecord, setExistingRecord] = useState(null);

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkStatusAndLoad();
  }, [farmId]);

  const checkStatusAndLoad = async () => {
    setCheckingStatus(true);
    try {
      const farmRes = await api.get(`/farms/${farmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const farmData = farmRes.data.farm;
      setFarm(farmData);

      const isDone = farmData.completedSteps.includes(6);
      setAlreadyCompleted(isDone);

      if (isDone) {
        const res = await api.get(`/disease?farmId=${farmId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setExistingRecord(res.data.record);
      }
    } catch (err) {
      console.error('Failed to check farm status', err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const toggleSymptom = (key) => {
    setSelectedSymptoms((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  const handleSubmit = async (skipNoIssue = false) => {
    setError('');
    if (!skipNoIssue && selectedSymptoms.length === 0 && !photoFile) {
      setError(t('disease.selectSymptomsError'));
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('farmId', farmId);
      formData.append('skippedNoIssue', skipNoIssue);
      if (!skipNoIssue) {
        formData.append('symptoms', JSON.stringify(selectedSymptoms));
      }
      if (photoFile && !skipNoIssue) {
        formData.append('photo', photoFile);
      }

      const res = await api.post('/disease', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data.record);
    } catch (err) {
      setError(err.response?.data?.message || t('irrigation.error'));
    } finally {
      setLoading(false);
    }
  };

  const renderResultCard = (record) => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      {record.photoPath && (
        <img
          src={`http://localhost:5000${record.photoPath}`}
          alt="Crop"
          className="w-full max-h-64 object-cover rounded-xl mb-4"
        />
      )}

      {record.skippedNoIssue || !record.diseaseKey ? (
        <div className="flex items-center gap-3 text-green-700">
          <FaCheckCircle size={24} />
          <p className="font-semibold">{t('disease.noIssueResult')}</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FaBug className="text-red-500" size={20} />
              <h3 className="font-bold text-gray-800 text-lg">{t(`disease.diseases.${record.diseaseKey}.name`)}</h3>
            </div>
            <span className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
              {t('disease.estimatedLikelihood')}: {record.confidencePercent}%
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-4">{t(`disease.diseases.${record.diseaseKey}.symptomsText`)}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold text-sm">
                <FaLeaf /> {t('disease.organicTreatment')}
              </div>
              <p className="text-sm text-gray-600">{t(`disease.diseases.${record.diseaseKey}.organicTreatment`)}</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold text-sm">
                <FaFlask /> {t('disease.chemicalTreatment')}
              </div>
              <p className="text-sm text-gray-600">{t(`disease.diseases.${record.diseaseKey}.chemicalTreatment`)}</p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-2">
            <FaExclamationTriangle className="text-orange-500 mt-0.5 shrink-0" size={14} />
            <p className="text-xs text-gray-600">{t('disease.expertConsultNote')}</p>
          </div>
        </>
      )}

      <p className="text-xs text-gray-400 mt-4">{t('disease.transparencyNote')}</p>
    </div>
  );

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

  if (alreadyCompleted && existingRecord) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">
            ← {t('farmDetail.backToFarms')}
          </Link>
          <h1 className="text-xl font-bold text-gray-800 mt-4 mb-4">{t('disease.title')}</h1>
          {renderResultCard(existingRecord)}
          <button
            onClick={() => navigate(`/dashboard/farms/${farmId}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium mt-6"
          >
            {t('wizard.continueToNext')}
          </button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-4">{t('disease.title')}</h1>
          {renderResultCard(result)}
          <button
            onClick={() => navigate(`/dashboard/farms/${farmId}`)}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium mt-6"
          >
            {t('wizard.continueToNext')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <Link to={`/dashboard/farms/${farmId}`} className="text-sm text-green-700 hover:underline">
          ← {t('farmDetail.backToFarms')}
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{t('disease.title')}</h1>
        <p className="text-gray-500 mb-6">{t('disease.subtitle')}</p>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>
        )}

        <div className="bg-white rounded-xl shadow p-6 mb-4">
          <h3 className="font-semibold text-gray-700 mb-3">{t('disease.uploadPhoto')}</h3>
          <label className="border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center py-8 cursor-pointer hover:border-green-400">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="max-h-48 rounded-lg" />
            ) : (
              <>
                <FaCamera className="text-gray-400 mb-2" size={28} />
                <span className="text-sm text-gray-500">{t('disease.uploadHint')}</span>
              </>
            )}
            <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handlePhotoChange} />
          </label>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">{t('disease.symptomsTitle')}</h3>
          <div className="flex flex-wrap gap-2">
            {symptomOptions.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => toggleSymptom(key)}
                className={`px-4 py-2 rounded-lg text-sm border transition ${
                  selectedSymptoms.includes(key)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {t(`disease.symptoms.${key}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? t('disease.analyzing') : t('disease.submitButton')}
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {t('disease.noIssueButton')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiseaseDetection;