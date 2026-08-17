import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { FaChartLine, FaMapMarkerAlt } from 'react-icons/fa';

const commodities = ['Wheat', 'Rice', 'Onion', 'Tomato', 'Cotton', 'Soybean'];

function MarketTrendsDetail() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [selectedCommodity, setSelectedCommodity] = useState('Wheat');
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrices(selectedCommodity);
  }, [selectedCommodity]);

  const fetchPrices = async (commodity) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/market/prices?commodity=${commodity}`);
      setPrices(res.data.prices);
    } catch (err) {
      setError(t('marketDetail.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/" className="text-sm text-green-700 hover:underline">← {t('nav.home')}</Link>

        <div className="flex items-center gap-2 mt-3 mb-2">
          <FaChartLine className="text-green-600" size={24} />
          <h1 className="text-3xl font-bold text-gray-800">{t('marketDetail.title')}</h1>
        </div>
        <p className="text-gray-500 mb-6">{t('marketDetail.subtitle')}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {commodities.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCommodity(c)}
              className={`px-4 py-2 rounded-lg text-sm border transition ${
                selectedCommodity === c
                  ? 'bg-green-600 text-white border-green-600'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              {t(`crop.cropNames.${c}`, c)}
            </button>
          ))}
        </div>

        {loading && <p className="text-gray-500">{t('marketDetail.loading')}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!loading && !error && prices.length === 0 && (
          <p className="text-gray-500">{t('marketDetail.noData')}</p>
        )}

        {!loading && prices.length > 0 && (
          <div className="bg-white rounded-xl shadow divide-y">
            {prices.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold text-gray-800">{p.market}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <FaMapMarkerAlt size={10} /> {p.district}, {p.state}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{p.variety} • {p.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">₹{p.modalPrice}</p>
                  <p className="text-xs text-gray-400">₹{p.minPrice} - ₹{p.maxPrice}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-4">{t('marketDetail.disclaimer')}</p>

        {!token && (
          <div className="bg-green-50 rounded-xl p-6 text-center mt-8">
            <p className="text-gray-600 mb-3">{t('marketDetail.ctaText')}</p>
            <Link to="/signup" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">
              {t('home.getStarted')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MarketTrendsDetail;