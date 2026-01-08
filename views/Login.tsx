
import React, { useState } from 'react';
import { View } from '../types';

interface LoginProps {
  setView: (view: View) => void;
  onLogin: (email: string, pass: string, isNew: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ setView, onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password, isSignup);
    }
  };

  return (
    <div className="flex flex-col h-full px-8 pt-20 pb-10 bg-[#0f172a]">
      <div className="mb-14 text-center">
        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] rounded-[2rem] rotate-12 group-hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-[#fbbf24]/20"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-900 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 italic" style={{ fontFamily: "'Cairo', sans-serif" }}>روح الإبداع</h1>
        <p className="text-slate-400 text-lg font-light italic">ملاذ الكلمة والروح في الفضاء الرقمي</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignup && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <label className="block text-xs font-bold text-slate-500 mb-2 mr-1 uppercase tracking-widest">الاسم الكامل</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="اكتب اسمك هنا"
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 transition-all text-right text-white placeholder:text-slate-700 shadow-inner"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 mr-1 uppercase tracking-widest">البريد الإلكتروني</label>
          <input 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@creative.sa"
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 transition-all text-right text-white placeholder:text-slate-700 shadow-inner"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-2 mr-1 uppercase tracking-widest">كلمة السر</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 transition-all text-right text-white placeholder:text-slate-700 shadow-inner"
            required
          />
        </div>

        <button 
          type="submit"
          className="mt-10 w-full bg-gradient-to-r from-[#fbbf24] to-[#f59e0b] text-slate-900 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#fbbf24]/20 active:scale-95 transition-transform"
        >
          {isSignup ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
        </button>
      </form>

      <div className="mt-10 text-center">
        <button 
          onClick={() => setIsSignup(!isSignup)}
          className="text-slate-400 font-medium hover:text-[#fbbf24] transition-colors"
        >
          {isSignup ? 'لديك حساب بالفعل؟ سجل دخولك' : 'ليس لديك حساب؟ انضم إلينا الآن'}
        </button>
      </div>
    </div>
  );
};
