import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaLeaf, FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-green-900 text-green-100 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
            <FaLeaf className="text-green-400" size={22} />
            Smart Agriculture Portal
          </div>
          <p className="text-sm text-green-200">
            Empowering farmers with smart, data-driven tools for modern agriculture.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">{t('nav.home')}</Link></li>
            <li><Link to="/about" className="hover:text-white">{t('nav.about')}</Link></li>
            <li><Link to="/dashboard" className="hover:text-white">{t('nav.dashboard')}</Link></li>
            <li><Link to="/login" className="hover:text-white">{t('nav.login')}</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-semibold mb-3">Services</h4>
          <ul className="space-y-2 text-sm">
            <li>Soil Health Analyzer</li>
            <li>Crop Recommendation</li>
            <li>Weather Based Farming</li>
            <li>Market Finder</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-3">Contact Us</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><FaEnvelope /> support@smartagri.com</li>
            <li className="flex items-center gap-2"><FaPhone /> +91 98765 43210</li>
          </ul>
          <div className="flex gap-4 mt-4 text-lg">
            <FaFacebook className="hover:text-white cursor-pointer" />
            <FaTwitter className="hover:text-white cursor-pointer" />
            <FaInstagram className="hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>

      <div className="border-t border-green-800 text-center text-sm text-green-300 py-4">
        © {new Date().getFullYear()} Smart Agriculture Portal. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;