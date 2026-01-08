
import React, { useState, useEffect } from 'react';
import { User, Post } from '../types';
import { db } from '../services/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

interface AdminDashboardProps {
  onBack: () => void;
  onVerifyUser: (userId: string, isVerified: boolean) => void;
  onDeleteUser: (userId: string) => void;
  onDeletePost: (postId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onBack, 
  onVerifyUser, 
  onDeleteUser, 
  onDeletePost 
}) => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'POSTS'>('USERS');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubUsers = onSnapshot(collection(db, 'users'), (snap) => {
      setUsers(snap.docs.map(d => ({ ...d.data(), id: d.id } as User)));
    });

    const unsubPosts = onSnapshot(query(collection(db, 'posts'), orderBy('createdAt', 'desc')), (snap) => {
      setPosts(snap.docs.map(d => ({ ...d.data(), id: d.id } as Post)));
      setLoading(false);
    });

    return () => {
      unsubUsers();
      unsubPosts();
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-hidden">
      <header className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between sticky top-0 z-10 shadow-xl">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-xl font-black text-[#fbbf24] uppercase tracking-[0.1em] flex items-center gap-2 italic">
          لوحة الإشراف 🛡️
        </h2>
        <div className="w-10"></div>
      </header>

      <div className="px-6 py-4 flex gap-4 bg-slate-900/30 border-b border-slate-800">
        <button 
          onClick={() => setActiveTab('USERS')}
          className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all uppercase tracking-widest ${activeTab === 'USERS' ? 'bg-[#fbbf24] text-slate-900 shadow-xl shadow-[#fbbf24]/20' : 'text-slate-500 border border-slate-700 hover:text-slate-300'}`}
        >
          المستخدمين ({users.length})
        </button>
        <button 
          onClick={() => setActiveTab('POSTS')}
          className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all uppercase tracking-widest ${activeTab === 'POSTS' ? 'bg-[#fbbf24] text-slate-900 shadow-xl shadow-[#fbbf24]/20' : 'text-slate-500 border border-slate-700 hover:text-slate-300'}`}
        >
          الخواطر ({posts.length})
        </button>
      </div>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
          </div>
        ) : activeTab === 'USERS' ? (
          users.map(u => (
            <div key={u.id} className="bg-slate-800/40 border border-slate-800 rounded-3xl p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-right">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-[#fbbf24] font-bold border border-slate-700 shadow-inner">
                  {u.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {u.isVerified && <span className="text-[#fbbf24]">✓</span>}
                    <h4 className="font-bold text-white text-sm">{u.name}</h4>
                  </div>
                  <p className="text-[10px] text-slate-500 italic truncate max-w-[120px]">{u.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onVerifyUser(u.id, !u.isVerified)}
                  className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase transition-all ${u.isVerified ? 'bg-slate-700 text-slate-400' : 'bg-sky-500 text-white shadow-lg shadow-sky-500/20'}`}
                >
                  {u.isVerified ? 'إلغاء توثيق' : 'توثيق'}
                </button>
                <button 
                  onClick={() => onDeleteUser(u.id)}
                  className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase bg-rose-500/20 text-rose-500 border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all"
                >
                  حذف
                </button>
              </div>
            </div>
          ))
        ) : (
          posts.map(p => (
            <div key={p.id} className="bg-slate-800/40 border border-slate-800 rounded-3xl p-5 space-y-3">
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => onDeletePost(p.id)}
                  className="px-3 py-1.5 rounded-xl text-[9px] font-black uppercase bg-rose-500 text-white shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                >
                  حذف الخاطرة
                </button>
                <div className="text-right">
                  <h4 className="font-bold text-white text-xs">{p.authorName}</h4>
                  <p className="text-[9px] text-slate-500">{p.date}</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 italic line-clamp-2 poetic-text leading-relaxed border-t border-slate-700/50 pt-3">
                {p.content}
              </p>
            </div>
          ))
        )}
      </main>
    </div>
  );
};
