import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import UserSidebar from './UserSidebar';
import { User as UserIcon, ShieldCheck, Menu, X } from 'lucide-react';
import ThemeToggle from '../ThemeToggle';
import { useLanguage } from '../../context/LanguageContext';
import Footer from '../common/Footer';

const UserLayout = () => {
  const navigate = useNavigate();
  const { lang, setLang, t } = useLanguage();
  const [userName, setUserName] = React.useState('User');
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name || 'User');
      setIsAdmin(user.role === 'admin');
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  return (
    <div className="flex min-h-screen bg-background text-text font-sans selection:bg-primary/30 transition-colors overflow-x-hidden">
      <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col w-full">
        <header className="sticky top-0 z-40 h-20 glass border-b border-white/5 px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="lg:hidden p-2 hover:bg-white/5 rounded-xl text-text-muted transition-colors"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-text to-text-muted bg-clip-text text-transparent">{t('marketOverview')}</h2>
              <p className="text-text-muted text-[9px] md:text-[10px] uppercase tracking-widest font-bold">{t('realTimeDataEnabled')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex items-center gap-2 md:gap-3">
              {isAdmin && (
                <button 
                  onClick={() => navigate('/admin')}
                  className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 bg-indigo-600/10 border border-indigo-600/20 text-indigo-400 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <ShieldCheck size={14} />
                  <span className="hidden md:inline">Admin Panel</span>
                </button>
              )}
              <ThemeToggle />
              <div className="h-6 w-px bg-white/10 mx-1"></div>
              <button 
                onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
                className="px-2 md:px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                {lang === 'en' ? 'EN' : 'TA'}
              </button>
            </div>

            {!isAdmin && (
              <div 
                onClick={() => navigate('/user/profile')}
                className="flex items-center gap-3 md:gap-4 pl-4 md:pl-6 border-l border-white/10 group cursor-pointer"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-xs md:text-sm font-bold group-hover:text-primary transition-colors">{userName}</p>
                  <p className="text-[9px] md:text-[10px] text-white/40 font-bold uppercase tracking-widest">{t('premiumMember')}</p>
                </div>
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl bg-gradient-to-tr from-surface to-surface-hover flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-all shadow-xl">
                  <UserIcon size={18} className="text-white/40 group-hover:text-primary transition-colors" />
                </div>
              </div>
            )}
          </div>
        </header>

        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>
        <div className="px-4 md:px-8 pb-8">
          <Footer />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
