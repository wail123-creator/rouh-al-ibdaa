
import React from 'react';
import { Chat } from '../types';

interface MessagesProps {
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
}

export const Messages: React.FC<MessagesProps> = ({ chats, onSelectChat }) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32 bg-[#0f172a]">
      <header className="mb-10 text-right">
        <h2 className="text-2xl font-bold text-white mb-1">المحادثات</h2>
        <p className="text-sm text-slate-500 font-medium italic">تواصل روحياً مع رفاق الحرف</p>
      </header>

      <div className="space-y-4">
        {chats.length > 0 ? (
          chats.map(chat => (
            <button 
              key={chat.id}
              onClick={() => onSelectChat(chat)}
              className="w-full bg-slate-800/40 border border-slate-800 rounded-[1.5rem] p-5 flex gap-4 items-center text-right hover:bg-slate-800 hover:shadow-2xl hover:shadow-black/20 transition-all active:scale-[0.98] group"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 flex-shrink-0 flex items-center justify-center text-[#fbbf24] font-bold text-2xl border border-slate-700 group-hover:border-[#fbbf24]/40 transition-colors glow-gold shadow-lg">
                  {chat.participantName.charAt(0)}
                </div>
                {/* Online Indicator */}
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 shadow-md ${chat.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter">{chat.timestamp}</span>
                  <h4 className="font-bold text-slate-100 group-hover:text-[#fbbf24] transition-colors truncate">{chat.participantName}</h4>
                </div>
                <div className="flex items-center justify-end gap-1.5 overflow-hidden">
                   <p className="text-sm text-slate-500 truncate italic flex-1">{chat.lastMessage}</p>
                   {chat.isOnline && <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest shrink-0 border border-emerald-500/20">نشط</span>}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="text-center py-24 opacity-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-xs font-bold tracking-[0.2em] uppercase">لا توجد محادثات نشطة</p>
          </div>
        )}
      </div>
    </div>
  );
};
