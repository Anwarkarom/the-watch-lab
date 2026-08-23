import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, Sparkles, Heart } from 'lucide-react';

export const ProductCatalog = () => {
  const { 
    products, 
    loading, 
    category, setCategory, 
    gender, setGender, 
    sortBy, setSortBy, 
    searchQuery, setSearchQuery,
    wishlist 
  } = useStore();

  const categories = ['All', 'Chronograph', 'Automatic', 'Minimalist', 'Diver/Sport', 'Smart Hybrid'];
  const genders = ['All', 'Men', 'Women', 'Unisex'];

  // Wishlist filtering if category === 'Wishlist'
  const displayedProducts = category === 'Wishlist' ? wishlist : products;

  return (
    <section id="catalog" className="py-12 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Explore Collection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
              {category === 'Wishlist' ? 'Your Wishlist Watches' : 'Curated Luxury Watch Catalog'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              {displayedProducts.length} premium models available for express dispatch.
            </p>
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort by:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="featured">Featured Models</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Category Pills & Gender Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  category === cat
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
            
            <button
              onClick={() => setCategory('Wishlist')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                category === 'Wishlist'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>Wishlist ({wishlist.length})</span>
            </button>
          </div>

          {/* Gender Filter */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            {genders.map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  gender === g
                    ? 'bg-slate-800 text-amber-400 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

        </div>

        {/* Active Search Badge */}
        {searchQuery && (
          <div className="mb-6 flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs px-4 py-2 rounded-xl w-fit">
            <span>Showing results for <strong>"{searchQuery}"</strong></span>
            <button 
              onClick={() => setSearchQuery('')}
              className="ml-2 underline text-amber-400 hover:text-white"
            >
              Reset Search
            </button>
          </div>
        )}

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800">
            <Filter className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-white font-serif font-bold text-lg">No watches match your selection</h3>
            <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto">
              Try resetting your category or search filters to explore our full collection.
            </p>
            <button
              onClick={() => { setCategory('All'); setGender('All'); setSearchQuery(''); }}
              className="mt-4 px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
