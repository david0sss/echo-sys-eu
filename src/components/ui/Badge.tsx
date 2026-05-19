import React from 'react';

export const Badge = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <span className={`inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20 ${className}`}>
      {children}
    </span>
  );
};
