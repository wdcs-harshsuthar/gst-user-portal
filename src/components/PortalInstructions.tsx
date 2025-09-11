import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowRight, CheckCircle, FileText, Mail, Shield, Clock, Users, Building } from 'lucide-react';

interface PortalInstructionsProps {
  onConfirm: () => void;
  onBack: () => void;
  onStartQuestionnaire: () => void;
}

export default function PortalInstructions({ onConfirm, onBack, onStartQuestionnaire }: PortalInstructionsProps) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to LRA GST Portal
          </h1>
          <p className="text-lg text-gray-600">
            Your comprehensive guide to Goods and Services Tax registration in Liberia
          </p>
        </div>

        <div className="space-y-8">
          {/* Process Steps */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 text-center mb-6">
              Registration Process Overview
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Step 1 */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-100 text-blue-800">Step 1</Badge>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">5 Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Answer 5 quick questions to determine the appropriate registration form 
                    and process for your business type.
                  </p>
                </CardContent>
              </Card>

              {/* Step 2 */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-100 text-green-800">Step 2</Badge>
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Email Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Provide your email address and verify it through a secure verification link 
                    that will be sent to your inbox.
                  </p>
                </CardContent>
              </Card>

              {/* Step 3 */}
              <Card className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-orange-100 text-orange-800">Step 3</Badge>
                    <CheckCircle className="h-8 w-8 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">Registration Forms</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Fill out the determined registration form based on your questionnaire answers 
                    and upload required documents.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Key Features */}
          <Card className="full-width">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Portal Features & Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Secure & Encrypted</h4>
                      <p className="text-sm text-gray-600">All data is protected with industry-standard encryption</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Multi-Form Support</h4>
                      <p className="text-sm text-gray-600">Supports IN-01, RF-01, SP-01, OS-01 registration forms</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Digital Documentation</h4>
                      <p className="text-sm text-gray-600">Upload and manage all required documents digitally</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Real-time Tracking</h4>
                      <p className="text-sm text-gray-600">Monitor your application status in real-time</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Expert Support</h4>
                      <p className="text-sm text-gray-600">Access to LRA support team throughout the process</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Mobile Responsive</h4>
                      <p className="text-sm text-gray-600">Complete registration on any device, anywhere</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notice */}
          <Card className="full-width border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-800">Important Notice</CardTitle>
            </CardHeader>
            <CardContent className="text-orange-700">
              <ul className="space-y-2 text-sm">
                <li className="text-[16px]">• Ensure you have all required business documents ready before starting</li>
                <li className="text-[16px]">• Use a valid email address that you can access immediately</li>
                <li className="text-[16px]">• The session will remain active for 2 hours - complete registration within this time</li>
                <li className="text-[16px]">• For support, contact LRA at +231 (0800) 3850 or info@lra.gov.lr</li>
              </ul>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="px-8 py-3"
            >
              Back to Home
            </Button>
            <Button 
              onClick={onStartQuestionnaire}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
            >
              I Understand - Begin Registration
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-8 mt-16 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Powered by Liberia Revenue Authority (LRA) • Secure • Reliable • Official
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}