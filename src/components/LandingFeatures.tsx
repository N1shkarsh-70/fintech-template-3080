
import React from 'react';
import { Brain, Shield, Zap, FileText, Users, TrendingUp } from 'lucide-react';

const LandingFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze patterns and detect suspicious activities automatically.'
    },
    {
      icon: Shield,
      title: 'Secure Processing',
      description: 'Bank-grade security ensures all financial data is processed with the highest level of protection.'
    },
    {
      icon: Zap,
      title: 'Real-time Tracing',
      description: 'Instantly trace money movement across multiple accounts and financial institutions.'
    },
    {
      icon: FileText,
      title: 'Document Analysis',
      description: 'Upload bank statements in any format - PDF, CSV, or images - for comprehensive analysis.'
    },
    {
      icon: Users,
      title: 'Multi-Agency Support',
      description: 'Collaborate with other government agencies and share findings securely.'
    },
    {
      icon: TrendingUp,
      title: 'Detailed Reports',
      description: 'Generate comprehensive reports with visual money flow graphs and evidence trails.'
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/30 to-transparent dark:via-pink-950/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Powerful Features for
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              {" "}Financial Investigation
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our platform combines cutting-edge AI with government-grade security to help you trace and analyze fraudulent financial activities with unprecedented accuracy.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-background/60 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-pink-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 group"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;
