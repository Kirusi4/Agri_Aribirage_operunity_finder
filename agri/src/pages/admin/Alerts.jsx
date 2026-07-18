import React from 'react';
import { Bell, Search, Filter, Calendar, MapPin, Tag } from 'lucide-react';
import { adminApi } from '../../api/api';
import { motion } from 'framer-motion';

const AdminAlerts = () => {
  const [alerts, setAlerts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAlertLogs();
      setAlerts(response.data);
    } catch (err) {
      console.error('Failed to fetch alerts', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter(alert => 
    alert.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alert.market.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black mb-2">Alert History</h2>
          <p className="text-slate-500 font-medium">Tracking all Telegram broadcasts and system notifications</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by commodity or market..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-2xl py-3 pl-12 pr-6 focus:outline-none focus:border-indigo-500 transition-all text-sm w-80"
            />
          </div>
          <button 
            onClick={fetchAlerts}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20"
          >
            Refresh Logs
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/50">
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Timestamp</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Commodity</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Market</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Price (₹)</th>
              <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading ? (
              [1, 2, 3, 4, 5].map(i => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="5" className="p-6"><div className="h-4 bg-slate-800 rounded w-full"></div></td>
                </tr>
              ))
            ) : filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert, index) => (
                <motion.tr 
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{new Date(alert.createdAt).toLocaleDateString()}</span>
                      <span className="text-[10px] text-slate-500 font-bold">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Tag size={14} className="text-indigo-400" />
                      </div>
                      <span className="text-sm font-black">{alert.commodity}</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <MapPin size={14} className="text-slate-500" />
                      {alert.market}
                    </div>
                  </td>
                  <td className="p-6 text-sm font-black text-indigo-400">
                    ₹{alert.price}
                  </td>
                  <td className="p-6">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                      {alert.status}
                    </span>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-20 text-center text-slate-500 italic">
                  No alerts found in the history log.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAlerts;
