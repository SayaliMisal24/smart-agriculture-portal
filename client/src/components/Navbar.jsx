import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { FaLeaf, FaBars, FaTimes } from 'react-icons/fa';

function Navbar() {
  const { t, i18n } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'mr' : 'en');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-green-700 font-bold text-lg">
            <FaLeaf className="text-green-600" size={22} />
            Smart Agriculture Portal
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-green-600">{t('nav.home')}</Link>
            <Link to="/about" className="hover:text-green-600">{t('nav.about')}</Link>
            <Link to="/dashboard" className="hover:text-green-600">{t('nav.dashboard')}</Link>

            <button
              onClick={toggleLanguage}
              className="px-3 py-1 border border-green-600 text-green-700 rounded-full text-sm hover:bg-green-50"
            >
              {i18n.language === 'en' ? 'मराठी' : 'English'}
            </button>

            <Link to="/login" className="hover:text-green-600">{t('nav.login')}</Link>
            <Link
              to="/signup"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              {t('nav.signup')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Mobile Links */}
        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 text-gray-700 font-medium">
            <Link to="/" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>{t('nav.about')}</Link>
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>{t('nav.dashboard')}</Link>
            <button onClick={toggleLanguage} className="text-left">
              {i18n.language === 'en' ? 'मराठी' : 'English'}
            </button>
            <Link to="/login" onClick={() => setMenuOpen(false)}>{t('nav.login')}</Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)}>{t('nav.signup')}</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;