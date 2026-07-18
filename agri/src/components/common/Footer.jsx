import React from 'react';
import { Globe, MessageCircle, Briefcase, Mail, Heart, ShieldCheck, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-white/5 pt-10 pb-8 px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldCheck className="text-white" size={18} />
            </div>
            <h3 className="font-black text-lg tracking-tight">AgriArb</h3>
          </div>
          <p className="text-xs text-text-muted leading-relaxed font-medium">
            Empowering Tamil Nadu's farmers with real-time market insights and 
            intelligent arbitrage opportunities. Data-driven growth for our agriculture.
          </p>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-6">Quick Links</h4>
          <ul className="space-y-3">
            {['Markets', 'Opportunities', 'Price Compare', 'Profile'].map((item) => (
              <li key={item}>
                <a href={`/user/${item.toLowerCase().replace(' ', '-')}`} className="text-xs font-bold text-text-muted hover:text-primary transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-6">Contact Us</h4>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Primary Support</p>
              <div className="space-y-1">
                <a href="mailto:kirusikesan257@gmail.com" className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors">
                  <Mail size={12} /> kirusikesan257@gmail.com
                </a>
                <a href="tel:9360639836" className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors">
                  <Phone size={12} /> +91 9360639836
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Alternative</p>
              <div className="space-y-1">
                <a href="mailto:androws@gmail.com" className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors">
                  <Mail size={12} /> androws@gmail.com
                </a>
                <a href="tel:8940066101" className="flex items-center gap-2 text-xs font-bold text-text-muted hover:text-primary transition-colors">
                  <Phone size={12} /> +91 8940066101
                </a>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="mt-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-[10px] font-bold text-primary">System Online</p>
            <p className="text-[9px] text-text-muted mt-1 uppercase tracking-widest">Global Market Sync: Active</p>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
          © {currentYear} AgriArb Platform. All rights reserved.
        </p>
        <p className="text-[10px] font-bold text-text-muted flex items-center gap-1 uppercase tracking-widest">
          Made with <Heart size={10} className="text-rose-500 fill-rose-500" /> by Kirusikesan and Androws Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
