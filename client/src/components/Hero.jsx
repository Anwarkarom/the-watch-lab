import React from 'react';
import { ShieldCheck, Truck, Clock, Award, ArrowRight, Sparkles } from 'lucide-react';

export const Hero = ({ onExploreClick }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/60 py-16 lg:py-24">
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-sky-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Watch Dropshipping Store</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-extrabold text-white tracking-tight leading-[1.15]">
              Mastery of Time.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600">
                Curated Luxury
              </span>{' '}
              Delivered Worldwide.
            </h1>

            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Discover precision-engineered automatic tourbillons, tactical chronographs, and Scandinavian minimalist timepieces. Tested for endurance, crafted for timeless distinction.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
              >
                <span>Shop Watch Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#features"
                className="w-full sm:w-auto px-6 py-4 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-300 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Why The Watch Lab?</span>
              </a>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-serif text-white">10K+</div>
                <div className="text-[11px] text-slate-400 font-medium">Delivered Orders</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-serif text-amber-400">4.9 ★</div>
                <div className="text-[11px] text-slate-400 font-medium">Verified Reviews</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-serif text-white">2 Years</div>
                <div className="text-[11px] text-slate-400 font-medium">Global Warranty</div>
              </div>
            </div>

          </div>

          {/* Right Featured Banner Image */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-amber-500/10 group">
              <img
                src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop"
                alt="AeroChronos Stealth Watch"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Featured Dropshipping Model</span>
                    <h3 className="text-white font-serif font-bold text-base">AeroChronos Stealth Black</h3>
                    <p className="text-xs text-slate-400">Tactical PVD Finish • Miyota Quartz</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs line-through text-slate-500 block">$249</span>
                    <span className="text-amber-400 font-bold text-lg">$189</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
