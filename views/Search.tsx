
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';

interface SearchProps {
  onProfileClick: (userId: string) => void;
}

export const Search: React.FC<SearchProps> = ({ onProfileClick }) => {
  const [queryStr, setQueryStr] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchUsers = async () => {
      if (queryStr.trim().length < 2) {
        setUsers([]);
        return;
      }

      setLoading(true);
      try {
        const q = query(
          collection(db, 'users'),
          where('name', '>=', queryStr),
          where('name', '<=', queryStr + '\uf8ff'),
          limit(10)
        );
        
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as User));
        setUsers(results);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchUsers, 500);
    return () => clearTimeout(timer);
  }, [queryStr]);

  return (
    <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32 bg-[#0f172a]">
      <header className="mb-10 text-right">
        <h2 className="text-3xl font-bold text-white mb-2 italic">استكشاف</h2>
        <p className="text-sm text-slate-400 font-medium italic">ابحث عن المبدعين ورفاق الحرف</p>
      </header>

      <div className="relative mb-12 group">
        <input
          type="text"
          value={queryStr}
          onChange={(e) => setQueryStr(e.target.value)}
          placeholder="ابحث بالاسم..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl px-14 py-5 text-right text-white focus:outline-none focus:ring-4 focus:ring-[#fbbf24]/10 shadow-inner transition-all placeholder:text-slate-600 italic"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#fbbf24] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
          </div>
        ) : queryStr.trim() === '' ? (
          <div className="text-center py-24 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto mb-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-xl font-bold text-white italic">ابدأ رحلة البحث عن رفقاء الحرف</p>
          </div>
        ) : users.length > 0 ? (
          users.map(u => (
            <div 
              key={u.id}
              onClick={() => onProfileClick(u.id)}
              className="w-full bg-slate-800/40 border border-slate-800 rounded-3xl p-5 flex items-center gap-4 text-right hover:bg-slate-800 transition-all group cursor-pointer active:scale-[0.98]"
            >
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-[#fbbf24] font-bold text-xl border border-slate-700 group-hover:border-[#fbbf24]/40 transition-colors shadow-lg">
                  {u.name.charAt(0)}
                </div>
                {/* Online Status Dot */}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 shadow-md ${u.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-1 justify-end">
                  {u.isVerified && (
                    <svg className="w-3.5 h-3.5 text-[#fbbf24]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  )}
                  <h4 className="font-bold text-white group-hover:text-[#fbbf24] transition-colors">{u.name}</h4>
                </div>
                <p className="text-[10px] text-slate-500 truncate italic">{u.bio || (u.isOnline ? 'متواجد الآن' : 'غير متصل')}</p>
              </div>
              <div className="text-slate-600 group-hover:text-[#fbbf24] transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                 </svg>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-slate-500 font-bold italic tracking-wider">
            لم نجد أحداً يطابق "{queryStr}"
          </div>
        )}
      </div>
    </div>
  );
};
