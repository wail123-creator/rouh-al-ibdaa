
import React from 'react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EMOJIS = ['❤️', '✨', '🌸', '✍️', '📜', '🌙', '🕊️', '🌿', '☕', '📖', '🥀', '💫', '🌅', '🍂', '💭', '💎'];

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, onClose }) => {
  return (
    <div className="absolute bottom-full mb-4 right-0 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-4 z-50 animate-in slide-in-from-bottom-4 duration-300 w-56 ring-1 ring-white/5">
      <div className="flex justify-between items-center mb-4 px-1">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">اختر رمزاً</span>
        <button onClick={onClose} className="text-slate-600 hover:text-rose-400 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {EMOJIS.map(emoji => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="text-2xl p-2 hover:bg-slate-800 rounded-xl transition-all duration-200 flex items-center justify-center hover:scale-110 active:scale-90"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
