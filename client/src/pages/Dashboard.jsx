import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaTractor, FaPlus, FaMapMarkerAlt } from 'react-icons/fa';

function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarms();
  }, []);

  const fetchFarms = async () => {
    try {
      const res = await api.get('/farms', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFarms(res.data.farms);
    } catch (err) {
      console.error('Failed to fetch farms', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="bg-gray-50 min-h-screen p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">{t('dashboard.welcome')}, {user?.name || 'Farmer'} 👋</h1>
          <p className="text-gray-500 mt-1">{t('dashboard.tagline')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">{t('dashboard.totalFarms')}</p>
            <p className="text-3xl font-bold text-green-700 mt-1">{farms.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">{t('dashboard.accountType')}</p>
            <p className="text-xl font-bold text-gray-800 mt-1 capitalize">{user?.role}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-sm text-gray-500">{t('dashboard.memberSince')}</p>
            <p className="text-xl font-bold text-gray-800 mt-1">
              {user?.createdAt ? new Date(user.createdAt).getFullYear() : '—'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">{t('dashboard.yourFarms')}</h2>
          <Link
            to="/dashboard/farms"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            <FaPlus size={12} /> {t('farms.addFarm')}
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">{t('dashboard.loading')}</p>
        ) : farms.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">
            <FaTractor className="text-green-600 mx-auto mb-3" size={40} />
            <p className="text-gray-600 mb-4">{t('farms.noFarms')}</p>
            <Link
              to="/dashboard/farms"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold"
            >
              {t('farms.addFarm')}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {farms.slice(0, 6).map((farm) => (
              <Link
                key={farm._id}
                to={`/dashboard/farms/${farm._id}`}
                className="bg-white rounded-xl shadow p-5 hover:shadow-lg transition"
              >
                <FaTractor className="text-green-600 mb-2" size={22} />
                <h3 className="font-semibold text-gray-800">{farm.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <FaMapMarkerAlt size={12} /> {farm.location}
                </p>
              </Link>
            ))}
          </div>
        )}

        {farms.length > 6 && (
          <div className="text-center mt-6">
            <Link to="/dashboard/farms" className="text-green-700 font-medium hover:underline">
              {t('dashboard.viewAllFarms')} →
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;