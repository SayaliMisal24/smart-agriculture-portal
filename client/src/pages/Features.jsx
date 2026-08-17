import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaSeedling, FaLeaf, FaCloudSun, FaTint, FaCalendarAlt,
  FaBug, FaFlask, FaChartLine, FaStore
} from 'react-icons/fa';

function Features() {
  const { t } = useTranslation();

  const steps = [
    { icon: <FaSeedling />, title: t('wizard.step1'), desc: t('features.desc1') },
    { icon: <FaLeaf />, title: t('wizard.step2'), desc: t('features.desc2') },
    { icon: <FaCloudSun />, title: t('wizard.step3'), desc: t('features.desc3') },
    { icon: <FaTint />, title: t('wizard.step4'), desc: t('features.desc4') },
    { icon: <FaCalendarAlt />, title: t('wizard.step5'), desc: t('features.desc5') },
    { icon: <FaBug />, title: t('wizard.step6'), desc: t('features.desc6') },
    { icon: <FaFlask />, title: t('wizard.step7'), desc: t('features.desc7') },
    { icon: <FaFlask />, title: t('wizard.step8'), desc: t('features.desc8') },
    { icon: <FaChartLine />, title: t('wizard.step9'), desc: t('features.desc9') },
    { icon: <FaStore />, title: t('wizard.step10'), desc: t('features.desc10') },
    { icon: <FaChartLine />, title: t('wizard.step11'), desc: t('features.desc11') },
  ];

  return (
    <div>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">{t('features.title')}</h1>
        <p className="text-gray-500 mb-10 max-w-2xl">{t('features.subtitle')}</p>

        <div className="space-y-4">
          {steps.map((s, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 flex items-start gap-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100 text-green-700 font-bold shrink-0">
                {i + 1}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-green-600">{s.icon}</span>
                  <h3 className="font-semibold text-gray-800">{s.title}</h3>
                </div>
                <p className="text-sm text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/signup"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-semibold"
          >
            {t('home.getStarted')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Features;