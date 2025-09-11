import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, ArrowRight, User, AlertCircle, Sparkles, FileText, Upload } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import DocumentUpload, { UploadedDocument } from './shared/DocumentUpload';
import PhotoUpload from './shared/PhotoUpload';
import { 
  IDENTIFICATION_TYPES, 
  TITLES, 
  MARITAL_STATUS_OPTIONS, 
  GENDER_OPTIONS, 
  LIBERIAN_COUNTIES,
  PETTY_TRADER_CLASSES 
} from './shared/constants';
import { DUMMY_INDIVIDUAL_DATA, DUMMY_EXISTING_USER_DATA } from './shared/dummyData';

interface IndividualRegistrationProps {
  initialData?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

interface FormData {
  reason: string;
  existingTin: string;
  applicantType: string;
  hasGstNumber: boolean;
  existingGstNumber: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  identificationType: string;
  idNumber: string;
  nationality: string;
  placeOfIssuance: string;
  gender: string;
  dateOfBirth: string;
  cityOfBirth: string;
  countryOfBirth: string;
  maritalStatus: string;
  occupation: string;
  phone: string;
  email: string;
  alternatePhone: string;
  fatherName: string;
  motherName: string;
  streetAddress: string;
  landmark: string;
  city: string;
  district: string;
  county: string;
  country: string;
  poBox: string;
  isResident: boolean;
  annualTurnover: string;
  fiscalYearStart: string;
  fiscalYearEnd: string;
  isImporter: boolean;
  isExporter: boolean;
  isLandlord: boolean;
  isPettyTrader: boolean;
  pettyTraderClass: string;
  ownsProperty: boolean;
  paysRent: boolean;
  applicantPhoto: UploadedDocument | null;
}

export default function IndividualRegistration({
  initialData,
  onComplete,
  onBack
}: IndividualRegistrationProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    reason: initialData?.reason || 'new',
    existingTin: initialData?.existingTin || '',
    applicantType: initialData?.applicantType || 'individual',
    hasGstNumber: initialData?.hasGstNumber || false,
    existingGstNumber: initialData?.existingGstNumber || '',
    title: initialData?.title || '',
    firstName: initialData?.firstName || '',
    middleName: initialData?.middleName || '',
    lastName: initialData?.lastName || '',
    identificationType: initialData?.identificationType || '',
    idNumber: initialData?.idNumber || '',
    nationality: initialData?.nationality || 'Liberian',
    placeOfIssuance: initialData?.placeOfIssuance || '',
    gender: initialData?.gender || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    cityOfBirth: initialData?.cityOfBirth || '',
    countryOfBirth: initialData?.countryOfBirth || 'Liberia',
    maritalStatus: initialData?.maritalStatus || '',
    occupation: initialData?.occupation || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    alternatePhone: initialData?.alternatePhone || '',
    fatherName: initialData?.fatherName || '',
    motherName: initialData?.motherName || '',
    streetAddress: initialData?.streetAddress || '',
    landmark: initialData?.landmark || '',
    city: initialData?.city || '',
    district: initialData?.district || '',
    county: initialData?.county || '',
    country: initialData?.country || 'Liberia',
    poBox: initialData?.poBox || '',
    isResident: initialData?.isResident || true,
    annualTurnover: initialData?.annualTurnover || '',
    fiscalYearStart: initialData?.fiscalYearStart || '',
    fiscalYearEnd: initialData?.fiscalYearEnd || '',
    isImporter: initialData?.isImporter || false,
    isExporter: initialData?.isExporter || false,
    isLandlord: initialData?.isLandlord || false,
    isPettyTrader: initialData?.isPettyTrader || false,
    pettyTraderClass: initialData?.pettyTraderClass || '',
    ownsProperty: initialData?.ownsProperty || false,
    paysRent: initialData?.paysRent || false,
    applicantPhoto: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Required documents for IN01 form
  const getRequiredDocuments = () => {
    const baseDocuments = [
      {
        type: 'identification_primary',
        label: 'Primary Identification Document',
        required: true,
        description: 'Choose one: National ID or Passport'
      },
      {
        type: 'identification_secondary',
        label: 'Secondary Identification Document',
        required: true,
        description: 'A second form of identification from the list above (different from primary)'
      }
    ];

    // Add business registration document for sole proprietorships
    if (formData.applicantType === 'sole-proprietorship') {
      baseDocuments.push({
        type: 'business_registration',
        label: 'Business Registration Application from LBR',
        required: true,
        description: 'Business registration application document from Liberia Business Registry (LBR)'
      });
    }

    return baseDocuments;
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const fillSampleData = (isExistingUser: boolean = false) => {
    const sampleData = isExistingUser ? DUMMY_EXISTING_USER_DATA : DUMMY_INDIVIDUAL_DATA;
    setFormData(prev => ({
      ...prev,
      ...sampleData,
      hasGstNumber: isExistingUser,
      existingGstNumber: isExistingUser ? 'GST-2023-1234567' : '',
      applicantPhoto: null
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Personal information validation
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.identificationType) newErrors.identificationType = 'Identification type is required';
    if (!formData.idNumber.trim()) newErrors.idNumber = 'ID number is required';
    if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.county) newErrors.county = 'County is required';

    // Applicant photo validation
    if (!formData.applicantPhoto) {
      newErrors.applicantPhoto = 'Applicant photo is required';
    }

    // GST number validation
    if (formData.hasGstNumber && !formData.existingGstNumber.trim()) {
      newErrors.existingGstNumber = 'GST number is required when "Already have a GST number" is checked';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (basic)
    const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete({
        ...formData,
        uploadedDocuments: uploadedDocuments
      });
    }
  };

  return (
    <div className="w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl">Individual Registration (Form IN01)</h2>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillSampleData(false)}
            className="text-blue-600 border-blue-300 hover:bg-blue-50"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Fill New User Sample
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fillSampleData(true)}
            className="text-purple-600 border-purple-300 hover:bg-purple-50"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Fill Existing User Sample
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information Section */}
        <div className="space-y-8">
          {/* Registration Reason */}
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="new" id="new" />
                    <Label htmlFor="new">New Registration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="modify" id="modify" />
                    <Label htmlFor="modify">Modify Existing Registration</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="reregister" id="reregister" />
                    <Label htmlFor="reregister">Re-registration</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.reason === 'modify' && (
                <div className="space-y-2">
                  <Label htmlFor="existingTin">Existing TIN Number</Label>
                  <Input
                    id="existingTin"
                    value={formData.existingTin}
                    onChange={(e) => updateFormData('existingTin', e.target.value)}
                    placeholder="Enter your existing TIN number"
                  />
                </div>
              )}

