import React from 'react';
import { Scale, Search, ArrowRightLeft, TrendingUp, TrendingDown, MapPin, Store, ChevronRight, X, BarChart as ChartIcon, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { agriApi } from '../../api/api';
import { useLanguage } from '../../context/LanguageContext';

const PriceCompare = () => {
  const { t } = useLanguage();
  const [markets, setMarkets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selection, setSelection] = React.useState({ m1: null, m2: null });
  const [searchTerm, setSearchTerm] = React.useState('');

  React.useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const response = await agriApi.getMarkets(100);
        setMarkets(response.data.records || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMarkets();
  }, []);

  const handleSelect = (market, slot) => {
    setSelection(prev => ({ ...prev, [slot]: market }));
  };

  const getDifference = () => {
    if (!selection.m1 || !selection.m2) return null;
    const p1 = parseFloat(selection.m1.modal_price);
    const p2 = parseFloat(selection.m2.modal_price);
    const diff = p2 - p1;
    const percentage = ((diff / p1) * 100).toFixed(2);
    return { diff, percentage, p1, p2 };
  };

  const stats = getDifference();

  const chartData = stats ? [
    { name: selection.m1.market, price: stats.p1, fill: '#3b82f6' },
    { name: selection.m2.market, price: stats.p2, fill: '#10b981' }
  ] : [];

  return (
    <div className="space-y-10 p-4 pb-24 max-w-[1600px] mx-auto">
      <div className="max-w-xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 mb-3"
        >
          <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[8px] font-black uppercase tracking-[0.2em]">
            <Scale size={10} />
            {t('comparison')}
          </div>
        </motion.div>
        <h2 className="text-3xl font-black tracking-tight mb-2">{t('priceCompare')}</h2>
        <p className="text-text-muted text-sm leading-relaxed max-w-lg">
          {t('priceCompareDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['m1', 'm2'].map((slot) => (
              <div key={slot} className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted px-2">
                  {slot === 'm1' ? t('marketA') : t('marketB')}
                </label>
                <div 
                  className={`glass-card p-6 rounded-3xl min-h-[120px] flex flex-col justify-center border-2 transition-all cursor-pointer relative overflow-hidden ${selection[slot] ? 'border-primary/50' : 'border-dashed border-border group hover:border-primary/30'}`}
                  onClick={() => !selection[slot] && document.getElementById('market-list')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  {selection[slot] ? (
                    <>
                      <div className="text-xl font-black mb-1 truncate pr-8">{selection[slot].market}</div>
                      <div className="text-sm text-text-muted">{selection[slot].commodity}</div>
                      <div className="text-2xl font-black text-primary mt-2">₹{selection[slot].modal_price}</div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleSelect(null, slot); }}
                        className="absolute top-4 right-4 text-rose-400 hover:scale-110 transition-transform p-2 bg-surface rounded-full shadow-lg"
                      >
                        <X size={14} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center text-text-muted italic flex flex-col items-center gap-2">
                      <Store size={24} className="opacity-20" />
                      {t('selectMarketBelow')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div id="market-list" className="glass-card p-8 rounded-[2.5rem] space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Store size={20} className="text-primary" />
                {t('availableMarkets')}
              </h3>
              <div className="relative group flex-1 max-w-xs">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder={t('filterMarkets')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl py-2 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all text-sm"
                />
              </div>
            </div>

            {/* Quick Commodity Filters */}
            <div className="flex flex-wrap items-center gap-2 px-1">
              {['Tomato', 'Onion', 'Paddy', 'Banana', 'Watermelon', 'Mango'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 group ${searchTerm === tag ? 'bg-primary border-primary text-white' : 'bg-surface border-white/5 hover:border-primary/50'}`}
                >
                  <Zap size={10} className={searchTerm === tag ? 'text-white' : 'text-primary'} />
                  {tag}
                </button>
              ))}
            </div>
            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-4 custom-scrollbar">
              {loading ? (
                <div className="text-center py-20">
                  <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-text-muted">{t('loadingMarkets')}</p>
                </div>
              ) : (markets.filter(m => 
                  m.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  m.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  m.state.toLowerCase().includes(searchTerm.toLowerCase())
                ).length > 0 ? (
                  markets.filter(m => 
                    m.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    m.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    m.state.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((m, i) => (
                    <div 
                      key={i}
                      className="p-4 bg-surface/50 rounded-2xl border border-border flex items-center justify-between group hover:border-primary/30 transition-all cursor-pointer"
                      onClick={() => !selection.m1 ? handleSelect(m, 'm1') : handleSelect(m, 'm2')}
                    >
                      <div>
                        <div className="font-bold">{m.market}</div>
                        <div className="text-xs text-text-muted">{m.commodity} • {m.state}</div>
                      </div>
                      <div className="font-black text-primary">₹{m.modal_price}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-text-muted italic">
                    {t('noMatchingMarkets')}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex-1 glass-card p-10 rounded-[3rem] border border-primary/10 relative overflow-hidden flex flex-col items-center justify-center min-h-[500px]">
            {stats ? (
              <div className="w-full h-full flex flex-col items-center">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary animate-shimmer"></div>
                
                <div className="w-full h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#94a3b8" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                        itemStyle={{ color: '#ffffff', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="price" radius={[10, 10, 0, 0]} barSize={60}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-10 text-center">
                  <h4 className="text-2xl font-bold mb-2">{t('priceSpreadAnalysis')}</h4>
                  <div className={`text-5xl font-black mb-4 ${stats.diff > 0 ? 'text-emerald-400' : stats.diff < 0 ? 'text-rose-400' : ''}`}>
                    {stats.diff > 0 ? '+' : ''}₹{Math.abs(stats.diff).toFixed(0)}
                  </div>
                  <div className="px-6 py-2 rounded-full bg-surface border border-border text-lg font-bold inline-block">
                    {stats.percentage}% {t('priceVariance')}
                  </div>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-10 w-full max-w-sm">
                  <div className="text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{t('stability')}</span>
                    <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold mt-2">
                      <TrendingUp size={20} />
                      {t('high')}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">{t('transportCheck')}</span>
                    <div className="flex items-center justify-center gap-2 text-secondary font-bold mt-2">
                      {t('ready')}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6 opacity-30 text-center">
                <ChartIcon size={80} />
                <p className="text-xl font-bold">{t('selectTwoMarkets')}</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default PriceCompare;
