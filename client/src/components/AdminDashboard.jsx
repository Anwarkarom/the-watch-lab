import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import axios from 'axios';
import { X, LayoutDashboard, DollarSign, Package, TrendingUp, Users, RefreshCcw, Check, Plus } from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    products, 
    formatPrice, 
    fetchProducts 
  } = useStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.warn('API error loading orders:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminOpen) {
      fetchOrders();
    }
  }, [isAdminOpen]);

  if (!isAdminOpen) return null;

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.warn('Error updating status:', err.message);
    }
  };

  const totalRevenueUSD = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalOrdersCount = orders.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-serif font-extrabold text-xl text-white">The Watch Lab - Seller Dashboard</h2>
              <p className="text-slate-400 text-xs">Manage dropshipping inventory, revenue & supplier order fulfillment</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchOrders}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              title="Refresh Data"
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsAdminOpen(false)}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Total Store Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-serif font-extrabold text-white">
                {formatPrice(totalRevenueUSD)}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Total Orders Placed</span>
                <Package className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-serif font-extrabold text-white">
                {totalOrdersCount}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>Active Watches Catalog</span>
                <TrendingUp className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-serif font-extrabold text-white">
                {products.length} Models
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
              Customer Orders & Supplier Fulfillment
            </h3>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                No customer orders placed yet. Place an order from the shop to test seller fulfillment!
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                      <th className="p-3.5">Tracking Code</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">City & Address</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Payment</th>
                      <th className="p-3.5">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {orders.map((o) => (
                      <tr key={o._id || o.trackingNumber} className="hover:bg-slate-900/40">
                        <td className="p-3.5 font-mono font-bold text-amber-400">
                          {o.trackingNumber}
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-white">{o.customer?.fullName}</div>
                          <div className="text-[10px] text-slate-400">{o.customer?.phone}</div>
                        </td>
                        <td className="p-3.5">
                          <div>{o.customer?.city}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{o.customer?.address}</div>
                        </td>
                        <td className="p-3.5 font-semibold text-white">
                          {formatPrice(o.totalAmount)}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]">
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <select
                            value={o.status || 'Order Placed'}
                            onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                            className="bg-slate-900 border border-slate-800 text-amber-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped from Supplier">Shipped from Supplier</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
