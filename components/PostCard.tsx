
import React, { useState, useRef } from 'react';
import { Post, Comment } from '../types';
import { COLORS } from '../constants';
import { CommentsSection } from './CommentsSection';
import { toPng, toBlob } from 'html-to-image';

interface PostCardProps {
  post: Post;
  isSaved?: boolean;
  onAddComment: (postId: string, text: string, imageUrl?: string) => void;
  onSave?: (postId: string) => void;
  onReport?: (postId: string) => void;
  onProfileClick?: (userId: string) => void;
  onToggleLike?: (postId: string) => void;
  currentUserId?: string;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  isSaved, 
  onAddComment, 
  onSave, 
  onReport, 
  onProfileClick,
  onToggleLike,
  currentUserId 
}) => {
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isPopping, setIsPopping] = useState(false);
  const [isSharingImage, setIsSharingImage] = useState(false);
  
  const shareCardRef = useRef<HTMLDivElement>(null);

  const liked = currentUserId ? (post.likedBy || []).includes(currentUserId) : false;

  const handleLike = () => {
    if (!liked) {
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), 300);
    }
    onToggleLike?.(post.id);
  };

  const shareAsText = () => {
    const text = `تحقق من هذا الإبداع للـ ${post.authorName} على منصة "روح الإبداع":\n\n"${post.content}"\n\nاقرأ المزيد هنا: https://ruh-al-ibdaa.web.app`;
    if (navigator.share) {
      navigator.share({ title: 'روح الإبداع', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      alert('تم نسخ النص لمشاركته!');
    }
    setShowShareMenu(false);
  };

  const shareAsImage = async () => {
    if (!shareCardRef.current) return;
    
    setIsSharingImage(true);
    try {
      // Small timeout to ensure everything is rendered
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const blob = await toBlob(shareCardRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: '#0f172a'
      });
      
      if (!blob) throw new Error('Failed to generate image blob');
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `Khatera-${post.authorName}-${Date.now()}.png`;
      link.href = url;
      link.click();
      
      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('Image capture failed', err);
      alert('فشل في إنشاء الصورة بسبب قيود المتصفح أو الشبكة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSharingImage(false);
      setShowShareMenu(false);
    }
  };

  return (
    <>
      {/* Invisible element for image generation */}
      <div className="fixed -left-[9999px] top-0 overflow-hidden pointer-events-none">
        <div 
          ref={shareCardRef}
          className="w-[500px] bg-[#0f172a] p-12 text-right relative border-8 border-slate-800"
          style={{ direction: 'rtl', fontFamily: "'Cairo', sans-serif" }}
        >
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-[#fbbf24]/5 to-transparent opacity-20"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10 border-b border-slate-800 pb-6">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-[#fbbf24] font-bold text-2xl border border-slate-700">
                {post.authorName.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">{post.authorName}</h3>
                <p className="text-slate-500 text-sm uppercase tracking-widest">خاطرة من منصة روح الإبداع</p>
              </div>
            </div>

            <p className="poetic-text text-slate-100 text-4xl leading-relaxed mb-16 italic text-center" style={{ fontFamily: "'Amiri', serif" }}>
              {post.content}
            </p>

            <div className="flex flex-col items-center pt-8 border-t border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-8 h-8 text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5.5 10.5C5.5 10.5 8.5 7.5 12 7.5C15.5 7.5 18.5 10.5 18.5 10.5C18.5 10.5 15.5 13.5 12 13.5C8.5 13.5 5.5 10.5 5.5 10.5Z" strokeWidth="1.5" />
                  <path d="M12 7.5V16.5M9 12L12 16.5L15 12" strokeWidth="1.5" />
                </svg>
                <span className="text-2xl font-bold text-[#fbbf24] italic">روح الإبداع</span>
              </div>
              <p className="text-slate-600 text-xs">ملاذ الكلمة والروح في الفضاء الرقمي</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-[2rem] p-6 mb-6 transition-all duration-300 hover:bg-slate-800 hover:shadow-2xl hover:shadow-black/20 relative overflow-hidden group">
        <div className="flex justify-between items-start mb-5">
          <div 
            className="flex items-center gap-3 cursor-pointer group/author"
            onClick={() => onProfileClick?.(post.authorId)}
          >
            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-[#fbbf24] font-bold border border-slate-700 group-hover/author:border-[#fbbf24]/50 transition-colors">
              {post.authorName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <h3 className="font-bold text-white text-base group-hover/author:text-[#fbbf24] transition-colors">{post.authorName}</h3>
                {post.isVerifiedAuthor && (
                  <svg className="w-4 h-4 text-[#fbbf24]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{post.date}</span>
            </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded-full transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            
            {showMenu && (
              <div className="absolute left-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in zoom-in duration-200 overflow-hidden">
                <button 
                  onClick={() => { onSave?.(post.id); setShowMenu(false); }}
                  className="w-full text-right px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  {isSaved ? 'إلغاء الحفظ' : 'حفظ الخاطرة'}
                </button>
                <button 
                  onClick={() => { onReport?.(post.id); setShowMenu(false); }}
                  className="w-full text-right px-4 py-3 text-sm text-red-400/80 hover:bg-red-400/10 transition-colors"
                >
                  إبلاغ عن محتوى
                </button>
              </div>
            )}
          </div>
        </div>
        
        <p className="poetic-text text-slate-200 text-xl whitespace-pre-wrap leading-relaxed mb-6">
          {post.content}
        </p>

        {post.imageUrl && (
          <div className="mb-6 overflow-hidden rounded-3xl border border-slate-700/50">
            <img src={post.imageUrl} alt="محتوى إبداعي" className="w-full h-auto object-cover max-h-80 transition-transform duration-700 group-hover:scale-105" />
          </div>
        )}

        <div className="flex items-center gap-6 pt-2 border-t border-slate-700/30">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 transition-all duration-300 ${liked ? 'text-rose-500' : 'text-slate-500'} ${isPopping ? 'scale-125' : 'scale-100'}`}
          >
            <div className={`p-2 rounded-full transition-colors ${liked ? 'bg-rose-500/10' : 'hover:bg-slate-700'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={liked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={liked ? 0 : 1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold">{post.likes}</span>
          </button>

          <button 
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-2 transition-colors duration-300 ${showComments ? 'text-[#fbbf24]' : 'text-slate-500'}`}
          >
            <div className={`p-2 rounded-full transition-colors ${showComments ? 'bg-[#fbbf24]/10' : 'hover:bg-slate-700'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xs font-bold">{post.comments.length}</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowShareMenu(!showShareMenu)}
              className={`flex items-center gap-2 transition-all duration-300 ${showShareMenu ? 'text-[#0ea5e9]' : 'text-slate-500 hover:text-[#0ea5e9]'} ${isSharingImage ? 'animate-pulse opacity-50' : ''}`}
            >
              <div className={`p-2 rounded-full transition-colors ${showShareMenu ? 'bg-[#0ea5e9]/10' : 'hover:bg-slate-700'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <span className="text-xs font-bold">{isSharingImage ? 'جاري التحضير...' : 'مشاركة'}</span>
            </button>

            {showShareMenu && !isSharingImage && (
              <div className="absolute bottom-full mb-3 right-0 w-44 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 py-2 animate-in slide-in-from-bottom-2 duration-200 overflow-hidden ring-1 ring-white/10">
                <button 
                  onClick={shareAsText}
                  className="w-full text-right px-4 py-3 text-sm text-slate-200 hover:bg-slate-800 transition-colors flex items-center justify-end gap-3 group"
                >
                  <span className="group-hover:text-[#0ea5e9]">مشاركة كنص</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 group-hover:text-[#0ea5e9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </button>
                <button 
                  onClick={shareAsImage}
                  className="w-full text-right px-4 py-3 text-sm text-slate-200 hover:bg-slate-800 transition-colors flex items-center justify-end gap-3 group"
                >
                  <span className="group-hover:text-[#fbbf24]">مشاركة كصورة</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500 group-hover:text-[#fbbf24]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {showComments && (
          <CommentsSection 
            comments={post.comments} 
            onAddComment={(text, img) => onAddComment(post.id, text, img)}
            onProfileClick={onProfileClick}
          />
        )}
      </div>
    </>
  );
};
