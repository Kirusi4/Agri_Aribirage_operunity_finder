import React from 'react';
import { Users as UsersIcon, Mail, Calendar, Trash2, Shield, User, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import api, { adminApi } from '../../api/api';

const AdminUsers = () => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.getUsers();
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminApi.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center text-indigo-400 font-bold tracking-widest animate-pulse">FETCHING USER RECORDS...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black flex items-center gap-3">
            <UsersIcon className="text-indigo-400" size={32} />
            User Management
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Monitor and manage registered system participants</p>
        </div>
        <div className="flex flex-col items-end">
          <span className="px-4 py-1 bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 rounded-full text-[10px] font-black uppercase tracking-widest">
            {users.length} Registered Accounts
          </span>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-800/50">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">Identity</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">Contact Details</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800">Geography</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 text-center">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${
                        u.role === 'admin' ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-blue-500/10 border-blue-500/20'
                      }`}>
                        {u.role === 'admin' ? <Shield className="text-indigo-400" size={24} /> : <User className="text-blue-400" size={24} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-200">{u.name || 'Unset'}</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Joined {new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail size={12} className="text-indigo-400" />
                        <span className="text-sm font-medium">{u.email}</span>
                      </div>
                      {u.contact && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <Phone size={12} className="text-indigo-400/60" />
                          <span className="text-xs font-bold">{u.contact}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-6">
                    {(u.location || u.state) ? (
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin size={12} className="text-indigo-400" />
                        <span className="text-xs font-bold">{u.location}{u.state && `, ${u.state}`}</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-600 font-black italic uppercase tracking-widest">Location Unset</span>
                    )}
                  </td>
                  <td className="p-6 text-center">
                    <span className={`px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] border ${
                      u.role === 'admin' 
                      ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' 
                      : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => deleteUser(u.id)}
                      disabled={u.role === 'admin'}
                      className="p-3 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all disabled:opacity-0 group-hover:scale-110 active:scale-90"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
