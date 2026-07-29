import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>
        <div className="bg-white rounded-xl shadow p-6 max-w-lg">
          <p className="text-gray-700"><span className="font-medium">Name:</span> {user?.name}</p>
          <p className="text-gray-700 mt-2"><span className="font-medium">Email:</span> {user?.email}</p>
          <p className="text-gray-700 mt-2"><span className="font-medium">Role:</span> {user?.role}</p>
        </div>
      </main>
    </div>
  );
}

export default Profile;