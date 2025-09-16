import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, CheckCircle, RefreshCw, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

interface CodeVerificationProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
  onResendCode: () => void;
}

export default function CodeVerification({ email, onVerified, onBack, onResendCode }: CodeVerificationProps) {
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const [errors, setErrors] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const maxAttempts = 3;

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    // Auto-focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);
    setErrors('');

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all fields are filled
    if (value && newCodes.every(code => code !== '')) {
      handleVerifyCode(newCodes.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6);
    
    if (digits.length === 6) {
      const newCodes = digits.split('');
      setCodes(newCodes);
      setErrors('');
      handleVerifyCode(digits);
    }
  };

  const handleVerifyCode = async (code: string) => {
    setIsVerifying(true);
    setErrors('');

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept "123456" as valid code
      if (code === '123456') {
        setIsVerified(true);
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        setAttempts(prev => prev + 1);
        setErrors(`Invalid verification code. ${maxAttempts - attempts - 1} attempts remaining.`);
        
        if (attempts + 1 >= maxAttempts) {
          setErrors('Maximum attempts reached. Please request a new verification code.');
        }
        
        // Clear the codes
        setCodes(['', '', '', '', '', '']);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
      setIsVerifying(false);
    }, 1500);
  };

  const handleResendCode = async () => {
    setIsResending(true);
    setResendCooldown(60); // 1 minute cooldown
    setAttempts(0); // Reset attempts
    setErrors('');
    
    // Simulate API call
    setTimeout(() => {
      onResendCode();
      setIsResending(false);
      setCodes(['', '', '', '', '', '']);
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 2000);
  };

  const handleManualVerify = () => {
    const code = codes.join('');
    if (code.length === 6) {
      handleVerifyCode(code);
    } else {
      setErrors('Please enter all 6 digits of the verification code.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            {isVerified ? (
              <CheckCircle className="h-8 w-8 text-green-600" />
            ) : (
              <Shield className="h-8 w-8 text-primary" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isVerified ? 'Security Verified!' : 'Security Verification'}
          </h1>
          <p className="text-lg text-gray-600">
            {isVerified 
              ? 'Your identity has been successfully verified'
              : 'Enter the 6-digit verification code sent to your email'
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
            <div className="w-12 h-0.5 bg-green-600"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 ${isVerified ? 'bg-green-600 text-white' : 'bg-primary text-white'} rounded-full flex items-center justify-center text-sm font-semibold`}>
                {isVerified ? '✓' : '2'}
              </div>
              <span className={`ml-2 text-sm font-medium ${isVerified ? 'text-green-600' : 'text-primary'}`}>Security</span>
            </div>
            <div className={`w-12 h-0.5 ${isVerified ? 'bg-primary' : 'bg-gray-300'}`}></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 ${isVerified ? 'bg-primary text-white' : 'bg-gray-300 text-gray-500'} rounded-full flex items-center justify-center text-sm font-semibold`}>
                3
              </div>
              <span className={`ml-2 text-sm ${isVerified ? 'text-primary font-medium' : 'text-gray-500'}`}>Registration</span>
            </div>
          </div>
        </div>

        {isVerified ? (
          /* Verification Success */
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-green-800 mb-2">Security Verification Complete!</h3>
                <p className="text-green-700 mb-6">
                  Your identity has been verified successfully. You can now proceed to the registration questionnaire.
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
          /* Code Input */
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  Enter Verification Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    We've sent a 6-digit verification code to <strong>{email}</strong>
                  </p>

                  {/* Code Input Fields */}
                  <div className="flex justify-center gap-3 mb-6">
                    {codes.map((code, index) => (
                      <Input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el as HTMLInputElement | null;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="\d{1}"
                        maxLength={1}
                        value={code}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className="w-12 h-12 text-center text-xl font-bold border-2 focus:border-primary"
                        disabled={isVerifying}
                      />
                    ))}
                  </div>

                  {/* Error Message */}
                  {errors && (
                    <Alert className="mb-4 border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        {errors}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Manual Verify Button */}
                  <Button
                    onClick={handleManualVerify}
                    disabled={isVerifying || codes.some(code => code === '') || attempts >= maxAttempts}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
                  >
                    {isVerifying ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Verifying Code...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Verify Code
                      </>
                    )}
                  </Button>
                </div>

                {/* Demo Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">For Demo Purposes:</h4>
                  <p className="text-sm text-blue-700">
                    Use the code <strong>123456</strong> to proceed with the demo.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Resend Code */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Didn't receive the code?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 mb-4">
                  <p>• Check your email inbox and spam folder</p>
                  <p>• The code expires in 10 minutes</p>
                  <p>• Make sure your email address is correct: {email}</p>
                </div>
                
                <Button
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={isResending || resendCooldown > 0 || attempts >= maxAttempts}
                  className="w-full sm:w-auto"
                >
                  {isResending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Sending New Code...
                    </>
                  ) : resendCooldown > 0 ? (
                    <>
                      Resend in {resendCooldown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Send New Code
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="px-6"
            disabled={isVerified}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Secure verification powered by LRA • Your data is protected
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}