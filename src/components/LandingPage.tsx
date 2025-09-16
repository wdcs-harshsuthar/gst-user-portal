import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { FileText, Shield, Users, TrendingUp, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onAdminAccess: () => void;
}

export default function LandingPage({ onGetStarted, onAdminAccess }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-primary text-white">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1569233422-c1eca3fc8eb6?w=50&h=50&fit=crop&crop=center" 
                alt="Liberia Coat of Arms" 
                className="w-12 h-12 rounded-full bg-white p-1"
              />
              <div>
                <h1 className="text-xl font-bold">Republic of Liberia</h1>
                <p className="text-sm opacity-90">Liberia Revenue Authority</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="bg-transparent border-white text-white hover:bg-white hover:text-primary"
              onClick={onAdminAccess}
            >
              Admin Portal
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <Badge variant="secondary" className="text-lg px-4 py-2 mb-6">
            GST Registration System
          </Badge>
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Register for GST
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The official Goods and Services Tax registration portal for the Republic of Liberia. 
            Complete your registration online with our streamlined digital process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90"
              onClick={onGetStarted}
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500">
              Quick questionnaire to determine your registration path
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Register Online?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our digital platform makes GST registration faster, more convenient, and more secure than ever before.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Digital Forms</h4>
                <p className="text-gray-600 text-sm">
                  Complete all required forms online with step-by-step guidance
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Secure Process</h4>
                <p className="text-gray-600 text-sm">
                  Your information is protected with bank-level security measures
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Track Progress</h4>
                <p className="text-gray-600 text-sm">
                  Monitor your application status in real-time through your dashboard
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Expert Support</h4>
                <p className="text-gray-600 text-sm">
                  Get help from our dedicated support team when you need it
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Registration Types
            </h3>
            <p className="text-lg text-gray-600">
              We support registration for both individuals and businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white">
                <CardTitle className="text-center text-xl">Individual Registration</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Sole proprietors and individual taxpayers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Simplified registration process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Form IN-01 based registration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold">•</span>
                    <span>Faster processing times</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardTitle className="text-center text-xl">Business Registration</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Corporations, partnerships, and NGOs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Comprehensive business documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Form RF-01 based registration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>Multiple stakeholder support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Take our quick questionnaire to determine the right registration path for you. 
            The entire process takes just a few minutes to complete.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-6"
            onClick={onGetStarted}
          >
            Start Registration Process
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12 bg-gray-800 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 mb-3 text-blue-400" />
              <h4 className="font-semibold mb-2">Phone Support</h4>
              <p className="text-gray-300">+231-XXX-XXXX</p>
              <p className="text-gray-300 text-sm">Mon-Fri, 8AM-5PM</p>
            </div>
            
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-blue-400" />
              <h4 className="font-semibold mb-2">Email Support</h4>
              <p className="text-gray-300">gst@lra.gov.lr</p>
              <p className="text-gray-300 text-sm">Response within 24 hours</p>
            </div>
            
            <div className="flex flex-col items-center">
              <MapPin className="h-8 w-8 mb-3 text-blue-400" />
              <h4 className="font-semibold mb-2">Visit Our Office</h4>
              <p className="text-gray-300">LRA Headquarters</p>
              <p className="text-gray-300 text-sm">Monrovia, Liberia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400 mb-2">
            © 2025 Republic of Liberia - Liberia Revenue Authority. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            This is the official GST registration portal of the Liberia Revenue Authority
          </p>
        </div>
      </footer>
    </div>
  );
}