
import React, { useMemo } from 'react';
import { PostCard } from '../components/PostCard';
import { Post } from '../types';
import { Footer } from '../components/Footer';

interface FeedProps {
  posts: Post[];
  onAddComment: (postId: string, text: string, imageUrl?: string) => void;
  onSave?: (postId: string) => void;
  onReport?: (postId: string) => void;
  onProfileClick?: (userId: string) => void;
  onPostClick?: (post: Post) => void;
  onToggleLike?: (postId: string) => void;
  filter: 'ALL' | 'FOLLOWING';
  onSetFilter: (filter: 'ALL' | 'FOLLOWING') => void;
  currentUserId?: string;
}

export const Feed: React.FC<FeedProps> = ({ 
  posts, 
  onAddComment, 
  onSave, 
  onReport, 
  onProfileClick, 
  onPostClick,
  onToggleLike,
  filter, 
  onSetFilter,
  currentUserId
}) => {
  // Logic for Trending: Top 5 posts by likes from the last 48 hours
  const trendingPosts = useMemo(() => {
    const now = Date.now();
    const fortyEightHoursAgo = now - 48 * 60 * 60 * 1000;
    
    return posts
      .filter(p => {
        const pDate = p.createdAt?.toMillis ? p.createdAt.toMillis() : now;
        return pDate > fortyEightHoursAgo;
      })
      .sort((a, b) => (b.likes || 0) - (a.likes || 0))
      .slice(0, 6);
  }, [posts]);

  return (
    <div className="flex-1 overflow-y-auto pt-8 pb-32">
      {/* Trending Section */}
      {trendingPosts.length > 0 && filter === 'ALL' && (
        <section className="mb-10">
          <div className="px-6 flex justify-between items-center mb-5">
            <h3 className="text-sm font-black text-[#fbbf24] uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="animate-bounce">🔥</span>
              الأكثر تفاعلاً
            </h3>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#fbbf24]/20 to-transparent mr-4"></div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide no-scrollbar">
            {trendingPosts.map(post => (
              <div 
                key={`trending-${post.id}`}
                onClick={() => onPostClick?.(post)}
                className="flex-shrink-0 w-64 bg-slate-800/80 border-2 border-[#fbbf24]/30 rounded-3xl p-5 cursor-pointer hover:border-[#fbbf24] transition-all group active:scale-95 shadow-xl shadow-[#fbbf24]/5"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-[#fbbf24] font-bold border border-[#fbbf24]/20 group-hover:border-[#fbbf24]/60 transition-colors">
                    {post.authorName.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate">{post.authorName}</h4>
                    <span className="text-[8px] text-[#fbbf24] font-bold uppercase tracking-widest flex items-center gap-1">
                      <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      {post.likes} إعجاب
                    </span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm italic leading-relaxed line-clamp-3 poetic-text h-16">
                  {post.content}
                </p>
                <div className="mt-4 flex justify-end">
                   <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest group-hover:text-[#fbbf24] transition-colors">اقرأ المزيد ←</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="px-6">
        <header className="mb-8 flex justify-between items-end">
          <div className="text-right">
            <h2 className="text-3xl font-bold text-white mb-1">آخر الخواطر</h2>
            <p className="text-xs text-slate-500 font-medium italic">استكشف جمال الكلمة العربية الراقية</p>
          </div>
          
          <div className="bg-slate-800/80 p-1 rounded-xl flex gap-1 border border-slate-700">
            <button 
              onClick={() => onSetFilter('FOLLOWING')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${filter === 'FOLLOWING' ? 'bg-[#fbbf24] text-slate-900 shadow-lg shadow-[#fbbf24]/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              أتابعهم
            </button>
            <button 
              onClick={() => onSetFilter('ALL')}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${filter === 'ALL' ? 'bg-[#fbbf24] text-slate-900 shadow-lg shadow-[#fbbf24]/20' : 'text-slate-500 hover:text-slate-300'}`}
            >
              الكل
            </button>
          </div>
        </header>
        
        <div className="space-y-2">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onAddComment={onAddComment} 
                onSave={onSave}
                onReport={onReport}
                onProfileClick={onProfileClick}
                onToggleLike={onToggleLike}
                currentUserId={currentUserId}
              />
            ))
          ) : (
            <div className="text-center py-32 opacity-20">
              <p className="text-sm font-bold uppercase tracking-[0.2em]">لا توجد خواطر هنا بعد</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};
