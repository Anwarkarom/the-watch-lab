import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Eye, Heart, Star, Zap, Check } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { 
    formatPrice, 
    addToCart, 
    toggleWishlist, 
    wishlist, 
    setSelectedProduct 
  } = useStore();

  const [added, setAdded] = useState(false);
  const pId = product._id || product.id;
  const isWishlisted = wishlist.some(w => (w._id || w.id) === pId);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div 
      onClick={() => setSelectedProduct(product)}
      className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1"
    >
      
      {/* Top Media Container */}
      <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
        
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.discountBadge && (
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-md shadow-md tracking-wider">
              {product.discountBadge}
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md">
              ★ Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all z-10 ${
            isWishlisted 
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30' 
              : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-950/80'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => setSelectedProduct(product)}
            className="px-4 py-2 bg-slate-900/90 text-white text-xs font-semibold rounded-full border border-slate-700 flex items-center gap-1.5 shadow-xl hover:bg-amber-500 hover:text-slate-950 hover:border-amber-400 transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> Quick View
          </button>
        </div>

      </div>

      {/* Details Container */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        
        <div>
          {/* Category & Gender */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1.5">
            <span className="uppercase tracking-wider text-amber-400/90">{product.category}</span>
            <span>{product.gender || 'Unisex'}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif font-bold text-white text-base group-hover:text-amber-300 transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-slate-400 text-xs line-clamp-2 mt-1 font-sans leading-relaxed">
            {product.subtitle || product.description}
          </p>

          {/* Key Specs Pills */}
          {product.specs && (
            <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {product.specs.caseDiameter || '41mm'}
              </span>
              <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[140px]">
                {product.specs.glass || 'Sapphire'}
              </span>
            </div>
          )}
        </div>

        {/* Price & Add To Cart Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-serif font-extrabold text-white">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Scarcity indicator */}
            <div className="flex items-center gap-1 text-[10px] text-amber-400 mt-0.5 font-medium">
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400/20" />
              <span>Only {product.stock || 5} left in stock</span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
              added 
                ? 'bg-emerald-500 text-slate-950' 
                : 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
