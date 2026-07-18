import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  MapPin, 
  Zap, 
  Scale, 
  User,
  LogOut,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';

import { useLanguage } from '../../context/LanguageContext';

const UserSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    { icon: Home, label: t('dashboard'), path: '/user' },
    { icon: MapPin, label: t('markets'), path: '/user/markets' },
    { icon: Zap, label: t('opportunities'), path: '/user/opportunities' },
    { icon: Scale, label: t('priceCompare'), path: '/user/price-compare' },
    { icon: User, label: t('profile'), path: '/user/profile' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "w-64 h-screen glass border-r border-white/10 flex flex-col fixed left-0 top-0 z-[70] transition-transform duration-500 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-emerald-400 to-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <TrendingUp className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-text to-text-muted bg-clip-text text-transparent">AgriArb</h1>
            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Opportunity Finder</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-text-muted transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/user'}
            className={({ isActive }) => cn(
              "flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden",
              isActive 
                ? "text-primary bg-primary/10" 
                : "text-text-muted hover:text-text hover:bg-surface-hover"
            )}
          >
            {({ isActive }) => (
              <>
                <div className="flex items-center gap-3 relative z-10">
                  <item.icon size={20} className={cn(
                    "transition-all duration-300",
                    isActive ? "text-primary scale-110" : "group-hover:text-text"
                  )} />
                  <span className="font-medium tracking-wide">{item.label}</span>
                </div>
                <ChevronRight size={14} className={cn(
                  "opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1",
                  isActive && "opacity-100 text-primary"
                )} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-2xl bg-surface border border-border mb-4">
          <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold mb-2">{t('proPlan')}</p>
          <div className="w-full h-1.5 bg-surface-hover rounded-full overflow-hidden">
            <div className="w-3/4 h-full bg-primary" />
          </div>
          <p className="text-[10px] text-text-muted mt-2">{t('monthlyQuota')}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-text-muted hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">{t('logout')}</span>
        </button>
      </div>
    </aside>
    </>
  );
};

export default UserSidebar;
