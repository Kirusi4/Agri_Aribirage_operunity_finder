import React from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Bell, LogOut, TrendingUp, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import Footer from '../common/Footer';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/admin' },
    { icon: Users, label: 'User Management', path: '/admin/users' },
    { icon: Bell, label: 'Alert Logs', path: '/admin/alerts' },
  ];

  return (
    <div className="flex min-h-screen bg-[#020617] text-slate-200">
      {/* Admin Sidebar */}
      <aside className="w-72 border-r border-slate-800 bg-[#020617]/50 backdrop-blur-xl flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight">AgriArb <span className="text-indigo-400">Admin</span></h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">System Control</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                ${isActive ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Exit Admin Panel</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <header className="h-20 border-b border-slate-800 bg-[#020617]/50 backdrop-blur-xl px-10 flex items-center justify-between sticky top-0 z-40">
          <h2 className="text-xl font-bold">Control Center</h2>
          <div className="flex items-center gap-4">
            <button 
                onClick={() => navigate('/user')}
                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-all"
            >
                Switch to User View
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
              <ShieldCheck size={20} className="text-indigo-400" />
            </div>
          </div>
        </header>

        <div className="p-10">
          <Outlet />
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
