
import React, { useState } from 'react';
import { View } from '../types';
import { EmojiPicker } from '../components/EmojiPicker';

interface CreateProps {
  onPublish: (content: string, imageUrl?: string) => void;
  onCancel: () => void;
}

export const Create: React.FC<CreateProps> = ({ onPublish, onCancel }) => {
  const [content, setContent] = useState('');
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const simulateImageAttach = () => {
    const randomImgs = [
      'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1518173946687-a4c8a9b746f5?auto=format&fit=crop&q=80&w=800'
    ];
    const picked = randomImgs[Math.floor(Math.random() * randomImgs.length)];
    setAttachedImage(picked);
  };

  const addEmoji = (emoji: string) => {
    setContent(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] animate-in fade-in duration-500">
      <header className="p-6 flex justify-between items-center border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-xl">
        <button 
          onClick={onCancel}
          className="text-slate-400 font-bold hover:text-rose-400 transition-colors text-sm uppercase tracking-widest"
        >
          إلغاء
        </button>
        <h2 className="text-lg font-bold text-white italic">خاطرة جديدة</h2>
        <button 
          onClick={() => content.trim() && onPublish(content, attachedImage || undefined)}
          disabled={!content.trim()}
          className={`px-6 py-2 rounded-xl font-bold transition-all shadow-lg ${content.trim() ? 'bg-[#fbbf24] text-slate-900 shadow-[#fbbf24]/20' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
        >
          نشر الإبداع
        </button>
      </header>

      <main className="flex-1 p-8 overflow-y-auto">
        <textarea
          autoFocus
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="ماذا يفيض به وجدانك اليوم؟ اكتب هنا..."
          className="w-full min-h-[300px] bg-transparent text-2xl poetic-text text-slate-100 placeholder:text-slate-800 outline-none resize-none text-right"
        />
        
        {attachedImage && (
          <div className="mt-8 relative animate-in zoom-in duration-300">
            <img src={attachedImage} alt="صورة مرفقة" className="w-full rounded-[2rem] shadow-2xl border border-slate-700" />
            <button 
              onClick={() => setAttachedImage(null)}
              className="absolute top-4 left-4 bg-slate-900/60 text-white p-2 rounded-full backdrop-blur-md border border-white/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </main>
      
      <footer className="p-6 bg-slate-900 border-t border-slate-800 text-slate-400 flex items-center gap-6 relative">
        <button 
          onClick={simulateImageAttach}
          className={`p-3 rounded-2xl transition-all ${attachedImage ? 'bg-[#fbbf24] text-slate-900 glow-gold' : 'bg-slate-800 hover:text-white hover:bg-slate-700'}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        <div className="relative">
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className={`p-3 rounded-2xl transition-all ${showEmojiPicker ? 'bg-[#fbbf24] text-slate-900 glow-gold' : 'bg-slate-800 hover:text-white hover:bg-slate-700'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          {showEmojiPicker && <EmojiPicker onSelect={addEmoji} onClose={() => setShowEmojiPicker(false)} />}
        </div>
        <div className="mr-auto text-[10px] font-bold uppercase tracking-widest opacity-40">
          {content.length} حرفاً
        </div>
      </footer>
    </div>
  );
};
