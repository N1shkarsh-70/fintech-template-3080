
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, Users } from 'lucide-react';

const LandingHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-blue-400/20 animate-gradient-shift"></div>
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-full border border-pink-500/20">
                <Shield className="w-4 h-4 mr-2 text-pink-500" />
                <span className="text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  AI-Powered Financial Security
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Trace
                <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
                  {" "}Fraudulent
                </span>
                <br />
                Money Movement
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl">
                Advanced AI-powered platform that helps government authorities detect and trace fraudulent financial activities through intelligent analysis of bank statements and transaction patterns.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white text-lg px-8 py-6 h-auto"
              >
                Start Tracing Now
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-pink-500/30 hover:bg-pink-500/10 text-lg px-8 py-6 h-auto"
              >
                Watch Demo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              {[
                { icon: Shield, label: 'Secure Analysis', value: '99.9%' },
                { icon: TrendingUp, label: 'Detection Rate', value: '94%' },
                { icon: Users, label: 'Gov Agencies', value: '150+' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-pink-500" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image/Animation */}
          <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative">
              {/* Main dashboard mockup */}
              <div className="bg-background/80 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-muted-foreground">Financial Trace Analysis</div>
                </div>
                
                {/* Mock data visualization */}
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">$2.3M</div>
                      <div className="text-sm text-muted-foreground">Fraudulent Amount Detected</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-pink-500/10 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-pink-500">23</div>
                        <div className="text-xs text-muted-foreground">Suspicious Accounts</div>
                      </div>
                    </div>
                    <div className="h-20 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-500">156</div>
                        <div className="text-xs text-muted-foreground">Transactions Traced</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-pink-500 rounded-full opacity-60 animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
