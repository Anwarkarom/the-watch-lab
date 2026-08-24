import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import axios from 'axios';
import { X, LayoutDashboard, DollarSign, Package, TrendingUp, ExternalLink, RefreshCcw, Plus, ShoppingCart, Sparkles, LogOut } from 'lucide-react';

export const AdminDashboard = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    adminLogout,
    products, 
    setProducts,
    formatPrice, 
    fetchProducts 
  } = useStore();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'add-product'

  // New product form state
  const [newWatch, setNewWatch] = useState({
    title: '',
    subtitle: '',
    description: '',
    price: '',
    originalPrice: '',
    supplierPrice: '',
    supplierUrl: '',
    affiliateUrl: '',
    category: 'Chronograph',
    gender: 'Men',
    image: '',
    stock: 10
  });
  const [addMsg, setAddMsg] = useState(null);

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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newWatch.title || !newWatch.price || !newWatch.image) {
      setAddMsg({ type: 'error', text: 'Please fill title, price, and image URL.' });
      return;
    }

    const createdWatchObj = {
      ...newWatch,
      _id: `watch_${Date.now()}`,
      price: Number(newWatch.price),
      originalPrice: newWatch.originalPrice ? Number(newWatch.originalPrice) : Number(newWatch.price) * 1.3,
      supplierPrice: newWatch.supplierPrice ? Number(newWatch.supplierPrice) : Number(newWatch.price) * 0.3
    };

    // Prepend to live React state so it immediately appears in the store catalog!
    setProducts(prev => [createdWatchObj, ...prev]);

    try {
      await axios.post('/api/products', createdWatchObj);
      setAddMsg({ type: 'success', text: '🎉 New watch saved to store catalog & MongoDB database!' });
    } catch (err) {
      setAddMsg({ type: 'success', text: '🎉 New watch added to store catalog view!' });
    }

    setNewWatch({
      title: '', subtitle: '', description: '', price: '', originalPrice: '',
      supplierPrice: '', supplierUrl: '', affiliateUrl: '', category: 'Chronograph',
      gender: 'Men', image: '', stock: 10
    });
  };

  const totalRevenueUSD = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const estimatedSupplierCostUSD = orders.reduce((sum, o) => sum + ((o.totalAmount || 0) * 0.3), 0);
  const totalNetProfitUSD = Math.max(0, totalRevenueUSD - estimatedSupplierCostUSD);

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
              <h2 className="font-serif font-extrabold text-xl text-white">The Watch Lab - Seller & Affiliate Dashboard</h2>
              <p className="text-slate-400 text-xs">Manage dropshipping profits, supplier links, and commission margin</p>
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
              onClick={adminLogout}
              className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Logout Admin"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
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
          
          {/* Top Tabs */}
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              Customer Orders & Profit Margin
            </button>

            <button
              onClick={() => setActiveTab('add-product')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'add-product'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Watch Product / Supplier Link</span>
            </button>
          </div>

          {/* Tab 1: Orders & Profits */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Stats Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Total Sales Revenue</span>
                    <DollarSign className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-2xl font-serif font-extrabold text-white">
                    {formatPrice(totalRevenueUSD)}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Estimated Net Commission / Profit</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-serif font-extrabold text-emerald-400">
                    +{formatPrice(totalNetProfitUSD)}
                  </div>
                  <span className="text-[10px] text-emerald-500 font-medium">~70% Net Margin</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                    <span>Orders Received</span>
                    <Package className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-serif font-extrabold text-white">
                    {orders.length}
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                  Customer Orders & 1-Click Supplier Fulfillment
                </h3>

                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-800 text-slate-400 text-xs">
                    No customer orders placed yet. Place an order from the shop to test fulfillment & profit calculation!
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400">
                          <th className="p-3.5">Tracking Code</th>
                          <th className="p-3.5">Customer Info</th>
                          <th className="p-3.5">Address</th>
                          <th className="p-3.5">Revenue</th>
                          <th className="p-3.5">Estimated Profit</th>
                          <th className="p-3.5">Supplier Link</th>
                          <th className="p-3.5">Status Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 text-slate-300">
                        {orders.map((o) => {
                          const orderProfitUSD = (o.totalAmount || 0) * 0.7;
                          return (
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
                                <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{o.customer?.address}</div>
                              </td>
                              <td className="p-3.5 font-semibold text-white">
                                {formatPrice(o.totalAmount)}
                              </td>
                              <td className="p-3.5 font-bold text-emerald-400">
                                +{formatPrice(orderProfitUSD)}
                              </td>
                              <td className="p-3.5">
                                <a
                                  href="https://www.aliexpress.com"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all"
                                >
                                  <span>Fulfill Order</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
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
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Tab 2: Add New Watch Product with Supplier & Affiliate Link */}
          {activeTab === 'add-product' && (
            <form onSubmit={handleAddProduct} className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-serif font-extrabold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Add New Watch Model to Store
                </h3>
                <span className="text-xs text-slate-400">Add custom dropshipping watches or affiliate links</span>
              </div>

              {addMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${addMsg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                  {addMsg.text}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Watch Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Tourbillon Skeleton"
                    value={newWatch.title}
                    onChange={(e) => setNewWatch({ ...newWatch, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={newWatch.category}
                    onChange={(e) => setNewWatch({ ...newWatch, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Chronograph">Chronograph</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Diver/Sport">Diver/Sport</option>
                    <option value="Smart Hybrid">Smart Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Selling Price ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 199"
                    value={newWatch.price}
                    onChange={(e) => setNewWatch({ ...newWatch, price: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Supplier Cost ($)</label>
                  <input
                    type="number"
                    placeholder="e.g. 45"
                    value={newWatch.supplierPrice}
                    onChange={(e) => setNewWatch({ ...newWatch, supplierPrice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Profit</label>
                  <div className="py-2 px-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-emerald-400">
                    +{formatPrice(Math.max(0, (Number(newWatch.price) || 0) - (Number(newWatch.supplierPrice) || 0)))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Supplier Product URL (AliExpress/CJ)</label>
                  <input
                    type="url"
                    placeholder="https://www.aliexpress.com/item/..."
                    value={newWatch.supplierUrl}
                    onChange={(e) => setNewWatch({ ...newWatch, supplierUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Affiliate Link (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://s.click.aliexpress.com/e/..."
                    value={newWatch.affiliateUrl}
                    onChange={(e) => setNewWatch({ ...newWatch, affiliateUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/photo-..."
                  value={newWatch.image}
                  onChange={(e) => setNewWatch({ ...newWatch, image: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Watch Description</label>
                <textarea
                  rows="2"
                  placeholder="Luxury stainless steel watch with Japanese quartz movement..."
                  value={newWatch.description}
                  onChange={(e) => setNewWatch({ ...newWatch, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save Watch to Store Catalog & Database</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
