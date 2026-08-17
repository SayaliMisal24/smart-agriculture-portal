import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { FaQuoteLeft } from 'react-icons/fa';

const storyKeys = ['story1', 'story2', 'story3'];

function SuccessStoryDetail() {
  const { t } = useTranslation();
  const { token } = useAuth();

  return (
    <div>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link to="/" className="text-sm text-green-700 hover:underline">← {t('nav.home')}</Link>

        <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-6">{t('storyDetail.title')}</h1>

        <div className="space-y-5 mb-8">
          {storyKeys.map((key) => (
            <div key={key} className="bg-white rounded-2xl shadow p-6">
              <FaQuoteLeft className="text-green-300 mb-3" size={24} />
              <p className="text-gray-700 italic mb-3">"{t(`storyDetail.stories.${key}.quote`)}"</p>
              <p className="text-sm font-medium text-gray-500">— {t(`storyDetail.stories.${key}.author`)}</p>
            </div>
          ))}
        </div>

        {!token && (
          <div className="bg-green-50 rounded-xl p-6 text-center">
            <p className="text-gray-600 mb-3">{t('storyDetail.ctaText')}</p>
            <Link to="/signup" className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold">
              {t('home.getStarted')}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default SuccessStoryDetail;