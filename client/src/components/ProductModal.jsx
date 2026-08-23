import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, ShoppingBag, ShieldCheck, Truck, Star, Zap, Check, Heart } from 'lucide-react';

export const ProductModal = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    formatPrice, 
    addToCart, 
    setIsCheckoutOpen,
    toggleWishlist,
    wishlist
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!selectedProduct) return null;

  const pId = selectedProduct._id || selectedProduct.id;
  const isWishlisted = wishlist.some(w => (w._id || w.id) === pId);

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, quantity);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/60 hover:bg-slate-950 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Image Gallery */}
        <div className="md:w-1/2 bg-slate-950 p-6 flex flex-col justify-between items-center relative">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-800">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
              className="w-full h-full object-cover"
            />
            {selectedProduct.discountBadge && (
              <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-xs font-black uppercase px-3 py-1 rounded-md">
                {selectedProduct.discountBadge}
              </span>
            )}
          </div>

          <div className="w-full mt-4 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <Star className="w-4 h-4 fill-amber-400" /> {selectedProduct.rating || 4.9} ({selectedProduct.reviewsCount || 32} reviews)
            </span>
            <button
              onClick={() => toggleWishlist(selectedProduct)}
              className="flex items-center gap-1 text-slate-300 hover:text-rose-400"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
            </button>
          </div>
        </div>

        {/* Right Info Section */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto space-y-6 flex flex-col justify-between">
          
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{selectedProduct.category}</span>
              <span className="text-xs text-slate-400 font-medium">{selectedProduct.gender || 'Unisex'}</span>
            </div>

            <h2 className="text-2xl font-serif font-extrabold text-white mt-1">{selectedProduct.title}</h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed">{selectedProduct.description}</p>

            {/* Price Box */}
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-2xl font-serif font-extrabold text-white">
                  {formatPrice(selectedProduct.price)}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="ml-2 text-sm text-slate-500 line-through">
                    {formatPrice(selectedProduct.originalPrice)}
                  </span>
                )}
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                In Stock ({selectedProduct.stock || 12} units)
              </span>
            </div>

            {/* Technical Specifications */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Specifications</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">Movement</span>
                  <span className="text-slate-200 font-medium">{selectedProduct.specs?.movement || 'Japanese Quartz'}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">Case Diameter</span>
                  <span className="text-slate-200 font-medium">{selectedProduct.specs?.caseDiameter || '41mm'}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">Water Resistance</span>
                  <span className="text-slate-200 font-medium">{selectedProduct.specs?.waterResistance || '5 ATM'}</span>
                </div>
                <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">Glass Crystal</span>
                  <span className="text-slate-200 font-medium">{selectedProduct.specs?.glass || 'Sapphire Glass'}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Quantity & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Quantity:</span>
              <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-slate-400 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-amber-400">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 text-slate-400 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className={`py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  added 
                    ? 'bg-emerald-500 text-slate-950' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                {added ? <Check className="w-4 h-4 stroke-[3]" /> : <ShoppingBag className="w-4 h-4" />}
                <span>{added ? 'Added to Cart' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
              >
                Instant Checkout
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
