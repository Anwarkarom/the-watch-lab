import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, CheckCircle, Truck, CreditCard, ShieldCheck, Copy, Check, ArrowRight } from 'lucide-react';

export const CheckoutModal = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartTotalUSD, 
    formatPrice, 
    currency, 
    placeOrder,
    setIsTrackingOpen 
  } = useStore();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: 'Casablanca',
    address: '',
    notes: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      alert('Please complete all required fields (Name, Phone, Address).');
      return;
    }

    setSubmitting(true);
    const res = await placeOrder(formData, paymentMethod);
    setSubmitting(false);

    if (res.success) {
      setOrderResult(res);
    }
  };

  const handleCopyTracking = () => {
    if (!orderResult) return;
    navigator.clipboard.writeText(orderResult.trackingNumber);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div>
            <h2 className="font-serif font-extrabold text-xl text-white">
              {orderResult ? 'Order Confirmation' : 'Complete Your Watch Order'}
            </h2>
            <p className="text-slate-400 text-xs mt-0.5">
              {orderResult ? 'Thank you for shopping at The Watch Lab' : 'Free Express Worldwide Shipping Included'}
            </p>
          </div>

          <button
            onClick={() => {
              setIsCheckoutOpen(false);
              setOrderResult(null);
            }}
            className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {orderResult ? (
          /* Order Success View */
          <div className="p-8 text-center space-y-6 overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-serif font-extrabold text-white">Order Confirmed!</h3>
              <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                Your luxury timepiece is being packed by our fulfillment center. Keep your tracking number to monitor your delivery.
              </p>
            </div>

            {/* Tracking Code Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 max-w-sm mx-auto">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                Your Order Tracking Number
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="font-mono text-2xl font-black text-amber-400 tracking-wider">
                  {orderResult.trackingNumber}
                </span>
                <button
                  onClick={handleCopyTracking}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg border border-slate-800"
                  title="Copy Tracking Number"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setIsTrackingOpen(true);
                  setOrderResult(null);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                <span>Track Live Order Status</span>
              </button>

              <button
                onClick={() => {
                  setIsCheckoutOpen(false);
                  setOrderResult(null);
                }}
                className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl"
              >
                Back to Shop
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form View */
          <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto space-y-6">
            
            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                1. Shipping Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karim El Amrani"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (For Delivery) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +212 612 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-amber-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Casablanca">Casablanca</option>
                    <option value="Rabat">Rabat</option>
                    <option value="Marrakech">Marrakech</option>
                    <option value="Tangier">Tangier</option>
                    <option value="Agadir">Agadir</option>
                    <option value="Fez">Fez</option>
                    <option value="Oujda">Oujda</option>
                    <option value="International / Other">International / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="karim@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Delivery Address *</label>
                <textarea
                  required
                  rows="2"
                  placeholder="Street name, building number, apartment..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                2. Payment Method
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                  paymentMethod === 'COD' 
                    ? 'bg-amber-500/10 border-amber-500 text-white' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="hidden"
                  />
                  <Truck className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Cash on Delivery</div>
                    <div className="text-[10px] text-slate-400">Pay when received</div>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                  paymentMethod === 'CREDIT_CARD' 
                    ? 'bg-amber-500/10 border-amber-500 text-white' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="CREDIT_CARD"
                    checked={paymentMethod === 'CREDIT_CARD'}
                    onChange={() => setPaymentMethod('CREDIT_CARD')}
                    className="hidden"
                  />
                  <CreditCard className="w-4 h-4 text-sky-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">Credit Card</div>
                    <div className="text-[10px] text-slate-400">Visa / MasterCard</div>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2.5 transition-all ${
                  paymentMethod === 'PAYPAL' 
                    ? 'bg-amber-500/10 border-amber-500 text-white' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    value="PAYPAL"
                    checked={paymentMethod === 'PAYPAL'}
                    onChange={() => setPaymentMethod('PAYPAL')}
                    className="hidden"
                  />
                  <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-white">PayPal</div>
                    <div className="text-[10px] text-slate-400">Express Checkout</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Total & Submit Button */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Total Amount to Pay</span>
                <span className="text-xl font-serif font-extrabold text-amber-400">
                  {formatPrice(cartTotalUSD)}
                </span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {submitting ? 'Processing Order...' : 'Confirm Order Now'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
