import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { User, Building2, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

interface EntryPointSelectionProps {
  onComplete: (data: { entryPoint: 'individual' | 'business' }) => void;
  onBackToHome?: () => void;
}

export default function EntryPointSelection({ onComplete, onBackToHome }: EntryPointSelectionProps) {
  const [selectedType, setSelectedType] = useState<'individual' | 'business' | ''>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedType) {
      onComplete({ entryPoint: selectedType });
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl">Welcome to GST Registration</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Register for a General Sales Tax (GST) number with the Liberia Revenue Authority. 
          This portal serves both new applicants and existing TIN holders who need GST registration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl mb-4">Select Your Registration Type</h3>
            <p className="text-muted-foreground mb-6">
              Choose the type of registration that best describes your situation:
            </p>
          </div>

          <RadioGroup 
            value={selectedType} 
            onValueChange={(value) => setSelectedType(value as 'individual' | 'business')}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="relative">
              
              <Label 
                htmlFor="individual" 
                className="flex cursor-pointer select-none rounded-lg border-2 border-muted p-6 hover:bg-accent peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50"
              >
                
                <Card className="w-full border-0 shadow-none">
                <RadioGroupItem value="individual" id="individual" className="peer sr-only" />
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="text-lg">Individual Registration</h4>
                        <p className="text-sm text-muted-foreground">
                          For individual taxpayers and sole proprietors
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Personal tax registration</p>
                      <p>• Sole proprietorship businesses</p>
                      <p>• Individual contractors</p>
                      <p>• Small traders</p>
                    </div>
                  </CardContent>
                </Card>
              </Label>
            </div>

            <div className="relative">
              
              <Label 
                htmlFor="business" 
                className="flex cursor-pointer select-none rounded-lg border-2 border-muted p-6 hover:bg-accent peer-data-[state=checked]:border-blue-600 peer-data-[state=checked]:bg-blue-50"
              >
                <Card className="w-full border-0 shadow-none">
                  <RadioGroupItem value="business" id="business" className="peer sr-only" />
                  <CardContent className="p-0 space-y-4">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="text-lg">Business Registration</h4>
                        <p className="text-sm text-muted-foreground">
                          For companies, corporations, and partnerships
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Limited liability companies</p>
                      <p>• Corporations</p>
                      <p>• Partnerships</p>
                      <p>• Large enterprises</p>
                    </div>
                  </CardContent>
                </Card>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-blue-600 mt-1" />
            <div className="space-y-2">
              <h4 className="text-blue-900">Important Information</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• All registrations require completion of the Residential Property Declaration</li>
                <li>• Existing TIN holders can register for GST and will receive both old and new numbers</li>
                <li>• Have your identification documents ready</li>
                <li>• The registration process takes approximately 10-15 minutes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          {onBackToHome && (
            <Button 
              type="button"
              variant="outline"
              onClick={onBackToHome}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={!selectedType}
            className="bg-blue-600 hover:bg-blue-700 ml-auto"
          >
            Continue <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}