
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900/50 px-8 py-16 border-t border-slate-800 mt-16">
      <div className="text-center space-y-8">
        <div className="space-y-3">
          <h4 className="text-lg font-bold text-white italic">عن روح الإبداع</h4>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto poetic-text">
            منصة "روح الإبداع" هي واحة هادئة وسط ضجيج العالم الرقمي، صممت لتكون وطناً لكل من يقدس الكلمة الراقية ويبحث عن الجمال في تفاصيل اللغة والأدب.
          </p>
        </div>
        
        <div className="pt-8 border-t border-slate-800/50">
          <p className="text-[10px] text-slate-600 tracking-[0.3em] font-bold uppercase">
            صنع بشغف لخدمة الكلمة العربية
          </p>
          <p className="text-[10px] text-[#fbbf24]/50 mt-2">© ٢٠٢٥ جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
};
