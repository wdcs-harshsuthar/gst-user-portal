// Replaced figma:asset imports with external placeholder images
const image_0a8941b2087eed40bd6e51fc272ab77d922aeb28 = "https://images.unsplash.com/photo-1542376750-0c7f1cb2a1b7?w=400&h=200&fit=crop";
const image_5bcfc9fdef80dc9f2e5064f92b5e1fc2fd9e4c08 = "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop";
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ArrowRight, Facebook, Twitter, Instagram, Youtube, Linkedin, Calendar, Users, FileText, Phone, Mail, MapPin, Download, ExternalLink, Play, Search, Building, CreditCard, Shield, BookOpen, HelpCircle, Clock, ChevronRight, FileCheck, Home } from 'lucide-react';
const backgroundImage = "https://images.unsplash.com/photo-1529925568486-84f5d5fe1d34?w=1600&h=900&fit=crop";
const lraLogo = "https://images.unsplash.com/photo-1518544801976-3e188e8777da?w=200&h=80&fit=crop";
const governmentHeroImage = "https://images.unsplash.com/photo-1530034565861-1034f70d2d2d?w=1600&h=900&fit=crop";
import GSTLogin from './GSTLogin';
import UserDashboard from './UserDashboard';

interface LRAWebsiteCloneProps {
  onGetStarted: () => void;
  onAdminAccess: () => void;
  onDirectRegistration: (formType: 'IN-01' | 'RF-01') => void;
  onExistingGSTLogin: () => void;
  onDocumentVerifierAccess?: () => void;
  onPropertyVerifierAccess?: () => void;
  onApplicationVerifierAccess?: () => void;
  onStaffPortalAccess?: () => void;
}

