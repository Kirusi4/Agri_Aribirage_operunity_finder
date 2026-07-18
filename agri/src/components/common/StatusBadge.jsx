import React from 'react';
import { cn } from '../../lib/utils';

const StatusBadge = ({ children, variant = 'primary', size = 'md', className }) => {
  const variants = {
    primary: 'bg-primary/10 border-primary/20 text-primary',
    secondary: 'bg-secondary/10 border-secondary/20 text-secondary',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    danger: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  };

  const sizes = {
    xs: 'text-[8px] px-2 py-0.5',
    sm: 'text-[9px] px-2.5 py-1',
    md: 'text-[10px] px-3 py-1.5',
  };

  return (
    <span className={cn(
      "inline-flex items-center font-black uppercase tracking-widest rounded-full border transition-all",
      variants[variant],
      sizes[size],
      className
    )}>
      {children}
    </span>
  );
};

export default StatusBadge;
