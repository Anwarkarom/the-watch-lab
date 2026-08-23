import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Check } from 'lucide-react';

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    formatPrice, 
    cartSubtotalUSD, 
    discountAmountUSD,
    cartTotalUSD,
    appliedCoupon,
    applyCoupon,
    setIsCheckoutOpen 
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg(res);
    if (res.success) setCouponInput('');
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const freeShippingThresholdUSD = 100;
  const progressPercent = Math.min(100, (cartSubtotalUSD / freeShippingThresholdUSD) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif font-bold text-lg text-white">Your Shopping Cart</h2>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                {cart.length}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-lg bg-slate-950 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="px-6 py-3 bg-slate-950 border-b border-slate-800/80">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400 font-medium">
                {progressPercent >= 100 
                  ? '🎉 You unlocked Free Express Worldwide Shipping!' 
                  : `Add ${formatPrice(freeShippingThresholdUSD - cartSubtotalUSD)} for FREE Shipping`}
              </span>
              <span className="text-amber-400 font-bold">{progressPercent.toFixed(0)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Your cart is currently empty.</p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Browse Luxury Watches
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemId = item._id || item.id;
                return (
                  <div 
                    key={itemId}
                    className="flex gap-4 p-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-xs font-bold font-serif truncate">{item.title}</h4>
                      <div className="text-amber-400 font-bold text-xs mt-0.5">
                        {formatPrice(item.price)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(itemId, -1)}
                          className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold text-slate-200">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(itemId, 1)}
                          className="w-6 h-6 rounded-md bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(itemId)}
                      className="p-2 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950/90 space-y-4">
              
              {/* Promo Coupon Box */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Coupon Code (e.g. WATCHLAB20)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-8 pr-3 text-xs text-slate-200 uppercase tracking-wider"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl"
                >
                  Apply
                </button>
              </form>

              {couponMsg && (
                <div className={`text-[11px] font-medium ${couponMsg.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {couponMsg.message}
                </div>
              )}

              {/* Price breakdown */}
              <div className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-200 font-mono">{formatPrice(cartSubtotalUSD)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Discount ({appliedCoupon.code} -20%)</span>
                    <span className="font-mono">-{formatPrice(discountAmountUSD)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-amber-400 font-serif text-base">{formatPrice(cartTotalUSD)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedCheckout}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 group transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>30-Day Money Back Guarantee • Encrypted Checkout</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
