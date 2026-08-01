import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '../components/Sidebar';
import { FaLeaf, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function CropDetail() {
  const { t } = useTranslation();
  const { index, farmId } = useParams();
  const navigate = useNavigate();
  const idx = parseInt(index, 10);

  const crops = JSON.parse(localStorage.getItem('recommendedCrops') || '[]');
  const crop = crops[idx];

  if (!crop) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 bg-gray-50 min-h-screen p-6">
          <p className="text-gray-600">
            No crop data found. Please{' '}
            <Link to={`/dashboard/farms/${farmId}/crop-recommendation`}>
              generate a recommendation
            </Link>{' '}
            first.
          </p>
        </main>
      </div>
    );
  }

  const goTo = (newIdx) => {
    if (newIdx >= 0 && newIdx < crops.length) {
      navigate(`/dashboard/farms/${farmId}/crop-recommendation/details/${newIdx}`);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <Link to={`/dashboard/farms/${farmId}/crop-recommendation`}>
          ← {t('crop.backToAll')}
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl mt-4">
          <FaLeaf className="text-green-600 mb-4" size={36} />
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{t(`crop.cropNames.${crop.name}`, crop.name)}</h1>

          <div className="space-y-3 text-gray-700">
            <p><span className="font-medium">{t('crop.expectedYield')}:</span> {crop.expectedYield}</p>
            <p><span className="font-medium">{t('crop.duration')}:</span> {crop.duration}</p>
            <p><span className="font-medium">{t('crop.waterNeed')}:</span> {crop.waterNeed}</p>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={() => goTo(idx - 1)}
              disabled={idx === 0}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-40"
            >
              <FaArrowLeft /> {t('crop.previous')}
            </button>
            <span className="text-sm text-gray-400 self-center">{idx + 1} of {crops.length}</span>
            <button
              onClick={() => goTo(idx + 1)}
              disabled={idx === crops.length - 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-40"
            >
              {t('crop.next')} <FaArrowRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CropDetail;