
import React from 'react';
import { AppNotification } from '../types';

interface NotificationsProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onProfileClick: (userId: string) => void;
}

export const Notifications: React.FC<NotificationsProps> = ({ notifications, onMarkRead, onProfileClick }) => {
  return (
    <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32 bg-[#0f172a]">
      <header className="mb-10 text-right">
        <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">تنبيهات</h2>
        <p className="text-sm text-slate-500 font-medium italic">ابقَ على اطلاع بكل ما هو جديد</p>
      </header>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map(notif => (
            <div 
              key={notif.id}
              onClick={() => onMarkRead(notif.id)}
              className={`p-5 rounded-[1.5rem] border transition-all cursor-pointer flex gap-4 items-center text-right group ${
                notif.isRead 
                  ? 'bg-slate-800/30 border-slate-800 text-slate-400' 
                  : 'bg-slate-800 border-slate-700 shadow-xl shadow-black/20 ring-1 ring-[#fbbf24]/5'
              }`}
            >
              <div 
                onClick={(e) => { e.stopPropagation(); onProfileClick(notif.fromId); }}
                className={`w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-transform group-hover:scale-110 cursor-pointer ${
                notif.type === 'LIKE' ? 'bg-rose-500/10 text-rose-500' :
                notif.type === 'COMMENT' ? 'bg-[#0ea5e9]/10 text-[#0ea5e9]' :
                'bg-[#fbbf24]/10 text-[#fbbf24]'
              }`}>
                {notif.type === 'LIKE' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                )}
                {notif.type === 'COMMENT' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                )}
                {notif.type === 'FOLLOW' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/></svg>
                )}
                {notif.type === 'MESSAGE' && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z"/></svg>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-tight">{notif.date}</span>
                  <h4 className={`text-sm font-bold ${notif.isRead ? 'text-slate-400' : 'text-white'}`}>{notif.fromName}</h4>
                </div>
                <p className={`text-xs ${notif.isRead ? 'text-slate-500' : 'text-slate-300 font-medium'}`}>{notif.content}</p>
              </div>
              {!notif.isRead && (
                <div className="w-2.5 h-2.5 bg-[#fbbf24] rounded-full flex-shrink-0 glow-gold"></div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-24 opacity-20">
            <p className="text-sm font-bold tracking-[0.2em] uppercase">لا توجد تنبيهات جديدة</p>
          </div>
        )}
      </div>
    </div>
  );
};
