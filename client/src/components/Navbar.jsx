import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { FaLeaf, FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';

function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'mr' : 'en');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 text-green-700 font-bold text-lg">
            <FaLeaf className="text-green-600" size={22} />
            Smart Agriculture Portal
          </Link>

          <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <Link to="/" className="hover:text-green-600">{t('nav.home')}</Link>
            <Link to="/about" className="hover:text-green-600">{t('nav.about')}</Link>

            <button
              onClick={toggleLanguage}
              className="px-3 py-1 border border-green-600 text-green-700 rounded-full text-sm hover:bg-green-50"
            >
              {i18n.language === 'en' ? 'मराठी' : 'English'}
            </button>

            {token ? (
              <>
                <Link to="/dashboard/farms" className="hover:text-green-600">{t('sidebar.myFarms')}</Link>
                <Link to="/dashboard" className="hover:text-green-600">{t('nav.dashboard')}</Link>
                <div className="relative" ref={profileRef}>
                  <button onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="flex items-center">
                    {user?.profilePhoto ? (
                      <img
                        src={`http://localhost:5000${user.profilePhoto}`}
                        alt="Profile"
                        className="w-9 h-9 rounded-full object-cover border-2 border-green-200"
                      />
                    ) : (
                      <FaUserCircle className="text-gray-400" size={34} />
                    )}
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">{user?.name}</div>
                      <Link
                        to="/profile"
                        onClick={() => setProfileMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <FaUserEdit /> {t('profile.myProfile')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <FaSignOutAlt /> {t('sidebar.logout')}
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-600">{t('nav.login')}</Link>
                <Link
                  to="/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden text-gray-700" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3 text-gray-700 font-medium">
            <Link to="/" onClick={() => setMenuOpen(false)}>{t('nav.home')}</Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>{t('nav.about')}</Link>
            <button onClick={toggleLanguage} className="text-left">
              {i18n.language === 'en' ? 'मराठी' : 'English'}
            </button>
            {token ? (
              <>
                <Link to="/dashboard/farms" onClick={() => setMenuOpen(false)}>{t('sidebar.myFarms')}</Link>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>{t('nav.dashboard')}</Link>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>{t('profile.myProfile')}</Link>
                <button onClick={handleLogout} className="text-left text-red-600">{t('sidebar.logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>{t('nav.login')}</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}>{t('nav.signup')}</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;