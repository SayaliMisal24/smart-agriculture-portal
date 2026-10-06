import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import { FaLeaf, FaCloudSun, FaChartLine, FaGlobe } from 'react-icons/fa';

function About() {
  const { t } = useTranslation();

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('about.title')}</h1>
        <p className="text-gray-600 leading-relaxed mb-8">{t('about.intro')}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-xl shadow p-6">
            <FaLeaf className="text-green-600 mb-3" size={24} />
            <h3 className="font-semibold text-gray-800 mb-1">{t('about.feature1Title')}</h3>
            <p className="text-sm text-gray-600">{t('about.feature1Desc')}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <FaCloudSun className="text-green-600 mb-3" size={24} />
            <h3 className="font-semibold text-gray-800 mb-1">{t('about.feature2Title')}</h3>
            <p className="text-sm text-gray-600">{t('about.feature2Desc')}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <FaChartLine className="text-green-600 mb-3" size={24} />
            <h3 className="font-semibold text-gray-800 mb-1">{t('about.feature3Title')}</h3>
            <p className="text-sm text-gray-600">{t('about.feature3Desc')}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <FaGlobe className="text-green-600 mb-3" size={24} />
            <h3 className="font-semibold text-gray-800 mb-1">{t('about.feature4Title')}</h3>
            <p className="text-sm text-gray-600">{t('about.feature4Desc')}</p>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-2">{t('about.missionTitle')}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{t('about.missionText')}</p>
        </div>
      </div>
    </div>
  );
}

export default About;