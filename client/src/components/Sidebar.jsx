import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { FaTachometerAlt, FaTractor, FaSignOutAlt, FaLeaf, FaHome } from 'react-icons/fa';
function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t, i18n } = useTranslation();

 const menuItems = [
    { name: t('postLogin.welcome2'), icon: <FaHome />, path: '/home' },
    { name: t('sidebar.dashboard'), icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: t('sidebar.myFarms'), icon: <FaTractor />, path: '/dashboard/farms' },
  ];
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'mr' : 'en');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-green-900 text-green-100 min-h-screen flex flex-col p-4">
      <div className="flex items-center gap-2 text-white font-bold text-lg mb-8 px-2">
        <FaLeaf className="text-green-400" size={22} />
        Smart Agriculture Portal
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? 'bg-green-700 text-white' : 'hover:bg-green-800 text-green-200'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={toggleLanguage}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-green-200 hover:bg-green-800 mb-1"
      >
        🌐 {i18n.language === 'en' ? 'मराठी' : 'English'}
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-green-200 hover:bg-green-800"
      >
        <FaSignOutAlt />
        {t('sidebar.logout')}
      </button>
    </aside>
  );
}

export default Sidebar;