export default function LRAWebsiteClone({ 
  onGetStarted, 
  onAdminAccess, 
  onDirectRegistration, 
  onExistingGSTLogin,
  onDocumentVerifierAccess,
  onPropertyVerifierAccess,
  onApplicationVerifierAccess,
  onStaffPortalAccess
}: LRAWebsiteCloneProps) {
  const [currentView, setCurrentView] = useState<'website' | 'login' | 'dashboard'>('website');
  const [loggedInUser, setLoggedInUser] = useState<string>('');
  const [applications, setApplications] = useState<any[]>([]);

  // GST Portal button - no flow (disabled)
  const handleGSTPortalClick = () => {
    // No navigation - button disabled
  };

  const handleLogin = (username: string) => {
    setLoggedInUser(username);
    setCurrentView('dashboard');
  };

  const handleBackToWebsite = () => {
    setCurrentView('website');
    setLoggedInUser('');
  };

  const handleStartNewApplication = () => {
    onGetStarted();
  };

  const handleDeleteApplication = (applicationReference: string) => {
    setApplications(prev => prev.filter(app => app.applicationReference !== applicationReference));
  };

  const handleUploadReceipt = (applicationReference: string, receiptFile: File) => {
    setApplications(prev => prev.map(app => 
      app.applicationReference === applicationReference 
        ? { ...app, status: 'under-review', receiptUploaded: true }
        : app
    ));
  };

  // Show different views based on current state
  if (currentView === 'login') {
    return (
      <GSTLogin 
        onLogin={handleLogin}
        onBack={handleBackToWebsite}
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <UserDashboard 
        applications={applications}
        onStartNewApplication={handleStartNewApplication}
        onDeleteApplication={handleDeleteApplication}
        onUploadReceipt={handleUploadReceipt}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white">
        {/* Top Red Bar */}
        <div className="bg-red-600 text-white text-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@lra.gov.lr</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>17th Street, Sinkor, Monrovia</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>+231 (0800) 3850</span>
                </div>
                <Button className="bg-[rgba(231,200,0,1)] hover:bg-yellow-600 text-white px-6 py-2" onClick={onExistingGSTLogin}>
                  Existing GST Login
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onAdminAccess}
                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                >
                  Admin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onStaffPortalAccess}
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  Staff Portal
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Header */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* Logo */}
              <div className="flex items-center space-x-3">
                <img 
                  src={image_0a8941b2087eed40bd6e51fc272ab77d922aeb28}
                  alt="LRA Logo"
                  className="h-12 w-auto"
                />
              </div>
              
              {/* Navigation Menu */}
              <nav className="hidden lg:flex items-center space-x-8">
                <a href="#" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Home</a>
                <div className="relative group">
                  <a href="#" className="text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center">
                    Pages
                    <ArrowRight className="ml-1 h-3 w-3 rotate-90" />
                  </a>
                </div>
                <a href="#" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Events</a>
                <div className="relative group">
                  <a href="#" className="text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center">
                    Departments
                    <ArrowRight className="ml-1 h-3 w-3 rotate-90" />
                  </a>
                </div>
                <a href="#" className="text-gray-700 hover:text-red-600 transition-colors font-medium">Documentation</a>
                <div className="relative group">
                  <a href="#" className="text-gray-700 hover:text-red-600 transition-colors font-medium flex items-center">
                    Services
                    <ArrowRight className="ml-1 h-3 w-3 rotate-90" />
                  </a>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-800/60 bg-[rgba(0,0,0,0)]"></div>
        </div>
        
        <div className="relative container mx-auto px-4 z-10">
          <div className="max-w-4xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to<br />
              <span className="text-[rgba(255,255,255,1)]">Liberia Revenue Authority</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl text-[24px]">
              Your trusted partner for tax services, revenue collection, and business compliance in the Republic of Liberia.
            </p>
            
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
            >
              Get Started GST Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Service Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Easy Registration Process</h2>
            <p className="text-gray-600">Choose your registration type to get started immediately</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Individual Registration</h3>
                <p className="text-sm text-gray-600 mb-4">Quick GST registration for individuals</p>
                {/* <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDirectRegistration('IN-01')}
                  className="w-full"
                >
                  Start Now
                </Button> */}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                  <Building className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Business Registration</h3>
                <p className="text-sm text-gray-600 mb-4">Register your organization or business</p>
                {/* <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onDirectRegistration('RF-01')}
                  className="w-full"
                >
                  Start Now
                </Button> */}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Guided Registration</h3>
                <p className="text-sm text-gray-600 mb-4">Need help choosing? Use our guided process</p>
                {/* <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onGetStarted}
                  className="w-full"
                >
                  Get Started
                </Button> */}
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                  <HelpCircle className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Support Center</h3>
                <p className="text-sm text-gray-600 mb-4">Get help with your tax questions</p>
                {/* <Button variant="outline" size="sm" className="w-full">
                  Get Help
                </Button> */}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Professional Services Section */}
      <section className="relative overflow-hidden">
        {/* Hero Section with Government Building */}
        <div 
          className="relative min-h-[600px] flex items-center bg-cover bg-center"
          style={{
            backgroundImage: `url(${governmentHeroImage})`
          }}
        >
          <div className="absolute inset-0 bg-blue-900/70 bg-[rgba(0,0,0,0.7)]"></div>
          
          <div className="relative container mx-auto px-4 z-10 mt-[304px] mr-[95px] mb-[0px] ml-[95px]">
            <div className="max-w-4xl text-white">
              {/* YouTube Play Button */}
              <div className="mb-8">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-8 leading-tight max-w-2xl">
                We help you solve your city government problems
              </h1>
              
              {/* Explore Services Banner */}
              <div className="relative max-w-2xl mb-8">
                <div className="bg-white text-gray-800 px-8 py-4 rounded-lg shadow-lg relative">
                  <div className="text-lg font-semibold">Explore online services</div>
                  {/* Speech bubble arrow */}
                  <div className="absolute left-8 top-full w-0 h-0 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent border-t-white"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="bg-red-600 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Classical Columns Image */}
              <div className="flex justify-center lg:justify-start">
                <img 
                  src={image_5bcfc9fdef80dc9f2e5064f92b5e1fc2fd9e4c08}
                  alt="Classical government columns"
                  className="rounded-lg shadow-xl w-full h-auto object-cover"
                />
              </div>
              
              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                {/* Left Column Services */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between cursor-pointer hover:bg-red-700 p-3 rounded transition-colors">
                    <span className="font-medium">Online Financial Services</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-red-700 p-3 rounded transition-colors">
                    <span className="font-medium">Online Court Services</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-red-700 p-3 rounded transition-colors">
                    <span className="font-medium">Report Pollution</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-red-700 p-3 rounded transition-colors">
                    <span className="font-medium">Order Birth Certificate</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-red-700 p-3 rounded transition-colors">
                    <span className="font-medium">Parking Permission</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-red-700 p-3 rounded transition-colors">
                    <span className="font-medium">City visitors guide</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
                
                {/* Right Column Services */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between cursor-pointer hover:bg-red-700 p-3 rounded transition-colors">
                    <span className="font-medium">National Planning</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-red-700 p-3 rounded transition-colors">
                    <span className="font-medium">Public Service Identity</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-red-700 p-3 rounded transition-colors">
                    <span className="font-medium">Get Building Permission</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-red-700 p-3 rounded transition-colors">
                    <span className="font-medium">File a Tax Return</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-red-700 p-3 rounded transition-colors">
                    <span className="font-medium">Administrations</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between cursor-pointer hover:bg-red-700 p-3 rounded transition-colors">
                    <span className="font-medium">Service departments</span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured & Tutorial Videos Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Featured & Tutorial Videos
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Learn how to use our services with step-by-step video tutorials and featured content from the Liberia Revenue Authority.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Video 1 */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=225&fit=crop"
                    alt="GST Registration Tutorial"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/70 text-white text-xs">8:45</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">How to Register for GST Online</h3>
                  <p className="text-gray-600 text-sm">Step-by-step guide to complete your GST registration through our online portal.</p>
                </div>
              </CardContent>
            </Card>

            {/* Video 2 */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop"
                    alt="Tax Filing Tutorial"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/70 text-white text-xs">12:30</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Annual Tax Filing Made Easy</h3>
                  <p className="text-gray-600 text-sm">Learn how to file your annual tax returns efficiently using our digital platform.</p>
                </div>
              </CardContent>
            </Card>

            {/* Video 3 */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop"
                    alt="Business Registration Tutorial"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/70 text-white text-xs">15:20</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Complete Business Registration Guide</h3>
                  <p className="text-gray-600 text-sm">Everything you need to know about registering your business in Liberia.</p>
                </div>
              </CardContent>
            </Card>

            {/* Video 4 */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1551434678-e071c223a692?w=400&h=225&fit=crop"
                    alt="Digital Payment Tutorial"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/70 text-white text-xs">6:15</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Secure Online Tax Payments</h3>
                  <p className="text-gray-600 text-sm">Learn how to make secure tax payments through our digital payment system.</p>
                </div>
              </CardContent>
            </Card>

            {/* Video 5 */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop"
                    alt="Tax Compliance Tutorial"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/70 text-white text-xs">10:45</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Understanding Tax Compliance</h3>
                  <p className="text-gray-600 text-sm">Essential information about tax compliance requirements and best practices.</p>
                </div>
              </CardContent>
            </Card>

            {/* Video 6 */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=225&fit=crop"
                    alt="LRA Services Overview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition-colors">
                      <Play className="h-6 w-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-black/70 text-white text-xs">14:00</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">LRA Services Overview</h3>
                  <p className="text-gray-600 text-sm">Comprehensive overview of all services offered by the Liberia Revenue Authority.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
              View All Videos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                We help you solve your city government problems
              </h2>
              <p className="text-blue-100 mb-8">
                Our comprehensive digital platform simplifies tax processes, business registration, 
                and compliance requirements. Get expert guidance and support throughout your journey.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Digital Services</h4>
                  <ul className="space-y-1 text-sm text-blue-100">
                    <li>• Online tax filing</li>
                    <li>• Digital payments</li>
                    <li>• Electronic receipts</li>
                    <li>• Document management</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Support Services</h4>
                  <ul className="space-y-1 text-sm text-blue-100">
                    <li>• Tax education</li>
                    <li>• Compliance assistance</li>
                    <li>• Technical support</li>
                    <li>• Advisory services</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-red-600 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Quick Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span>+231 (0800) 3850</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5" />
                  <span>info@lra.gov.lr</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5" />
                  <span>Mon-Fri: 8:00 AM - 5:00 PM</span>
                </div>
              </div>
              <Button className="bg-white text-red-600 hover:bg-gray-100 w-full mt-6">
                Contact Us Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Let's explore local services programs & resources
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover comprehensive tax and business services designed to support your compliance needs and business growth.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1553877522-4326b3ff858f?w=400&h=200&fit=crop"
                  alt="Tax Services"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Individual Tax Services</h3>
                  <p className="text-gray-600 text-sm mb-4">Personal income tax filing, compliance assistance, and tax education for individual taxpayers.</p>
                  <Button variant="outline" size="sm">Learn More</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop"
                  alt="Business Services"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Business Registration</h3>
                  <p className="text-gray-600 text-sm mb-4">Complete business registration services including GST, TIN, and other business licenses.</p>
                  <Button variant="outline" size="sm">Learn More</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img 
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop"
                  alt="Compliance"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">Compliance Support</h3>
                  <p className="text-gray-600 text-sm mb-4">Expert guidance on tax compliance, regulatory requirements, and best practices.</p>
                  <Button variant="outline" size="sm">Learn More</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
            Join thousands of businesses and individuals who trust LRA for their tax and compliance needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={onGetStarted}
              className="bg-white text-red-600 hover:bg-gray-100 px-8 py-4"
            >
              Start GST Registration
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-red-600 px-8 py-4"
            >
              Explore Services
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={lraLogo}
                  alt="LRA Logo"
                  className="h-8 w-auto"
                />
                <div className="font-bold">Liberia Revenue Authority</div>
              </div>
              <p className="text-blue-100 text-sm mb-4">
                The official revenue collection agency of the Republic of Liberia, committed to modernizing tax administration and improving taxpayer services.
              </p>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500">
                  <span className="text-white text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-300">
                  <span className="text-white text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-500">
                  <span className="text-white text-xs">i</span>
                </div>
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-500">
                  <span className="text-white text-xs">y</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-blue-100 hover:text-white transition-colors">GST Registration</a>
                <a href="#" className="block text-blue-100 hover:text-white transition-colors">Tax Filing</a>
                <a href="#" className="block text-blue-100 hover:text-white transition-colors">Business Registration</a>
                <a href="#" className="block text-blue-100 hover:text-white transition-colors">Payment Portal</a>
                <a href="#" className="block text-blue-100 hover:text-white transition-colors">Tax Forms</a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-blue-100 hover:text-white transition-colors">Individual Tax</a>
                <a href="#" className="block text-blue-100 hover:text-white transition-colors">Corporate Tax</a>
                <a href="#" className="block text-blue-100 hover:text-white transition-colors">GST Services</a>
                <a href="#" className="block text-blue-100 hover:text-white transition-colors">Compliance Support</a>
                <a href="#" className="block text-blue-100 hover:text-white transition-colors">Tax Education</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-3 text-sm text-blue-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>17th Street, Sinkor, Monrovia</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+231 (0800) 3850</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@lra.gov.lr</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>Mon-Fri: 8:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-blue-100">
            <p>© 2025 Liberia Revenue Authority. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}