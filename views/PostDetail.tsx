
import React from 'react';
import { Post, User } from '../types';
import { PostCard } from '../components/PostCard';

interface PostDetailProps {
  post: Post;
  currentUser: User;
  onBack: () => void;
  onAddComment: (postId: string, text: string) => void;
  onSave: (postId: string) => void;
  onToggleLike: (postId: string) => void;
  onProfileClick: (userId: string) => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ 
  post, 
  currentUser, 
  onBack, 
  onAddComment, 
  onSave, 
  onToggleLike, 
  onProfileClick 
}) => {
  return (
    <div className="flex flex-col h-full bg-[#0f172a] overflow-y-auto pb-32">
      <header className="sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-800 px-6 py-5 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-lg font-bold text-white italic">عرض الخاطرة</h2>
        <div className="w-10"></div>
      </header>

      <main className="p-6">
        <PostCard 
          post={post}
          isSaved={(currentUser.savedPostIds || []).includes(post.id)}
          onAddComment={onAddComment}
          onSave={onSave}
          onToggleLike={onToggleLike}
          onProfileClick={onProfileClick}
          currentUserId={currentUser.id}
        />
        
        <div className="mt-10 px-4 text-center">
           <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-700 to-transparent mx-auto mb-6"></div>
           <p className="text-slate-500 text-xs italic leading-relaxed">
             انتهت رحلة هذه الكلمات هنا.. <br/> شكراً لتقديرك للإبداع.
           </p>
        </div>
      </main>
    </div>
  );
};
