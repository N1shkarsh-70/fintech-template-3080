import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Play } from 'lucide-react';

const LandingCTA = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/analysis');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-background to-primary/10"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-card/80 backdrop-blur-xl rounded-2xl p-12 border border-border shadow-2xl">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Analyze
            <span className="text-primary">
              {" "}a Statement?
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your bank statements into forensic-grade insights in minutes. 
            Start your analysis today with our secure, audit-ready platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 h-auto group"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary/30 hover:bg-primary/10 text-foreground text-lg px-8 py-6 h-auto"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-muted-foreground">
            No credit card required • Secure processing • End-to-end encryption
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCTA;