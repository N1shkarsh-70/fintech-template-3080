import React from 'react';
import { Shield, Lock, Award, Users } from 'lucide-react';

const LandingTrust = () => {
  const trustMetrics = [
    {
      icon: Award,
      value: '1M+',
      label: 'Lines Parsed',
      description: 'with 99.9% accuracy'
    },
    {
      icon: Users,
      value: '150+',
      label: 'CA Firms',
      description: 'trust our platform'
    },
    {
      icon: Shield,
      value: '100%',
      label: 'Compliance',
      description: 'audit-ready outputs'
    },
    {
      icon: Lock,
      value: '24/7',
      label: 'Security',
      description: 'end-to-end encryption'
    }
  ];

  const clientLogos = [
    'KPMG', 'EY', 'Deloitte', 'PwC', 'Grant Thornton', 'BDO'
  ];

  return (
    <section className="py-20 relative bg-secondary/10">
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-secondary/5 to-background/50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Stats */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Trusted by
            <span className="text-primary">
              {" "}Professionals
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
            Over 1 million lines parsed with 99.9% accuracy. Trusted by forensic analysts and CA firms across India.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {trustMetrics.map((metric, index) => (
            <div
              key={index}
              className="bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300 text-center group"
            >
              <div className="mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                  <metric.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-foreground mb-2">{metric.value}</div>
              <div className="text-lg font-semibold text-foreground mb-1">{metric.label}</div>
              <div className="text-sm text-muted-foreground">{metric.description}</div>
            </div>
          ))}
        </div>

        {/* Client Logos */}
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-8">
            Trusted by forensic analysts and CA firms
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
            {clientLogos.map((logo, index) => (
              <div
                key={index}
                className="bg-card/40 backdrop-blur-sm rounded-lg p-4 border border-border hover:border-primary/30 transition-all duration-300 text-center group"
              >
                <div className="text-lg font-bold text-muted-foreground group-hover:text-primary transition-colors">
                  {logo}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-16 bg-card/60 backdrop-blur-sm rounded-xl p-8 border border-border text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary mr-3" />
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-4">
            Enterprise-Grade Security
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            <strong>End-to-end encryption.</strong> No data stored after processing. 
            All files are automatically deleted after analysis completion. 
            Fully compliant with data protection regulations.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LandingTrust;