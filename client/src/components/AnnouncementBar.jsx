import React, { useState } from 'react';
import { Tag, Sparkles, Copy, Check, ShieldCheck } from 'lucide-react';

export const AnnouncementBar = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('WATCHLAB20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-slate-950 font-medium text-xs sm:text-sm py-2 px-4 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2 font-semibold tracking-wide">
          <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          <span>🔥 FLASH SALE: Extra 20% OFF Luxury Chronographs & Automatic Watches!</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-slate-950 border border-slate-950/20 text-xs font-mono font-bold">
            <Tag className="w-3.5 h-3.5" />
            <span>WATCHLAB20</span>
            <button 
              onClick={handleCopy}
              className="ml-1 hover:text-slate-900 transition-colors p-0.5"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <span className="hidden md:inline-flex items-center gap-1 text-xs opacity-90">
            <ShieldCheck className="w-3.5 h-3.5" />
            Free Express Shipping Included
          </span>
        </div>
      </div>
    </div>
  );
};
