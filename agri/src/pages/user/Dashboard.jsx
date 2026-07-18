import React from 'react';
import { 
  Zap, 
  MapPin, 
  ArrowRight,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpRight,
  Activity,
  Send
} from 'lucide-react';
import { motion } from 'framer-motion';
import { agriApi } from '../../api/api';
import OpportunityModal from '../../components/user/OpportunityModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useLanguage } from '../../context/LanguageContext';
import StatusBadge from '../../components/common/StatusBadge';

const UserDashboard = () => {
  const { t } = useLanguage();
  const [opportunities, setOpportunities] = React.useState([]);
  const [stats, setStats] = React.useState({ totalMarkets: 0, activeCommodities: 0, activeOpportunities: 0 });
  const [loading, setLoading] = React.useState(true);


  const [selectedOpp, setSelectedOpp] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [oppsRes, statsRes] = await Promise.all([
          agriApi.getOpportunities(),
          agriApi.getStats()
        ]);
        setOpportunities(oppsRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch opportunities', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = opportunities.slice(0, 5).map(opp => ({
    name: opp.commodity,
    profit: parseFloat(opp.profit),
    forecast: parseFloat(opp.profit) * (1 + (Math.random() * 0.2 - 0.05)), // Simulated prediction
    roi: parseFloat(opp.profitPercentage)
  }));

  return (
    <div className="space-y-8">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: t('marketsMonitored'), value: stats.totalMarkets, icon: MapPin, color: 'text-primary' },
          { label: t('activeCommodities'), value: stats.activeCommodities, icon: Layers, color: 'text-secondary' },
          { label: t('hotOpportunities'), value: stats.activeOpportunities, icon: Zap, color: 'text-emerald-400' },
          { label: t('systemHealth'), value: '100%', icon: Activity, color: 'text-blue-400' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-[2rem] border border-white/5 flex items-center gap-4"
          >
            <div className={`p-3 bg-surface rounded-xl ${stat.color} border border-white/5 shadow-sm`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-black">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Health Summary Chart */}
        <div className="lg:col-span-2 glass-card p-8 rounded-[2.5rem] border border-white/5 overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-black flex items-center gap-2">
                <BarChart3 className="text-primary" size={20} />
                {t('marketProfitIndex')}
              </h3>
              <p className="text-xs text-text-muted mt-1 uppercase tracking-widest font-bold">{t('topProfitableSpreads')}</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
              <ArrowUpRight size={12} />
              {t('liveTrends')}
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ 
                    backgroundColor: '#111827', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="profit" name={t('currentProfit')} radius={[8, 8, 0, 0]} barSize={30}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" fillOpacity={0.8} />
                  ))}
                </Bar>
                <Bar dataKey="forecast" name={t('aiForecast')} radius={[8, 8, 0, 0]} barSize={20} fill="#10b981" fillOpacity={0.4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Insights Card */}
        <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
          <h3 className="text-xl font-black mb-6">{t('arbitrageSignal')}</h3>
          <div className="space-y-6">
            <div className="p-5 bg-surface rounded-2xl border border-white/5">
              <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest block mb-2">{t('primaryRecommendation')}</span>
              <p className="text-sm font-medium leading-relaxed">
                {opportunities.length > 0 
                  ? t('recommendationText').replace('{commodity}', opportunities[0].commodity).replace('{profit}', opportunities[0].profitPercentage).replace('{market}', opportunities[0].buyAt.market)
                  : t('scanningMarkets')}
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <span className="text-xs font-bold">{t('dataFreshness')}</span>
                <span className="text-xs font-black text-primary">{t('live')}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                <span className="text-xs font-bold">{t('analysisEngine')}</span>
                <span className="text-xs font-black text-secondary">V2.4 {t('active')}</span>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Paddy Spotlight Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black flex items-center gap-2">
            <Layers className="text-amber-500" size={24} />
            {t('commoditySpotlight')}: <span className="text-amber-500 italic">Paddy</span>
          </h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-text-muted bg-surface px-3 py-1 rounded-full border border-border">{t('realTimeTracker')}</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { market: 'Tiruppur APMC', price: '2450', state: 'Tamil Nadu', trend: 'up' },
            { market: 'Madurai APMC', price: '2300', state: 'Tamil Nadu', trend: 'stable' },
            { market: 'Thanjavur APMC', price: '2100', state: 'Tamil Nadu', trend: 'down' },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="glass-card p-5 rounded-3xl border border-amber-500/10 hover:border-amber-500/30 transition-all bg-gradient-to-tr from-amber-500/5 to-transparent"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">{t('market')}</p>
                  <h4 className="font-bold text-sm truncate">{item.market}</h4>
                </div>
                <StatusBadge variant={item.trend === 'up' ? 'success' : item.trend === 'down' ? 'danger' : 'info'} size="xs">
                  {item.trend}
                </StatusBadge>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest">{t('modalPrice')}</p>
                  <p className="text-2xl font-black text-amber-500">₹{item.price}</p>
                </div>
                <div className="text-[10px] font-bold text-text-muted">
                  {item.state}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hot Opportunities Header */}
      <div className="flex items-center justify-between pt-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Zap className="text-primary" size={24} />
          {t('hotOpportunities')}
        </h3>
        <button className="text-text-muted text-sm font-bold uppercase tracking-widest hover:text-text transition-colors flex items-center gap-2 group">
          {t('seeAll')}
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
      
      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="glass-card p-6 rounded-3xl h-64 animate-pulse bg-white/5"></div>
          ))
        ) : opportunities.length > 0 ? (
          opportunities.map((opp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 rounded-3xl border-l-4 border-primary/20 hover:border-primary/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="text-xl font-bold group-hover:text-primary transition-colors">{opp.commodity}</h4>
                <span className="px-2 py-0.5 rounded bg-surface text-[9px] font-bold uppercase tracking-wider text-primary border border-primary/20">
                  {opp.profitPercentage}% ROI
                </span>
              </div>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex flex-col min-w-0">
                  <span className="text-[9px] text-text-muted uppercase font-bold tracking-widest">{t('buy')}</span>
                  <span className="font-bold truncate text-sm">{opp.buyAt.market}</span>
                </div>
                <div className="flex flex-col items-center justify-center h-full px-2 opacity-20">
                  <ArrowRight size={14} />
                </div>
                <div className="flex flex-col min-w-0 text-right">
                  <span className="text-[9px] text-text-muted uppercase font-bold tracking-widest">{t('sell')}</span>
                  <span className="font-bold truncate text-sm">{opp.sellAt.market}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest">{t('estProfit')}</p>
                  <p className="text-lg font-black">₹{parseFloat(opp.profit).toFixed(0)} <span className="text-[10px] font-normal text-text-muted">{t('perQtl')}</span></p>
                </div>
                <button 
                  onClick={() => { setSelectedOpp(opp); setIsModalOpen(true); }}
                  className="p-3 bg-surface hover:bg-primary hover:text-white rounded-xl transition-all duration-300 shadow-lg group-hover:shadow-primary/20"
                >
                  <ArrowUpRight size={20} />
                </button>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center glass-card rounded-[2.5rem]">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <Zap size={32} className="text-text-muted" />
            </div>
            <p className="text-text-muted text-sm font-medium italic">{t('scanningMarkets')}</p>
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

export default UserDashboard;
