import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navigation from '@/components/Navigation';
import BackButton from '@/components/BackButton';
import AppFooter from '@/components/AppFooter';
import { Building, Mail, Phone, User, FileText, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const RequestDemo = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    jobTitle: '',
    organizationType: '',
    caseVolume: '',
    message: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.email || !formData.organization) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock API call - replace with actual endpoint later
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Demo request submitted successfully! We\'ll contact you within 24 hours.');
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        organization: '',
        jobTitle: '',
        organizationType: '',
        caseVolume: '',
        message: ''
      });
      
      // Navigate back to home after 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (error) {
      toast.error('Failed to submit demo request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fintech-navy via-fintech-navy to-fintech-navy">
      <Navigation />
      
      <main className="pt-20 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton />
          
          <div className="cosmic-card rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Request a
                <span className="text-primary">
                  {" "}Demo
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">
                See how our bank statement parser can transform your forensic analysis workflow
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-primary" />
                    <span>Full Name *</span>
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>Email Address *</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@company.com"
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-primary" />
                    <span>Phone Number</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="flex items-center space-x-2">
                    <Building className="w-4 h-4 text-primary" />
                    <span>Job Title</span>
                  </Label>
                  <Input
                    id="jobTitle"
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    placeholder="e.g., Forensic Analyst, CA, Investigator"
                    className="h-12"
                  />
                </div>
              </div>

              {/* Organization Information */}
              <div className="space-y-2">
                <Label htmlFor="organization" className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-primary" />
                  <span>Organization Name *</span>
                </Label>
                <Input
                  id="organization"
                  type="text"
                  value={formData.organization}
                  onChange={(e) => handleInputChange('organization', e.target.value)}
                  placeholder="Your company or firm name"
                  required
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="organizationType">Organization Type</Label>
                  <Select value={formData.organizationType} onValueChange={(value) => handleInputChange('organizationType', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ca-firm">CA Firm</SelectItem>
                      <SelectItem value="law-enforcement">Law Enforcement</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="consulting">Consulting Firm</SelectItem>
                      <SelectItem value="government">Government Agency</SelectItem>
                      <SelectItem value="bank">Bank/Financial Institution</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="caseVolume">Monthly Case Volume</Label>
                  <Select value={formData.caseVolume} onValueChange={(value) => handleInputChange('caseVolume', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select volume" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5 cases</SelectItem>
                      <SelectItem value="6-20">6-20 cases</SelectItem>
                      <SelectItem value="21-50">21-50 cases</SelectItem>
                      <SelectItem value="50+">50+ cases</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message" className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span>Additional Information</span>
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Tell us about your specific requirements, current challenges, or any questions you have..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Demo Features */}
              <div className="bg-secondary/10 rounded-lg p-6 border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">What You'll See in the Demo:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Live bank statement parsing</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Fraud detection algorithms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>Export formats & reports</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span>API integration options</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    Submitting Request...
                  </>
                ) : (
                  'Request Demo'
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to be contacted by our team regarding your demo request.
                We typically respond within 24 hours during business days.
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