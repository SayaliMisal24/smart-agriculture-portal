import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaCamera, FaLock, FaEnvelope, FaUserTag, FaEdit } from 'react-icons/fa';

function Profile() {
  const { t } = useTranslation();
  const { user, login } = useAuth();

  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const showMsg = (type, text) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 4000);
  };

  const handleNameSave = async () => {
    setLoading(true);
    try {
      const res = await api.put(
        '/user/profile',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      login(res.data.user, token);
      setEditingName(false);
      showMsg('success', t('profile.nameUpdated'));
    } catch (err) {
      showMsg('error', err.response?.data?.message || t('profile.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      const res = await api.post('/user/profile/photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      login(res.data.user, token);
      setPhotoFile(null);
      showMsg('success', t('profile.photoUpdated'));
    } catch (err) {
      showMsg('error', err.response?.data?.message || t('profile.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(
        '/user/profile/password',
        passwordData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPasswordData({ currentPassword: '', newPassword: '' });
      showMsg('success', t('profile.passwordChanged'));
    } catch (err) {
      showMsg('error', err.response?.data?.message || t('profile.passwordFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="bg-gray-50 min-h-screen p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('profile.myProfile')}</h1>

        {msg.text && (
          <div className={`text-sm p-3 rounded mb-4 max-w-xl ${
            msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow p-6 md:col-span-1 flex flex-col items-center text-center">
            <div className="relative">
              {photoPreview || user?.profilePhoto ? (
                <img
                  src={photoPreview || `http://localhost:5000${user.profilePhoto}`}
                  alt="Profile"
                  className="w-28 h-28 rounded-full object-cover border-4 border-green-100"
                />
              ) : (
                <FaUserCircle className="w-28 h-28 text-gray-300" />
              )}
              <label className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full cursor-pointer">
                <FaCamera size={14} />
                <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={handlePhotoChange} />
              </label>
            </div>

            {photoFile && (
              <button
                onClick={handlePhotoUpload}
                disabled={loading}
                className="mt-3 text-sm bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg disabled:opacity-50"
              >
                {t('profile.savePhoto')}
              </button>
            )}

            <h2 className="text-lg font-bold text-gray-800 mt-4">{user?.name}</h2>
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mt-2 capitalize">
              {user?.role}
            </span>
          </div>

          {/* Info + Edit */}
          <div className="bg-white rounded-2xl shadow p-6 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('profile.accountInfo')}</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 flex items-center gap-2 mb-1">
                  <FaUserTag /> {t('profile.name')}
                </label>
                {editingName ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    />
                    <button
                      onClick={handleNameSave}
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                    >
                      {t('profile.save')}
                    </button>
                    <button
                      onClick={() => { setEditingName(false); setName(user?.name); }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm"
                    >
                      {t('profile.cancel')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2">
                    <span className="text-gray-800">{user?.name}</span>
                    <button onClick={() => setEditingName(true)} className="text-green-600 hover:text-green-800">
                      <FaEdit size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-gray-500 flex items-center gap-2 mb-1">
                  <FaEnvelope /> {t('profile.email')}
                </label>
                <div className="border border-gray-200 rounded-lg px-3 py-2 text-gray-500 bg-gray-50">
                  {user?.email}
                </div>
              </div>
            </div>

            <hr className="my-6" />

            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FaLock size={16} /> {t('profile.changePassword')}
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{t('profile.currentPassword')}</label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{t('profile.newPassword')}</label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium text-sm disabled:opacity-50"
              >
                {loading ? t('profile.updating') : t('profile.updatePassword')}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;