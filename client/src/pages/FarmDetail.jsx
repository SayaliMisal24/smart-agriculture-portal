import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaCheckCircle, FaLock, FaArrowRight, FaMapMarkerAlt, FaTractor } from 'react-icons/fa';

const STEP_ROUTES = {
  1: 'soil-health',
  2: 'crop-recommendation',
  3: 'weather',
  4: 'irrigation',
  5: 'calendar',
  6: 'disease-detection',
  7: 'fertilizer',
  8: 'pesticide',
  9: 'yield-prediction',
  10: 'market',
  11: 'market-price-prediction',
};

function FarmDetail() {
  const { t } = useTranslation();
  const { farmId } = useParams();
  const navigate = useNavigate();
  const [farm, setFarm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFarm();
  }, [farmId]);

  const fetchFarm = async () => {
    try {
      const res = await api.get(`/farms/${farmId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFarm(res.data.farm);
    } catch (err) {
      setError(t('farmDetail.notFound'));
    }
  };

  const stepNames = [
    t('wizard.step1'), t('wizard.step2'), t('wizard.step3'), t('wizard.step4'),
    t('wizard.step5'), t('wizard.step6'), t('wizard.step7'), t('wizard.step8'),
    t('wizard.step9'), t('wizard.step10'), t('wizard.step11'),
  ];

  const handleStepClick = (stepNum, status) => {
    if (status === 'locked') return;
    navigate(`/dashboard/farms/${farmId}/${STEP_ROUTES[stepNum]}`);
  };

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="max-w-3xl mx-auto p-6">
          <p className="text-red-600">{error}</p>
          <Link to="/dashboard/farms" className="text-green-700 underline">{t('farmDetail.backToFarms')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <Link to="/dashboard/farms" className="text-sm text-green-700 hover:underline">
          ← {t('farmDetail.backToFarms')}
        </Link>

        {farm && (
          <div className="flex items-center gap-3 mt-3 mb-8">
            <FaTractor className="text-green-600" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{farm.name}</h1>
              <p className="text-gray-500 flex items-center gap-1">
                <FaMapMarkerAlt size={12} /> {farm.location}
                {farm.sizeInAcres ? ` • ${farm.sizeInAcres} ${t('farms.acres')}` : ''}
              </p>
            </div>
          </div>
        )}

        {farm && (
          <div className="bg-white rounded-2xl shadow p-4">
            {stepNames.map((name, i) => {
              const stepNum = i + 1;
              const isCompleted = farm.completedSteps.includes(stepNum);
              const isCurrent = farm.currentStep === stepNum;
              const status = isCompleted ? 'completed' : isCurrent ? 'current' : 'locked';

              return (
                <div
                  key={stepNum}
                  onClick={() => handleStepClick(stepNum, status)}
                  className={`flex items-center justify-between p-4 rounded-xl mb-2 border transition ${
                    status === 'completed'
                      ? 'border-green-200 bg-green-50 cursor-pointer hover:bg-green-100'
                      : status === 'current'
                      ? 'border-green-600 bg-white cursor-pointer hover:shadow-md ring-2 ring-green-100'
                      : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold ${
                      status === 'completed' ? 'bg-green-600 text-white'
                      : status === 'current' ? 'bg-green-100 text-green-700 border-2 border-green-600'
                      : 'bg-gray-200 text-gray-400'
                    }`}>
                      {status === 'completed' ? <FaCheckCircle size={16} /> : stepNum}
                    </span>
                    <span className={`font-medium ${status === 'locked' ? 'text-gray-400' : 'text-gray-800'}`}>
                      {name}
                    </span>
                  </div>

                  {status === 'locked' && <FaLock className="text-gray-300" />}
                  {status === 'current' && <FaArrowRight className="text-green-600" />}
                  {status === 'completed' && <span className="text-xs text-green-600 font-medium">{t('wizard.viewOnly')}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default FarmDetail;