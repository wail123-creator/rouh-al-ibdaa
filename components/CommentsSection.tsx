
import React, { useState } from 'react';
import { Comment } from '../types';
import { EmojiPicker } from './EmojiPicker';

interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (text: string, imageUrl?: string) => void;
  onProfileClick?: (userId: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({ comments, onAddComment, onProfileClick }) => {
  const [text, setText] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddComment(text);
      setText('');
      setShowImageInput(false);
      setShowEmojiPicker(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="mt-6 pt-6 border-t border-slate-700/50">
      <div className="space-y-4 mb-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-slate-900/40 p-4 rounded-2xl text-right border border-slate-700/30">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{comment.date}</span>
              <span 
                onClick={() => comment.authorId && onProfileClick?.(comment.authorId)}
                className={`font-bold text-sm text-slate-200 ${comment.authorId ? 'cursor-pointer hover:text-[#fbbf24] transition-colors' : ''}`}
              >
                {comment.authorName}
              </span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium">{comment.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="أضف بصمتك هنا..."
          className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-right text-white focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 transition-all resize-none placeholder:text-slate-600"
          rows={2}
        />
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setShowImageInput(!showImageInput)}
              className={`text-slate-400 p-2 rounded-xl transition-all ${showImageInput ? 'bg-slate-700 text-white' : 'hover:bg-slate-700 hover:text-white'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </button>
            <div className="relative">
              <button 
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`text-slate-400 p-2 rounded-xl transition-all ${showEmojiPicker ? 'bg-slate-700 text-white' : 'hover:bg-slate-700 hover:text-white'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              {showEmojiPicker && <EmojiPicker onSelect={addEmoji} onClose={() => setShowEmojiPicker(false)} />}
            </div>
          </div>
          <button 
            type="submit"
            disabled={!text.trim()}
            className="text-slate-900 bg-[#fbbf24] px-6 py-2 rounded-xl text-xs font-bold disabled:opacity-30 transition-all active:scale-95 shadow-lg shadow-[#fbbf24]/20"
          >
            إرسال
          </button>
        </div>
      </form>
    </div>
  );
};
