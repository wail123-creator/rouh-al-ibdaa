
import React, { useState } from 'react';
import { Post, User } from '../types';
import { PostCard } from '../components/PostCard';
import { Footer } from '../components/Footer';

interface ProfileProps {
  user: User;
  allPosts: Post[];
  isOwnProfile?: boolean;
  isAdmin?: boolean;
  onLogout?: () => void;
  onAddComment: (postId: string, text: string, imageUrl?: string) => void;
  onSave: (postId: string) => void;
  onUpdateBio?: (bio: string) => void;
  onProfileClick?: (userId: string) => void;
  isFollowing?: boolean;
  onFollow?: () => void;
  onShowFollowList?: (userId: string, mode: 'FOLLOWERS' | 'FOLLOWING') => void;
  onStartChat?: () => void;
  onGoToAdmin?: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ 
  user, 
  allPosts, 
  isOwnProfile = false, 
  isAdmin = false,
  onLogout, 
  onAddComment, 
  onSave, 
  onUpdateBio, 
  onProfileClick,
  isFollowing = false,
  onFollow,
  onShowFollowList,
  onStartChat,
  onGoToAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'MY' | 'SAVED'>('MY');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio || '');
  
  const userPosts = allPosts.filter(p => p.authorId === user.id);
  const savedPosts = allPosts.filter(p => isOwnProfile && (user.savedPostIds || []).includes(p.id));

  const displayPosts = activeTab === 'MY' ? userPosts : savedPosts;

  const handleSaveBio = () => {
    onUpdateBio?.(bioText);
    setIsEditingBio(false);
  };

  const lastSeenStr = user.lastSeen?.toDate ? user.lastSeen.toDate().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) : 'قريباً';

  return (
    <div className="flex-1 overflow-y-auto pb-32 bg-[#0f172a]">
      <div className="bg-slate-800/40 px-8 pt-12 pb-10 border-b border-slate-800/50 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#fbbf24]/5 rounded-full blur-[60px]"></div>
        
        <div className="flex justify-between items-start mb-8">
          <div className="w-12">
            {isOwnProfile && onLogout ? (
              <button 
                onClick={onLogout}
                className="text-rose-400 text-xs font-bold hover:text-rose-300 transition-colors uppercase tracking-widest"
              >
                خروج
              </button>
            ) : null}
          </div>
          
          <div className="relative group">
            <div className="w-28 h-28 bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-[#fbbf24] text-4xl border-4 border-slate-800 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500 overflow-hidden glow-gold">
              {user.name.charAt(0)}
            </div>
            
            {/* Status Indicator */}
            <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-slate-800 shadow-xl ${user.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>

            {user.isVerified && (
              <div className="absolute -top-1 -right-1 bg-[#fbbf24] text-slate-900 p-1.5 rounded-full border-4 border-slate-800 shadow-lg glow-gold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
            )}
          </div>

          <div className="w-12 flex flex-col gap-2 items-end">
            {isOwnProfile ? (
              <button 
                onClick={() => setIsEditingBio(true)}
                className="text-[#fbbf24] text-xs font-bold hover:text-white transition-colors uppercase tracking-widest"
              >
                تعديل
              </button>
            ) : (
              <>
                <button 
                  onClick={onFollow}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isFollowing ? 'bg-slate-700 text-slate-300 border border-slate-600' : 'bg-[#fbbf24] text-slate-900 shadow-lg shadow-[#fbbf24]/20 active:scale-95'}`}
                >
                  {isFollowing ? 'متابع' : 'متابعة'}
                </button>
                <button 
                  onClick={onStartChat}
                  className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:border-white/20 active:scale-95 flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  رسالة
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="text-center relative z-10">
          <div className="flex flex-col items-center mb-4">
            <h2 className="text-3xl font-bold text-white mb-1 italic">{user.name}</h2>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]' : 'bg-slate-500'}`}></span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                {user.isOnline ? 'متواجد الآن' : `آخر ظهور: ${lastSeenStr}`}
              </span>
            </div>
          </div>

          {/* Admin Access Button */}
          {isOwnProfile && isAdmin && (
            <div className="mb-6">
              <button 
                onClick={onGoToAdmin}
                className="bg-slate-800 border border-[#fbbf24]/30 text-[#fbbf24] px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-slate-700 transition-all flex items-center gap-2 mx-auto"
              >
                Admin 🛡️ لوحة التحكم
              </button>
            </div>
          )}
          
          <div className="mt-4 mb-8 px-6">
            {isEditingBio ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <textarea 
                  value={bioText}
                  onChange={(e) => setBioText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 text-sm text-right text-white focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 transition-all resize-none shadow-inner"
                  rows={2}
                  maxLength={100}
                />
                <div className="flex justify-center gap-3">
                  <button onClick={handleSaveBio} className="bg-[#fbbf24] text-slate-900 px-6 py-2 rounded-xl text-xs font-bold shadow-lg shadow-[#fbbf24]/20 transition-transform active:scale-95">حفظ</button>
                  <button onClick={() => setIsEditingBio(false)} className="text-slate-400 px-6 py-2 text-xs font-bold hover:text-white transition-colors">إلغاء</button>
                </div>
              </div>
            ) : (
              <p className="poetic-text text-slate-400 italic leading-relaxed text-sm">
                {user.bio || 'لم يكتب هذا المبدع نبذة عنه بعد..'}
              </p>
            )}
          </div>
          
          <div className="flex justify-center gap-10 pt-8 border-t border-slate-700/30">
            <div className="text-center">
              <span className="block font-bold text-white text-xl glow-gold">{userPosts.length}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">خاطرة</span>
            </div>
            <div 
              className="text-center cursor-pointer group/stat"
              onClick={() => onShowFollowList?.(user.id, 'FOLLOWERS')}
            >
              <span className="block font-bold text-white text-xl glow-gold group-hover/stat:text-[#fbbf24] transition-colors">
                {(user.followersCount || 0).toLocaleString('ar-SA')}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 group-hover/stat:text-slate-400">متابع</span>
            </div>
            <div 
              className="text-center cursor-pointer group/stat"
              onClick={() => onShowFollowList?.(user.id, 'FOLLOWING')}
            >
              <span className="block font-bold text-white text-xl glow-gold group-hover/stat:text-[#fbbf24] transition-colors">
                {(user.followingCount || 0).toLocaleString('ar-SA')}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1 group-hover/stat:text-slate-400">يتابع</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 flex justify-center gap-4 mb-8 sticky top-0 glass z-10 py-4">
        <button 
          onClick={() => setActiveTab('MY')}
          className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${activeTab === 'MY' ? 'bg-[#fbbf24] text-slate-900 shadow-xl shadow-[#fbbf24]/20' : 'bg-slate-800/50 text-slate-500 border border-slate-700 hover:text-slate-300'}`}
        >
          {isOwnProfile ? 'كتاباتي' : 'الخواطر'}
        </button>
        {isOwnProfile && (
          <button 
            onClick={() => setActiveTab('SAVED')}
            className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 uppercase tracking-widest ${activeTab === 'SAVED' ? 'bg-[#fbbf24] text-slate-900 shadow-xl shadow-[#fbbf24]/20' : 'bg-slate-800/50 text-slate-500 border border-slate-700 hover:text-slate-300'}`}
          >
            المحفوظات
            {savedPosts.length > 0 && <span className={`w-2 h-2 rounded-full ${activeTab === 'SAVED' ? 'bg-slate-900' : 'bg-[#fbbf24] glow-gold'}`}></span>}
          </button>
        )}
      </div>

      <div className="px-6 space-y-2 min-h-[400px]">
        {displayPosts.length > 0 ? (
          displayPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              isSaved={isOwnProfile && (user.savedPostIds || []).includes(post.id)}
              onAddComment={onAddComment} 
              onSave={onSave}
              onProfileClick={onProfileClick}
            />
          ))
        ) : (
          <div className="text-center py-24 px-10">
            <div className="w-20 h-20 bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-slate-600 border border-slate-700 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <p className="text-slate-500 font-bold leading-relaxed italic uppercase tracking-widest text-xs">
              لم نجد أي إبداع منشور هنا بعد
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
