import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Award } from 'lucide-react';

export const TrustBadges = () => {
  const badges = [
    {
      icon: Truck,
      title: "Worldwide Express Shipping",
      desc: "Tracked delivery directly from verified suppliers to your door."
    },
    {
      icon: ShieldCheck,
      title: "2-Year International Warranty",
      desc: "Full movement coverage & hassle-free replacements."
    },
    {
      icon: RefreshCw,
      title: "30-Day Money-Back Guarantee",
      desc: "Try it risk-free. 100% full refund if not satisfied."
    },
    {
      icon: Award,
      title: "100% Quality Inspected",
      desc: "Every watch undergoes water & precision timekeeping tests."
    }
  ];

  return (
    <section id="features" className="py-12 bg-slate-900/60 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-amber-500/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 group-hover:bg-amber-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
