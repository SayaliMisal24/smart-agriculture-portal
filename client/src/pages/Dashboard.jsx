import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { FaSun, FaCloud, FaCloudRain } from 'react-icons/fa';

function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Soil Health', value: 'Good', color: 'bg-green-100 text-green-800' },
    { label: "Today's Weather", value: '28°C', color: 'bg-blue-100 text-blue-800' },
    { label: 'Market Price (Avg)', value: '₹2,350/quintal', color: 'bg-purple-100 text-purple-800' },
    { label: 'Predicted Yield', value: '32 Quintal/acre', color: 'bg-orange-100 text-orange-800' },
  ];

  const forecast = [
    { day: 'Today', temp: '28°C', icon: <FaSun className="text-yellow-500" /> },
    { day: 'Tomorrow', temp: '27°C', icon: <FaCloud className="text-gray-400" /> },
    { day: 'Wed', temp: '26°C', icon: <FaCloudRain className="text-blue-400" /> },
    { day: 'Thu', temp: '25°C', icon: <FaCloud className="text-gray-400" /> },
    { day: 'Fri', temp: '29°C', icon: <FaSun className="text-yellow-500" /> },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500">Welcome back, {user?.name || 'Farmer'} 👋</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((s, i) => (
            <div key={i} className={`rounded-xl p-4 ${s.color}`}>
              <p className="text-sm font-medium">{s.label}</p>
              <p className="text-xl font-bold mt-1">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Weather Forecast */}
        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-800">Weather Forecast</h2>
            <span className="text-sm text-green-600 cursor-pointer">View Details</span>
          </div>
          <div className="grid grid-cols-5 gap-4 text-center">
            {forecast.map((f, i) => (
              <div key={i}>
                <p className="text-sm text-gray-500 mb-1">{f.day}</p>
                <div className="text-2xl flex justify-center mb-1">{f.icon}</div>
                <p className="text-sm font-medium">{f.temp}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Recent Recommendations</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Apply organic fertilizer</li>
              <li>• Good time for irrigation</li>
              <li>• Use recommended pesticide for better yield</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="font-semibold text-gray-800 mb-3">Market Insights</h2>
            <ul className="text-sm text-gray-600 space-y-2">
              <li className="flex justify-between"><span>Tomato</span> <span>₹2,100/quintal <span className="text-green-600">▲2.5%</span></span></li>
              <li className="flex justify-between"><span>Wheat</span> <span>₹2,350/quintal <span className="text-green-600">▲2.1%</span></span></li>
              <li className="flex justify-between"><span>Onion</span> <span>₹1,800/quintal <span className="text-red-600">▼1.2%</span></span></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;