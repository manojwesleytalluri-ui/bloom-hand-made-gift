import React from 'react';
import { AppProvider } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import MagicalCursor from './components/layout/MagicalCursor';
import HeroSection from './components/sections/HeroSection';
import FeaturedBouquetsSection from './components/sections/FeaturedBouquetsSection';
import WeddingCollectionSection from './components/sections/WeddingCollectionSection';
import BirthdayCollectionSection from './components/sections/BirthdayCollectionSection';
import AnniversaryCollectionSection from './components/sections/AnniversaryCollectionSection';
import GiftHampersSection from './components/sections/GiftHampersSection';
import CustomBouquetBuilder from './components/sections/CustomBouquetBuilder';
import WhyChooseUsSection from './components/sections/WhyChooseUsSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import InstagramGallerySection from './components/sections/InstagramGallerySection';
import FAQSection from './components/sections/FAQSection';
import FooterSection from './components/sections/FooterSection';
import AiRecommendationSection from './components/sections/AiRecommendationSection';

// Drawers & Modals
import CartDrawer from './components/modals/CartDrawer';
import WishlistDrawer from './components/modals/WishlistDrawer';
import SearchFilterDrawer from './components/modals/SearchFilterDrawer';
import AuthModal from './components/modals/AuthModal';
import BookingModal from './components/modals/BookingModal';
import CheckoutModal from './components/modals/CheckoutModal';
import OrderTrackingModal from './components/modals/OrderTrackingModal';
import AdminPortalModal from './components/modals/AdminPortalModal';
import LiveChatWidget from './components/modals/LiveChatWidget';

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen overflow-x-hidden w-full bg-charcoal-950 text-ivory-100 font-sans selection:bg-mutedGold-500 selection:text-charcoal-950">
        {/* Navigation Bar */}
        <Navbar />

        {/* 12 Core Luxury Sections */}
        <main>
          {/* 1. Fullscreen Animated Hero Section with 3D Canvas */}
          <HeroSection />

          {/* 2. Featured Luxury Bouquets (3D Cards) */}
          <FeaturedBouquetsSection />

          {/* 3. Wedding Collection */}
          <WeddingCollectionSection />

          {/* 4. Birthday Collection */}
          <BirthdayCollectionSection />

          {/* 5. Anniversary Collection */}
          <AnniversaryCollectionSection />

          {/* 6. Premium Gift Hampers */}
          <GiftHampersSection />

          {/* 7. Custom Bouquet Builder */}
          <CustomBouquetBuilder />

          {/* AI Bouquet Recommendation Section */}
          <AiRecommendationSection />

          {/* 8. Why Choose Us */}
          <WhyChooseUsSection />

          {/* 9. Customer Testimonials */}
          <TestimonialsSection />

          {/* 10. Instagram Gallery */}
          <InstagramGallerySection />

          {/* 11. FAQ Section */}
          <FAQSection />
        </main>

        {/* 12. Luxury Footer */}
        <FooterSection />

        {/* Interactive Drawers & Modals */}
        <CartDrawer />
        <WishlistDrawer />
        <SearchFilterDrawer />
        <AuthModal />
        <BookingModal />
        <CheckoutModal />
        <OrderTrackingModal />
        <AdminPortalModal />

        {/* WhatsApp & VIP Concierge Floating Live Chat */}
        <LiveChatWidget />

        {/* Custom Angel Image Cursor */}
        <MagicalCursor />
      </div>
    </AppProvider>
  );
}

