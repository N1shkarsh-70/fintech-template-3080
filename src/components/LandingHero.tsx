
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowRight, Play, Shield, TrendingUp, Users, FileText, Database, BarChart3 } from 'lucide-react';

const LandingHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleUploadStatement = () => {
    if (user) {
      navigate('/analysis');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary))_0.5px,transparent_0.5px)] bg-[length:30px_30px] animate-pulse"></div>
      </div>
      
      {/* Floating data particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/30 rounded-full opacity-60 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
                <Shield className="w-4 h-4 mr-2 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Trusted by Forensic Analysts & CA Firms
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Parse
                <span className="text-primary">
                  {" "}1M Bank
                </span>
                <br />
                Transactions
                <br />
                <span className="text-primary">in Minutes</span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                Automated, secure, and audit-ready insights from any bank statement. 
                Forensic-grade parsing accuracy for investigators and financial analysts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={handleUploadStatement}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 h-auto group"
              >
                Upload Statement
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-primary/30 hover:bg-primary/10 text-foreground text-lg px-8 py-6 h-auto group"
                onClick={() => navigate('/request-demo')}
              >
                <Play className="mr-2 h-5 w-5" />
                Request a Demo
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8 pt-8">
              {[
                { icon: Shield, label: 'Parsing Accuracy', value: '99.9%' },
                { icon: TrendingUp, label: 'Lines Processed', value: '1M+' },
                { icon: Users, label: 'CA Firms Trust Us', value: '150+' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Animated Dashboard Flow */}
          <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative">
              {/* Data Flow Animation */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Input data stream */}
                <div className="absolute top-0 left-0 w-full h-full">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-primary/40 rounded-full animate-pulse opacity-60"
                      style={{
                        left: `${10 + i * 12}%`,
                        top: `${20 + Math.sin(i) * 10}%`,
                        animationDelay: `${i * 0.5}s`,
                        animationDuration: '2s'
                      }}
                    />
                  ))}
                </div>
                
                {/* Processing nodes */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-spin">
                    <Database className="w-8 h-8 text-primary" />
                  </div>
                </div>
                
                {/* Output data stream */}
                <div className="absolute bottom-0 right-0 w-full h-full">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-4 h-4 bg-primary/60 rounded-sm animate-bounce"
                      style={{
                        right: `${10 + i * 15}%`,
                        bottom: `${20 + Math.cos(i) * 8}%`,
                        animationDelay: `${1 + i * 0.3}s`,
                        animationDuration: '1.5s'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Main dashboard mockup */}
              <div className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border p-6 shadow-2xl relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">Financial Compass</div>
                </div>
                
                {/* Animated mock data visualization */}
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/20 rounded-lg border border-primary/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse"></div>
                    <div className="text-center relative z-10">
                      <div className="text-2xl font-bold text-foreground">₹23,45,678</div>
                      <div className="text-sm text-muted-foreground">Total Transactions Analyzed</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-20 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-primary/30 animate-pulse"></div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">1,247</div>
                        <div className="text-xs text-muted-foreground">Transactions</div>
                      </div>
                    </div>
                    <div className="h-20 bg-primary/5 rounded-lg border border-primary/10 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-red-400/30 animate-pulse" style={{animationDelay: '1s'}}></div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">23</div>
                        <div className="text-xs text-muted-foreground">Flagged Items</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <span>Processing Status</span>
                      <span className="text-primary font-medium animate-pulse">Processing...</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div className="bg-primary h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements with animation */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-bounce">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary/30 rounded-full flex items-center justify-center animate-pulse">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
