import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './Navbar';
import api from '../utils/api';
import { FaPlus } from 'react-icons/fa';

const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

function MultiCropStep({ endpoint, i18nKey, renderRecord, extra, isFinal }) {
  const { t } = useTranslation();
  const { farmId } = useParams();

  const [farm, setFarm] = useState(null);
  const [records, setRecords] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('');
  const [extraValue, setExtraValue] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    load();
  }, [farmId]);

  const load = async () => {
    setLoadingPage(true);
    try {
      const [farmRes, recRes] = await Promise.all([
        api.get(`/farms/${farmId}`, authHeader()),
        api.get(`${endpoint}?farmId=${farmId}`, authHeader()),
      ]);
      setFarm(farmRes.data.farm);
      const list = recRes.data.records || [];
      setRecords(list);
      setShowForm(list.length === 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPage(false);
    }
  };

  const remainingCrops = (farm?.selectedCrops || []).filter((c) => !records.some((r) => r.cropName === c));

  const chooseCrop = (cropName) => {
    setSelectedCrop(cropName);
    if (extra?.initial) setExtraValue(extra.initial(farm, cropName, records, remainingCrops));
  };

  const handleGenerate = async () => {
    setError('');
    if (!selectedCrop) {
      setError(t(`${i18nKey}.selectCropError`));
      return;
    }
    if (extra?.validate) {
      const problem = extra.validate(extraValue, farm, records);
      if (problem) {
        setError(t(problem.key, problem.params));
        return;
      }
    }

    setBusy(true);
    try {
      const extraPayload = extra?.payload ? await extra.payload(extraValue) : {};
      const res = await api.post(endpoint, { farmId, cropName: selectedCrop, ...extraPayload }, authHeader());
      setRecords((prev) => [...prev, res.data.record]);
      setSelectedCrop('');
      setExtraValue(null);
      setShowForm(false);
    } catch (err) {
      setError(err.i18nKey ? t(err.i18nKey) : err.response?.data?.message || t('irrigation.error'));
    } finally {
      setBusy(false);
    }
  };

  if (loadingPage) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto p-6">
          <p className="text-gray-500">{t('wizard.loadingStatus')}</p>
        </div>
      </div>
    );
  }

  const hubLink = `/dashboard/farms/${farmId}`;

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <Link to={hubLink} className="text-sm text-green-700 hover:underline">
          ← {t('farmDetail.backToFarms')}
        </Link>

        <h1 className="text-2xl font-bold text-gray-800 mt-3 mb-2">{t(`${i18nKey}.title`)}</h1>
        <p className="text-gray-500 mb-6">{t(`${i18nKey}.subtitle`)}</p>

        {error && <div className="bg-red-100 text-red-700 text-sm p-3 rounded mb-4">{error}</div>}

        {(!farm?.selectedCrops || farm.selectedCrops.length === 0) && (
          <div className="bg-yellow-100 text-yellow-800 text-sm p-4 rounded-lg mb-4">
            {t('calendar.noCropsYet')}{' '}
            <Link to={`${hubLink}/crop-recommendation`} className="underline font-medium">
              {t('crop.title')}
            </Link>
          </div>
        )}

        {records.map((record, i) => (
          <div key={record._id || i} className="mb-6">
            {renderRecord(record, t)}
          </div>
        ))}

        {remainingCrops.length > 0 && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium mb-6"
          >
            <FaPlus size={12} /> {t('wizard.addForAnotherCrop')}
          </button>
        )}

        {showForm && remainingCrops.length > 0 && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">{t(`${i18nKey}.selectCropTitle`)}</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {remainingCrops.map((cropName) => (
                <button
                  key={cropName}
                  type="button"
                  onClick={() => chooseCrop(cropName)}
                  className={`px-4 py-2 rounded-lg text-sm border transition ${
                    selectedCrop === cropName
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {t(`crop.cropNames.${cropName}`, cropName)}
                </button>
              ))}
            </div>

            {selectedCrop && extra?.render && (
              <div className="mb-4">
                {extra.render({ crop: selectedCrop, farm, records, value: extraValue, setValue: setExtraValue, t })}
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={busy}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
            >
              {busy ? t(`${i18nKey}.generating`) : t(`${i18nKey}.generateButton`)}
            </button>
          </div>
        )}

        {records.length > 0 && remainingCrops.length === 0 && isFinal && (
          <p className="text-green-700 font-medium mb-4">{t(`${i18nKey}.wizardComplete`)}</p>
        )}

        {records.length > 0 && (
          <Link
            to={hubLink}
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium"
          >
            {isFinal && remainingCrops.length === 0 ? t('farmDetail.backToFarms') : t('wizard.continueToNext')}
          </Link>
        )}
      </div>
    </div>
  );
}

export default MultiCropStep;