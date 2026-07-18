import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Mail, MapPin, Edit3, Save, X, Phone, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import api, { authApi } from '../../api/api';

const UserProfile = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    name: 'User',
    email: 'user@example.com',
    location: '',
    state: '',
    contact: '',
    role: 'user',
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [adminStats, setAdminStats] = React.useState(null);
  const [updating, setUpdating] = React.useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      const response = await authApi.updateProfile(formData);
      const updatedUser = response.data;
      
      // Update local storage
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const newUserData = { ...storedUser, ...updatedUser };
      localStorage.setItem('user', JSON.stringify(newUserData));
      
      setUser(newUserData);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
      alert('Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await authApi.getProfile();
        const latestUser = response.data;
        setUser(latestUser);
        setFormData({
          name: latestUser.name || '',
          contact: latestUser.contact || '',
          location: latestUser.location || '',
          state: latestUser.state || '',
        });

        if (latestUser.role === 'admin') {
          const statsRes = await api.get('/admin/stats');
          setAdminStats(statsRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch latest profile', err);
        // Fallback to local storage if API fails
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setFormData({
            name: parsedUser.name || '',
            contact: parsedUser.contact || '',
            location: parsedUser.location || '',
            state: parsedUser.state || '',
          });
        }
      }
    };
    
    fetchUserProfile();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 pb-24 space-y-8">
      {/* Profile Header */}
      <div className="relative group">
        <div className="flex items-center gap-6 p-8 bg-surface rounded-[2rem] border border-border shadow-sm">
          <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden">
            <User size={48} className="text-primary" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-2xl font-black w-full focus:border-primary outline-none"
                placeholder="Enter Name"
              />
            ) : (
              <h2 className="text-3xl font-black">{user.name}</h2>
            )}
            <p className="text-text-muted text-sm font-medium flex items-center gap-2 mt-2">
              <span className={`w-2 h-2 rounded-full ${user.role === 'admin' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
              {user.role === 'admin' ? 'System Administrator' : `Premium Pro ${t('account')}`}
            </p>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setIsEditing(true)}
              className="p-3 bg-white/5 hover:bg-primary/10 text-text-muted hover:text-primary rounded-2xl transition-all border border-white/5 hover:border-primary/20"
            >
              <Edit3 size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Info Card */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-border space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-text-muted">{t('contactDetails')}</h3>
            {isEditing && (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white/5 text-text-muted rounded-xl text-xs font-bold border border-white/5"
                >
                  {t('cancel')}
                </button>
                <button 
                  disabled={updating}
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <Save size={14} />
                  {updating ? 'Saving...' : t('saveChanges')}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <Mail size={12} className="text-primary" />
                  Email Address
                </label>
                <div className="text-sm font-bold opacity-60 px-1">{user.email}</div>
                <p className="text-[9px] text-text-muted italic px-1">Email cannot be changed</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <Phone size={12} className="text-primary" />
                  Contact Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold focus:border-primary outline-none"
                    placeholder="Enter Phone Number"
                  />
                ) : (
                  <div className="text-sm font-bold px-1">{user.contact || 'Not set'}</div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={12} className="text-primary" />
                  City / Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold focus:border-primary outline-none"
                    placeholder="Enter City"
                  />
                ) : (
                  <div className="text-sm font-bold px-1">{user.location || 'Not set'}</div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest flex items-center gap-2">
                  <Globe size={12} className="text-primary" />
                  State / Region
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold focus:border-primary outline-none"
                    placeholder="Enter State"
                  />
                ) : (
                  <div className="text-sm font-bold px-1">{user.state || 'Not set'}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {user.role === 'admin' && adminStats && !isEditing && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-600/5 border border-indigo-600/10 p-8 rounded-[2.5rem] flex items-center justify-between"
        >
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-2">System Overview</h3>
            <p className="text-3xl font-black text-indigo-400">{adminStats.userCount}</p>
            <p className="text-xs text-indigo-400/60 font-bold uppercase tracking-widest mt-1">Total Registered Users</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-black uppercase tracking-widest text-indigo-400 mb-2">Alerts Dispatched</h3>
            <p className="text-3xl font-black text-indigo-400">{adminStats.alertCount}</p>
            <p className="text-xs text-indigo-400/60 font-bold uppercase tracking-widest mt-1">Live Notifications</p>
          </div>
        </motion.div>
      )}

      <button 
        onClick={handleLogout}
        className="w-full py-4 bg-rose-500/10 text-rose-500 rounded-2xl font-bold text-sm hover:bg-rose-500/20 transition-all border border-rose-500/10 flex items-center justify-center gap-3 active:scale-95 transition-all"
      >
        <LogOut size={18} />
        {t('logoutSession')}
      </button>
    </div>
  );
};

export default UserProfile;