              <div className="space-y-4">
                <Label>Applicant Type *</Label>
                <RadioGroup 
                  value={formData.applicantType} 
                  onValueChange={(value) => updateFormData('applicantType', value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual-type" />
                    <Label htmlFor="individual-type">Individual Taxpayer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sole-proprietorship" id="sole-prop-type" />
                    <Label htmlFor="sole-prop-type">Sole Proprietorship</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* GST Number Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasGstNumber"
                    checked={formData.hasGstNumber}
                    onCheckedChange={(checked) => updateFormData('hasGstNumber', checked)}
                  />
                  <Label htmlFor="hasGstNumber">Already have a GST number</Label>
                </div>

                {formData.hasGstNumber && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="existingGstNumber">Existing GST Number *</Label>
                    <Input
                      id="existingGstNumber"
                      value={formData.existingGstNumber}
                      onChange={(e) => updateFormData('existingGstNumber', e.target.value)}
                      placeholder="Enter your existing GST number (e.g., GST-2023-1234567)"
                      className={errors.existingGstNumber ? 'border-red-500' : ''}
                    />
                    {errors.existingGstNumber && (
                      <p className="text-red-500 text-sm font-medium">{errors.existingGstNumber}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      If you already have a GST number, please provide it here for reference.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
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
                        description="Upload a clear, recent passport-style photograph"
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

              <Separator className="my-6" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Select value={formData.title} onValueChange={(value) => updateFormData('title', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      {TITLES.map(title => (
                        <SelectItem key={title} value={title}>{title}.</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => updateFormData('middleName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
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
                  <Label htmlFor="city">City/Town *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="county">County *</Label>
                <Select 
                  value={formData.county} 
                  onValueChange={(value) => updateFormData('county', value)}
                >
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
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+231-XXX-XXXX"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="identificationType">Identification Type *</Label>
                  <Select 
                    value={formData.identificationType} 
                    onValueChange={(value) => updateFormData('identificationType', value)}
                  >
                    <SelectTrigger className={errors.identificationType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      {IDENTIFICATION_TYPES.map(idType => (
                        <SelectItem key={idType.value} value={idType.value}>{idType.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.identificationType && <p className="text-red-500 text-sm">{errors.identificationType}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number *</Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => updateFormData('idNumber', e.target.value)}
                    className={errors.idNumber ? 'border-red-500' : ''}
                  />
                  {errors.idNumber && <p className="text-red-500 text-sm">{errors.idNumber}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => updateFormData('nationality', e.target.value)}
                    className={errors.nationality ? 'border-red-500' : ''}
                  />
                  {errors.nationality && <p className="text-red-500 text-sm">{errors.nationality}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select 
                    value={formData.gender} 
                    onValueChange={(value) => updateFormData('gender', value)}
                  >
                    <SelectTrigger className={errors.gender ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map(gender => (
                        <SelectItem key={gender} value={gender} className="capitalize">
                          {gender}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                    className={errors.dateOfBirth ? 'border-red-500' : ''}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status *</Label>
                  <Select 
                    value={formData.maritalStatus} 
                    onValueChange={(value) => updateFormData('maritalStatus', value)}
                  >
                    <SelectTrigger className={errors.maritalStatus ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {MARITAL_STATUS_OPTIONS.map(status => (
                        <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.maritalStatus && <p className="text-red-500 text-sm">{errors.maritalStatus}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation *</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => updateFormData('occupation', e.target.value)}
                  className={errors.occupation ? 'border-red-500' : ''}
                />
                {errors.occupation && <p className="text-red-500 text-sm">{errors.occupation}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Document Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Required Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentUpload
                requiredDocuments={getRequiredDocuments()}
                onDocumentsChange={setUploadedDocuments}
                uploadedDocuments={uploadedDocuments}
              />
              
              {/* Show document validation errors */}
              {getRequiredDocuments().map(doc => (
                errors[doc.type] && (
                  <Alert key={doc.type} className="mt-4 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      {errors[doc.type]}
                    </AlertDescription>
                  </Alert>
                )
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Form Navigation */}
        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}