
import React from 'react';
import Navigation from '@/components/Navigation';
import LandingHero from '@/components/LandingHero';
import LandingHowItWorks from '@/components/LandingHowItWorks';
import LandingFeatures from '@/components/LandingFeatures';
import LandingTrust from '@/components/LandingTrust';
import LandingSampleOutput from '@/components/LandingSampleOutput';
import LandingCTA from '@/components/LandingCTA';
import AppFooter from '@/components/AppFooter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fintech-navy via-fintech-navy to-fintech-navy">
      <Navigation />
      <main className="pt-16">
        <LandingHero />
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingTrust />
        <LandingSampleOutput />
        <LandingCTA />
      </main>
      <AppFooter />
    </div>
  );
};

export default Index;
