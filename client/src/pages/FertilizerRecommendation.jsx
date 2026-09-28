import MultiCropStep from '../components/MultiCropStep';
import { FaFlask, FaLeaf, FaRupeeSign, FaCalendarCheck } from 'react-icons/fa';

const renderRecord = (record, t) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <FaFlask className="text-green-600" size={22} />
        <h3 className="font-bold text-gray-800 text-lg">{t(`crop.cropNames.${record.cropName}`, record.cropName)}</h3>
      </div>
      <span className={`text-xs px-3 py-1 rounded-full font-medium ${record.leansOrganic ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
        {record.leansOrganic ? t('fertilizer.organicLean') : t('fertilizer.balancedLean')}
      </span>
    </div>

    {record.areaAcres != null && (
      <p className="text-xs text-gray-500 mb-4">{t('fertilizer.areaUsed', { area: record.areaAcres })}</p>
    )}

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {[['urea', record.ureaKg], ['dap', record.dapKg], ['mop', record.mopKg], ['compost', record.compostKg]].map(([key, value]) => (
        <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400">{t(`fertilizer.${key}`)}</p>
          <p className="font-bold text-gray-800">{value} kg</p>
        </div>
      ))}
    </div>

    <div className="flex items-center gap-2 bg-yellow-50 rounded-lg p-3 mb-5">
      <FaRupeeSign className="text-yellow-600" size={16} />
      <p className="text-sm text-gray-700">
        {t('fertilizer.estimatedCost')}: <span className="font-bold">₹{(record.estimatedCost ?? 0).toLocaleString('en-IN')}</span>
      </p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
      <div className="bg-green-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2 text-green-700 font-semibold text-sm"><FaLeaf /> {t('fertilizer.organicOption')}</div>
        <p className="text-sm text-gray-600">{t(`fertilizer.${record.organicKey}`)}</p>
      </div>
      <div className="bg-blue-50 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2 text-blue-700 font-semibold text-sm"><FaFlask /> {t('fertilizer.chemicalOption')}</div>
        <p className="text-sm text-gray-600">{t(`fertilizer.${record.chemicalKey}`)}</p>
      </div>
    </div>

    <div className="bg-purple-50 rounded-xl p-4 flex items-start gap-2 mb-4">
      <FaCalendarCheck className="text-purple-600 mt-0.5 shrink-0" size={16} />
      <p className="text-sm text-gray-600">{t('fertilizer.applicationGuide')}</p>
    </div>

    {record.microKey && (
      <div className="bg-teal-50 rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold text-teal-700 mb-1">{t('fertilizer.micronutrientsTitle')}</p>
        <p className="text-sm text-gray-600">{t(`fertilizer.${record.microKey}`)}</p>
      </div>
    )}

    {record.diseaseNoteKey && (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
        <p className="text-sm font-semibold text-orange-700 mb-1">{t('fertilizer.diseaseAwareTitle')}</p>
        <p className="text-sm text-gray-600">{t(`fertilizer.${record.diseaseNoteKey}`)}</p>
      </div>
    )}

    <p className="text-xs text-gray-400">{t('fertilizer.disclaimer')}</p>
  </div>
);

function FertilizerRecommendation() {
  return <MultiCropStep endpoint="/fertilizer" i18nKey="fertilizer" renderRecord={renderRecord} />;
}

export default FertilizerRecommendation;