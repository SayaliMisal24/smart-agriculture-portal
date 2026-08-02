import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { FaTractor, FaMapMarkerAlt, FaPlus, FaTrash } from 'react-icons/fa';

function MyFarms() {
  const { t } = useTranslation();
  const [farms, setFarms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', sizeInAcres: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.location) {
      setError(t('farms.fillRequired'));
      return;
    }

    setLoading(true);
    try {
      await api.post('/farms', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setFormData({ name: '', location: '', sizeInAcres: '' });
      setShowForm(false);
      fetchFarms();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('farms.confirmDelete'))) return;
    try {
      await api.delete(`/farms/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchFarms();
    } catch (err) {
      console.error('Failed to delete farm', err);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="bg-gray-50 min-h-screen p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{t('farms.title')}</h1>
            <p className="text-gray-500">{t('farms.subtitle')}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
          >
            <FaPlus /> {t('farms.addFarm')}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4 max-w-md">
            {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 max-w-md mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('farms.name')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('farms.namePlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('farms.location')}</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder={t('farms.locationPlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('farms.size')}</label>
              <input
                type="number"
                name="sizeInAcres"
                value={formData.sizeInAcres}
                onChange={handleChange}
                placeholder={t('farms.sizePlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? t('farms.saving') : t('farms.saveFarm')}
            </button>
          </form>
        )}

        {farms.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center max-w-md">
            <FaTractor className="text-green-600 mx-auto mb-3" size={40} />
            <p className="text-gray-600">{t('farms.noFarms')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {farms.map((farm) => (
              <div key={farm._id} className="bg-white rounded-xl shadow p-5 relative">
                <button
                  onClick={() => handleDelete(farm._id)}
                  className="absolute top-3 right-3 text-red-400 hover:text-red-600"
                >
                  <FaTrash size={14} />
                </button>
                <FaTractor className="text-green-600 mb-2" size={24} />
                <h3 className="font-semibold text-gray-800">{farm.name}</h3>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <FaMapMarkerAlt size={12} /> {farm.location}
                </p>
                {farm.sizeInAcres && (
                  <p className="text-sm text-gray-500">{farm.sizeInAcres} {t('farms.acres')}</p>
                )}
                <Link
                  to={`/dashboard/farms/${farm._id}`}
                  className="block mt-4 text-center bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium"
                >
                  {t('farms.openFarm')}
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyFarms;