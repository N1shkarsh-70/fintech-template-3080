
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import AppFooter from '@/components/AppFooter';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';

const RequestDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    phone: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock API call - replace with actual implementation later
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Demo request submitted:', formData);
      toast.success('Demo request submitted successfully!');
      setIsSubmitted(true);
    } catch (error) {
      toast.error('Failed to submit demo request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-fintech-navy via-fintech-navy to-fintech-navy">
        <Navigation />
        
        <main className="pt-20 pb-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-2xl text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-foreground mb-4">Thank You!</h1>
              <p className="text-muted-foreground text-lg mb-6">
                Your demo request has been submitted successfully. Our team will contact you within 24 hours to schedule your personalized demo.
              </p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>What happens next:</p>
                <ul className="list-disc list-inside space-y-1 max-w-md mx-auto">
                  <li>Our team reviews your request</li>
                  <li>We'll contact you to schedule a convenient time</li>
                  <li>Personalized demo tailored to your needs</li>
                  <li>Q&A session with our experts</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
        
        <AppFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-fintech-navy via-fintech-navy to-fintech-navy">
      <Navigation />
      
      <main className="pt-20 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton />
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Request a
              <span className="text-primary">
                {" "}Demo
              </span>
            </h1>
            <p className="text-muted-foreground text-lg">
              See Financial Compass in action. Get a personalized demo tailored to your specific needs and use cases.
            </p>
          </div>

          <div className="bg-card/90 backdrop-blur-xl rounded-2xl p-8 border border-border shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="company">Company/Organization *</Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Enter your company name"
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Your Role *</Label>
                  <Select onValueChange={(value) => handleInputChange('role', value)} required>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="forensic-analyst">Forensic Analyst</SelectItem>
                      <SelectItem value="chartered-accountant">Chartered Accountant</SelectItem>
                      <SelectItem value="financial-investigator">Financial Investigator</SelectItem>
                      <SelectItem value="auditor">Auditor</SelectItem>
                      <SelectItem value="compliance-officer">Compliance Officer</SelectItem>
                      <SelectItem value="legal-professional">Legal Professional</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your specific needs, challenges, or questions about Financial Compass..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              <div className="bg-primary/10 rounded-lg p-4 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-2">What to expect in your demo:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Live demonstration of bank statement parsing</li>
                  <li>• Overview of forensic analysis features</li>
                  <li>• Custom workflow setup for your use case</li>
                  <li>• Q&A session with our experts</li>
                  <li>• Pricing and implementation discussion</li>
                </ul>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 font-semibold"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Request...
                  </>
                ) : (
                  'Request Demo'
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to our Privacy Policy and Terms of Service.
                We'll contact you within 24 hours to schedule your demo.
              </p>
            </form>
          </div>
        </div>
      </main>
      
      <AppFooter />
    </div>
  );
};

export default RequestDemo;
