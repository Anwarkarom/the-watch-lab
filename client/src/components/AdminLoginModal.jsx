import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, Key, ShieldCheck, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const AdminLoginModal = () => {
  const { 
    isAdminLoginOpen, 
    setIsAdminLoginOpen, 
    adminLogin 
  } = useStore();

  const [passcode, setPasscode] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isAdminLoginOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!passcode.trim()) return;

    const res = adminLogin(passcode.trim());
    if (!res.success) {
      setErrorMsg(res.message);
    } else {
      setPasscode('');
      setErrorMsg(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8">
        
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAdminLoginOpen(false);
            setErrorMsg(null);
          }}
          className="absolute top-4 right-4 p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Header */}
        <div className="text-center space-y-3 mb-6">
          <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-serif font-extrabold text-white">Seller & Admin Access</h2>
          <p className="text-slate-400 text-xs">
            Enter your secret Admin passcode to access seller metrics, customer orders, and product management.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Admin Secret Passcode</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Enter admin passcode (e.g. admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-10 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
              />
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3.5 text-slate-500 hover:text-slate-300"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
          >
            <span>Unlock Admin Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-[11px] text-slate-500">
          🔒 Secure Area • Passcode Default: <code className="text-amber-400 font-mono">admin123</code>
        </div>

      </div>
    </div>
  );
};
