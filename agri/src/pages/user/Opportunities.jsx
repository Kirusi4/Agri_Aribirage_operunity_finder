import React from 'react';
import { Zap, ArrowRight, TrendingUp, Filter, Search, MapPin, ExternalLink, ShieldCheck, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { agriApi } from '../../api/api';
import OpportunityModal from '../../components/user/OpportunityModal';
import { useLanguage } from '../../context/LanguageContext';

const UserOpportunities = () => {
  const { t } = useLanguage();
  const [opportunities, setOpportunities] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedOpp, setSelectedOpp] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const response = await agriApi.getOpportunities();
      setOpportunities(response.data || []);
    } catch (err) {
      console.error('Failed to fetch opportunities', err);
    } finally {
      setLoading(false);
    }
  };



  React.useEffect(() => {
    fetchOpportunities();
  }, []);

  const filteredOpps = opportunities.filter(opp => 
    opp.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.buyAt.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opp.sellAt.market.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 p-4 pb-24 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-3"
          >
            <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[8px] font-black uppercase tracking-[0.2em]">
              <Zap size={10} className="fill-primary" />
              {t('aiSignals')}
            </div>
          </motion.div>
          <h2 className="text-3xl font-black tracking-tight mb-2">{t('arbitrageOpportunities')}</h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-lg">
            {t('opportunitiesDescription')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={fetchOpportunities}
            className="px-6 py-3 bg-surface border border-border rounded-xl text-sm font-bold hover:bg-border transition-all flex items-center gap-2"
          >
            {t('refresh')}
            <TrendingUp size={16} />
          </button>
        </div>
      </div>
      
      {/* Quick Search Tags */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest mr-2">{t('focus')}:</span>
        {['Tomato', 'Onion', 'Paddy', 'Banana', 'Watermelon', 'Mango'].map((tag) => (
          <button
            key={tag}
            onClick={() => setSearchTerm(tag)}
            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 group ${searchTerm === tag ? 'bg-primary border-primary text-white' : 'bg-surface border-white/5 hover:border-primary/50 hover:bg-primary/5'}`}
          >
            <Zap size={12} className={searchTerm === tag ? 'text-white' : 'text-primary group-hover:scale-125 transition-transform'} />
            {tag}
          </button>
        ))}
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')}
            className="text-[10px] font-bold text-primary hover:underline ml-2"
          >
            {t('clear')}
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="relative group max-w-xl">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
        <input 
          type="text" 
          placeholder={t('searchPlaceholderOpportunities')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-surface/80 backdrop-blur-2xl border border-border rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-primary/50 transition-all text-lg shadow-lg"
        />
      </div>

      {/* Opportunities List */}
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-64 animate-pulse bg-white/5 rounded-[2.5rem] border border-border"></div>
          ))
        ) : filteredOpps.length > 0 ? (
          <AnimatePresence>
            {filteredOpps.map((opp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-1 relative overflow-hidden rounded-[2rem] group"
              >
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-48 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none"></div>
                
                <div className="flex flex-col lg:flex-row items-stretch p-6 gap-6">
                  {/* Commodity & Profit */}
                  <div className="lg:w-1/4 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-border pb-6 lg:pb-0 lg:pr-6">
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-1">{t('signal')}</span>
                    <h3 className="text-2xl font-black mb-2 truncate">{opp.commodity}</h3>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-black">
                      <TrendingUp size={14} />
                      {opp.profitPercentage}%
                    </div>
                  </div>

                  {/* The Trade Path */}
                  <div className="flex-1 flex flex-col md:flex-row items-center justify-around gap-8 py-2">
                    {/* Source */}
                    <div className="text-center md:text-left flex flex-col items-center md:items-start group/buy">
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-2 px-2 py-0.5 bg-blue-400/10 rounded-lg border border-blue-400/20">{t('buyAt')}</span>
                      <div className="text-lg font-black truncate max-w-[180px] group-hover/buy:text-primary transition-colors">{opp.buyAt.market}</div>
                      <div className="text-2xl font-black text-blue-400 mt-2 flex items-baseline gap-1">
                        <span className="text-sm font-bold opacity-50">₹</span>
                        {opp.buyAt.price}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
                        <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-transform" />
                      </div>
                      <span className="text-[8px] font-black text-text-muted uppercase tracking-widest">{t('tradeRoute')}</span>
                    </div>

                    {/* Target */}
                    <div className="text-center md:text-right flex flex-col items-center md:items-end group/sell">
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-2 px-2 py-0.5 bg-emerald-400/10 rounded-lg border border-emerald-400/20">{t('sellAt')}</span>
                      <div className="text-lg font-black truncate max-w-[180px] group-hover/sell:text-emerald-400 transition-colors">{opp.sellAt.market}</div>
                      <div className="text-2xl font-black text-emerald-400 mt-2 flex items-baseline gap-1">
                        <span className="text-sm font-bold opacity-50">₹</span>
                        {opp.sellAt.price}
                      </div>
                    </div>
                  </div>

                  {/* Profit Indicator */}
                  <div className="lg:w-1/5 flex flex-col justify-center items-center lg:items-end border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8">
                    <div className="text-center lg:text-right mb-4">
                      <span className="text-[9px] font-black text-text-muted uppercase tracking-widest block mb-1">{t('expectedProfit')}</span>
                      <span className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-primary bg-clip-text text-transparent">
                        ₹{parseFloat(opp.profit).toFixed(0)}
                      </span>
                      <span className="text-[10px] text-text-muted font-bold block mt-1">{t('perQuintal')}</span>
                    </div>


                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-32 text-center glass-card rounded-[3rem]">
            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
              <Zap size={40} className="text-text-muted" />
            </div>
            <h3 className="text-3xl font-black mb-2">{t('noArbitrageDetected')}</h3>
            <p className="text-text-muted text-lg">{t('noSignificantSpreads')}</p>
          </div>
        )}
      </div>

      <OpportunityModal 
        opportunity={selectedOpp} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default UserOpportunities;
