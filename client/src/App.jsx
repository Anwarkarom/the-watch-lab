import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBadges } from './components/TrustBadges';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTracking } from './components/OrderTracking';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';

export function App() {
  const scrollToCatalog = () => {
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <StoreProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
        <AnnouncementBar />
        <Navbar />
        <main className="flex-1">
          <Hero onExploreClick={scrollToCatalog} />
          <TrustBadges />
          <ProductCatalog />
        </main>
        <Footer />

        {/* Global Modals & Drawers */}
        <ProductModal />
        <CartDrawer />
        <CheckoutModal />
        <OrderTracking />
        <AdminDashboard />
      </div>
    </StoreProvider>
  );
}

export default App;
