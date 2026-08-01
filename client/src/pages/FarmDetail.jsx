import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import {
  FaSeedling, FaLeaf, FaTint, FaCloudSun, FaBug, FaFlask,
  FaChartLine, FaStore, FaCalendarAlt, FaMapMarkerAlt, FaTractor
} from 'react-icons/fa';

function FarmDetail() {
  const { t } = useTranslation();
  const { farmId } = useParams();
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

  const modules = [
    { name: t('farmDetail.soilHealth'), icon: <FaSeedling />, path: `/dashboard/farms/${farmId}/soil-health` },
    { name: t('farmDetail.cropRecommendation'), icon: <FaLeaf />, path: `/dashboard/farms/${farmId}/crop-recommendation` },
    { name: t('farmDetail.weather'), icon: <FaCloudSun />, path: `/dashboard/farms/${farmId}/weather` },
    { name: t('farmDetail.irrigation'), icon: <FaTint />, path: `/dashboard/farms/${farmId}/irrigation` },
    { name: t('farmDetail.calendar'), icon: <FaCalendarAlt />, path: `/dashboard/farms/${farmId}/calendar` },
    { name: t('farmDetail.diseaseDetection'), icon: <FaBug />, path: `/dashboard/farms/${farmId}/disease-detection` },
    { name: t('farmDetail.fertilizer'), icon: <FaFlask />, path: `/dashboard/farms/${farmId}/fertilizer` },
    { name: t('farmDetail.pesticide'), icon: <FaFlask />, path: `/dashboard/farms/${farmId}/pesticide` },
    { name: t('farmDetail.yieldPrediction'), icon: <FaChartLine />, path: `/dashboard/farms/${farmId}/yield-prediction` },
    { name: t('farmDetail.marketFinder'), icon: <FaStore />, path: `/dashboard/farms/${farmId}/market` },
  ];

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-gray-50 min-h-screen p-6">
          <p className="text-red-600">{error}</p>
          <Link to="/dashboard/farms" className="text-green-700 underline">{t('farmDetail.backToFarms')}</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {modules.map((m, i) => (
            <Link
              key={i}
              to={m.path}
              className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition flex items-center gap-3"
            >
              <span className="text-green-600 text-xl">{m.icon}</span>
              <span className="font-medium text-gray-800">{m.name}</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export default FarmDetail;