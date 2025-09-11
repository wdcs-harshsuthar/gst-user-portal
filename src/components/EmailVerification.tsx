import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Mail, CheckCircle, Clock, RefreshCw, ArrowLeft, ArrowRight, Home } from 'lucide-react';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
  onResendEmail: () => void;
  onBackToHome?: () => void;
}

export default function EmailVerification({ email, onVerified, onBack, onResendEmail, onBackToHome }: EmailVerificationProps) {
  const [timeLeft, setTimeLeft] = useState(30 * 24 * 60 * 60); // 30 days in seconds
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
  };

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendCooldown(60); // 1 minute cooldown
    
    // Simulate API call
    setTimeout(() => {
      onResendEmail();
      setIsResending(false);
      setTimeLeft(30 * 24 * 60 * 60); // Reset timer
    }, 2000);
  };

  const handleVerifyClick = () => {
    // Simulate email verification
    setIsVerified(true);
    setTimeout(() => {
      onVerified();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            {isVerified ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <Mail className="h-8 w-8 text-primary" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isVerified ? 'Email Verified!' : 'Check Your Email'}
          </h1>
          <p className="text-lg text-gray-600">
            {isVerified 
              ? 'Your email has been successfully verified'
              : 'We\'ve sent a verification link to your email address'
            }
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                ✓
              </div>
              <span className="ml-2 text-sm font-medium text-green-600">Email</span>
            </div>
            <div className="w-12 h-0.5 bg-primary"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 ${isVerified ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500'} rounded-full flex items-center justify-center text-sm font-semibold`}>
                2
              </div>
              <span className={`ml-2 text-sm ${isVerified ? 'text-primary font-medium' : 'text-gray-500'}`}>Registration</span>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          {isVerified ? (
            /* Verification Success */
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Email Successfully Verified!</h3>
                  <p className="text-green-700 mb-6">
                    Your email address has been confirmed. You can now proceed to complete your GST registration.
                  </p>
                  <Button 
                    onClick={onVerified}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
                  >
                    Continue to Registration
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            /* Email Verification Instructions */
            <>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-6 w-6 text-primary" />
                    Email Sent to: {email}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Follow these steps to verify your email:</h3>
                    <ol className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">1</span>
                        <span>Check your email inbox for a message from LRA GST Portal</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">2</span>
                        <span>Click the "Verify Email" button in the email</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold">3</span>
                        <span>Return to this page and click "I've Verified My Email" below</span>
                      </li>
                    </ol>
                  </div>

                  {/* Timer */}
                  <Alert className={timeLeft <= 3 * 24 * 60 * 60 ? 'border-orange-200 bg-orange-50' : ''}>
                    <Clock className={`h-4 w-4 ${timeLeft <= 3 * 24 * 60 * 60 ? 'text-orange-600' : ''}`} />
                    <AlertDescription className={timeLeft <= 3 * 24 * 60 * 60 ? 'text-orange-700' : ''}>
                      <strong>Time remaining:</strong> {formatTime(timeLeft)}
                      {timeLeft <= 3 * 24 * 60 * 60 && (
                        <span className="block mt-1 text-sm">
                          ⚠️ Your verification link will expire in less than 3 days. Please verify your email or request a new link.
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>

                  {/* Demo Button for Testing */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">For Demo Purposes:</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Since this is a demo, click the button below to simulate email verification:
                    </p>
                    <Button 
                      onClick={handleVerifyClick}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Simulate Email Verification
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Troubleshooting */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Didn't receive the email?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600 space-y-2">
                    <p>• Check your spam or junk folder</p>
                    <p>• Ensure {email} is correct</p>
                    <p>• Wait a few minutes - emails can sometimes be delayed</p>
                    <p>• Check if your email provider blocks automated emails</p>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={handleResendEmail}
                    disabled={isResending || resendCooldown > 0}
                    className="w-full sm:w-auto"
                  >
                    {isResending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        Sending Email...
                      </>
                    ) : resendCooldown > 0 ? (
                      <>
                        <Clock className="mr-2 h-4 w-4" />
                        Resend in {resendCooldown}s
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="px-6"
                disabled={isVerified}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              {onBackToHome && (
                <Button 
                  variant="ghost"
                  onClick={onBackToHome}
                  className="px-6 text-gray-600"
                  disabled={isVerified}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              )}
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Having trouble? Contact LRA Support at +231 (0800) 3850
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}