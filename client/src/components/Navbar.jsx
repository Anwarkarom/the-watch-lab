import React, { useState } from 'react';
import { useStore, currencies } from '../context/StoreContext';
import { Watch, ShoppingBag, Heart, Search, PackageCheck, LayoutDashboard, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { 
    cart, 
    wishlist, 
    currency, 
    setCurrency, 
    setIsCartOpen, 
    setIsTrackingOpen, 
    setIsAdminOpen,
    setIsAdminLoginOpen,
    isAdminAuthenticated,
    searchQuery, 
    setSearchQuery,
    setCategory
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Left: Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-slate-400 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setCategory('All'); }} 
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                <Watch className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-extrabold text-xl sm:text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500 uppercase">
                  The Watch Lab
                </span>
                <span className="text-[10px] tracking-[0.25em] text-slate-400 font-sans uppercase font-medium">
                  Precision & Luxury
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search luxury watches, movement, strap..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-slate-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Currency Selector */}
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {Object.keys(currencies).map(code => (
                  <option key={code} value={code} className="bg-slate-900 text-slate-200">
                    {currencies[code].label}
                  </option>
                ))}
              </select>
            </div>

            {/* Order Tracking */}
            <button
              onClick={() => setIsTrackingOpen(true)}
              className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-amber-400 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
            >
              <PackageCheck className="w-4 h-4 text-amber-500" />
              <span>Track Order</span>
            </button>

            {/* Admin Toggle */}
            <button
              onClick={() => isAdminAuthenticated ? setIsAdminOpen(true) : setIsAdminLoginOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-amber-400 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
              title="Admin Dashboard"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-500" />
              <span>{isAdminAuthenticated ? 'Admin Panel' : 'Seller Access'}</span>
            </button>

            {/* Wishlist */}
            <div className="relative">
              <button 
                onClick={() => setCategory('Wishlist')}
                className="p-2 text-slate-300 hover:text-amber-400 transition-colors relative"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>
            </div>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/25 transition-all duration-200"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 stroke-[2.2]" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-950 text-amber-400 border border-amber-500 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs tracking-wider uppercase font-black">
                Cart
              </span>
            </button>

          </div>
        </div>

        {/* Mobile Search Bar & Quick Categories */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800/80 space-y-3 animate-fadeIn">
            <div className="relative">
              <input
                type="text"
                placeholder="Search watches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-9 pr-4 text-xs text-slate-200"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <button 
                onClick={() => { setCategory('All'); setMobileMenuOpen(false); }} 
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800"
              >
                All Watches
              </button>
              <button 
                onClick={() => { setIsTrackingOpen(true); setMobileMenuOpen(false); }} 
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 flex items-center gap-1"
              >
                <PackageCheck className="w-3.5 h-3.5" /> Track Order
              </button>
              <button 
                onClick={() => { setIsAdminOpen(true); setMobileMenuOpen(false); }} 
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 flex items-center gap-1"
              >
                <LayoutDashboard className="w-3.5 h-3.5" /> Admin Panel
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
