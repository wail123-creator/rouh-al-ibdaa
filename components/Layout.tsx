
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen max-w-md mx-auto shadow-2xl bg-[#0f172a] flex flex-col relative overflow-hidden ring-1 ring-slate-800">
      {children}
    </div>
  );
};
