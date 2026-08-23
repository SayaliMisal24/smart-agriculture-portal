import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaLeaf, FaTint, FaCalendarAlt, FaSeedling, FaChartBar } from 'react-icons/fa';

function CropGrowingGuide() {
  const { t } = useTranslation();
  const { farmId } = useParams();

  // Reads crop info passed via localStorage from the Crop Recommendation page
  const cropInfo = JSON.parse(localStorage.getItem('viewingCropGuide') || 'null');

  if (!cropInfo) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <p className="text-gray-600">
          {t('cropGuide.notFound')}{' '}
          <Link to={`/dashboard/farms/${farmId}/crop-recommendation`} className="text-green-700 underline">
            {t('crop.title')}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to={`/dashboard/farms/${farmId}/crop-recommendation`} className="text-sm text-green-700 hover:underline">
        ← {t('crop.title')}
      </Link>

      <div className="flex items-center gap-3 mt-4 mb-4">
        <FaLeaf className="text-green-600" size={28} />
        <h1 className="text-2xl font-bold text-gray-800">{t(`crop.cropNames.${cropInfo.name}`, cropInfo.name)}</h1>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">{t('cropGuide.overview')}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{t(`crop.descriptions.${cropInfo.descKey}`)}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-2 mb-1 text-green-600">
            <FaCalendarAlt size={14} />
            <p className="text-xs text-gray-500">{t('crop.season')}</p>
          </div>
          <p className="font-semibold text-gray-800">{t(`crop.seasons.${cropInfo.season}`)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-2 mb-1 text-green-600">
            <FaTint size={14} />
            <p className="text-xs text-gray-500">{t('crop.water')}</p>
          </div>
          <p className="font-semibold text-gray-800">{t(`crop.waterLevels.${cropInfo.waterNeed}`)}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-2 mb-1 text-green-600">
            <FaSeedling size={14} />
            <p className="text-xs text-gray-500">{t('crop.duration')}</p>
          </div>
          <p className="font-semibold text-gray-800">{cropInfo.duration}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex items-center gap-2 mb-1 text-green-600">
            <FaChartBar size={14} />
            <p className="text-xs text-gray-500">{t('crop.expectedYield')}</p>
          </div>
          <p className="font-semibold text-gray-800">{cropInfo.expectedYield}</p>
        </div>
      </div>

      <div className="bg-green-50 rounded-xl p-5">
        <h3 className="font-semibold text-gray-800 mb-2">{t('cropGuide.suitabilityTitle')}</h3>
        <p className="text-sm text-gray-600">
          {t('cropGuide.suitabilityText', {
            soil: t(`crop.soilTypes.${cropInfo.soilTypeMatch}`, cropInfo.soilTypeMatch),
            season: t(`crop.seasons.${cropInfo.season}`),
          })}
        </p>
      </div>
    </div>
  );
}

export default CropGrowingGuide;