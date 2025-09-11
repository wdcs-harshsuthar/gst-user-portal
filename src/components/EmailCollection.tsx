import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Mail, ArrowRight, ArrowLeft, Shield, CheckCircle, Home, Phone } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface EmailCollectionProps {
  onSubmit: (email: string) => void;
  onBack: () => void;
  onBackToHome?: () => void;
}

export default function EmailCollection({ onSubmit, onBack, onBackToHome }: EmailCollectionProps) {
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [errors, setErrors] = useState<{ email?: string; mobileNumber?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getInlineStyles } = useTheme();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobileNumber = (mobile: string) => {
    // Liberian mobile number format: starts with +231 or 231, followed by 7-9 digits
    const mobileRegex = /^(\+?231)?[0-9]{7,9}$/;
    return mobileRegex.test(mobile.replace(/\s/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: { email?: string; mobileNumber?: string } = {};

    if (!email) {
      newErrors.email = 'Email address is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!validateMobileNumber(mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid Liberian mobile number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubmit(email);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div 
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ backgroundColor: 'hsl(230 100% 60% / 0.1)' }}
          >
            <Mail className="h-8 w-8" style={{ color: getInlineStyles().textPrimary.color }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Email Verification Required
          </h1>
          <p className="text-lg text-gray-600">
            Please provide your email address to begin the GST registration process
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div 
                className="w-8 h-8 text-white rounded-full flex items-center justify-center text-sm font-semibold"
                style={{ backgroundColor: getInlineStyles().primary.backgroundColor }}
              >
                1
              </div>
              <span className="ml-2 text-sm font-medium" style={{ color: getInlineStyles().textPrimary.color }}>Email</span>
            </div>
            <div className="w-12 h-0.5 bg-gray-300"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <span className="ml-2 text-sm text-gray-500">Registration</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Main Form Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-6 w-6" style={{ color: getInlineStyles().textPrimary.color }} />
                Email Address Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div className="form-group">
                  <Label htmlFor="email" className="form-label">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`mt-1 ${errors.email ? 'border-destructive' : ''}`}
                  />
                  {errors.email && (
                    <p className="form-error">{errors.email}</p>
                  )}
                  <p className="form-description">
                    We'll send a verification link to this email address
                  </p>
                </div>

                {/* Mobile Number Input */}
                <div className="form-group">
                  <Label htmlFor="mobileNumber" className="form-label">
                    Mobile Number *
                  </Label>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+231 XX XXX XXXX"
                    className={`mt-1 ${errors.mobileNumber ? 'border-destructive' : ''}`}
                  />
                  {errors.mobileNumber && (
                    <p className="form-error">{errors.mobileNumber}</p>
                  )}
                  <p className="form-description">
                    We'll use this number for SMS notifications and two-factor authentication
                  </p>
                </div>

                {/* Mobile Number Validation Indicator */}
                {mobileNumber && (
                  <div className="flex items-center gap-2 text-sm">
                    {validateMobileNumber(mobileNumber) ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-green-600">Valid mobile number format</span>
                      </>
                    ) : (
                      <>
                        <div className="h-4 w-4 rounded-full bg-orange-500"></div>
                        <span className="text-orange-600">Please enter a valid Liberian mobile number</span>
                      </>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full py-3"
                  style={{ 
                    backgroundColor: getInlineStyles().primary.backgroundColor,
                    color: getInlineStyles().primary.color
                  }}
                  disabled={isSubmitting || !email || !mobileNumber || !validateEmail(email) || !validateMobileNumber(mobileNumber)}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending Verification Email...
                    </>
                  ) : (
                    <>
                      Send Verification Email
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information Requirements */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 text-lg">Contact Information Requirements</CardTitle>
            </CardHeader>
            <CardContent className="text-blue-700">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Requirements
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Use a business email if registering for a business</li>
                    <li>• Ensure you have access to this email account</li>
                    <li>• Check spam/junk folder for verification emails</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Mobile Number Requirements
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Use Liberian mobile number format</li>
                    <li>• Include country code (+231) or omit</li>
                    <li>• Must be accessible for SMS verification</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="px-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              {onBackToHome && (
                <Button 
                  variant="ghost"
                  onClick={onBackToHome}
                  className="px-6 text-gray-600"
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Need help? Contact LRA Support at +231 (0800) 3850
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}