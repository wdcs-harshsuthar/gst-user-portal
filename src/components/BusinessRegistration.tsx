import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, ArrowRight, Building2, Plus, Trash2, Sparkles, FileText, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import DocumentUpload, { UploadedDocument } from './shared/DocumentUpload';
import PhotoUpload from './shared/PhotoUpload';
import { 
  ORGANIZATION_TYPES, 
  BUSINESS_TYPES, 
  BUILDING_TYPES, 
  LIBERIAN_COUNTIES,
  REGISTRATION_REASONS 
} from './shared/constants';
import { DUMMY_BUSINESS_DATA } from './shared/dummyData';

interface BusinessRegistrationProps {
  initialData?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function BusinessRegistration({ initialData, onComplete, onBack }: BusinessRegistrationProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

  const [formData, setFormData] = useState({
    reason: 'new',
    existingTins: [''],
    hasExistingGst: false,
    existingGstNumber: '',
    organizationType: '',
    registeredName: '',
    tradeName: '',
    countryOfIncorporation: 'Liberia',
    registrationDate: '',
    businessRegNumber: '',
    nassCorpNumber: '',
    taxStartDate: '',
    taxCloseDate: '',
    streetAddress: '',
    landmark: '',
    city: '',
    district: '',
    county: '',
    country: 'Liberia',
    poBox: '',
    mailingAddressDifferent: false,
    mailingStreetAddress: '',
    mailingCity: '',
    mailingCounty: '',
    mailingCountry: '',
    mailingPoBox: '',
    buildingType: '',
    fiscalYearStart: '',
    fiscalYearEnd: '',
    businessActivities: '',
    mainActivity: '',
    businessLicenses: [{ number: '', type: '', startDate: '', endDate: '' }],
    contactName: '',
    contactPosition: '',
    contactPhone: '',
    contactEmail: '',
    annualTurnover: '',
    capitalOrigin: '',
    capitalValue: '',
    totalShares: '',
    bankName: '',
    accountNumber: '',
    businessType: '',
    applicantPhoto: null,
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Required documents for RF01 form
  const getRequiredDocuments = () => {
    return [
      {
        type: 'business_registration_certificate',
        label: 'LBR Business Registration Certificate',
        required: true,
        description: 'Valid business registration certificate from Liberia Business Registry (LBR)'
      },
      {
        type: 'articles_of_incorporation',
        label: 'Articles of Incorporation',
        required: true,
        description: 'Articles of incorporation or founding documents for the organization'
      }
    ];
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: Record<string, string>) => ({ ...prev, [field]: '' }));
    }
  };

  const fillSampleData = () => {
    setFormData((prev: any) => ({ ...prev, ...DUMMY_BUSINESS_DATA }));
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Applicant photo validation
    if (!formData.applicantPhoto) {
      newErrors.applicantPhoto = 'Applicant photo is required';
    }

    // Organization validation
    if (formData.hasExistingGst && !formData.existingGstNumber.trim()) {
      newErrors.existingGstNumber = 'Existing GST number is required';
    }
    if (!formData.organizationType) newErrors.organizationType = 'Organization type is required';
    if (!formData.registeredName.trim()) newErrors.registeredName = 'Registered name is required';
    if (!formData.businessRegNumber.trim()) newErrors.businessRegNumber = 'Business registration number is required';
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.county.trim()) newErrors.county = 'County is required';
    if (!formData.buildingType) newErrors.buildingType = 'Building type is required';
    if (!formData.businessType) newErrors.businessType = 'Business type classification is required';

    // Document validation
    const requiredDocs = getRequiredDocuments();
    requiredDocs.forEach(doc => {
      if (doc.required) {
        const hasDoc = uploadedDocuments.some(uploaded => uploaded.documentType === doc.type);
        if (!hasDoc) {
          newErrors[doc.type] = `${doc.label} is required`;
        }
      }
    });

