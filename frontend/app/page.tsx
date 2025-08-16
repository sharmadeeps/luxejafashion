const HomePage = 
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StoryReel from '@/components/StoryReel';
import HeroBanner from '@/components/HeroBanner';
import RewardsBar from '@/components/RewardsBar';
import FeaturedProducts from '@/components/FeaturedProducts';
import ShopByOccasion from '@/components/ShopByOccasion';
import BestSellers from '@/components/BestSellers';
import InfluencerSection from '@/components/InfluencerSection';
import Newsletter from '@/components/Newsletter';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Story/Highlight Reel */}
      <StoryReel />
      
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Rewards Progress Bar */}
      <RewardsBar />
      
      {/* Featured Collections */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif text-center mb-12 text-neutral-900"
          >
            Featured Collections
          </motion.h2>
          <FeaturedProducts />
        </div>
      </section>
      
      {/* Shop by Occasion */}
      <ShopByOccasion />
      
      {/* Best Sellers */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl font-serif text-center mb-12 text-neutral-900"
          >
            Best Sellers
          </motion.h2>
          <BestSellers />
        </div>
      </section>
      
      {/* Influencer Spotlight */}
      <InfluencerSection />
      
      {/* Newsletter */}
      <Newsletter />
    </div>
  );
}
;