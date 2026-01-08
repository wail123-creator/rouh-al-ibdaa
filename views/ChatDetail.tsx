
import React, { useState, useEffect, useRef } from 'react';
import { Chat, User, ChatMessage } from '../types';
import { EmojiPicker } from '../components/EmojiPicker';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';

interface ChatDetailProps {
  chat: Chat;
  currentUser: User;
  onBack: () => void;
  onSendMessage: (chatId: string, text: string) => void;
}

export const ChatDetail: React.FC<ChatDetailProps> = ({ chat, currentUser, onBack, onSendMessage }) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, `chats/${chat.id}/messages`),
      orderBy('createdAt', 'asc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          senderId: data.senderId,
          text: data.text,
          timestamp: data.createdAt?.toDate()?.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }) || 'الآن'
        } as ChatMessage;
      });
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight), 100);
    });

    return () => unsubscribe();
  }, [chat.id]);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(chat.id, text);
      setText('');
      setShowEmojiPicker(false);
    }
  };

  const addEmoji = (emoji: string) => {
    setText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a]">
      <header className="bg-[#0f172a]/80 backdrop-blur-xl px-6 py-5 border-b border-slate-800 flex justify-between items-center sticky top-0 z-10 shadow-xl">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div className="text-right flex items-center gap-3">
          <div className="text-right">
            <h3 className="font-bold text-white text-base">{chat.participantName}</h3>
            <div className="flex items-center justify-end gap-1.5">
               <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                 {chat.isOnline ? 'نشط الآن' : 'غير متصل'}
               </span>
               <span className={`w-1.5 h-1.5 rounded-full ${chat.isOnline ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></span>
            </div>
          </div>
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-[#fbbf24] font-bold text-xl border border-slate-700 shadow-lg glow-gold">
              {chat.participantName.charAt(0)}
            </div>
            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${chat.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></div>
          </div>
        </div>
      </header>

      <main ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
        {messages.length > 0 ? (
          messages.map(msg => (
            <div 
              key={msg.id} 
              className={`max-w-[85%] rounded-[1.5rem] px-5 py-3.5 text-sm shadow-xl transition-all ${
                msg.senderId === currentUser.id 
                  ? 'bg-gradient-to-br from-[#fbbf24] to-[#f59e0b] text-slate-900 self-start rounded-tl-none font-bold' 
                  : 'bg-slate-800 text-slate-200 self-end rounded-tr-none border border-slate-700'
              }`}
            >
              <p className="leading-relaxed text-right">{msg.text}</p>
              <span className={`text-[9px] mt-1.5 block text-right font-bold uppercase opacity-60`}>
                {msg.timestamp}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-24 text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">
            ابدأ رحلة الحرف مع {chat.participantName}
          </div>
        )}
      </main>

      <footer className="p-5 glass border-t border-white/5 flex gap-4 items-center sticky bottom-0">
        <button 
          onClick={handleSend}
          disabled={!text.trim()}
          className="bg-[#fbbf24] text-slate-900 p-4 rounded-2xl disabled:opacity-30 active:scale-95 transition-all flex-shrink-0 shadow-lg shadow-[#fbbf24]/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
        <div className="flex-1 relative">
          <input 
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اكتب رسالتك..."
            className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl px-12 py-4 text-sm text-right text-white focus:outline-none focus:ring-2 focus:ring-[#fbbf24]/20 shadow-inner"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`text-slate-500 hover:text-[#fbbf24] transition-colors p-1 rounded-lg ${showEmojiPicker ? 'text-[#fbbf24]' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            {showEmojiPicker && <EmojiPicker onSelect={addEmoji} onClose={() => setShowEmojiPicker(false)} />}
          </div>
        </div>
      </footer>
    </div>
  );
};
