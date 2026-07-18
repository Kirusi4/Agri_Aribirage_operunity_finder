import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowRight, Mail, Lock } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../api/api';

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/user');
    } catch (error) {
      alert('Login failed: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-primary opacity-10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-secondary opacity-10 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-card p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-primary to-emerald-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 mb-6">
            <TrendingUp size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-text-muted text-sm mt-2">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-text-muted ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="email" 
                name="email"
                placeholder="alex@example.com"
                className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/20 text-text"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold uppercase tracking-widest text-text-muted">Password</label>
              <button type="button" className="text-[10px] text-primary font-bold uppercase tracking-widest hover:underline">Forgot?</button>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors" size={20} />
              <input 
                type="password" 
                name="password"
                placeholder="••••••••"
                className="w-full bg-surface border border-border rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-all placeholder:text-text-muted/20 text-text"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
          >
            Sign In
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
            <span className="text-text-muted">Don't have an account? </span>
            <Link to="/register" className="text-primary font-bold hover:underline">Create Account</Link>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;
