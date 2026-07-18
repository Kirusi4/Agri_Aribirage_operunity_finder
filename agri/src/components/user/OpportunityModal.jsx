import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, ArrowRight, TrendingUp, Truck, DollarSign, BarChart, Info } from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const OpportunityModal = ({ opportunity, isOpen, onClose }) => {
  if (!opportunity) return null;

  const chartData = [
    { name: 'Source Price', price: opportunity.buyAt.price, fill: '#3b82f6' },
    { name: 'Target Price', price: opportunity.sellAt.price, fill: '#10b981' }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-surface border border-white/10 rounded-3xl md:rounded-[3rem] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
          >
            {/* Header */}
            <div className="p-4 md:p-8 border-b border-white/5 flex items-center justify-between sticky top-0 bg-surface z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-primary">Live Trade Analysis</span>
                </div>
                <h2 className="text-xl md:text-3xl font-black">{opportunity.commodity}</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 md:p-3 hover:bg-white/5 rounded-xl md:rounded-2xl transition-colors text-text-muted hover:text-text"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* Top Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl border-emerald-500/20 bg-emerald-500/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block mb-2">Net Profit</span>
                  <div className="text-3xl font-black text-emerald-400">₹{parseFloat(opportunity.profit).toFixed(0)}</div>
                  <span className="text-xs text-text-muted">Per quintal after spread</span>
                </div>
                <div className="glass-card p-6 rounded-3xl border-primary/20 bg-primary/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary block mb-2">ROI Potential</span>
                  <div className="text-3xl font-black text-primary">{opportunity.profitPercentage}%</div>
                  <span className="text-xs text-text-muted">Estimated return on capital</span>
                </div>
                <div className="glass-card p-6 rounded-3xl border-secondary/20 bg-secondary/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-2">Market Status</span>
                  <div className="text-3xl font-black text-secondary">High</div>
                  <span className="text-xs text-text-muted">Demand & Liquidity score</span>
                </div>
              </div>

              {/* Trade Flow */}
              <div className="glass-card p-8 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                  <Truck size={20} className="text-primary" />
                  Logistics & Price Flow
                </h3>
                
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">Source Market</span>
                    <div className="text-xl font-black">{opportunity.buyAt.market}</div>
                    <div className="text-sm text-text-muted flex items-center justify-center md:justify-start gap-1">
                      <MapPin size={12} /> {opportunity.buyAt.state}
                    </div>
                    <div className="mt-4 text-2xl font-black text-primary">₹{opportunity.buyAt.price}</div>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                      <ArrowRight size={24} />
                    </div>
                    <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                  </div>

                  <div className="flex-1 text-center md:text-right">
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">Target Market</span>
                    <div className="text-xl font-black">{opportunity.sellAt.market}</div>
                    <div className="text-sm text-text-muted flex items-center justify-center md:justify-end gap-1">
                      <MapPin size={12} /> {opportunity.sellAt.state}
                    </div>
                    <div className="mt-4 text-2xl font-black text-emerald-400">₹{opportunity.sellAt.price}</div>
                  </div>
                </div>
              </div>

              {/* Price Visualization */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="glass-card p-8 rounded-[2.5rem]">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <BarChart size={20} className="text-secondary" />
                    Price Comparison
                  </h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                      <ReBarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} hide />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                        />
                        <Bar dataKey="price" radius={[8, 8, 0, 0]} barSize={40}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="glass-card p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <Info size={20} className="text-primary" />
                    Trading Insights
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                      </div>
                      <p className="text-sm text-text-muted leading-relaxed">
                        Transport costs between <span className="text-text font-bold">{opportunity.buyAt.state}</span> and <span className="text-text font-bold">{opportunity.sellAt.state}</span> are estimated at ₹150-200/quintal.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                      </div>
                      <p className="text-sm text-text-muted leading-relaxed">
                        Arrivals in {opportunity.buyAt.market} are increasing, suggesting potential further price dips at source.
                      </p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                      </div>
                      <p className="text-sm text-text-muted leading-relaxed">
                        Demand in {opportunity.sellAt.market} for {opportunity.commodity} is currently at a 30-day peak.
                      </p>
                    </li>
                  </ul>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default OpportunityModal;
