import React from 'react';
import { Upload, Brain, Search, FileText } from 'lucide-react';

const LandingHowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload PDF/Scanned Bank Statement',
      description: 'Upload any bank statement format - PDF, scanned images, or digital files. Our system supports all major Indian banks.',
      step: '01'
    },
    {
      icon: Brain,
      title: 'Auto-extract transactions and metadata',
      description: 'Advanced OCR and AI extract every transaction detail with forensic-grade accuracy, including dates, amounts, and descriptions.',
      step: '02'
    },
    {
      icon: Search,
      title: 'Analyze and flag key insights',
      description: 'Smart detection algorithms identify related-party transactions, unusual patterns, and potential compliance issues.',
      step: '03'
    },
    {
      icon: FileText,
      title: 'Export clean Excel or Audit Reports',
      description: 'Generate court-ready, audit-optimized reports with clean Excel exports and detailed transaction analysis.',
      step: '04'
    }
  ];

  return (
    <section className="py-20 relative bg-secondary/20">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/5 to-background"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How It
            <span className="text-primary">
              {" "}Works
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Simple 4-step process to transform any bank statement into actionable insights for forensic analysis and auditing.
          </p>
        </div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step card */}
                <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 text-center group">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="mt-4 mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 border border-primary/20">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-foreground mb-3 leading-tight">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHowItWorks;