
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  hasUnreadNotifications?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ currentView, setView, hasUnreadNotifications }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex justify-between items-center transition-all duration-300">
      <div className="relative">
        <button 
          onClick={() => setView('NOTIFICATIONS')}
          className={`p-2 rounded-full transition-all duration-300 ${currentView === 'NOTIFICATIONS' ? 'text-[#fbbf24] scale-110' : 'text-slate-400 hover:text-[#fbbf24]'}`}
          aria-label="التنبيهات"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${currentView === 'NOTIFICATIONS' ? 'glow-gold' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {hasUnreadNotifications && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#fbbf24] border-2 border-[#0f172a] rounded-full shadow-[0_0_8px_rgba(251,191,36,0.6)]"></span>
          )}
        </button>
      </div>
      
      <div 
        onClick={() => setView('FEED')}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1.5">
            <svg className="w-5 h-5 text-[#fbbf24] glow-gold rotate-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" className="hidden"/>
              <path d="M5.5 10.5C5.5 10.5 8.5 7.5 12 7.5C15.5 7.5 18.5 10.5 18.5 10.5C18.5 10.5 15.5 13.5 12 13.5C8.5 13.5 5.5 10.5 5.5 10.5Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 7.5V16.5M9 12L12 16.5L15 12" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M21 12C21 12 18 15 12 15C6 15 3 12 3 12C3 12 6 9 12 9C18 9 21 12 21 12Z" fill="none" stroke="currentColor" strokeWidth="1" className="opacity-30" />
              <path d="M11 19C11 19 13 14 17 12M13 21C13 21 15 16 19 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <h1 className="text-xl font-bold bg-gradient-to-l from-[#fbbf24] to-[#f8fafc] bg-clip-text text-transparent italic" style={{ fontFamily: "'Cairo', sans-serif" }}>
              روح الإبداع
            </h1>
          </div>
          <div className="h-0.5 w-12 bg-gradient-to-r from-transparent via-[#fbbf24]/50 to-transparent mt-1"></div>
        </div>
      </div>

      <div className="w-10"></div>
    </header>
  );
};
