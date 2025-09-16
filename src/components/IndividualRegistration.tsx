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
import { ArrowLeft, ArrowRight, User, AlertCircle, Sparkles, FileText, Upload, Plus, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import DocumentUpload, { UploadedDocument } from './shared/DocumentUpload';
import PhotoUpload from './shared/PhotoUpload';
import { 
  IDENTIFICATION_TYPES, 
  TITLES, 
  MARITAL_STATUS_OPTIONS, 
  GENDER_OPTIONS, 
  LIBERIAN_COUNTIES,
  LIBERIAN_DISTRICTS,
  PETTY_TRADER_CLASSES,
  EMPLOYMENT_TYPES,
  REPRESENTATION_TYPES,
  REPRESENTATION_REASONS
} from './shared/constants';
import { DUMMY_INDIVIDUAL_DATA, DUMMY_EXISTING_USER_DATA } from './shared/dummyData';

interface IndividualRegistrationProps {
  initialData?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

interface EmploymentEntry {
  employmentType: string;
  employerTin: string;
  employerName: string;
  startDate: string;
  endDate: string;
  isMainActivity: boolean;
}

interface ShareholderEntry {
  companyTin: string;
  companyName: string;
  startDate: string;
  endDate: string;
  sharePercentage: string;
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
  employerNasscorp: string;
  nationality: string;
  placeOfIssuance: string;
  countryOfIssuance: string;
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
  nonResidentCountry: string;
  mailingAddress: {
    streetAddress: string;
    landmark: string;
    city: string;
    district: string;
    county: string;
    country: string;
    poBox: string;
  };
  isFiscalYearSame: boolean;
  fiscalYearStart: string;
  annualTurnoverLastYear: string;
  projectedAnnualTurnover: string;
  isImporter: boolean;
  isExporter: boolean;
  isIncidentalImporter: boolean;
  isLandlord: boolean;
  isPettyTrader: boolean;
  pettyTraderClass: string;
  ownsProperty: boolean;
  paysRent: boolean;
  isPettyTraderEmployee: boolean;
  employmentEntries: EmploymentEntry[];
  isShareholderOwner: boolean;
  shareholderEntries: ShareholderEntry[];
  hasRepresentative: boolean;
  representativeTin: string;
  representativeName: string;
  representationType: string;
  representationReason: string;
  sendMailToRepresentative: boolean;
  bankAccountNumber: string;
  bankAccountHolder: string;
  bankName: string;
  bankBranchAddress: string;
  certificationName: string;
  certificationPosition: string;
  certificationPhone: string;
  applicantPhoto: UploadedDocument | null;
}

export default function IndividualRegistration({
  initialData,
  onComplete,
  onBack
}: IndividualRegistrationProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);
  const [isDifferentMailingAddress, setIsDifferentMailingAddress] = useState<boolean>(false);
  
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
    employerNasscorp: initialData?.employerNasscorp || '',
    nationality: initialData?.nationality || 'Liberian',
    placeOfIssuance: initialData?.placeOfIssuance || '',
    countryOfIssuance: initialData?.countryOfIssuance || 'Liberia',
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
    isResident: initialData?.isResident !== undefined ? initialData.isResident : true,
    nonResidentCountry: initialData?.nonResidentCountry || '',
    mailingAddress: {
      streetAddress: initialData?.mailingAddress?.streetAddress || '',
      landmark: initialData?.mailingAddress?.landmark || '',
      city: initialData?.mailingAddress?.city || '',
      district: initialData?.mailingAddress?.district || '',
      county: initialData?.mailingAddress?.county || '',
      country: initialData?.mailingAddress?.country || '',
      poBox: initialData?.mailingAddress?.poBox || '',
    },
    isFiscalYearSame: initialData?.isFiscalYearSame !== undefined ? initialData.isFiscalYearSame : true,
    fiscalYearStart: initialData?.fiscalYearStart || '',
    annualTurnoverLastYear: initialData?.annualTurnoverLastYear || '',
    projectedAnnualTurnover: initialData?.projectedAnnualTurnover || '',
    isImporter: initialData?.isImporter || false,
    isExporter: initialData?.isExporter || false,
    isIncidentalImporter: initialData?.isIncidentalImporter || false,
    isLandlord: initialData?.isLandlord || false,
    isPettyTrader: initialData?.isPettyTrader || false,
    pettyTraderClass: initialData?.pettyTraderClass || '',
    ownsProperty: initialData?.ownsProperty || false,
    paysRent: initialData?.paysRent || false,
    isPettyTraderEmployee: initialData?.isPettyTraderEmployee || false,
    employmentEntries: initialData?.employmentEntries || [
      { employmentType: '', employerTin: '', employerName: '', startDate: '', endDate: '', isMainActivity: false }
    ],
    isShareholderOwner: initialData?.isShareholderOwner || false,
    shareholderEntries: initialData?.shareholderEntries || [
      { companyTin: '', companyName: '', startDate: '', endDate: '', sharePercentage: '' }
    ],
    hasRepresentative: initialData?.hasRepresentative || false,
    representativeTin: initialData?.representativeTin || '',
    representativeName: initialData?.representativeName || '',
    representationType: initialData?.representationType || '',
    representationReason: initialData?.representationReason || '',
    sendMailToRepresentative: initialData?.sendMailToRepresentative || false,
    bankAccountNumber: initialData?.bankAccountNumber || '',
    bankAccountHolder: initialData?.bankAccountHolder || '',
    bankName: initialData?.bankName || '',
    bankBranchAddress: initialData?.bankBranchAddress || '',
    certificationName: initialData?.certificationName || '',
    certificationPosition: initialData?.certificationPosition || '',
    certificationPhone: initialData?.certificationPhone || '',
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

  const updateMailingAddress = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      mailingAddress: {
        ...prev.mailingAddress,
        [field]: value
      }
    }));
    // Clear error when field is updated
    const errorKey = `mailingAddress.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const addEmploymentEntry = () => {
    if (formData.employmentEntries.length < 4) {
      setFormData(prev => ({
        ...prev,
        employmentEntries: [...prev.employmentEntries, {
          employmentType: '',
          employerTin: '',
          employerName: '',
          startDate: '',
          endDate: '',
          isMainActivity: false
        }]
      }));
    }
  };

  const removeEmploymentEntry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      employmentEntries: prev.employmentEntries.filter((_, i) => i !== index)
    }));
  };

  const updateEmploymentEntry = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      employmentEntries: prev.employmentEntries.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const addShareholderEntry = () => {
    if (formData.shareholderEntries.length < 4) {
      setFormData(prev => ({
        ...prev,
        shareholderEntries: [...prev.shareholderEntries, {
          companyTin: '',
          companyName: '',
          startDate: '',
          endDate: '',
          sharePercentage: ''
        }]
      }));
    }
  };

  const removeShareholderEntry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shareholderEntries: prev.shareholderEntries.filter((_, i) => i !== index)
    }));
  };

  const updateShareholderEntry = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      shareholderEntries: prev.shareholderEntries.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
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
    if (!formData.employerNasscorp.trim()) newErrors.employerNasscorp = 'Employer NASSCORP# is required';
    if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required';
    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.cityOfBirth.trim()) newErrors.cityOfBirth = 'City of birth is required';
    if (!formData.maritalStatus) newErrors.maritalStatus = 'Marital status is required';
    if (!formData.occupation.trim()) newErrors.occupation = 'Occupation is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.fatherName.trim()) newErrors.fatherName = 'Father\'s full name is required';
    if (!formData.motherName.trim()) newErrors.motherName = 'Mother\'s full name is required';
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!formData.landmark.trim()) newErrors.landmark = 'Major landmark is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.county) newErrors.county = 'County is required';
    if (!formData.certificationName.trim()) newErrors.certificationName = 'Certification name is required';
    if (!formData.certificationPosition.trim()) newErrors.certificationPosition = 'Certification position is required';
    if (!formData.certificationPhone.trim()) newErrors.certificationPhone = 'Certification phone is required';

    // Applicant photo validation
    if (!formData.applicantPhoto) {
      newErrors.applicantPhoto = 'Applicant photo is required';
    }

    // GST number validation
    if (formData.hasGstNumber && !formData.existingGstNumber.trim()) {
      newErrors.existingGstNumber = 'GST number is required when "Already have a GST number" is checked';
    }

    // Non-resident validation
    if (!formData.isResident && !formData.nonResidentCountry.trim()) {
      newErrors.nonResidentCountry = 'Country of residence is required for non-residents';
    }

    // Mailing address validation (when different from main address)
    if (isDifferentMailingAddress) {
      if (!formData.mailingAddress.streetAddress.trim()) newErrors['mailingAddress.streetAddress'] = 'Mailing street address is required';
      if (!formData.mailingAddress.landmark.trim()) newErrors['mailingAddress.landmark'] = 'Mailing landmark is required';
      if (!formData.mailingAddress.city.trim()) newErrors['mailingAddress.city'] = 'Mailing city is required';
      if (!formData.mailingAddress.district.trim()) newErrors['mailingAddress.district'] = 'Mailing district is required';
      if (!formData.mailingAddress.county.trim()) newErrors['mailingAddress.county'] = 'Mailing county is required';
      if (!formData.mailingAddress.country.trim()) newErrors['mailingAddress.country'] = 'Mailing country is required';
    }

    // Fiscal year validation
    if (!formData.isFiscalYearSame && !formData.fiscalYearStart) {
      newErrors.fiscalYearStart = 'Fiscal year start date is required';
    }

    // Annual turnover validation
    if (!formData.annualTurnoverLastYear.trim()) {
      newErrors.annualTurnoverLastYear = 'Last year\'s gross income is required';
    }

    // Petty trader class validation
    if (formData.isPettyTrader && !formData.pettyTraderClass) {
      newErrors.pettyTraderClass = 'Petty trader class is required';
    }

    // Representative validation
    if (formData.hasRepresentative) {
      if (!formData.representativeTin.trim()) newErrors.representativeTin = 'Representative TIN is required';
      if (!formData.representativeName.trim()) newErrors.representativeName = 'Representative name is required';
      if (!formData.representationType) newErrors.representationType = 'Representation type is required';
      if (!formData.representationReason) newErrors.representationReason = 'Representation reason is required';
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
                    <Label htmlFor="modify">Modify or Closure</Label>
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
                {formData.applicantType === 'sole-proprietorship' && (
                  <Alert className="bg-purple-50 border-purple-200">
                    <AlertCircle className="h-4 w-4 text-purple-600" />
                    <AlertDescription className="text-purple-800">
                      You're registering as a <strong>Sole Proprietorship</strong>. After completing this form, you'll proceed to the Sole Proprietorship (SP01) form.
                    </AlertDescription>
                  </Alert>
                )}
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

              {/* Name Fields */}
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

              {/* Identification Fields */}
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
                  <Label htmlFor="employerNasscorp">Employer NASSCORP# *</Label>
                  <Input
                    id="employerNasscorp"
                    value={formData.employerNasscorp}
                    onChange={(e) => updateFormData('employerNasscorp', e.target.value)}
                    className={errors.employerNasscorp ? 'border-red-500' : ''}
                  />
                  {errors.employerNasscorp && <p className="text-red-500 text-sm">{errors.employerNasscorp}</p>}
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="placeOfIssuance">Place of Issuance</Label>
                  <Input
                    id="placeOfIssuance"
                    value={formData.placeOfIssuance}
                    onChange={(e) => updateFormData('placeOfIssuance', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="countryOfIssuance">Country of Issuance</Label>
                  <Input
                    id="countryOfIssuance"
                    value={formData.countryOfIssuance}
                    onChange={(e) => updateFormData('countryOfIssuance', e.target.value)}
                  />
                </div>
              </div>

              {/* Birth and Gender */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <Label htmlFor="cityOfBirth">City of Birth *</Label>
                  <Input
                    id="cityOfBirth"
                    value={formData.cityOfBirth}
                    onChange={(e) => updateFormData('cityOfBirth', e.target.value)}
                    className={errors.cityOfBirth ? 'border-red-500' : ''}
                  />
                  {errors.cityOfBirth && <p className="text-red-500 text-sm">{errors.cityOfBirth}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="countryOfBirth">Country of Birth</Label>
                  <Input
                    id="countryOfBirth"
                    value={formData.countryOfBirth}
                    onChange={(e) => updateFormData('countryOfBirth', e.target.value)}
                  />
                </div>
              </div>

              {/* Personal Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">Alternate Phone</Label>
                  <Input
                    id="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={(e) => updateFormData('alternatePhone', e.target.value)}
                    placeholder="+231-XXX-XXXX"
                  />
                </div>
              </div>

              {/* Parents Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName">Father's Full Name *</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => updateFormData('fatherName', e.target.value)}
                    className={errors.fatherName ? 'border-red-500' : ''}
                  />
                  {errors.fatherName && <p className="text-red-500 text-sm">{errors.fatherName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="motherName">Mother's Full Name *</Label>
                  <Input
                    id="motherName"
                    value={formData.motherName}
                    onChange={(e) => updateFormData('motherName', e.target.value)}
                    className={errors.motherName ? 'border-red-500' : ''}
                  />
                  {errors.motherName && <p className="text-red-500 text-sm">{errors.motherName}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Address Section */}
          <Card>
            <CardHeader>
              <CardTitle>Main Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street and House # *</Label>
                  <Input
                    id="streetAddress"
                    value={formData.streetAddress}
                    onChange={(e) => updateFormData('streetAddress', e.target.value)}
                    placeholder="If applicable"
                    className={errors.streetAddress ? 'border-red-500' : ''}
                  />
                  {errors.streetAddress && <p className="text-red-500 text-sm">{errors.streetAddress}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landmark">Major Landmark *</Label>
                  <Input
                    id="landmark"
                    value={formData.landmark}
                    onChange={(e) => updateFormData('landmark', e.target.value)}
                    placeholder="Clear description of location"
                    className={errors.landmark ? 'border-red-500' : ''}
                  />
                  {errors.landmark && <p className="text-red-500 text-sm">{errors.landmark}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City/Village/Town *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District *</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => updateFormData('district', e.target.value)}
                    className={errors.district ? 'border-red-500' : ''}
                  />
                  {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => updateFormData('country', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poBox">PO Box</Label>
                  <Input
                    id="poBox"
                    value={formData.poBox}
                    onChange={(e) => updateFormData('poBox', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isResident"
                    checked={formData.isResident}
                    onCheckedChange={(checked) => updateFormData('isResident', checked)}
                  />
                  <Label htmlFor="isResident">Resident of Liberia *</Label>
                </div>

                {!formData.isResident && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="nonResidentCountry">Country of Residence *</Label>
                    <Input
                      id="nonResidentCountry"
                      value={formData.nonResidentCountry}
                      onChange={(e) => updateFormData('nonResidentCountry', e.target.value)}
                      placeholder="If not resident of Liberia"
                      className={errors.nonResidentCountry ? 'border-red-500' : ''}
                    />
                    {errors.nonResidentCountry && <p className="text-red-500 text-sm">{errors.nonResidentCountry}</p>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mailing Address Section */}
          <Card>
            <CardHeader>
              <CardTitle>Mailing Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isDifferentMailingAddress"
                  checked={isDifferentMailingAddress}
                  onCheckedChange={(checked) => setIsDifferentMailingAddress(checked === true)}
                />
                <Label htmlFor="isDifferentMailingAddress">Mailing address is different from main address</Label>
              </div>

              {isDifferentMailingAddress && (
                <div className="space-y-6 pl-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mailingStreetAddress">Street and House # *</Label>
                      <Input
                        id="mailingStreetAddress"
                        value={formData.mailingAddress.streetAddress}
                        onChange={(e) => updateMailingAddress('streetAddress', e.target.value)}
                        placeholder="If applicable"
                        className={errors['mailingAddress.streetAddress'] ? 'border-red-500' : ''}
                      />
                      {errors['mailingAddress.streetAddress'] && <p className="text-red-500 text-sm">{errors['mailingAddress.streetAddress']}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mailingLandmark">Major Landmark *</Label>
                      <Input
                        id="mailingLandmark"
                        value={formData.mailingAddress.landmark}
                        onChange={(e) => updateMailingAddress('landmark', e.target.value)}
                        placeholder="Clear description of location"
                        className={errors['mailingAddress.landmark'] ? 'border-red-500' : ''}
                      />
                      {errors['mailingAddress.landmark'] && <p className="text-red-500 text-sm">{errors['mailingAddress.landmark']}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mailingCity">City/Village/Town *</Label>
                      <Input
                        id="mailingCity"
                        value={formData.mailingAddress.city}
                        onChange={(e) => updateMailingAddress('city', e.target.value)}
                        className={errors['mailingAddress.city'] ? 'border-red-500' : ''}
                      />
                      {errors['mailingAddress.city'] && <p className="text-red-500 text-sm">{errors['mailingAddress.city']}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mailingDistrict">District *</Label>
                      <Input
                        id="mailingDistrict"
                        value={formData.mailingAddress.district}
                        onChange={(e) => updateMailingAddress('district', e.target.value)}
                        className={errors['mailingAddress.district'] ? 'border-red-500' : ''}
                      />
                      {errors['mailingAddress.district'] && <p className="text-red-500 text-sm">{errors['mailingAddress.district']}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mailingCounty">County *</Label>
                      <Select 
                        value={formData.mailingAddress.county} 
                        onValueChange={(value) => updateMailingAddress('county', value)}
                      >
                        <SelectTrigger className={errors['mailingAddress.county'] ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          {LIBERIAN_COUNTIES.map(county => (
                            <SelectItem key={county} value={county}>{county}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors['mailingAddress.county'] && <p className="text-red-500 text-sm">{errors['mailingAddress.county']}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mailingCountry">Country *</Label>
                      <Input
                        id="mailingCountry"
                        value={formData.mailingAddress.country}
                        onChange={(e) => updateMailingAddress('country', e.target.value)}
                        className={errors['mailingAddress.country'] ? 'border-red-500' : ''}
                      />
                      {errors['mailingAddress.country'] && <p className="text-red-500 text-sm">{errors['mailingAddress.country']}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mailingPoBox">PO Box</Label>
                      <Input
                        id="mailingPoBox"
                        value={formData.mailingAddress.poBox}
                        onChange={(e) => updateMailingAddress('poBox', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity & Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle>Activity & Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isFiscalYearSame"
                    checked={formData.isFiscalYearSame}
                    onCheckedChange={(checked) => updateFormData('isFiscalYearSame', checked)}
                  />
                  <Label htmlFor="isFiscalYearSame">Is your fiscal year the same as the calendar year? *</Label>
                </div>

                {!formData.isFiscalYearSame && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="fiscalYearStart">Fiscal Year Start Date *</Label>
                    <Input
                      id="fiscalYearStart"
                      type="date"
                      value={formData.fiscalYearStart}
                      onChange={(e) => updateFormData('fiscalYearStart', e.target.value)}
                      className={errors.fiscalYearStart ? 'border-red-500' : ''}
                    />
                    {errors.fiscalYearStart && <p className="text-red-500 text-sm">{errors.fiscalYearStart}</p>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annualTurnoverLastYear">Gross Income from Last Year (LRD) *</Label>
                  <Input
                    id="annualTurnoverLastYear"
                    value={formData.annualTurnoverLastYear}
                    onChange={(e) => updateFormData('annualTurnoverLastYear', e.target.value)}
                    placeholder="Include all sole-proprietorships owned"
                    className={errors.annualTurnoverLastYear ? 'border-red-500' : ''}
                  />
                  {errors.annualTurnoverLastYear && <p className="text-red-500 text-sm">{errors.annualTurnoverLastYear}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectedAnnualTurnover">Projected Gross Income for This Year (LRD)</Label>
                  <Input
                    id="projectedAnnualTurnover"
                    value={formData.projectedAnnualTurnover}
                    onChange={(e) => updateFormData('projectedAnnualTurnover', e.target.value)}
                    placeholder="New taxpayers only"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Business Activities (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isImporter"
                      checked={formData.isImporter}
                      onCheckedChange={(checked) => updateFormData('isImporter', checked)}
                    />
                    <Label htmlFor="isImporter">Importer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isExporter"
                      checked={formData.isExporter}
                      onCheckedChange={(checked) => updateFormData('isExporter', checked)}
                    />
                    <Label htmlFor="isExporter">Exporter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isIncidentalImporter"
                      checked={formData.isIncidentalImporter}
                      onCheckedChange={(checked) => updateFormData('isIncidentalImporter', checked)}
                    />
                    <Label htmlFor="isIncidentalImporter">Incidental Importer/Exporter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isLandlord"
                      checked={formData.isLandlord}
                      onCheckedChange={(checked) => updateFormData('isLandlord', checked)}
                    />
                    <Label htmlFor="isLandlord">Landlord</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isPettyTrader"
                      checked={formData.isPettyTrader}
                      onCheckedChange={(checked) => updateFormData('isPettyTrader', checked)}
                    />
                    <Label htmlFor="isPettyTrader">Petty Trader</Label>
                  </div>
                </div>

                {formData.isPettyTrader && (
                  <div className="space-y-2 ml-6">
                    <Label htmlFor="pettyTraderClass">Petty Trader Class *</Label>
                    <Select 
                      value={formData.pettyTraderClass} 
                      onValueChange={(value) => updateFormData('pettyTraderClass', value)}
                    >
                      <SelectTrigger className={errors.pettyTraderClass ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {PETTY_TRADER_CLASSES.map(traderClass => (
                          <SelectItem key={traderClass.value} value={traderClass.value}>
                            {traderClass.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.pettyTraderClass && <p className="text-red-500 text-sm">{errors.pettyTraderClass}</p>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ownsProperty"
                    checked={formData.ownsProperty}
                    onCheckedChange={(checked) => updateFormData('ownsProperty', checked)}
                  />
                  <Label htmlFor="ownsProperty">Do you own real estate? *</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="paysRent"
                    checked={formData.paysRent}
                    onCheckedChange={(checked) => updateFormData('paysRent', checked)}
                  />
                  <Label htmlFor="paysRent">Do you pay rent? *</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Employment Information
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEmploymentEntry}
                  disabled={formData.employmentEntries.length >= 4}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Employment
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPettyTraderEmployee"
                  checked={formData.isPettyTraderEmployee}
                  onCheckedChange={(checked) => updateFormData('isPettyTraderEmployee', checked)}
                />
                <Label htmlFor="isPettyTraderEmployee">
                  Are you a petty trader, self-employed, government/charity/private business employee, investor or landlord? *
                </Label>
              </div>

              {formData.isPettyTraderEmployee && (
                <div className="space-y-4">
                  {formData.employmentEntries.map((entry, index) => (
                    <Card key={index} className="bg-gray-50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Employment Entry {index + 1}</h4>
                          {formData.employmentEntries.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeEmploymentEntry(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Employment Type</Label>
                            <Select 
                              value={entry.employmentType} 
                              onValueChange={(value) => updateEmploymentEntry(index, 'employmentType', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {EMPLOYMENT_TYPES.map(type => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>TIN or Name of Employer/Contractor</Label>
                            <Input
                              value={entry.employerTin}
                              onChange={(e) => updateEmploymentEntry(index, 'employerTin', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Start Date</Label>
                            <Input
                              type="date"
                              value={entry.startDate}
                              onChange={(e) => updateEmploymentEntry(index, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date</Label>
                            <Input
                              type="date"
                              value={entry.endDate}
                              onChange={(e) => updateEmploymentEntry(index, 'endDate', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`mainActivity-${index}`}
                            checked={entry.isMainActivity}
                            onCheckedChange={(checked) => updateEmploymentEntry(index, 'isMainActivity', checked)}
                          />
                          <Label htmlFor={`mainActivity-${index}`}>Main Activity</Label>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Shareholder & Ownership Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Shareholder & Ownership Information
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addShareholderEntry}
                  disabled={formData.shareholderEntries.length >= 4}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ownership
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isShareholderOwner"
                  checked={formData.isShareholderOwner}
                  onCheckedChange={(checked) => updateFormData('isShareholderOwner', checked)}
                />
                <Label htmlFor="isShareholderOwner">
                  Are you a shareholder or owner of a company (do not include sole-proprietorships)? *
                </Label>
              </div>

              {formData.isShareholderOwner && (
                <div className="space-y-4">
                  {formData.shareholderEntries.map((entry, index) => (
                    <Card key={index} className="bg-gray-50">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Ownership Entry {index + 1}</h4>
                          {formData.shareholderEntries.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeShareholderEntry(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>TIN of Company</Label>
                            <Input
                              value={entry.companyTin}
                              onChange={(e) => updateShareholderEntry(index, 'companyTin', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Name of Company</Label>
                            <Input
                              value={entry.companyName}
                              onChange={(e) => updateShareholderEntry(index, 'companyName', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label>Start Date of Share/Ownership</Label>
                            <Input
                              type="date"
                              value={entry.startDate}
                              onChange={(e) => updateShareholderEntry(index, 'startDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>End Date of Share/Ownership</Label>
                            <Input
                              type="date"
                              value={entry.endDate}
                              onChange={(e) => updateShareholderEntry(index, 'endDate', e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Percentage of Share/Ownership</Label>
                            <Input
                              value={entry.sharePercentage}
                              onChange={(e) => updateShareholderEntry(index, 'sharePercentage', e.target.value)}
                              placeholder="%"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Representative Information */}
          <Card>
            <CardHeader>
              <CardTitle>Representative Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="hasRepresentative"
                  checked={formData.hasRepresentative}
                  onCheckedChange={(checked) => updateFormData('hasRepresentative', checked)}
                />
                <Label htmlFor="hasRepresentative">Do you have a representative? *</Label>
              </div>

              {formData.hasRepresentative && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="representativeTin">Representative TIN *</Label>
                      <Input
                        id="representativeTin"
                        value={formData.representativeTin}
                        onChange={(e) => updateFormData('representativeTin', e.target.value)}
                        className={errors.representativeTin ? 'border-red-500' : ''}
                      />
                      {errors.representativeTin && <p className="text-red-500 text-sm">{errors.representativeTin}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="representativeName">Representative Full Name *</Label>
                      <Input
                        id="representativeName"
                        value={formData.representativeName}
                        onChange={(e) => updateFormData('representativeName', e.target.value)}
                        className={errors.representativeName ? 'border-red-500' : ''}
                      />
                      {errors.representativeName && <p className="text-red-500 text-sm">{errors.representativeName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="representationType">Type of Representation *</Label>
                      <Select 
                        value={formData.representationType} 
                        onValueChange={(value) => updateFormData('representationType', value)}
                      >
                        <SelectTrigger className={errors.representationType ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {REPRESENTATION_TYPES.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.representationType && <p className="text-red-500 text-sm">{errors.representationType}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="representationReason">Reason for Representation *</Label>
                      <Select 
                        value={formData.representationReason} 
                        onValueChange={(value) => updateFormData('representationReason', value)}
                      >
                        <SelectTrigger className={errors.representationReason ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {REPRESENTATION_REASONS.map(reason => (
                            <SelectItem key={reason.value} value={reason.value}>
                              {reason.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.representationReason && <p className="text-red-500 text-sm">{errors.representationReason}</p>}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendMailToRepresentative"
                      checked={formData.sendMailToRepresentative}
                      onCheckedChange={(checked) => updateFormData('sendMailToRepresentative', checked)}
                    />
                    <Label htmlFor="sendMailToRepresentative">Send Mail to Representative?</Label>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bank Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>Bank Account Information (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankAccountNumber">Account Number</Label>
                  <Input
                    id="bankAccountNumber"
                    value={formData.bankAccountNumber}
                    onChange={(e) => updateFormData('bankAccountNumber', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccountHolder">Account Holder</Label>
                  <Input
                    id="bankAccountHolder"
                    value={formData.bankAccountHolder}
                    onChange={(e) => updateFormData('bankAccountHolder', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) => updateFormData('bankName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankBranchAddress">Branch Address</Label>
                  <Input
                    id="bankBranchAddress"
                    value={formData.bankBranchAddress}
                    onChange={(e) => updateFormData('bankBranchAddress', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certification Section */}
          <Card>
            <CardHeader>
              <CardTitle>Certification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="certificationName">Full Name *</Label>
                  <Input
                    id="certificationName"
                    value={formData.certificationName}
                    onChange={(e) => updateFormData('certificationName', e.target.value)}
                    className={errors.certificationName ? 'border-red-500' : ''}
                  />
                  {errors.certificationName && <p className="text-red-500 text-sm">{errors.certificationName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificationPosition">Position (Job Title) *</Label>
                  <Input
                    id="certificationPosition"
                    value={formData.certificationPosition}
                    onChange={(e) => updateFormData('certificationPosition', e.target.value)}
                    className={errors.certificationPosition ? 'border-red-500' : ''}
                  />
                  {errors.certificationPosition && <p className="text-red-500 text-sm">{errors.certificationPosition}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="certificationPhone">Telephone # *</Label>
                  <Input
                    id="certificationPhone"
                    value={formData.certificationPhone}
                    onChange={(e) => updateFormData('certificationPhone', e.target.value)}
                    className={errors.certificationPhone ? 'border-red-500' : ''}
                  />
                  {errors.certificationPhone && <p className="text-red-500 text-sm">{errors.certificationPhone}</p>}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> By providing this information, you certify that all information provided is true and accurate. 
                  Any false information may result in penalties or rejection of your application.
                </p>
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