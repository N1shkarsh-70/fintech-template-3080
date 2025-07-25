import React from 'react';
import { Target, FileCheck, Users, Download } from 'lucide-react';

const LandingFeatures = () => {
  const features = [
    {
      icon: Target,
      title: 'Forensic-grade parsing accuracy',
      description: 'Advanced AI algorithms ensure 99.9% accuracy in transaction extraction, meeting forensic investigation standards.'
    },
    {
      icon: FileCheck,
      title: 'Scanned + Digital statements supported',
      description: 'Process any format - from high-quality PDFs to poor-quality scanned images from any Indian bank.'
    },
    {
      icon: Users,
      title: 'Smart detection of related-party links',
      description: 'Automatically identify connections between accounts, flag circular transactions, and detect unusual patterns.'
    },
    {
      icon: Download,
      title: 'Court-Ready, Audit-Optimized Outputs',
      description: 'Generate professionally formatted Excel reports and detailed analysis ready for legal proceedings.'
    }
  ];

  return (
    <section id="features" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Powerful Features for
            <span className="text-primary">
              {" "}Financial Analysis
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Professional-grade tools designed specifically for auditors, investigators, and financial analysts who need accurate, reliable results.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card/60 backdrop-blur-sm rounded-xl p-8 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group"
            >
              <div className="mb-6">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;