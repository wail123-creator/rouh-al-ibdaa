
import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../types';

interface FollowListProps {
  mode: 'FOLLOWERS' | 'FOLLOWING';
  userIds: string[];
  onBack: () => void;
  onProfileClick: (userId: string) => void;
}

export const FollowList: React.FC<FollowListProps> = ({ mode, userIds, onBack, onProfileClick }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const userList: User[] = [];
      for (const id of userIds) {
        const snap = await getDoc(doc(db, 'users', id));
        if (snap.exists()) {
          userList.push(snap.data() as User);
        }
      }
      setUsers(userList);
      setLoading(false);
    };

    if (userIds && userIds.length > 0) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [userIds]);

  return (
    <div className="flex-1 flex flex-col bg-[#0f172a] h-full overflow-hidden">
      <header className="p-6 border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-10 shadow-xl">
        <button 
          onClick={onBack}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h3 className="text-lg font-bold text-white italic">
          {mode === 'FOLLOWERS' ? 'المتابعون' : 'قائمة المتابعة'}
        </h3>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#fbbf24]/20 border-t-[#fbbf24] rounded-full animate-spin"></div>
          </div>
        ) : users.length > 0 ? (
          users.map(u => (
            <button 
              key={u.id}
              onClick={() => onProfileClick(u.id)}
              className="w-full bg-slate-800/40 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 text-right hover:bg-slate-800 transition-all active:scale-[0.98] group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-[#fbbf24] font-bold border border-slate-700 group-hover:border-[#fbbf24]/40 transition-colors">
                {u.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1 justify-end">
                  {u.isVerified && (
                    <svg className="w-3.5 h-3.5 text-[#fbbf24]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  )}
                  <h4 className="font-bold text-white group-hover:text-[#fbbf24] transition-colors">{u.name}</h4>
                </div>
                <p className="text-[10px] text-slate-500 truncate italic">{u.bio || 'مبدع في روح الإبداع'}</p>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-32 opacity-20">
            <p className="text-sm font-bold uppercase tracking-[0.2em]">لا توجد بيانات</p>
          </div>
        )}
      </main>
    </div>
  );
};
