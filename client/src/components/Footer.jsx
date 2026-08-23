import React, { useState } from 'react';
import { Watch, ShieldCheck, Mail, ArrowRight, Check } from 'lucide-react';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmail('');
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800/80 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center">
                <Watch className="w-5 h-5 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="font-serif font-extrabold text-xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 uppercase">
                The Watch Lab
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              The Watch Lab is an elite online watch store delivering precision-tested automatic, chronograph, and minimalist watches directly from verified global manufacturers to your doorstep.
            </p>

            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Authentic Quality Guaranteed • Worldwide Express</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wider uppercase">Customer Care</h4>
            <ul className="space-y-2">
              <li><a href="#catalog" className="hover:text-amber-400 transition-colors">Catalog Collection</a></li>
              <li><a href="#features" className="hover:text-amber-400 transition-colors">Worldwide Shipping Times</a></li>
              <li><a href="#features" className="hover:text-amber-400 transition-colors">2-Year International Warranty</a></li>
              <li><a href="#features" className="hover:text-amber-400 transition-colors">30-Day Return & Refund Policy</a></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-white font-serif font-bold text-sm tracking-wider uppercase">V.I.P Club & VIP Discounts</h4>
            <p className="text-slate-400 text-xs">
              Subscribe to receive instant secret promo codes and early access to dropshipping releases.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
              >
                {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {subscribed && (
              <div className="text-[11px] text-emerald-400 font-medium">
                🎉 Thank you for subscribing! Check your inbox for your 10% discount code.
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} <strong>The Watch Lab</strong>. All rights reserved. Built for Dropshipping Excellence.
          </div>
          <div className="flex items-center gap-4">
            <span>Cash on Delivery (COD)</span>
            <span>•</span>
            <span>Visa / MasterCard</span>
            <span>•</span>
            <span>PayPal</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
