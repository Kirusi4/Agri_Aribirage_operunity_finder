import React from 'react';
import { Store, Search, Filter, TrendingUp, MapPin, Activity, ChevronRight, X, Mic, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { agriApi } from '../../api/api';
import GlassCard from '../../components/common/GlassCard';
import StatusBadge from '../../components/common/StatusBadge';
import { useLanguage } from '../../context/LanguageContext';

const UserMarkets = () => {
  const { t } = useLanguage();
  const [markets, setMarkets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [offset, setOffset] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedState, setSelectedState] = React.useState('Tamil Nadu');
  const [selectedCommodity, setSelectedCommodity] = React.useState('');
  const [showFilters, setShowFilters] = React.useState(false);
  const [source, setSource] = React.useState('live');
  const [isListening, setIsListening] = React.useState(false);

  const startVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
  };
  
  const LIMIT = 12;

  const fetchMarkets = async (currentOffset = 0, isNewSearch = false) => {
    try {
      if (currentOffset === 0) setLoading(true);
      else setLoadingMore(true);

      const response = await agriApi.getMarkets(
        LIMIT, 
        currentOffset, 
        selectedState, 
        selectedCommodity
      );
      
      const newRecords = response.data.records || [];
      setSource(response.data.source || 'live');
      
      setMarkets(prev => (currentOffset === 0 || isNewSearch) ? newRecords : [...prev, ...newRecords]);
      if (isNewSearch) setOffset(0);
    } catch (err) {
      console.error('Failed to fetch markets', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  React.useEffect(() => {
    fetchMarkets(0, true);
  }, [selectedState, selectedCommodity]);

  const handleLoadMore = () => {
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    fetchMarkets(nextOffset);
  };

  const filteredMarkets = markets.filter(m => 
    m.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const states = [...new Set(markets.map(m => m.state))].sort();
  const commodities = [...new Set(markets.map(m => m.commodity))].sort();

  return (
    <div className="space-y-10 p-4 pb-24 max-w-[1600px] mx-auto">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="max-w-xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-[0.2em]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              {source === 'ogd_api' ? t('live') : t('cached')}
            </div>
          </motion.div>
          <h2 className="text-3xl font-black tracking-tight mb-2">{t('marketExplorer')}</h2>
          <p className="text-text-muted text-sm leading-relaxed max-w-lg">
            {t('realTimeDataEnabled')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3 bg-surface/50 backdrop-blur-xl rounded-2xl border border-border flex items-center gap-4 px-6">
            <div className="text-center">
              <span className="block text-[8px] font-black text-text-muted uppercase tracking-widest">{t('total')}</span>
              <span className="text-lg font-black">{filteredMarkets.length}</span>
            </div>
            <div className="w-px h-6 bg-border"></div>
            <div className="text-center">
              <span className="block text-[8px] font-black text-text-muted uppercase tracking-widest">{t('update')}</span>
              <span className="text-lg font-black">{t('today')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search Tags */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest mr-2">{t('popular')}:</span>
        {['Tomato', 'Onion', 'Paddy', 'Banana', 'Watermelon', 'Mango'].map((tag) => (
          <button
            key={tag}
            onClick={() => {
              setSelectedCommodity(tag);
              setSearchTerm(''); // Clear local search to show API results
            }}
            className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 group ${selectedCommodity === tag ? 'bg-primary border-primary text-white' : 'bg-surface border-white/5 hover:border-primary/50 hover:bg-primary/5'}`}
          >
            <Zap size={12} className={selectedCommodity === tag ? 'text-white' : 'text-primary group-hover:scale-125 transition-transform'} />
            {tag}
          </button>
        ))}
        {selectedCommodity && (
          <button 
            onClick={() => setSelectedCommodity('')}
            className="text-[10px] font-bold text-primary hover:underline ml-2"
          >
            {t('clearFilter')}
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="sticky top-4 z-40 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface/80 backdrop-blur-2xl border border-border rounded-2xl py-4 pl-14 pr-16 focus:outline-none focus:border-primary/50 transition-all text-lg shadow-lg"
          />
          <button 
            onClick={startVoiceSearch}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${isListening ? 'bg-primary text-white animate-pulse' : 'bg-white/5 text-text-muted hover:text-primary hover:bg-primary/10'}`}
          >
            <Mic size={18} />
          </button>
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg ${showFilters ? 'bg-primary text-white scale-95' : 'bg-surface/80 backdrop-blur-2xl border border-border text-text hover:bg-surface'}`}
        >
          <Filter size={18} />
          {t('filters')}
        </button>
      </div>

      {/* Filter Panels */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-card p-8 rounded-[3rem] border border-primary/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted px-2">{t('state')}</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedState('')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedState === '' ? 'bg-primary text-white' : 'bg-surface hover:bg-border'}`}
                  >
                    {t('allStates')}
                  </button>
                  {states.map(s => (
                    <button 
                      key={s}
                      onClick={() => setSelectedState(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedState === s ? 'bg-primary text-white' : 'bg-surface hover:bg-border'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted px-2">Commodity</label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => setSelectedCommodity('')}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCommodity === '' ? 'bg-primary text-white' : 'bg-surface hover:bg-border'}`}
                  >
                    {t('allCommodities')}
                  </button>
                  {commodities.map(c => (
                    <button 
                      key={c}
                      onClick={() => setSelectedCommodity(c)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCommodity === c ? 'bg-primary text-white' : 'bg-surface hover:bg-border'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-end justify-end">
                <button 
                  onClick={() => { setSelectedState(''); setSelectedCommodity(''); }}
                  className="flex items-center gap-2 text-rose-400 font-bold hover:text-rose-300 transition-colors"
                >
                  <X size={18} />
                  {t('clearAllFilters')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Market Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-[400px] animate-pulse bg-white/5 rounded-[3rem] border border-border/50"></div>
          ))
        ) : filteredMarkets.length > 0 ? (
          filteredMarkets.map((market, index) => (
            <GlassCard
              key={index}
              delay={(index % 12) * 0.05}
              className="p-6 group"
            >
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="p-3 bg-surface/50 rounded-xl border border-border group-hover:border-primary/30 transition-colors">
                  <Store size={20} className="text-primary" />
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-text-muted block mb-0.5">{t('state')}</span>
                  <StatusBadge variant="info" size="xs">{market.state}</StatusBadge>
                </div>
              </div>

              <div className="mb-6 relative z-10">
                <h3 className="text-xl font-black group-hover:text-primary transition-colors leading-tight mb-1 truncate">{market.market}</h3>
                <div className="flex items-center gap-1.5 text-text-muted">
                  <MapPin size={12} className="text-primary/50" />
                  <span className="font-medium text-xs truncate">{market.district}</span>
                </div>
              </div>

              <div className="space-y-4 relative z-10 bg-surface/30 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted font-bold text-[10px] uppercase tracking-widest">{t('commodity')}</span>
                  <StatusBadge variant="primary" size="sm">{market.commodity}</StatusBadge>
                </div>
                
                <div className="w-full h-px bg-border/20"></div>

                <div className="flex items-end justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[8px] text-text-muted font-black uppercase tracking-widest block">{t('marketPrice')}</span>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black">₹{market.modal_price}</span>
                      <span className="text-[8px] text-text-muted font-bold uppercase">{t('perQtl')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className={`w-1 h-3 rounded-full ${i <= 4 ? 'bg-emerald-500' : 'bg-emerald-500/20'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </GlassCard>
          ))
        ) : (
          <div className="col-span-full py-32 text-center">
            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6 border border-border">
              <Search size={40} className="text-text-muted" />
            </div>
            <h3 className="text-3xl font-black mb-2">{t('noMarketsFound')}</h3>
            <p className="text-text-muted text-lg max-w-md mx-auto">
              {t('noResultsMessage')}
            </p>
            <button 
              onClick={() => { setSearchTerm(''); setSelectedState(''); setSelectedCommodity(''); }}
              className="mt-8 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:scale-105 transition-all"
            >
              {t('resetAllSearches')}
            </button>
          </div>
        )}
      </div>

      {/* Load More Section */}
      {filteredMarkets.length > 0 && (
        <div className="flex justify-center pt-16">
          <button 
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="group relative px-20 py-6 bg-surface/50 backdrop-blur-xl border border-border rounded-[2.5rem] font-black text-xl hover:bg-primary hover:text-white hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50 flex items-center gap-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/10 to-primary/0 -translate-x-full group-hover:animate-shimmer"></div>
            {loadingMore ? (
              <>
                <Activity className="animate-spin" size={24} />
                {t('synchronizing')}
              </>
            ) : (
              <>
                {t('exploreMoreMarkets')}
                <ChevronRight size={24} />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMarkets;
