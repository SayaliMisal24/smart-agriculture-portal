import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaSeedling, FaCloudSun, FaChartLine, FaLeaf } from 'react-icons/fa';

function Home() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <FaSeedling className="text-green-600" size={28} />,
      title: 'Soil Health Analyzer',
      desc: 'Analyze soil nutrients and get suggestions.',
    },
    {
      icon: <FaLeaf className="text-green-600" size={28} />,
      title: 'Crop Recommendation',
      desc: 'Get best crop suggestions for higher yield.',
    },
    {
      icon: <FaCloudSun className="text-green-600" size={28} />,
      title: 'Weather Based Farming',
      desc: 'Plan your farming based on accurate weather.',
    },
    {
      icon: <FaChartLine className="text-green-600" size={28} />,
      title: 'Market Insights',
      desc: 'Check market prices and sell smart.',
    },
  ];

  return (
    <div>
      {/* HERO SECTION */}
      <section
        className="relative bg-cover bg-center min-h-[500px] flex items-center"
        style={{ backgroundImage: `url(https://wallpaperaccess.com/full/13781652.jpg)` }}
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
              to="/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {t('home.getStarted')}
            </Link>
            <Link
              to="/about"
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
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-800">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <div className="h-20"></div>
    </div>
  );
}

export default Home;