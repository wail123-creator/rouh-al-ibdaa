
import React from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setView }) => {
  const isActive = (v: View) => currentView === v;

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass border-t border-white/5 px-2 py-4 flex justify-around items-center z-50">
      <button 
        onClick={() => setView('FEED')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('FEED') ? 'text-[#fbbf24] scale-110 glow-gold' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive('FEED') ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('FEED') ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>

      <button 
        onClick={() => setView('SEARCH')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('SEARCH') ? 'text-[#fbbf24] scale-110 glow-gold' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      <button 
        onClick={() => setView('CREATE')}
        className="flex flex-col items-center gap-1 p-3.5 rounded-2xl bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-slate-900 shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-transform active:scale-90 -mt-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <button 
        onClick={() => setView('MESSAGES')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('MESSAGES') || isActive('CHAT_DETAIL') ? 'text-[#fbbf24] scale-110 glow-gold' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive('MESSAGES') ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('MESSAGES') ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      <button 
        onClick={() => setView('PROFILE')}
        className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive('PROFILE') ? 'text-[#fbbf24] scale-110 glow-gold' : 'text-slate-500 hover:text-slate-300'}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isActive('PROFILE') ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive('PROFILE') ? 0 : 2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>
    </nav>
  );
};
