import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ArrowLeft, ArrowRight, Home, Sparkles, Camera, CheckCircle } from 'lucide-react';
import AddressForm from './shared/AddressForm';
import PropertyValuation from './property/PropertyValuation';
import PropertySchedule from './property/PropertySchedule';
import PhotoUpload from './shared/PhotoUpload';
import { UploadedDocument } from './shared/DocumentUpload';
import { PROPERTY_CONDITIONS } from './shared/constants';
import { validateRequired } from './shared/validation';
import { DUMMY_PROPERTY_DATA } from './shared/dummyData';

interface Property {
  location: string;
  description: string;
  classification: string;
  value: string;
}

interface ResidentialPropertyDeclarationProps {
  initialData?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function ResidentialPropertyDeclaration({ 
  initialData, 
  onComplete, 
  onBack 
}: ResidentialPropertyDeclarationProps) {
  const [formData, setFormData] = useState({
    // Property Owner Info
    ownerTin: '',
    houseNumber: '',
    ownerFullName: '',
    ownerAddress: '',
    ownerPhone: '',
    
    // Property Valuation
    declaredValue: '',
    taxRate: '0.25',
    annualTaxAmount: '',
    
    // Property Location
    streetAddress: '',
    landmark: '',
    city: '',
    district: '',
    county: '',
    country: 'Liberia',
    poBox: '',
    
    // Property Photos
    frontViewPhotos: [] as UploadedDocument[],
    backViewPhotos: [] as UploadedDocument[],
    leftSidePhotos: [] as UploadedDocument[],
    rightSidePhotos: [] as UploadedDocument[],
    interiorPhotos: [] as UploadedDocument[],
    overviewPhotos: [] as UploadedDocument[],
    
    // Additional Information
    caretakerOccupant: '',
    constructionDate: '',
    currentCondition: '',
    
    // Property Schedule
    properties: [
      { location: '', description: '', classification: '', value: '' }
    ] as Property[],
    
    // Signature
    ownerSignature: '',
    signatureDate: '',
    
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    newErrors.ownerFullName = validateRequired(formData.ownerFullName, 'Owner full name');
    newErrors.ownerAddress = validateRequired(formData.ownerAddress, 'Owner address');
    newErrors.ownerPhone = validateRequired(formData.ownerPhone, 'Owner phone');
    newErrors.declaredValue = validateRequired(formData.declaredValue, 'Declared property value');
    newErrors.county = validateRequired(formData.county, 'Property county');
    newErrors.city = validateRequired(formData.city, 'Property town/city');
    newErrors.streetAddress = validateRequired(formData.streetAddress, 'Property street');
    newErrors.currentCondition = validateRequired(formData.currentCondition, 'Current condition');
    
    // Validate property photos
    if (formData.frontViewPhotos.length === 0) {
      newErrors.frontViewPhotos = 'Front view photo is required';
    }
    if (formData.backViewPhotos.length === 0) {
      newErrors.backViewPhotos = 'Back view photo is required';
    }
    if (formData.leftSidePhotos.length === 0) {
      newErrors.leftSidePhotos = 'Left side view photo is required';
    }
    if (formData.rightSidePhotos.length === 0) {
      newErrors.rightSidePhotos = 'Right side view photo is required';
    }
    if (formData.overviewPhotos.length === 0) {
      newErrors.overviewPhotos = 'Property overview photo is required';
    }
    newErrors.ownerSignature = validateRequired(formData.ownerSignature, 'Owner signature');
    newErrors.signatureDate = validateRequired(formData.signatureDate, 'Signature date');

    // Filter out empty errors
    const filteredErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([_, value]) => value !== '')
    );

    setErrors(filteredErrors);
    return Object.keys(filteredErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate annual tax amount when declared value changes
      if (field === 'declaredValue') {
        const declaredValue = parseFloat(value) || 0;
        const taxRate = parseFloat(newData.taxRate) / 100;
        newData.annualTaxAmount = (declaredValue * taxRate).toFixed(2);
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const fillSampleData = () => {
    setFormData((prev: any) => ({ ...prev, ...DUMMY_PROPERTY_DATA }));
    setErrors({});
  };

  const addProperty = () => {
    setFormData((prev: any) => ({
      ...prev,
      properties: [...prev.properties, { location: '', description: '', classification: '', value: '' }]
    }));
  };

  const removeProperty = (index: number) => {
    if (formData.properties.length > 1) {
      setFormData((prev: any) => ({
        ...prev,
        properties: prev.properties.filter((_: any, i: number) => i !== index)
      }));
    }
  };

  const updateProperty = (index: number, field: keyof Property, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      properties: prev.properties.map((property: any, i: number) => 
        i === index ? { ...property, [field]: value } : property
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Home className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl">Residential Property Declaration</h2>
          <div className="bg-red-100 border border-red-300 rounded px-3 py-1 text-red-800 text-sm">
            Required Final Step
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fillSampleData}
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Fill Sample Data
        </Button>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          <strong>Important:</strong> This form is mandatory for all GST registrations. 
          All property owners in Liberia must declare their residential properties for tax purposes.
        </p>
      </div>

      {/* Property Owner Information */}
      <Card>
        <CardHeader>
          <CardTitle>Property Owner Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerTin">TIN Number</Label>
              <Input
                id="ownerTin"
                value={formData.ownerTin}
                onChange={(e) => updateFormData('ownerTin', e.target.value)}
                placeholder="Your TIN number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="houseNumber">House Number (Alphanumberic)</Label>
              <Input
                id="houseNumber"
                value={formData.houseNumber}
                onChange={(e) => updateFormData('houseNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerFullName">Full Name *</Label>
              <Input
                id="ownerFullName"
                value={formData.ownerFullName}
                onChange={(e) => updateFormData('ownerFullName', e.target.value)}
                className={errors.ownerFullName ? 'border-red-500' : ''}
              />
              {errors.ownerFullName && <p className="text-red-500 text-sm">{errors.ownerFullName}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerAddress">Address *</Label>
              <Textarea
                id="ownerAddress"
                value={formData.ownerAddress}
                onChange={(e) => updateFormData('ownerAddress', e.target.value)}
                className={errors.ownerAddress ? 'border-red-500' : ''}
                rows={2}
              />
              {errors.ownerAddress && <p className="text-red-500 text-sm">{errors.ownerAddress}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerPhone">Phone Number *</Label>
              <Input
                id="ownerPhone"
                value={formData.ownerPhone}
                onChange={(e) => updateFormData('ownerPhone', e.target.value)}
                placeholder="+231-XXX-XXXX"
                className={errors.ownerPhone ? 'border-red-500' : ''}
              />
              {errors.ownerPhone && <p className="text-red-500 text-sm">{errors.ownerPhone}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Valuation */}
      <Card>
        <CardHeader>
          <CardTitle>Property Valuation</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyValuation
            data={{
              declaredValue: formData.declaredValue,
              taxRate: formData.taxRate,
              annualTaxAmount: formData.annualTaxAmount
            }}
            onChange={updateFormData}
            errors={errors}
          />
        </CardContent>
      </Card>

      {/* Property Location */}
      <Card>
        <CardHeader>
          <CardTitle>Property Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <AddressForm
            data={{
              streetAddress: formData.streetAddress,
              landmark: formData.landmark,
              city: formData.city,
              district: formData.district,
              county: formData.county,
              country: formData.country,
              poBox: formData.poBox
            }}
            onChange={updateFormData}
            errors={errors}
          />
        </CardContent>
      </Card>

      {/* Property Photos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-6 w-6 text-blue-600" />
            Property Photos Documentation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Requirements and Instructions */}
          

          {/* Progress Tracker */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Upload Progress</h4>
              </div>
              <div className="bg-white px-3 py-1 rounded-full border border-green-200">
                <span className="text-sm font-medium text-green-700">
                  {[
                    formData.frontViewPhotos.length > 0,
                    formData.backViewPhotos.length > 0,
                    formData.leftSidePhotos.length > 0,
                    formData.rightSidePhotos.length > 0,
                    formData.overviewPhotos.length > 0
                  ].filter(Boolean).length}/5 Required Completed
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: 'frontViewPhotos', label: 'Front View', required: true },
                { key: 'backViewPhotos', label: 'Back View', required: true },
                { key: 'leftSidePhotos', label: 'Left Side', required: true },
                { key: 'rightSidePhotos', label: 'Right Side', required: true },
                { key: 'overviewPhotos', label: 'Overview', required: true },
                { key: 'interiorPhotos', label: 'Interior', required: false }
              ].map(({ key, label, required }) => {
                const isCompleted = formData[key as keyof typeof formData].length > 0;
                return (
                  <div key={key} className={`flex items-center gap-2 p-2 rounded-md ${isCompleted ? 'bg-green-100' : 'bg-white'}`}>
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'} ${isCompleted ? 'ring-2 ring-green-200' : ''}`}></div>
                    <span className={`text-sm ${isCompleted ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                      {label} {isCompleted ? '✓' : required ? '' : '(Optional)'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mandatory Exterior Photos */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-red-200">
              <div className="bg-red-100 p-2 rounded-lg">
                <Camera className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800">Required Exterior Views</h3>
              <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full">5 Photos Required</span>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Front View */}
              <Card className="border-l-4 border-l-red-500 shadow-sm">
                <CardContent className="p-4">
                  <PhotoUpload
                    title="Front View"
                    description="Photo showing the main entrance and front facade"
                    onUpload={(docs) => updateFormData('frontViewPhotos', docs)}
                    uploadedDocuments={formData.frontViewPhotos}
                    isRequired={true}
                  />
                  {errors.frontViewPhotos && (
                    <p className="text-red-500 text-sm mt-2">{errors.frontViewPhotos}</p>
                  )}
                </CardContent>
              </Card>

              {/* Back View */}
              <Card className="border-l-4 border-l-red-500 shadow-sm">
                <CardContent className="p-4">
                  <PhotoUpload
                    title="Back View"
                    description="Photo showing the rear side of the property"
                    onUpload={(docs) => updateFormData('backViewPhotos', docs)}
                    uploadedDocuments={formData.backViewPhotos}
                    isRequired={true}
                  />
                  {errors.backViewPhotos && (
                    <p className="text-red-500 text-sm mt-2">{errors.backViewPhotos}</p>
                  )}
                </CardContent>
              </Card>

              {/* Left Side View */}
              <Card className="border-l-4 border-l-red-500 shadow-sm">
                <CardContent className="p-4">
                  <PhotoUpload
                    title="Left Side View"
                    description="Photo showing the left side of the property"
                    onUpload={(docs) => updateFormData('leftSidePhotos', docs)}
                    uploadedDocuments={formData.leftSidePhotos}
                    isRequired={true}
                  />
                  {errors.leftSidePhotos && (
                    <p className="text-red-500 text-sm mt-2">{errors.leftSidePhotos}</p>
                  )}
                </CardContent>
              </Card>

              {/* Right Side View */}
              <Card className="border-l-4 border-l-red-500 shadow-sm">
                <CardContent className="p-4">
                  <PhotoUpload
                    title="Right Side View"
                    description="Photo showing the right side of the property"
                    onUpload={(docs) => updateFormData('rightSidePhotos', docs)}
                    uploadedDocuments={formData.rightSidePhotos}
                    isRequired={true}
                  />
                  {errors.rightSidePhotos && (
                    <p className="text-red-500 text-sm mt-2">{errors.rightSidePhotos}</p>
                  )}
                </CardContent>
              </Card>

              {/* Property Overview - Full Width */}
              <Card className="border-l-4 border-l-red-500 shadow-sm lg:col-span-2">
                <CardContent className="p-4">
                  <PhotoUpload
                    title="Property Overview"
                    description="Wide-angle photo showing the entire property and surrounding area"
                    onUpload={(docs) => updateFormData('overviewPhotos', docs)}
                    uploadedDocuments={formData.overviewPhotos}
                    isRequired={true}
                  />
                  {errors.overviewPhotos && (
                    <p className="text-red-500 text-sm mt-2">{errors.overviewPhotos}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Optional Interior Photos */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Home className="h-5 w-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">Optional Interior Photos</h3>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">Recommended</span>
            </div>
            
            <Card className="border-l-4 border-l-gray-400 shadow-sm bg-gray-50/50">
              <CardContent className="p-4">
                <PhotoUpload
                  title="Interior Photos"
                  description="Photos of main living areas, bedrooms, kitchen, or bathrooms"
                  onUpload={(docs) => updateFormData('interiorPhotos', docs)}
                  uploadedDocuments={formData.interiorPhotos}
                  isRequired={false}
                />
                <p className="text-sm text-gray-600 mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <Sparkles className="h-4 w-4 inline mr-2 text-blue-600" />
                  Interior photos are optional but may help with property valuation assessment and expedite processing.
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caretakerOccupant">Caretaker/Occupant</Label>
              <Input
                id="caretakerOccupant"
                value={formData.caretakerOccupant}
                onChange={(e) => updateFormData('caretakerOccupant', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="constructionDate">Construction Date</Label>
              <Input
                id="constructionDate"
                type="date"
                value={formData.constructionDate}
                onChange={(e) => updateFormData('constructionDate', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentCondition">Current Condition *</Label>
            <Select value={formData.currentCondition} onValueChange={(value) => updateFormData('currentCondition', value)}>
              <SelectTrigger className={errors.currentCondition ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select current condition" />
              </SelectTrigger>
              <SelectContent>
                {PROPERTY_CONDITIONS.map(condition => (
                  <SelectItem key={condition} value={condition}>{condition}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.currentCondition && <p className="text-red-500 text-sm">{errors.currentCondition}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Property Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Property Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <PropertySchedule
            properties={formData.properties}
            onAddProperty={addProperty}
            onRemoveProperty={removeProperty}
            onUpdateProperty={updateProperty}
          />
        </CardContent>
      </Card>

      {/* Owner Signature */}
      <Card>
        <CardHeader>
          <CardTitle>Owner Declaration & Signature</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-sm">
              I hereby declare that the information provided above is true and correct to the best of my knowledge. 
              I understand that providing false information is a violation of Liberian tax law and may result in penalties.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerSignature">Owner Signature (Full Name) *</Label>
              <Input
                id="ownerSignature"
                value={formData.ownerSignature}
                onChange={(e) => updateFormData('ownerSignature', e.target.value)}
                placeholder="Type your full name as signature"
                className={errors.ownerSignature ? 'border-red-500' : ''}
              />
              {errors.ownerSignature && <p className="text-red-500 text-sm">{errors.ownerSignature}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="signatureDate">Signature Date *</Label>
              <Input
                id="signatureDate"
                type="date"
                value={formData.signatureDate}
                onChange={(e) => updateFormData('signatureDate', e.target.value)}
                className={errors.signatureDate ? 'border-red-500' : ''}
              />
              {errors.signatureDate && <p className="text-red-500 text-sm">{errors.signatureDate}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Complete Registration <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}