import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { PublicNavRoute } from './types';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/public/HomePage';
import { PropertiesPage } from './components/public/PropertiesPage';
import { PropertyDetailPage } from './components/public/PropertyDetailPage';
import { ListPropertyPage } from './components/public/ListPropertyPage';
import { AboutContactPage } from './components/public/AboutContactPage';
import { AdminPortalPage } from './components/admin/AdminPortalPage';
import { MessageSquare } from 'lucide-react';

function AppContent() {
  const { settings, savedPropertyIds } = useStore();

  // Navigation State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    return (
      window.location.hash.startsWith('#admin') ||
      window.location.pathname.startsWith('/admin') ||
      window.location.search.includes('admin')
    );
  });

  const [publicRoute, setPublicRoute] = useState<PublicNavRoute>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  // Search filter parameters passed from Hero
  const [appliedSearchFilters, setAppliedSearchFilters] = useState<{
    type?: string;
    location?: string;
    priceRange?: string;
  }>({});

  // Sync hash changes for separate admin portal routing
  useEffect(() => {
    const handleUrlChange = () => {
      const isCurrentlyAdmin =
        window.location.hash.startsWith('#admin') ||
        window.location.pathname.startsWith('/admin') ||
        window.location.search.includes('admin');
      setIsAdminMode(isCurrentlyAdmin);
    };

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);

  // Public Navigation Handlers
  const handlePublicNavigate = (route: PublicNavRoute, filterType?: string) => {
    setIsAdminMode(false);
    if (window.location.hash.startsWith('#admin')) {
      window.location.hash = '';
    }
    if (filterType) {
      setAppliedSearchFilters({ type: filterType });
    }
    setPublicRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProperty = (id: string) => {
    setSelectedPropertyId(id);
    setIsAdminMode(false);
    if (window.location.hash.startsWith('#admin')) {
      window.location.hash = '';
    }
    setPublicRoute('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (filters: { type?: string; location?: string; priceRange?: string }) => {
    setAppliedSearchFilters(filters);
    setPublicRoute('properties');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Switch to Dedicated Admin Portal
  const handleOpenAdminPortal = () => {
    setIsAdminMode(true);
    window.location.hash = '#admin';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToPublic = () => {
    setIsAdminMode(false);
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open WhatsApp directly
  const openFloatingWhatsApp = () => {
    const text = encodeURIComponent(
      `Assalam-o-Alaikum Rafeeq Homes! I am interested in buying/selling property in Chitral.`
    );
    window.open(`https://wa.me/${settings.whatsapp}?text=${text}`, '_blank');
  };

  // Render Standalone Separate Admin Portal
  if (isAdminMode) {
    return (
      <AdminPortalPage
        onReturnToPublic={handleReturnToPublic}
        onViewPropertyDetails={handleSelectProperty}
      />
    );
  }

  // Render Public Website Screen (No admin login visible on landing page)
  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col font-sans-brand text-slate-800 selection:bg-[#2f6b3a] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentRoute={publicRoute}
        onNavigate={handlePublicNavigate}
        onOpenAdmin={handleOpenAdminPortal}
        savedCount={savedPropertyIds.length}
      />

      {/* Main Public Content */}
      <main className="flex-1">
        {publicRoute === 'home' && (
          <HomePage
            onNavigate={handlePublicNavigate}
            onSelectProperty={handleSelectProperty}
            onSearch={handleHeroSearch}
            onOpenAdmin={handleOpenAdminPortal}
          />
        )}

        {publicRoute === 'properties' && (
          <PropertiesPage
            initialFilterType={appliedSearchFilters.type}
            appliedSearchFilters={appliedSearchFilters}
            onSelectProperty={handleSelectProperty}
          />
        )}

        {publicRoute === 'detail' && selectedPropertyId && (
          <PropertyDetailPage
            propertyId={selectedPropertyId}
            onBack={() => handlePublicNavigate('properties')}
            onSelectOtherProperty={handleSelectProperty}
          />
        )}

        {publicRoute === 'list-property' && (
          <ListPropertyPage onNavigate={handlePublicNavigate} />
        )}

        {publicRoute === 'about' && (
          <AboutContactPage initialTab="about" />
        )}

        {publicRoute === 'contact' && (
          <AboutContactPage initialTab="contact" />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handlePublicNavigate}
        onOpenAdmin={handleOpenAdminPortal}
      />

      {/* Floating WhatsApp Contact Button */}
      <button
        onClick={openFloatingWhatsApp}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all group active:scale-95"
        title="Chat with Rafeeq Homes on WhatsApp"
        aria-label="Direct WhatsApp Chat"
      >
        <MessageSquare className="w-5 h-5 fill-white" />
        <span className="text-xs font-bold tracking-wide hidden sm:inline-block pr-1">
          WhatsApp Us
        </span>
        <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
      </button>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
