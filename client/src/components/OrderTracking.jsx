import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import axios from 'axios';
import { X, Search, PackageCheck, Truck, Clock, CheckCircle2, AlertCircle, Building2, MapPin } from 'lucide-react';

export const OrderTracking = () => {
  const { 
    isTrackingOpen, 
    setIsTrackingOpen, 
    lastPlacedOrder, 
    formatPrice 
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Auto-populate last placed order if opened directly
  useEffect(() => {
    if (lastPlacedOrder) {
      setTrackedOrder(lastPlacedOrder);
      setInputCode(lastPlacedOrder.trackingNumber);
    }
  }, [lastPlacedOrder]);

  if (!isTrackingOpen) return null;

  const handleTrackSubmit = async (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await axios.get(`/api/orders/track/${inputCode.trim()}`);
      setTrackedOrder(res.data);
    } catch (err) {
      if (lastPlacedOrder && lastPlacedOrder.trackingNumber.toUpperCase() === inputCode.trim().toUpperCase()) {
        setTrackedOrder(lastPlacedOrder);
      } else {
        setErrorMsg('Order tracking code not found. Please check your order code (e.g. TWL-849201).');
        setTrackedOrder(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: 'Order Placed', desc: 'Received & confirmed', statusKey: 'Order Placed' },
    { title: 'Processing', desc: 'Quality inspection & packing', statusKey: 'Processing' },
    { title: 'Shipped', desc: 'Dispatched from supplier', statusKey: 'Shipped from Supplier' },
    { title: 'Out for Delivery', desc: 'Courier in transit', statusKey: 'Out for Delivery' },
    { title: 'Delivered', desc: 'Handed to customer', statusKey: 'Delivered' }
  ];

  const getActiveStepIndex = (status) => {
    if (!status) return 0;
    if (status === 'Delivered') return 4;
    if (status === 'Out for Delivery') return 3;
    if (status === 'Shipped from Supplier') return 2;
    if (status === 'Processing') return 1;
    return 0;
  };

  const activeIndex = trackedOrder ? getActiveStepIndex(trackedOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <PackageCheck className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-extrabold text-xl text-white">Live Dropshipping Order Tracker</h2>
          </div>

          <button
            onClick={() => setIsTrackingOpen(false)}
            className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Tracking Search Input */}
          <form onSubmit={handleTrackSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Tracking Number (e.g. TWL-849201)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs font-mono font-bold text-amber-400 placeholder-slate-600 uppercase tracking-widest focus:border-amber-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl disabled:opacity-50 transition-colors"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>

          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Tracking Results View */}
          {trackedOrder && (
            <div className="space-y-6">
              
              {/* Status Header Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tracking ID:</span>
                  <div className="font-mono text-lg font-bold text-amber-400">{trackedOrder.trackingNumber}</div>
                  <div className="text-xs text-slate-400 mt-0.5">Customer: {trackedOrder.customer?.fullName} ({trackedOrder.customer?.city})</div>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Current Status:</span>
                  <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold text-xs rounded-full mt-1">
                    {trackedOrder.status}
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="py-4">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-6">Shipment Journey</h4>
                
                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0">
                  {/* Connecting Bar */}
                  <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 z-0" />
                  <div 
                    className="hidden sm:block absolute top-1/2 left-0 h-1 bg-amber-500 -translate-y-1/2 z-0 transition-all duration-500"
                    style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
                  />

                  {steps.map((step, idx) => {
                    const isCompleted = idx <= activeIndex;
                    const isCurrent = idx === activeIndex;

                    return (
                      <div key={idx} className="relative z-10 flex sm:flex-col items-center gap-3 sm:gap-2 text-left sm:text-center max-w-[120px]">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCompleted 
                            ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                            : 'bg-slate-950 border border-slate-800 text-slate-600'
                        }`}>
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>

                        <div>
                          <div className={`text-xs font-bold ${isCurrent ? 'text-amber-400' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                            {step.title}
                          </div>
                          <div className="text-[10px] text-slate-500 hidden sm:block mt-0.5">{step.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items Breakdown */}
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Order Package</h4>
                <div className="space-y-2">
                  {trackedOrder.items?.map((item, i) => (
                    <div key={i} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover border border-slate-800" />
                        )}
                        <div>
                          <div className="text-white font-semibold">{item.title}</div>
                          <div className="text-slate-400 text-[10px]">Qty: {item.quantity}</div>
                        </div>
                      </div>
                      <div className="text-amber-400 font-bold">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
