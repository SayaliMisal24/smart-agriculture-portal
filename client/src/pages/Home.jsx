import { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaCloudSun, FaChartLine, FaLightbulb, FaQuoteLeft } from 'react-icons/fa';
import { getTipKeyFromWeather } from '../utils/tipHelper';
function Home() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [liveWeather, setLiveWeather] = useState(null);

  useEffect(() => {
    fetchDefaultWeather();
  }, []);

  const fetchDefaultWeather = () => {
    if (!navigator.geolocation) {
      // Browser doesn't support geolocation at all - fall back to a default city
      fetchWeatherByCity('Nagpur');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (error) => {
        // User denied permission or location failed - fall back to a default city
        console.error('Geolocation failed or denied', error);
        fetchWeatherByCity('Nagpur');
      }
    );
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const res = await api.get(`/weather/public?lat=${lat}&lon=${lon}`);
      setLiveWeather(res.data.weather);
    } catch (err) {
      console.error('Could not load weather for detected location', err);
    }
  };

  const fetchWeatherByCity = async (city) => {
    try {
      const res = await api.get(`/weather/public?city=${city}`);
      setLiveWeather(res.data.weather);
    } catch (err) {
      console.error('Could not load fallback weather', err);
    }
  };
  const todaysTipKey = getTipKeyFromWeather(liveWeather);
 const features = [
    {
      icon: <FaCloudSun className="text-green-600" size={28} />,
      title: t('home.card1Title'),
      desc: liveWeather
        ? `${liveWeather.city}: ${liveWeather.temperature}°C, ${liveWeather.description}`
        : t('home.card1Desc'),
      link: '/weather-detail',
    },
    {
      icon: <FaLightbulb className="text-green-600" size={28} />,
      title: t('home.card2Title'),
      desc: t(`home.tips.${todaysTipKey}`),
      link: '/tip-detail',
    },
    {
      icon: <FaChartLine className="text-green-600" size={28} />,
      title: t('home.card3Title'),
      desc: t('home.card3Desc'),
      link: '/market-trends-detail',
    },
    {
      icon: <FaQuoteLeft className="text-green-600" size={28} />,
      title: t('home.card4Title'),
      desc: t('home.card4Desc'),
      link: '/success-story-detail',
    },
  ];
  
  return (
    <div>
      {/* HERO SECTION */}
      <section
        className="relative bg-cover bg-center min-h-[500px] flex items-center"
        style={{ backgroundImage: `url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80)` }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative max-w-3xl mx-8 md:mx-16 text-white">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            {t('home.heroTitle')}
          </h1>
          <p className="mt-4 text-lg text-gray-100">
            {t('home.heroSubtitle')}
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              to={token ? '/dashboard/farms' : '/signup'}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {token ? t('home.goToFarms') : t('home.getStarted')}
            </Link>
            <Link
              to="/features"
              className="bg-white/90 hover:bg-white text-green-700 px-6 py-3 rounded-lg font-semibold"
            >
              {t('home.exploreFeatures')}
            </Link>
          </div>
        </div>
      </section>

 {/* FEATURE CARDS */}
      <section className="max-w-6xl mx-auto px-6 -mt-12 relative z-10">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to={f.link}
                className="block bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
              >
                <div className="mb-3">{f.icon}</div>
                <h3 className="font-semibold text-gray-800">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
                <p className="text-xs text-green-600 mt-2 font-medium">{t('home.viewDetails')} →</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="h-20"></div>
    </div>
  );
}

export default Home;