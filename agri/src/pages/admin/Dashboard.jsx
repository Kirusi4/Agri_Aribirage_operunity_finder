import React from 'react';
import { Users, Bell, Activity, Database, TrendingUp, ShieldAlert, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import api, { adminApi, agriApi } from '../../api/api';

const AdminDashboard = () => {
  const [stats, setStats] = React.useState({
    userCount: 0,
    alertCount: 0,
    marketStats: { totalMarkets: 0 }
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats();
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center text-indigo-400">Loading System Stats...</div>;

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Users', value: stats?.userCount, icon: Users, color: 'text-blue-400' },
          { label: 'Alerts Sent', value: stats?.alertCount, icon: Bell, color: 'text-amber-400' },
          { label: 'Active Markets', value: stats?.marketStats?.totalMarkets, icon: Database, color: 'text-indigo-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
            <stat.icon className={`${stat.color} mb-4`} size={32} />
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-4xl font-black mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Activity className="text-emerald-400" size={20} />
            System Health
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-2xl border border-slate-800">
              <span className="text-sm font-medium">Database Connection</span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full uppercase">Stable</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-2xl border border-slate-800">
              <span className="text-sm font-medium">OGD API Sync</span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full uppercase">Active</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-800/30 rounded-2xl border border-slate-800">
              <span className="text-sm font-medium">Telegram Bot Service</span>
              <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full uppercase">Online</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center space-y-4">
          <ShieldAlert className="text-indigo-400" size={60} />
          <h3 className="text-2xl font-bold">Telegram Broadcast</h3>
          <p className="text-slate-400 text-sm max-w-xs mx-auto">
            Instantly send the top arbitrage signal directly to the connected Telegram Group.
          </p>
          <button 
            onClick={async () => {
              try {
                const details = {
                  commodity: "Paddy (Dhan)",
                  price: "2650",
                  market: "Nawabganj APMC"
                };
                await agriApi.sendTelegramAlert('', details);
                alert("Alert successfully sent to Telegram Group!");
              } catch (err) {
                console.error(err);
                alert("Failed to send alert.");
              }
            }}
            className="px-6 py-3 bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
          >
            <Send size={18} />
            Broadcast Top Signal to Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