    // Business information validation
    if (!formData.mainActivity.trim()) newErrors.mainActivity = 'Main activity is required';
    if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete({
        ...formData,
        documents: uploadedDocuments
      });
    }
  };

  const addExistingTin = () => {
    setFormData((prev: any) => ({
      ...prev,
      existingTins: [...prev.existingTins, '']
    }));
  };

  const removeExistingTin = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      existingTins: prev.existingTins.filter((_tin: string, i: number) => i !== index)
    }));
  };

  const updateExistingTin = (index: number, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      existingTins: prev.existingTins.map((tin: string, i: number) => i === index ? value : tin)
    }));
  };

  const addBusinessLicense = () => {
    setFormData((prev: any) => ({
      ...prev,
      businessLicenses: [...prev.businessLicenses, { number: '', type: '', startDate: '', endDate: '' }]
    }));
  };

  const removeBusinessLicense = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      businessLicenses: prev.businessLicenses.filter((_lic: any, i: number) => i !== index)
    }));
  };

  const updateBusinessLicense = (index: number, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      businessLicenses: prev.businessLicenses.map((license: any, i: number) => 
        i === index ? { ...license, [field]: value } : license
      )
    }));
  };

  return (
    <div className="w-full p-[0px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl">Business Registration (Form RF01)</h2>
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Applicant Photo Section */}
        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Applicant Photo Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label className="text-lg font-semibold">Applicant Photo *</Label>
                <AlertCircle className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-800">Photo Requirements:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Recent passport-style photo (taken within 6 months)</li>
                      <li>• Clear, front-facing with visible facial features</li>
                      <li>• Neutral background (white or light colored)</li>
                      <li>• File size: Maximum 5MB</li>
                      <li>• Format: JPG, JPEG, PNG only</li>
                      <li>• Minimum resolution: 600x600 pixels</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <PhotoUpload
                      title="Upload Applicant Photo"
                      description="Upload a clear, recent passport-style photograph of the business representative"
                      accept="image/jpeg,image/jpg,image/png"
                      maxSize={5}
                      onUpload={(docs) => updateFormData('applicantPhoto', docs[0] || null)}
                      uploadedDocuments={formData.applicantPhoto ? [formData.applicantPhoto] : []}
                      isRequired={true}
                      className="border-2 border-dashed border-blue-300 bg-blue-25"
                    />
                    {errors.applicantPhoto && (
                      <p className="text-red-500 text-sm font-medium">{errors.applicantPhoto}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Organization Information Section */}
        <div className="space-y-8">
          {/* Registration Information */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Reason for Registration *</Label>
                <RadioGroup 
                  value={formData.reason} 
                  onValueChange={(value) => updateFormData('reason', value)}
                >
                  {REGISTRATION_REASONS.slice(0, 3).map(reason => (
                    <div key={reason.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={reason.value} id={reason.value} />
                      <Label htmlFor={reason.value}>{reason.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {formData.reason === 'modify' && (
                <div className="space-y-4">
                  <Label>Existing TIN Numbers</Label>
                  {formData.existingTins.map((tin: string, index: number) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={tin}
                        onChange={(e) => updateExistingTin(index, e.target.value)}
                        placeholder="Enter existing TIN number"
                        className="flex-1"
                      />
                      {formData.existingTins.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeExistingTin(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExistingTin}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another TIN
                  </Button>
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasExistingGst"
                    checked={formData.hasExistingGst}
                    onCheckedChange={(checked) => updateFormData('hasExistingGst', checked)}
                  />
                  <Label htmlFor="hasExistingGst" className="text-blue-600 cursor-pointer">
                    Already have a GST number
                  </Label>
                </div>

                {formData.hasExistingGst && (
                  <div className="space-y-2">
                    <Label htmlFor="existingGstNumber">Existing GST Number *</Label>
                    <Input
                      id="existingGstNumber"
                      value={formData.existingGstNumber}
                      onChange={(e) => updateFormData('existingGstNumber', e.target.value)}
                      placeholder="Enter your existing GST number (e.g. GST-2023-1234567)"
                      className={`max-w-md ${errors.existingGstNumber ? 'border-red-500' : ''}`}
                    />
                    {errors.existingGstNumber && <p className="text-red-500 text-sm">{errors.existingGstNumber}</p>}
                    <p className="text-sm text-gray-600">
                      If you already have a GST number, please provide it here for reference.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Organization Details */}
          <Card>
            <CardHeader>
              <CardTitle>Organization Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="organizationType">Organization Type *</Label>
                <Select 
                  value={formData.organizationType} 
                  onValueChange={(value) => updateFormData('organizationType', value)}
                >
                  <SelectTrigger className={errors.organizationType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ORGANIZATION_TYPES.map(orgType => (
                      <SelectItem key={orgType.value} value={orgType.value}>{orgType.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.organizationType && <p className="text-red-500 text-sm">{errors.organizationType}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registeredName">Registered Name *</Label>
                  <Input
                    id="registeredName"
                    value={formData.registeredName}
                    onChange={(e) => updateFormData('registeredName', e.target.value)}
                    className={errors.registeredName ? 'border-red-500' : ''}
                  />
                  {errors.registeredName && <p className="text-red-500 text-sm">{errors.registeredName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tradeName">Trade Name</Label>
                  <Input
                    id="tradeName"
                    value={formData.tradeName}
                    onChange={(e) => updateFormData('tradeName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="countryOfIncorporation">Country of Incorporation</Label>
                  <Input
                    id="countryOfIncorporation"
                    value={formData.countryOfIncorporation}
                    onChange={(e) => updateFormData('countryOfIncorporation', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registrationDate">Registration Date</Label>
                  <Input
                    id="registrationDate"
                    type="date"
                    value={formData.registrationDate}
                    onChange={(e) => updateFormData('registrationDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessRegNumber">Business Registration Number *</Label>
                  <Input
                    id="businessRegNumber"
                    value={formData.businessRegNumber}
                    onChange={(e) => updateFormData('businessRegNumber', e.target.value)}
                    className={errors.businessRegNumber ? 'border-red-500' : ''}
                  />
                  {errors.businessRegNumber && <p className="text-red-500 text-sm">{errors.businessRegNumber}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nassCorpNumber">NASSCORP Number</Label>
                  <Input
                    id="nassCorpNumber"
                    value={formData.nassCorpNumber}
                    onChange={(e) => updateFormData('nassCorpNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxStartDate">Tax Start Date</Label>
                  <Input
                    id="taxStartDate"
                    type="date"
                    value={formData.taxStartDate}
                    onChange={(e) => updateFormData('taxStartDate', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Type Classification */}
          <Card>
            <CardHeader>
              <CardTitle>Business Type Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <RadioGroup 
                  value={formData.businessType} 
                  onValueChange={(value) => updateFormData('businessType', value)}
                >
                  {BUSINESS_TYPES.map(bizType => (
                    <div key={bizType.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={bizType.value} id={bizType.value} />
                      <Label htmlFor={bizType.value}>{bizType.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.businessType && <p className="text-red-500 text-sm">{errors.businessType}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Main Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street/House Number *</Label>
                  <Input
                    id="streetAddress"
                    value={formData.streetAddress}
                    onChange={(e) => updateFormData('streetAddress', e.target.value)}
                    className={errors.streetAddress ? 'border-red-500' : ''}
                  />
                  {errors.streetAddress && <p className="text-red-500 text-sm">{errors.streetAddress}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landmark">Landmark</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) => updateFormData('landmark', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City/Town *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => updateFormData('district', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="county">County *</Label>
                  <Select value={formData.county} onValueChange={(value) => updateFormData('county', value)}>
                    <SelectTrigger className={errors.county ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent>
                      {LIBERIAN_COUNTIES.map(county => (
                        <SelectItem key={county} value={county}>{county}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.county && <p className="text-red-500 text-sm">{errors.county}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateFormData('country', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poBox">P.O. Box</Label>
                  <Input
                    id="poBox"
                    value={formData.poBox}
                    onChange={(e) => updateFormData('poBox', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buildingType">Building Type *</Label>
                  <Select 
                    value={formData.buildingType} 
                    onValueChange={(value) => updateFormData('buildingType', value)}
                  >
                    <SelectTrigger className={errors.buildingType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUILDING_TYPES.map(buildingType => (
                        <SelectItem key={buildingType.value} value={buildingType.value}>{buildingType.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.buildingType && <p className="text-red-500 text-sm">{errors.buildingType}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Document Upload Section */}
        <div className="space-y-6">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              <strong>Form RF01 Document Requirements:</strong><br />
              For organization registration, you must provide your LBR business registration certificate 
              and articles of incorporation or founding documents.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentUpload
                requiredDocuments={getRequiredDocuments()}
                uploadedDocuments={uploadedDocuments}
                onDocumentsChange={setUploadedDocuments}
                errors={errors}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Business Information Section */}
        <div className="space-y-8">
          {/* Business Activity Information */}
          <Card>
            <CardHeader>
              <CardTitle>Business Activity Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fiscalYearStart">Fiscal Year Start</Label>
                  <Input
                    id="fiscalYearStart"
                    type="date"
                    value={formData.fiscalYearStart}
                    onChange={(e) => updateFormData('fiscalYearStart', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fiscalYearEnd">Fiscal Year End</Label>
                  <Input
                    id="fiscalYearEnd"
                    type="date"
                    value={formData.fiscalYearEnd}
                    onChange={(e) => updateFormData('fiscalYearEnd', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessActivities">Business Activities Description</Label>
                <Textarea
                  id="businessActivities"
                  value={formData.businessActivities}
                  onChange={(e) => updateFormData('businessActivities', e.target.value)}
                  placeholder="Describe your business activities"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mainActivity">Main Activity *</Label>
                <Input
                  id="mainActivity"
                  value={formData.mainActivity}
                  onChange={(e) => updateFormData('mainActivity', e.target.value)}
                  placeholder="Primary business activity"
                  className={errors.mainActivity ? 'border-red-500' : ''}
                />
                {errors.mainActivity && <p className="text-red-500 text-sm">{errors.mainActivity}</p>}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Business Licenses</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addBusinessLicense}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add License
                  </Button>
                </div>

                {formData.businessLicenses.map((license: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>License Number</Label>
                        <Input
                          value={license.number}
                          onChange={(e) => updateBusinessLicense(index, 'number', e.target.value)}
                          placeholder="License number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>License Type</Label>
                        <Input
                          value={license.type}
                          onChange={(e) => updateBusinessLicense(index, 'type', e.target.value)}
                          placeholder="License type"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={license.startDate}
                          onChange={(e) => updateBusinessLicense(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date</Label>
                        <div className="flex gap-2">
                          <Input
                            type="date"
                            value={license.endDate}
                            onChange={(e) => updateBusinessLicense(index, 'endDate', e.target.value)}
                            className="flex-1"
                          />
                          {formData.businessLicenses.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeBusinessLicense(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Person Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => updateFormData('contactName', e.target.value)}
                    className={errors.contactName ? 'border-red-500' : ''}
                  />
                  {errors.contactName && <p className="text-red-500 text-sm">{errors.contactName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPosition">Position/Title</Label>
                  <Input
                    id="contactPosition"
                    value={formData.contactPosition}
                    onChange={(e) => updateFormData('contactPosition', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone Number *</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData('contactPhone', e.target.value)}
                    placeholder="+231-XXX-XXXX"
                    className={errors.contactPhone ? 'border-red-500' : ''}
                  />
                  {errors.contactPhone && <p className="text-red-500 text-sm">{errors.contactPhone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Address</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData('contactEmail', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Financial Information Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualTurnover">Annual Turnover (LRD)</Label>
                  <Input
                    id="annualTurnover"
                    value={formData.annualTurnover}
                    onChange={(e) => updateFormData('annualTurnover', e.target.value)}
                    placeholder="Enter annual turnover"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capitalOrigin">Capital Origin</Label>
                  <Input
                    id="capitalOrigin"
                    value={formData.capitalOrigin}
                    onChange={(e) => updateFormData('capitalOrigin', e.target.value)}
                    placeholder="Source of capital"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capitalValue">Capital Value (LRD)</Label>
                  <Input
                    id="capitalValue"
                    value={formData.capitalValue}
                    onChange={(e) => updateFormData('capitalValue', e.target.value)}
                    placeholder="Enter capital value"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalShares">Total Number of Shares</Label>
                  <Input
                    id="totalShares"
                    value={formData.totalShares}
                    onChange={(e) => updateFormData('totalShares', e.target.value)}
                    placeholder="Enter total shares"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => updateFormData('bankName', e.target.value)}
                    placeholder="Name of bank"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) => updateFormData('accountNumber', e.target.value)}
                    placeholder="Bank account number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Selection
          </Button>

          <Button
            type="submit"
            className="flex items-center gap-2"
          >
            Complete Registration
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}