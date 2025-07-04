import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Shield } from 'lucide-react';

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
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-background/80 backdrop-blur-xl rounded-2xl p-12 border border-white/20 shadow-2xl">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-full border border-pink-500/20 mb-6">
            <Shield className="w-4 h-4 mr-2 text-pink-500" />
            <span className="text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              Trusted by 150+ Government Agencies
            </span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Ready to Start
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              {" "}Tracing Fraud?
            </span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join the fight against financial crime. Start analyzing bank statements and tracing fraudulent money movement with our AI-powered platform today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white text-lg px-8 py-6 h-auto group"
            >
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-pink-500/30 hover:bg-pink-500/10 text-lg px-8 py-6 h-auto"
            >
              Schedule Demo
            </Button>
          </div>
          
          <div className="mt-8 text-sm text-muted-foreground">
            No credit card required • Secure processing • GDPR compliant
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingCTA;
