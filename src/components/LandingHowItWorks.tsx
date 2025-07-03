
import React from 'react';
import { Upload, Brain, Search, FileText } from 'lucide-react';

const LandingHowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Bank Statements',
      description: 'Upload multiple bank statements in PDF, CSV, or image format. Our system supports all major banking formats.',
      step: '01'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our advanced AI processes the documents using OCR and NLP to extract transaction data and identify patterns.',
      step: '02'
    },
    {
      icon: Search,
      title: 'Trace Money Flow',
      description: 'The system traces money movement across accounts, identifying suspicious transfers and connections.',
      step: '03'
    },
    {
      icon: FileText,
      title: 'Generate Report',
      description: 'Receive detailed reports with visual money flow graphs, suspicious activity alerts, and evidence trails.',
      step: '04'
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-pink-50/30 dark:from-blue-950/10 dark:to-pink-950/10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            How
            <span className="bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
              {" "}FinTrace
            </span>
            {" "}Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our streamlined process makes financial investigation simple and efficient, from document upload to comprehensive analysis.
          </p>
        </div>

        <div className="relative">
          {/* Connection lines */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-blue-500 transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step card */}
                <div className="bg-background/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-pink-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/10 text-center group">
                  {/* Step number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  
                  <div className="mt-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <step.icon className="w-8 h-8 text-pink-500" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
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
