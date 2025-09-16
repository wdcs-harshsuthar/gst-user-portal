import image_0a8941b2087eed40bd6e51fc272ab77d922aeb28 from 'figma:asset/0a8941b2087eed40bd6e51fc272ab77d922aeb28.png';
import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, FileText, ArrowRight, RefreshCw, Download, User, Building, Home } from 'lucide-react';

interface QuestionnaireResult {
  route: 'sole-proprietorship' | 'partnership-corporation' | 'property-only';
  forms: string[];
  formDescription: string;
  registrationStatus: 'new' | 're-registration' | 'modification' | 'closure';
  applicantType: 'sole-proprietor' | 'organization' | 'property-owner';
  hasOwners?: boolean;
  hasBranches?: boolean;
  needsProperty?: boolean;
  icon: React.ReactNode;
  color: string;
}

interface QuestionnaireResultProps {
  result: QuestionnaireResult;
  onProceed: (route: 'sole-proprietorship' | 'partnership-corporation' | 'property-only') => void;
  onRetakeQuestionnaire: () => void;
  onBackToHome: () => void;
}

export default function QuestionnaireResult({ 
  result, 
  onProceed, 
  onRetakeQuestionnaire, 
  onBackToHome 
}: QuestionnaireResultProps) {
  const getRouteDetails = (route: string) => {
    switch (route) {
      case 'sole-proprietorship':
        return {
          title: 'Sole Proprietorship Registration Path',
          description: 'For single-owner business registration',
          requirements: [
            'Personal identification documents',
            'Business description and activities',
            'Business address and contact info',
            'Bank account information',
            'Business licenses (if any)',
            'Residential property details'
          ],
          estimatedTime: '25-30 minutes',
          bgColor: 'bg-gradient-to-r from-blue-600 to-blue-700',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          steps: [
            'Complete Sole Proprietorship Form (SP01)',
            'Complete Residential Property Declaration'
          ]
        };
      
      case 'partnership-corporation':
        return {
          title: 'Business Entity Registration Path',
          description: 'For partnerships, corporations, and LLCs',
          requirements: [
            'Business registration documents',
            'Articles of incorporation/partnership agreement',
            'Shareholder/partner information',
            'Business financial details',
            'Authorized representative info',
            'Residential property details'
          ],
          estimatedTime: '35-45 minutes',
          bgColor: 'bg-gradient-to-r from-purple-600 to-purple-700',
          borderColor: 'border-purple-200',
          iconColor: 'text-purple-600',
          steps: [
            'Complete Business Registration (RF01)',
            'Complete Owners/Shareholders (OS01)',
            'Complete Residential Property Declaration'
          ]
        };

      case 'property-only':
        return {
          title: 'Property Owner Registration Path',
          description: 'For residential property tax registration only',
          requirements: [
            'Property ownership documents',
            'Property address and details',
            'Property valuation information',
            'Property photos (front, back, sides)',
            'Contact information'
          ],
          estimatedTime: '10-15 minutes',
          bgColor: 'bg-gradient-to-r from-green-600 to-green-700',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          steps: [
            'Complete Residential Property Declaration'
          ]
        };
      
      default:
        return {
          title: 'Registration Path',
          description: 'Complete your GST registration',
          requirements: [],
          estimatedTime: '20-25 minutes',
          bgColor: 'bg-gradient-to-r from-gray-600 to-gray-700',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          steps: []
        };
    }
  };

  const routeDetails = getRouteDetails(result.route);

  const getRegistrationStatusBadge = () => {
    switch (result.registrationStatus) {
      case 'new':
        return <Badge className="bg-green-100 text-green-800 border-green-300">New Registration</Badge>;
      case 're-registration':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-300">Re-registration</Badge>;
      case 'modification':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Modification</Badge>;
      case 'closure':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Closure</Badge>;
      default:
        return null;
    }
  };

  const getPropertyOwnershipNote = () => {
    if (result.propertyOwnership === 'no') {
      return 'You indicated you don\'t own property, but the Residential Property Declaration is still mandatory for all applicants.';
    } else if (result.propertyOwnership === 'not-sure') {
      return 'Since you\'re unsure about property ownership, we\'ll guide you through the full property declaration process.';
    } else {
      return 'You\'ll need to provide details about your residential property in Liberia.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={image_0a8941b2087eed40bd6e51fc272ab77d922aeb28} 
                alt="Liberia Coat of Arms" 
                className="w-60 h-24 rounded-[0px] object-cover mx-[0px] py-[0px] m-[0px] pt-[115px] pb-[--4px] px-[10px] pt-[24px] pr-[10px] pb-[18px] pl-[10px]"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Liberia Revenue Authority</h1>
                <p className="text-sm text-gray-600">Registration Assessment Complete</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1 bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              Assessment Complete
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Results Card */}
          <Card className="shadow-xl mb-8">
            <CardHeader className={`${routeDetails.bgColor} text-white`}>
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-16 w-16" />
              </div>
              <CardTitle className="text-center text-2xl">
                Your Registration Path Determined!
              </CardTitle>
              <p className="text-center text-blue-100 mt-2">
                Based on your responses, here's your personalized registration journey
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${routeDetails.iconColor} bg-gray-50 rounded-full mb-4`}>
                  {result.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {routeDetails.title}
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  {routeDetails.description}
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  {getRegistrationStatusBadge()}
                  <Badge variant="outline" className={`${routeDetails.borderColor}`}>
                    {result.applicantType === 'business' && result.businessStructure 
                      ? result.businessStructure.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())
                      : result.applicantType.charAt(0).toUpperCase() + result.applicantType.slice(1)
                    }
                  </Badge>
                </div>
              </div>

              {/* Registration Steps */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  Your Registration Steps
                </h4>
                <div className="space-y-3">
                  {routeDetails.steps.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Requirements */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Required Information
                  </h4>
                  <ul className="space-y-2">
                    {routeDetails.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Process Info */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    What to Expect
                  </h4>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Estimated time: {routeDetails.estimatedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Multi-step guided process</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Save progress and return later</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Online and offline payment options</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Real-time application tracking</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Special Notes */}
              {result.businessOperations && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">Business Operations Note:</h5>
                  <p className="text-sm text-blue-800">
                    Your business type ({result.businessOperations.replace('-', ' ')}) may require additional documentation. 
                    We'll guide you through any specific requirements during the registration process.
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-start gap-2">
                  <Home className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-amber-900 mb-1">Property Declaration Required:</h5>
                    <p className="text-sm text-amber-800">{getPropertyOwnershipNote()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className={`text-lg px-8 py-6 ${routeDetails.bgColor} hover:opacity-90`}
              onClick={() => onProceed(result.route)}
            >
              Start Registration Process
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={onRetakeQuestionnaire}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retake Assessment
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={onBackToHome}
                className="text-gray-600"
              >
                Back to Home
              </Button>
            </div>
          </div>

          {/* Additional Information */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 rounded-full">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">
                    Need Help with Registration?
                  </h4>
                  <p className="text-blue-800 text-sm mb-3">
                    Download our registration guide to understand the process and prepare your documents 
                    before starting your {routeDetails.title.toLowerCase()}.
                  </p>
                  <Button variant="outline" size="sm" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                    <Download className="h-4 w-4 mr-2" />
                    Download Guide
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm mb-2">
              Need assistance during registration? Contact our support team:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-500">
              <span>📞 +231-XXX-XXXX</span>
              <span>✉️ gst@lra.gov.lr</span>
              <span>🕒 Mon-Fri, 8AM-5PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}