import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt, FaSeedling, FaLeaf, FaTint, FaCloudSun,
  FaBug, FaChartLine, FaStore, FaCalendarAlt, FaSignOutAlt
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
    { name: 'Soil Health', icon: <FaSeedling />, path: '/dashboard/soil-health' },
    { name: 'Crop Recommendation', icon: <FaLeaf />, path: '/dashboard/crop-recommendation' },
    { name: 'Smart Irrigation', icon: <FaTint />, path: '/dashboard/irrigation' },
    { name: 'Weather Forecast', icon: <FaCloudSun />, path: '/dashboard/weather' },
    { name: 'Disease Detection', icon: <FaBug />, path: '/dashboard/disease-detection' },
    { name: 'Market Finder', icon: <FaStore />, path: '/dashboard/market' },
    { name: 'Crop Calendar', icon: <FaCalendarAlt />, path: '/dashboard/calendar' },
  ];

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
                isActive
                  ? 'bg-green-700 text-white'
                  : 'hover:bg-green-800 text-green-200'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-green-200 hover:bg-green-800 mt-4"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;