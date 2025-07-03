
import React from 'react';
import Navigation from '@/components/Navigation';
import LandingHero from '@/components/LandingHero';
import LandingFeatures from '@/components/LandingFeatures';
import LandingHowItWorks from '@/components/LandingHowItWorks';
import LandingCTA from '@/components/LandingCTA';
import AppFooter from '@/components/AppFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-blue-50 dark:from-pink-950/20 dark:via-background dark:to-blue-950/20">
      <Navigation />
      <main className="pt-16">
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingCTA />
      </main>
      <AppFooter />
    </div>
  );
};

export default Index;
