import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle, FileText, ArrowRight, RefreshCw, Download } from 'lucide-react';

interface QuestionnaireResult {
  formType: 'IN-01' | 'RF-01';
  formName: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface QuestionnaireResultProps {
  result: QuestionnaireResult;
  onProceed: (formType: 'IN-01' | 'RF-01') => void;
  onRetakeQuestionnaire: () => void;
  onBackToHome: () => void;
}

export default function QuestionnaireResult({ 
  result, 
  onProceed, 
  onRetakeQuestionnaire, 
  onBackToHome 
}: QuestionnaireResultProps) {
  const getFormDetails = (formType: 'IN-01' | 'RF-01') => {
    if (formType === 'IN-01') {
      return {
        title: 'Individual Registration Form (IN-01)',
        description: 'Designed for individuals and sole proprietors',
        requirements: [
          'Personal identification documents',
          'Proof of address',
          'Bank account information',
          'Business description (if applicable)',
          'Residential property declaration'
        ],
        estimatedTime: '15-20 minutes',
        bgColor: 'bg-gradient-to-r from-green-600 to-green-700',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600'
      };
    } else {
      return {
        title: 'Organization Registration Form (RF-01)',
        description: 'Designed for corporations, partnerships, and NGOs',
        requirements: [
          'Business registration documents',
          'Articles of incorporation',
          'Shareholder/owner information',
          'Financial statements',
          'Business address verification',
          'Residential property declaration'
        ],
        estimatedTime: '25-30 minutes',
        bgColor: 'bg-gradient-to-r from-blue-600 to-blue-700',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600'
      };
    }
  };

  const formDetails = getFormDetails(result.formType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://images.unsplash.com/photo-1569233422-c1eca3fc8eb6?w=50&h=50&fit=crop&crop=center" 
                alt="Liberia Coat of Arms" 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Liberia Revenue Authority</h1>
                <p className="text-sm text-gray-600">Registration Assessment Complete</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1 bg-green-100 text-green-800">
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Results Card */}
          <Card className="shadow-xl mb-8">
            <CardHeader className={`${formDetails.bgColor} text-white`}>
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-16 w-16" />
              </div>
              <CardTitle className="text-center text-2xl">
                Assessment Complete!
              </CardTitle>
              <p className="text-center text-blue-100 mt-2">
                Based on your responses, we've determined your registration path
              </p>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 ${formDetails.iconColor} bg-gray-50 rounded-full mb-4`}>
                  {result.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {formDetails.title}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {formDetails.description}
                </p>
                <Badge variant="outline" className={`text-base px-4 py-2 ${formDetails.borderColor}`}>
                  Form {result.formType}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Requirements */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Required Documents
                  </h4>
                  <ul className="space-y-2">
                    {formDetails.requirements.map((requirement, index) => (
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
                      <span>Estimated time: {formDetails.estimatedTime}</span>
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
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg"
              className={`text-lg px-8 py-6 ${formDetails.bgColor.replace('gradient-to-r', 'gradient-to-r')} hover:opacity-90`}
              onClick={() => onProceed(result.formType)}
            >
              Start {result.formType} Registration
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
                    Need Help with Documents?
                  </h4>
                  <p className="text-blue-800 text-sm mb-3">
                    Download our document preparation guide to ensure you have everything ready 
                    before starting your registration.
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
              Need assistance? Contact our support team:
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