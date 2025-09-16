import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { ArrowLeft, ArrowRight, Building2, Plus, Trash2, Sparkles, AlertCircle, Users, DollarSign, FileText, MapPin, Phone, User, Briefcase, CreditCard, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import DocumentUpload, { UploadedDocument } from './shared/DocumentUpload';
import PhotoUpload from './shared/PhotoUpload';
import { LIBERIAN_COUNTIES } from './shared/constants';

// RF01 Organization Registration Form - New Structure with 17 Sections

interface DirectorInfo {
  tin: string;
  residenceStatus: string;
  firstName: string;
  middleName: string;
  lastName: string;
  position: string;
}

interface ShareholderInfo {
  tin: string;
  residenceStatus: string;
  fullName: string;
  percentageShares: string;
  startDate: string;
}

interface BeneficiaryOwner {
  tin: string;
  fullName: string;
  passportNo: string;
  taxResidency: string;
  nationality: string;
  percentageHeld: string;
}

interface AssociateInfo {
  tin: string;
  fullName: string;
  residenceStatus: string;
}

interface RelatedEntity {
  entityTin: string;
  entityName: string;
  startDate: string;
}

interface EconomicActivity {
  isicCode: string;
  description: string;
  isMain: boolean;
}

interface RepresentativeInfo {
  tin: string;
  name: string;
  telephone: string;
  email: string;
  authDateFrom: string;
  authDateTo: string;
  taxType?: string;
}

interface BusinessRegistrationProps {
  initialData?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function BusinessRegistration({ initialData, onComplete, onBack }: BusinessRegistrationProps) {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedDocument[]>([]);

  const [formData, setFormData] = useState({
    // Section 1: Organization Type
    organizationType: initialData?.organizationType || '',
    
    // Section 2: Organization Detail
    registrationNumber: initialData?.registrationNumber || '',
    registrationDate: initialData?.registrationDate || '',
    registeredName: initialData?.registeredName || '',
    mainTradeName: initialData?.mainTradeName || '',
    countryOfIncorporation: initialData?.countryOfIncorporation || 'Liberia',
    accountingYearEndMonth: initialData?.accountingYearEndMonth || '',
    
    // Section 3: Main Address
    mainAddressCountry: initialData?.mainAddressCountry || 'Liberia',
    mainAddressCounty: initialData?.mainAddressCounty || '',
    mainAddressDistrict: initialData?.mainAddressDistrict || '',
    mainAddressTaxDistrict: initialData?.mainAddressTaxDistrict || '',
    mainAddressCityVillageTown: initialData?.mainAddressCityVillageTown || '',
    mainAddressLandmark: initialData?.mainAddressLandmark || '',
    mainAddressStreetRoad: initialData?.mainAddressStreetRoad || '',
    mainAddressBuildingUnit: initialData?.mainAddressBuildingUnit || '',
    mainAddressPoBox: initialData?.mainAddressPoBox || '',
    
    // Section 4: Foreign Address
    foreignAddressCountry: initialData?.foreignAddressCountry || '',
    foreignAddressLine1: initialData?.foreignAddressLine1 || '',
    foreignAddressLine2: initialData?.foreignAddressLine2 || '',
    foreignAddressLine3: initialData?.foreignAddressLine3 || '',
    
    // Section 5: Mailing Address
    mailingAddressDifferent: initialData?.mailingAddressDifferent || false,
    mailingAddressCountry: initialData?.mailingAddressCountry || '',
    mailingAddressCounty: initialData?.mailingAddressCounty || '',
    mailingAddressDistrict: initialData?.mailingAddressDistrict || '',
    mailingAddressTaxDistrict: initialData?.mailingAddressTaxDistrict || '',
    mailingAddressCityVillageTown: initialData?.mailingAddressCityVillageTown || '',
    mailingAddressLandmark: initialData?.mailingAddressLandmark || '',
    mailingAddressStreetRoad: initialData?.mailingAddressStreetRoad || '',
    mailingAddressBuildingUnit: initialData?.mailingAddressBuildingUnit || '',
    mailingAddressPoBox: initialData?.mailingAddressPoBox || '',
    
    // Section 6: Contact Details
    telephoneMobile: initialData?.telephoneMobile || '',
    alternateTelephoneMobile: initialData?.alternateTelephoneMobile || '',
    emailAddress: initialData?.emailAddress || '',
    alternateEmailAddress: initialData?.alternateEmailAddress || '',
    contactPersonFullName: initialData?.contactPersonFullName || '',
    
    // Section 7: Parent-Subsidiary Information
    isSubsidiary: initialData?.isSubsidiary || false,
    isParentLiberianResident: initialData?.isParentLiberianResident || false,
    parentCompanyTin: initialData?.parentCompanyTin || '',
    parentCompanyName: initialData?.parentCompanyName || '',
    parentCompanyCountry: initialData?.parentCompanyCountry || '',
    
    // Section 8: Organization Activities
    isImporter: initialData?.isImporter || false,
    isExporter: initialData?.isExporter || false,
    paysRent: initialData?.paysRent || false,
    ownsRealProperty: initialData?.ownsRealProperty || false,
    numberOfEmployees: initialData?.numberOfEmployees || '',
    estimatedAnnualTurnover: initialData?.estimatedAnnualTurnover || '',
    estimatedInvestmentValue: initialData?.estimatedInvestmentValue || '',
    estimatedImportExportValue: initialData?.estimatedImportExportValue || '',
    sharesAuthorized: initialData?.sharesAuthorized || '',
    sharesIssued: initialData?.sharesIssued || '',
    
    // Section 9: Economic Activities
    economicActivities: initialData?.economicActivities || [
      { isicCode: '', description: '', isMain: false }
    ] as EconomicActivity[],
    
    // Section 10: Existing related Organization/Company
    relatedEntities: initialData?.relatedEntities || [
      { entityTin: '', entityName: '', startDate: '' }
    ] as RelatedEntity[],
    
    // Section 11: Directors Information
    directors: initialData?.directors || [
      { tin: '', residenceStatus: '', firstName: '', middleName: '', lastName: '', position: '' }
    ] as DirectorInfo[],
    
    // Section 12: Shareholders/Partners Information
    shareholders: initialData?.shareholders || [
      { tin: '', residenceStatus: '', fullName: '', percentageShares: '', startDate: '' }
    ] as ShareholderInfo[],
    
    // Section 13: Beneficiary Owners
    beneficiaryOwners: initialData?.beneficiaryOwners || [
      { tin: '', fullName: '', passportNo: '', taxResidency: '', nationality: '', percentageHeld: '' }
    ] as BeneficiaryOwner[],
    
    // Section 14: Associates Information
    associates: initialData?.associates || [
      { tin: '', fullName: '', residenceStatus: '' }
    ] as AssociateInfo[],
    
    // Section 15: Agent/Representative
    hasRepresentative: initialData?.hasRepresentative || false,
    applicationRepresentative: initialData?.applicationRepresentative || {
      tin: '', name: '', telephone: '', email: '', authDateFrom: '', authDateTo: ''
    } as RepresentativeInfo,
    returnsRepresentative: initialData?.returnsRepresentative || {
      tin: '', name: '', telephone: '', email: '', authDateFrom: '', authDateTo: '', taxType: ''
    } as RepresentativeInfo,
    
    // Section 16: Bank Account
    declareBankAccount: initialData?.declareBankAccount || false,
    accountNumber: initialData?.accountNumber || '',
    accountHolderName: initialData?.accountHolderName || '',
    bankName: initialData?.bankName || '',
    bankBranch: initialData?.bankBranch || '',
    
    // Section 17: Certification
    certFirstName: initialData?.certFirstName || '',
    certMiddleName: initialData?.certMiddleName || '',
    certLastName: initialData?.certLastName || '',
    certPosition: initialData?.certPosition || '',
    certSignature: initialData?.certSignature || '',
    certDate: initialData?.certDate || new Date().toISOString().split('T')[0],
    
    // Additional
    applicantPhoto: initialData?.applicantPhoto || null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const organizationTypes = [
    'Limited Liability Company',
    'Business Corporation',
    'Foreign Corporation',
    'Foreign Maritime Entity',
    'Diplomatic Organization',
    'Partnership',
    'Limited Partnership',
    'Foundation',
    'Trust',
    'Ministry, Agency, Commission',
    'Not-for-Profit Organization',
    'Religious Organization',
    'Government Owned Enterprises',
    'National Maritime Entity',
    'Local Government'
  ];

  const monthOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const residenceStatusOptions = ['Resident', 'Non-resident'];

  // Progress calculation
  const completionProgress = useMemo(() => {
    const requiredFields = [
      'organizationType', 'registeredName', 'countryOfIncorporation',
      'mainAddressCounty', 'mainAddressCityVillageTown', 'telephoneMobile',
      'emailAddress', 'contactPersonFullName', 'certFirstName', 'certLastName',
      'certPosition', 'certSignature'
    ];
    
    let completedFields = 0;
    requiredFields.forEach(field => {
      if (formData[field as keyof typeof formData] && 
          String(formData[field as keyof typeof formData]).trim()) {
        completedFields++;
      }
    });
    
    return Math.round((completedFields / requiredFields.length) * 100);
  }, [formData]);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const fillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      organizationType: 'Limited Liability Company',
      registrationNumber: 'LBR-2024-001234',
      registrationDate: '2024-01-15',
      registeredName: 'Liberia Tech Solutions LLC',
      mainTradeName: 'TechSolutions',
      countryOfIncorporation: 'Liberia',
      accountingYearEndMonth: 'December',
      mainAddressCounty: 'Montserrado',
      mainAddressDistrict: 'Greater Monrovia',
      mainAddressTaxDistrict: 'Sinkor Tax District',
      mainAddressCityVillageTown: 'Monrovia',
      mainAddressLandmark: 'Near Bella Casa Hotel',
      mainAddressStreetRoad: '15th Street, Sinkor',
      mainAddressBuildingUnit: 'Suite 301',
      mainAddressPoBox: 'P.O. Box 1234',
      telephoneMobile: '+231-555-0100',
      emailAddress: 'info@techsolutions.lr',
      contactPersonFullName: 'John K. Marwolo',
      numberOfEmployees: '25',
      estimatedAnnualTurnover: '2500000',
      certFirstName: 'John',
      certLastName: 'Marwolo',
      certPosition: 'Chief Executive Officer',
      certSignature: 'John K. Marwolo',
      certDate: new Date().toISOString().split('T')[0]
    }));
    setErrors({});
  };

  // Array management functions
  const addArrayItem = (arrayName: string, newItem: any) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName as keyof typeof prev] as any[], newItem]
    }));
  };

  const removeArrayItem = (arrayName: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName as keyof typeof prev] as any[]).filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (arrayName: string, index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: (prev[arrayName as keyof typeof prev] as any[]).map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validations
    if (!formData.organizationType) newErrors.organizationType = 'Organization type is required';
    if (!formData.registeredName?.trim()) newErrors.registeredName = 'Registered name is required';
    if (!formData.countryOfIncorporation?.trim()) newErrors.countryOfIncorporation = 'Country of incorporation is required';
    if (!formData.mainAddressCounty) newErrors.mainAddressCounty = 'County is required';
    if (!formData.mainAddressCityVillageTown?.trim()) newErrors.mainAddressCityVillageTown = 'City/Village/Town is required';
    if (!formData.telephoneMobile?.trim()) newErrors.telephoneMobile = 'Telephone/Mobile number is required';
    if (!formData.emailAddress?.trim()) newErrors.emailAddress = 'Email address is required';
    if (!formData.contactPersonFullName?.trim()) newErrors.contactPersonFullName = 'Contact person full name is required';
    if (!formData.certFirstName?.trim()) newErrors.certFirstName = 'First name is required';
    if (!formData.certLastName?.trim()) newErrors.certLastName = 'Last name is required';
    if (!formData.certPosition?.trim()) newErrors.certPosition = 'Position is required';
    if (!formData.certSignature?.trim()) newErrors.certSignature = 'Signature is required';

    // Email validation
    if (formData.emailAddress && !/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Valid email address is required';
    }
    if (formData.alternateEmailAddress && !/\S+@\S+\.\S+/.test(formData.alternateEmailAddress)) {
      newErrors.alternateEmailAddress = 'Valid alternate email address is required';
    }

    // Conditional validations
    if (formData.countryOfIncorporation !== 'Liberia' && !formData.foreignAddressCountry?.trim()) {
      newErrors.foreignAddressCountry = 'Foreign address country is required when country of incorporation is not Liberia';
    }

    if (formData.mailingAddressDifferent && !formData.mailingAddressCounty) {
      newErrors.mailingAddressCounty = 'Mailing address county is required when mailing address is different';
    }

    if (formData.isSubsidiary && formData.isParentLiberianResident && !formData.parentCompanyTin?.trim()) {
      newErrors.parentCompanyTin = 'Parent company TIN is required when parent is Liberian resident';
    }

    if (formData.isSubsidiary && !formData.isParentLiberianResident && !formData.parentCompanyName?.trim()) {
      newErrors.parentCompanyName = 'Parent company name is required when parent is not Liberian resident';
    }

    if (formData.declareBankAccount) {
      if (!formData.accountNumber?.trim()) newErrors.accountNumber = 'Account number is required';
      if (!formData.accountHolderName?.trim()) newErrors.accountHolderName = 'Account holder name is required';
      if (!formData.bankName?.trim()) newErrors.bankName = 'Bank name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (validateForm()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        onComplete({
          ...formData,
          documents: uploadedDocuments
        });
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors(prev => ({ ...prev, general: 'An error occurred while submitting. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl">RF01 Organization Registration Form</h2>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${completionProgress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600">{completionProgress}% Complete</span>
            </div>
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

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Error */}
        {errors.general && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        {/* Applicant Photo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Applicant Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

        {/* Section 1: Organization Type */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Section 1: Organization Type (Select 1 Only)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Label>Organization Type *</Label>
              <RadioGroup 
                value={formData.organizationType} 
                onValueChange={(value) => updateFormData('organizationType', value)}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                {organizationTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type} className="text-sm">{type}</Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.organizationType && <p className="text-red-500 text-sm">{errors.organizationType}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Organization Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Section 2: Organization Detail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                  placeholder="Enter registration number"
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registeredName">Registered Name *</Label>
                <Input
                  id="registeredName"
                  value={formData.registeredName}
                  onChange={(e) => updateFormData('registeredName', e.target.value)}
                  className={errors.registeredName ? 'border-red-500' : ''}
                  placeholder="Enter registered name"
                />
                {errors.registeredName && <p className="text-red-500 text-sm">{errors.registeredName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainTradeName">Main Trade Name (if different from Registered Name)</Label>
                <Input
                  id="mainTradeName"
                  value={formData.mainTradeName}
                  onChange={(e) => updateFormData('mainTradeName', e.target.value)}
                  placeholder="Enter main trade name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="countryOfIncorporation">Country of Incorporation *</Label>
                <Input
                  id="countryOfIncorporation"
                  value={formData.countryOfIncorporation}
                  onChange={(e) => updateFormData('countryOfIncorporation', e.target.value)}
                  className={errors.countryOfIncorporation ? 'border-red-500' : ''}
                  placeholder="Enter country of incorporation"
                />
                {errors.countryOfIncorporation && <p className="text-red-500 text-sm">{errors.countryOfIncorporation}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountingYearEndMonth">Accounting Year End Month</Label>
                <Select 
                  value={formData.accountingYearEndMonth} 
                  onValueChange={(value) => updateFormData('accountingYearEndMonth', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthOptions.map(month => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Main Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Section 3: Main Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mainAddressCountry">Country</Label>
                <Select 
                  value={formData.mainAddressCountry} 
                  onValueChange={(value) => updateFormData('mainAddressCountry', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Liberia">Liberia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainAddressCounty">County *</Label>
                <Select 
                  value={formData.mainAddressCounty} 
                  onValueChange={(value) => updateFormData('mainAddressCounty', value)}
                >
                  <SelectTrigger className={errors.mainAddressCounty ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIBERIAN_COUNTIES.map(county => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.mainAddressCounty && <p className="text-red-500 text-sm">{errors.mainAddressCounty}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainAddressDistrict">Administrative District</Label>
                <Input
                  id="mainAddressDistrict"
                  value={formData.mainAddressDistrict}
                  onChange={(e) => updateFormData('mainAddressDistrict', e.target.value)}
                  placeholder="Enter administrative district"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mainAddressTaxDistrict">Tax District</Label>
                <Input
                  id="mainAddressTaxDistrict"
                  value={formData.mainAddressTaxDistrict}
                  onChange={(e) => updateFormData('mainAddressTaxDistrict', e.target.value)}
                  placeholder="Enter tax district"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainAddressCityVillageTown">City/Village/Town *</Label>
                <Input
                  id="mainAddressCityVillageTown"
                  value={formData.mainAddressCityVillageTown}
                  onChange={(e) => updateFormData('mainAddressCityVillageTown', e.target.value)}
                  className={errors.mainAddressCityVillageTown ? 'border-red-500' : ''}
                  placeholder="Enter city, village, or town"
                />
                {errors.mainAddressCityVillageTown && <p className="text-red-500 text-sm">{errors.mainAddressCityVillageTown}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mainAddressLandmark">Major Landmark</Label>
                <Input
                  id="mainAddressLandmark"
                  value={formData.mainAddressLandmark}
                  onChange={(e) => updateFormData('mainAddressLandmark', e.target.value)}
                  placeholder="Enter major landmark"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainAddressStreetRoad">Street/Road</Label>
                <Input
                  id="mainAddressStreetRoad"
                  value={formData.mainAddressStreetRoad}
                  onChange={(e) => updateFormData('mainAddressStreetRoad', e.target.value)}
                  placeholder="Enter street or road"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mainAddressBuildingUnit">Building/Unit</Label>
                <Input
                  id="mainAddressBuildingUnit"
                  value={formData.mainAddressBuildingUnit}
                  onChange={(e) => updateFormData('mainAddressBuildingUnit', e.target.value)}
                  placeholder="Enter building or unit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainAddressPoBox">P.O. Box</Label>
                <Input
                  id="mainAddressPoBox"
                  value={formData.mainAddressPoBox}
                  onChange={(e) => updateFormData('mainAddressPoBox', e.target.value)}
                  placeholder="Enter P.O. Box"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Foreign Address (Conditional) */}
        {formData.countryOfIncorporation !== 'Liberia' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Section 4: Foreign Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="foreignAddressCountry">Country *</Label>
                <Input
                  id="foreignAddressCountry"
                  value={formData.foreignAddressCountry}
                  onChange={(e) => updateFormData('foreignAddressCountry', e.target.value)}
                  className={errors.foreignAddressCountry ? 'border-red-500' : ''}
                  placeholder="Enter country"
                />
                {errors.foreignAddressCountry && <p className="text-red-500 text-sm">{errors.foreignAddressCountry}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="foreignAddressLine1">Address Line 1</Label>
                <Input
                  id="foreignAddressLine1"
                  value={formData.foreignAddressLine1}
                  onChange={(e) => updateFormData('foreignAddressLine1', e.target.value)}
                  placeholder="Enter address line 1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="foreignAddressLine2">Address Line 2</Label>
                <Input
                  id="foreignAddressLine2"
                  value={formData.foreignAddressLine2}
                  onChange={(e) => updateFormData('foreignAddressLine2', e.target.value)}
                  placeholder="Enter address line 2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="foreignAddressLine3">Address Line 3</Label>
                <Input
                  id="foreignAddressLine3"
                  value={formData.foreignAddressLine3}
                  onChange={(e) => updateFormData('foreignAddressLine3', e.target.value)}
                  placeholder="Enter address line 3"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 5: Mailing Address (Conditional) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Section 5: Mailing Address
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="mailingAddressDifferent"
                checked={formData.mailingAddressDifferent}
                onCheckedChange={(checked) => updateFormData('mailingAddressDifferent', checked)}
              />
              <Label htmlFor="mailingAddressDifferent">Mailing address is different than main address</Label>
            </div>

            {formData.mailingAddressDifferent && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailingAddressCountry">Country</Label>
                    <Select 
                      value={formData.mailingAddressCountry} 
                      onValueChange={(value) => updateFormData('mailingAddressCountry', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Liberia">Liberia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mailingAddressCounty">County</Label>
                    <Select 
                      value={formData.mailingAddressCounty} 
                      onValueChange={(value) => updateFormData('mailingAddressCounty', value)}
                    >
                      <SelectTrigger className={errors.mailingAddressCounty ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select county" />
                      </SelectTrigger>
                      <SelectContent>
                        {LIBERIAN_COUNTIES.map(county => (
                          <SelectItem key={county} value={county}>{county}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.mailingAddressCounty && <p className="text-red-500 text-sm">{errors.mailingAddressCounty}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mailingAddressDistrict">Administrative District</Label>
                    <Input
                      id="mailingAddressDistrict"
                      value={formData.mailingAddressDistrict}
                      onChange={(e) => updateFormData('mailingAddressDistrict', e.target.value)}
                      placeholder="Enter administrative district"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailingAddressTaxDistrict">Tax District</Label>
                    <Input
                      id="mailingAddressTaxDistrict"
                      value={formData.mailingAddressTaxDistrict}
                      onChange={(e) => updateFormData('mailingAddressTaxDistrict', e.target.value)}
                      placeholder="Enter tax district"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mailingAddressCityVillageTown">City/Village/Town</Label>
                    <Input
                      id="mailingAddressCityVillageTown"
                      value={formData.mailingAddressCityVillageTown}
                      onChange={(e) => updateFormData('mailingAddressCityVillageTown', e.target.value)}
                      placeholder="Enter city, village, or town"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailingAddressLandmark">Major Landmark</Label>
                    <Input
                      id="mailingAddressLandmark"
                      value={formData.mailingAddressLandmark}
                      onChange={(e) => updateFormData('mailingAddressLandmark', e.target.value)}
                      placeholder="Enter major landmark"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mailingAddressStreetRoad">Street/Road</Label>
                    <Input
                      id="mailingAddressStreetRoad"
                      value={formData.mailingAddressStreetRoad}
                      onChange={(e) => updateFormData('mailingAddressStreetRoad', e.target.value)}
                      placeholder="Enter street or road"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mailingAddressBuildingUnit">Building/Unit</Label>
                    <Input
                      id="mailingAddressBuildingUnit"
                      value={formData.mailingAddressBuildingUnit}
                      onChange={(e) => updateFormData('mailingAddressBuildingUnit', e.target.value)}
                      placeholder="Enter building or unit"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mailingAddressPoBox">P.O. Box</Label>
                    <Input
                      id="mailingAddressPoBox"
                      value={formData.mailingAddressPoBox}
                      onChange={(e) => updateFormData('mailingAddressPoBox', e.target.value)}
                      placeholder="Enter P.O. Box"
                    />
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Section 6: Contact Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Section 6: Contact Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="telephoneMobile">Telephone/Mobile Number *</Label>
                <Input
                  id="telephoneMobile"
                  value={formData.telephoneMobile}
                  onChange={(e) => updateFormData('telephoneMobile', e.target.value)}
                  className={errors.telephoneMobile ? 'border-red-500' : ''}
                  placeholder="Enter telephone/mobile number"
                />
                {errors.telephoneMobile && <p className="text-red-500 text-sm">{errors.telephoneMobile}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="alternateTelephoneMobile">Alternate Telephone/Mobile Number</Label>
                <Input
                  id="alternateTelephoneMobile"
                  value={formData.alternateTelephoneMobile}
                  onChange={(e) => updateFormData('alternateTelephoneMobile', e.target.value)}
                  placeholder="Enter alternate telephone/mobile number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emailAddress">Email Address *</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => updateFormData('emailAddress', e.target.value)}
                  className={errors.emailAddress ? 'border-red-500' : ''}
                  placeholder="Enter email address"
                />
                {errors.emailAddress && <p className="text-red-500 text-sm">{errors.emailAddress}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="alternateEmailAddress">Alternate Email Address</Label>
                <Input
                  id="alternateEmailAddress"
                  type="email"
                  value={formData.alternateEmailAddress}
                  onChange={(e) => updateFormData('alternateEmailAddress', e.target.value)}
                  className={errors.alternateEmailAddress ? 'border-red-500' : ''}
                  placeholder="Enter alternate email address"
                />
                {errors.alternateEmailAddress && <p className="text-red-500 text-sm">{errors.alternateEmailAddress}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPersonFullName">Contact Person Full Name *</Label>
              <Input
                id="contactPersonFullName"
                value={formData.contactPersonFullName}
                onChange={(e) => updateFormData('contactPersonFullName', e.target.value)}
                className={errors.contactPersonFullName ? 'border-red-500' : ''}
                placeholder="Enter contact person full name"
              />
              {errors.contactPersonFullName && <p className="text-red-500 text-sm">{errors.contactPersonFullName}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Section 7: Parent-Subsidiary Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Section 7: Parent-Subsidiary Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="isSubsidiary"
                  checked={formData.isSubsidiary}
                  onCheckedChange={(checked) => updateFormData('isSubsidiary', checked)}
                />
                <Label htmlFor="isSubsidiary">Is the Organization being registered a subsidiary?</Label>
              </div>

              {formData.isSubsidiary && (
                <>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isParentLiberianResident"
                      checked={formData.isParentLiberianResident}
                      onCheckedChange={(checked) => updateFormData('isParentLiberianResident', checked)}
                    />
                    <Label htmlFor="isParentLiberianResident">Is the parent company resident in Liberia?</Label>
                  </div>

                  {formData.isParentLiberianResident ? (
                    <div className="space-y-2">
                      <Label htmlFor="parentCompanyTin">Parent Company TIN *</Label>
                      <Input
                        id="parentCompanyTin"
                        value={formData.parentCompanyTin}
                        onChange={(e) => updateFormData('parentCompanyTin', e.target.value)}
                        className={errors.parentCompanyTin ? 'border-red-500' : ''}
                        placeholder="Enter parent company TIN"
                      />
                      {errors.parentCompanyTin && <p className="text-red-500 text-sm">{errors.parentCompanyTin}</p>}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="parentCompanyName">Parent Company Name *</Label>
                        <Input
                          id="parentCompanyName"
                          value={formData.parentCompanyName}
                          onChange={(e) => updateFormData('parentCompanyName', e.target.value)}
                          className={errors.parentCompanyName ? 'border-red-500' : ''}
                          placeholder="Enter parent company name"
                        />
                        {errors.parentCompanyName && <p className="text-red-500 text-sm">{errors.parentCompanyName}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="parentCompanyCountry">Country of residence of Parent Company</Label>
                        <Input
                          id="parentCompanyCountry"
                          value={formData.parentCompanyCountry}
                          onChange={(e) => updateFormData('parentCompanyCountry', e.target.value)}
                          placeholder="Enter parent company country"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 8: Organization Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Section 8: Organization Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isImporter"
                    checked={formData.isImporter}
                    onCheckedChange={(checked) => updateFormData('isImporter', checked)}
                  />
                  <Label htmlFor="isImporter">Is the Organization/company an Importer?</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isExporter"
                    checked={formData.isExporter}
                    onCheckedChange={(checked) => updateFormData('isExporter', checked)}
                  />
                  <Label htmlFor="isExporter">Is the Organization/Company an Exporter?</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="paysRent"
                    checked={formData.paysRent}
                    onCheckedChange={(checked) => updateFormData('paysRent', checked)}
                  />
                  <Label htmlFor="paysRent">Does the organization/Company pay rent?</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="ownsRealProperty"
                    checked={formData.ownsRealProperty}
                    onCheckedChange={(checked) => updateFormData('ownsRealProperty', checked)}
                  />
                  <Label htmlFor="ownsRealProperty">Does the organization/Company own Real Property?</Label>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="numberOfEmployees">Number of Employees</Label>
                  <Input
                    id="numberOfEmployees"
                    value={formData.numberOfEmployees}
                    onChange={(e) => updateFormData('numberOfEmployees', e.target.value)}
                    placeholder="Enter number of employees"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedAnnualTurnover">Estimated/Actual Annual Turnover (LRD)</Label>
                  <Input
                    id="estimatedAnnualTurnover"
                    value={formData.estimatedAnnualTurnover}
                    onChange={(e) => updateFormData('estimatedAnnualTurnover', e.target.value)}
                    placeholder="Enter estimated annual turnover"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedInvestmentValue">Estimated/Actual Value of Investment (LRD)</Label>
                  <Input
                    id="estimatedInvestmentValue"
                    value={formData.estimatedInvestmentValue}
                    onChange={(e) => updateFormData('estimatedInvestmentValue', e.target.value)}
                    placeholder="Enter estimated investment value"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimatedImportExportValue">Estimated/Actual Value of Import/Export (LRD)</Label>
                  <Input
                    id="estimatedImportExportValue"
                    value={formData.estimatedImportExportValue}
                    onChange={(e) => updateFormData('estimatedImportExportValue', e.target.value)}
                    placeholder="Enter estimated import/export value"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sharesAuthorized">Number of Shares Authorized</Label>
                <Input
                  id="sharesAuthorized"
                  value={formData.sharesAuthorized}
                  onChange={(e) => updateFormData('sharesAuthorized', e.target.value)}
                  placeholder="Enter number of shares authorized"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sharesIssued">Number of Shares Issued</Label>
                <Input
                  id="sharesIssued"
                  value={formData.sharesIssued}
                  onChange={(e) => updateFormData('sharesIssued', e.target.value)}
                  placeholder="Enter number of shares issued"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 9: Economic Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Section 9: Economic Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.economicActivities.map((activity: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Economic Activity {index + 1}</h4>
                  {formData.economicActivities.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('economicActivities', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>ISIC Code (Official Use)</Label>
                    <Input
                      value={activity.isicCode}
                      onChange={(e) => updateArrayItem('economicActivities', index, 'isicCode', e.target.value)}
                      placeholder="ISIC Code"
                      disabled
                      className="bg-gray-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Main Activity</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={activity.isMain}
                        onCheckedChange={(checked) => updateArrayItem('economicActivities', index, 'isMain', checked)}
                      />
                      <Label>This is the main activity</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Business Activity Description</Label>
                  <Textarea
                    value={activity.description}
                    onChange={(e) => updateArrayItem('economicActivities', index, 'description', e.target.value)}
                    placeholder="Describe the business activity"
                    rows={3}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('economicActivities', { isicCode: '', description: '', isMain: false })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Economic Activity
            </Button>
          </CardContent>
        </Card>

        {/* Section 10: Existing related Organization/Company */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Section 10: Existing related Organization/Company
            </CardTitle>
            <p className="text-sm text-gray-600">Excluding Parent-Subsidiary Relationship</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.relatedEntities.map((entity: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Related Entity {index + 1}</h4>
                  {formData.relatedEntities.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('relatedEntities', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Entity TIN</Label>
                    <Input
                      value={entity.entityTin}
                      onChange={(e) => updateArrayItem('relatedEntities', index, 'entityTin', e.target.value)}
                      placeholder="Enter entity TIN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Entity Name</Label>
                    <Input
                      value={entity.entityName}
                      onChange={(e) => updateArrayItem('relatedEntities', index, 'entityName', e.target.value)}
                      placeholder="Enter entity name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date of Relationship</Label>
                    <Input
                      type="date"
                      value={entity.startDate}
                      onChange={(e) => updateArrayItem('relatedEntities', index, 'startDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('relatedEntities', { entityTin: '', entityName: '', startDate: '' })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Related Entity
            </Button>
          </CardContent>
        </Card>

        {/* Section 11: Directors Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Section 11: Directors Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.directors.map((director: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Director {index + 1}</h4>
                  {formData.directors.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('directors', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>TIN</Label>
                    <Input
                      value={director.tin}
                      onChange={(e) => updateArrayItem('directors', index, 'tin', e.target.value)}
                      placeholder="Enter TIN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Residence Status</Label>
                    <Select 
                      value={director.residenceStatus} 
                      onValueChange={(value) => updateArrayItem('directors', index, 'residenceStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select residence status" />
                      </SelectTrigger>
                      <SelectContent>
                        {residenceStatusOptions.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input
                      value={director.firstName}
                      onChange={(e) => updateArrayItem('directors', index, 'firstName', e.target.value)}
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Middle Name</Label>
                    <Input
                      value={director.middleName}
                      onChange={(e) => updateArrayItem('directors', index, 'middleName', e.target.value)}
                      placeholder="Enter middle name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input
                      value={director.lastName}
                      onChange={(e) => updateArrayItem('directors', index, 'lastName', e.target.value)}
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={director.position}
                    onChange={(e) => updateArrayItem('directors', index, 'position', e.target.value)}
                    placeholder="Enter position"
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('directors', { tin: '', residenceStatus: '', firstName: '', middleName: '', lastName: '', position: '' })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Director
            </Button>
          </CardContent>
        </Card>

        {/* Section 12: Shareholders/Partners Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Section 12: Shareholders/Partners Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.shareholders.map((shareholder: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Shareholder/Partner {index + 1}</h4>
                  {formData.shareholders.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('shareholders', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>TIN</Label>
                    <Input
                      value={shareholder.tin}
                      onChange={(e) => updateArrayItem('shareholders', index, 'tin', e.target.value)}
                      placeholder="Enter TIN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Residence Status</Label>
                    <Select 
                      value={shareholder.residenceStatus} 
                      onValueChange={(value) => updateArrayItem('shareholders', index, 'residenceStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select residence status" />
                      </SelectTrigger>
                      <SelectContent>
                        {residenceStatusOptions.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={shareholder.fullName}
                      onChange={(e) => updateArrayItem('shareholders', index, 'fullName', e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Percentage of Shares (Profit/Loss Ratio)</Label>
                    <Input
                      value={shareholder.percentageShares}
                      onChange={(e) => updateArrayItem('shareholders', index, 'percentageShares', e.target.value)}
                      placeholder="Enter percentage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={shareholder.startDate}
                      onChange={(e) => updateArrayItem('shareholders', index, 'startDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('shareholders', { tin: '', residenceStatus: '', fullName: '', percentageShares: '', startDate: '' })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Shareholder/Partner
            </Button>
          </CardContent>
        </Card>

        {/* Section 13: Beneficiary Owners */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Section 13: Beneficiary Owners
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.beneficiaryOwners.map((owner: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Beneficiary Owner {index + 1}</h4>
                  {formData.beneficiaryOwners.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeArrayItem('beneficiaryOwners', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>TIN</Label>
                    <Input
                      value={owner.tin}
                      onChange={(e) => updateArrayItem('beneficiaryOwners', index, 'tin', e.target.value)}
                      placeholder="Enter TIN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={owner.fullName}
                      onChange={(e) => updateArrayItem('beneficiaryOwners', index, 'fullName', e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Passport No.</Label>
                    <Input
                      value={owner.passportNo}
                      onChange={(e) => updateArrayItem('beneficiaryOwners', index, 'passportNo', e.target.value)}
                      placeholder="Enter passport number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tax Residency</Label>
                    <Input
                      value={owner.taxResidency}
                      onChange={(e) => updateArrayItem('beneficiaryOwners', index, 'taxResidency', e.target.value)}
                      placeholder="Enter tax residency"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nationality</Label>
                    <Input
                      value={owner.nationality}
                      onChange={(e) => updateArrayItem('beneficiaryOwners', index, 'nationality', e.target.value)}
                      placeholder="Enter nationality"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Percentage of share/interest held directly/indirectly</Label>
                    <Input
                      value={owner.percentageHeld}
                      onChange={(e) => updateArrayItem('beneficiaryOwners', index, 'percentageHeld', e.target.value)}
                      placeholder="Enter percentage"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('beneficiaryOwners', { tin: '', fullName: '', passportNo: '', taxResidency: '', nationality: '', percentageHeld: '' })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Beneficiary Owner
            </Button>
          </CardContent>
        </Card>

        {/* Section 14: Associates Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Section 14: Associates Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.associates.map((associate: any, index: number) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Associate {index + 1}</h4>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() => addArrayItem('associates', { tin: '', fullName: '', residenceStatus: '' })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Associate
            </Button>
          </CardContent>
        </Card>

        {/* Section 15: Agent/Representative */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Section 15: Agent/Representative
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="hasRepresentative"
                checked={formData.hasRepresentative}
                onCheckedChange={(checked) => updateFormData('hasRepresentative', checked)}
              />
              <Label htmlFor="hasRepresentative">Do you have a representative/Agent?</Label>
            </div>

            {formData.hasRepresentative && (
              <>
                {/* Application Representative */}
                <div className="space-y-4">
                  <h4 className="font-medium">Representative to submit any application on behalf of Taxpayer</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Representative TIN</Label>
                      <Input
                        value={formData.applicationRepresentative.tin}
                        onChange={(e) => updateFormData('applicationRepresentative', { ...formData.applicationRepresentative, tin: e.target.value })}
                        placeholder="Enter representative TIN"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={formData.applicationRepresentative.name}
                        onChange={(e) => updateFormData('applicationRepresentative', { ...formData.applicationRepresentative, name: e.target.value })}
                        placeholder="Enter representative name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Telephone No.</Label>
                      <Input
                        value={formData.applicationRepresentative.telephone}
                        onChange={(e) => updateFormData('applicationRepresentative', { ...formData.applicationRepresentative, telephone: e.target.value })}
                        placeholder="Enter telephone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={formData.applicationRepresentative.email}
                        onChange={(e) => updateFormData('applicationRepresentative', { ...formData.applicationRepresentative, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Authorization Date From</Label>
                      <Input
                        type="date"
                        value={formData.applicationRepresentative.authDateFrom}
                        onChange={(e) => updateFormData('applicationRepresentative', { ...formData.applicationRepresentative, authDateFrom: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Authorization Date To</Label>
                      <Input
                        type="date"
                        value={formData.applicationRepresentative.authDateTo}
                        onChange={(e) => updateFormData('applicationRepresentative', { ...formData.applicationRepresentative, authDateTo: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Returns Representative */}
                <div className="space-y-4">
                  <h4 className="font-medium">Representative/Agent to submit Returns on behalf of Taxpayer</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Representative TIN</Label>
                      <Input
                        value={formData.returnsRepresentative.tin}
                        onChange={(e) => updateFormData('returnsRepresentative', { ...formData.returnsRepresentative, tin: e.target.value })}
                        placeholder="Enter representative TIN"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={formData.returnsRepresentative.name}
                        onChange={(e) => updateFormData('returnsRepresentative', { ...formData.returnsRepresentative, name: e.target.value })}
                        placeholder="Enter representative name"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Telephone No.</Label>
                      <Input
                        value={formData.returnsRepresentative.telephone}
                        onChange={(e) => updateFormData('returnsRepresentative', { ...formData.returnsRepresentative, telephone: e.target.value })}
                        placeholder="Enter telephone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={formData.returnsRepresentative.email}
                        onChange={(e) => updateFormData('returnsRepresentative', { ...formData.returnsRepresentative, email: e.target.value })}
                        placeholder="Enter email address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tax Type</Label>
                      <Input
                        value={formData.returnsRepresentative.taxType}
                        onChange={(e) => updateFormData('returnsRepresentative', { ...formData.returnsRepresentative, taxType: e.target.value })}
                        placeholder="All, Income Tax etc"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Authorization Date From</Label>
                      <Input
                        type="date"
                        value={formData.returnsRepresentative.authDateFrom}
                        onChange={(e) => updateFormData('returnsRepresentative', { ...formData.returnsRepresentative, authDateFrom: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Authorization Date To</Label>
                      <Input
                        type="date"
                        value={formData.returnsRepresentative.authDateTo}
                        onChange={(e) => updateFormData('returnsRepresentative', { ...formData.returnsRepresentative, authDateTo: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Section 16: Bank Account */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Section 16: Bank Account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="declareBankAccount"
                checked={formData.declareBankAccount}
                onCheckedChange={(checked) => updateFormData('declareBankAccount', checked)}
              />
              <Label htmlFor="declareBankAccount">Do you wish to declare your Bank Account for tax refunds?</Label>
            </div>

            {formData.declareBankAccount && (
              <div className="space-y-4">
                <h4 className="font-medium">Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      value={formData.accountNumber}
                      onChange={(e) => updateFormData('accountNumber', e.target.value)}
                      className={errors.accountNumber ? 'border-red-500' : ''}
                      placeholder="Enter account number"
                    />
                    {errors.accountNumber && <p className="text-red-500 text-sm">{errors.accountNumber}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName">Account Holder Name *</Label>
                    <Input
                      id="accountHolderName"
                      value={formData.accountHolderName}
                      onChange={(e) => updateFormData('accountHolderName', e.target.value)}
                      className={errors.accountHolderName ? 'border-red-500' : ''}
                      placeholder="Enter account holder name"
                    />
                    {errors.accountHolderName && <p className="text-red-500 text-sm">{errors.accountHolderName}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank *</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName}
                      onChange={(e) => updateFormData('bankName', e.target.value)}
                      className={errors.bankName ? 'border-red-500' : ''}
                      placeholder="Enter bank name"
                    />
                    {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankBranch">Branch</Label>
                    <Input
                      id="bankBranch"
                      value={formData.bankBranch}
                      onChange={(e) => updateFormData('bankBranch', e.target.value)}
                      placeholder="Enter branch name"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 17: Certification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Section 17: Certification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certFirstName">First Name *</Label>
                <Input
                  id="certFirstName"
                  value={formData.certFirstName}
                  onChange={(e) => updateFormData('certFirstName', e.target.value)}
                  className={errors.certFirstName ? 'border-red-500' : ''}
                  placeholder="Enter first name"
                />
                {errors.certFirstName && <p className="text-red-500 text-sm">{errors.certFirstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="certMiddleName">Middle Name</Label>
                <Input
                  id="certMiddleName"
                  value={formData.certMiddleName}
                  onChange={(e) => updateFormData('certMiddleName', e.target.value)}
                  placeholder="Enter middle name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="certLastName">Last Name *</Label>
                <Input
                  id="certLastName"
                  value={formData.certLastName}
                  onChange={(e) => updateFormData('certLastName', e.target.value)}
                  className={errors.certLastName ? 'border-red-500' : ''}
                  placeholder="Enter last name"
                />
                {errors.certLastName && <p className="text-red-500 text-sm">{errors.certLastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="certPosition">Position *</Label>
                <Input
                  id="certPosition"
                  value={formData.certPosition}
                  onChange={(e) => updateFormData('certPosition', e.target.value)}
                  className={errors.certPosition ? 'border-red-500' : ''}
                  placeholder="Enter position"
                />
                {errors.certPosition && <p className="text-red-500 text-sm">{errors.certPosition}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="certDate">Date *</Label>
                <Input
                  id="certDate"
                  type="date"
                  value={formData.certDate}
                  onChange={(e) => updateFormData('certDate', e.target.value)}
                  className={errors.certDate ? 'border-red-500' : ''}
                />
                {errors.certDate && <p className="text-red-500 text-sm">{errors.certDate}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="certSignature">Signature *</Label>
              <Input
                id="certSignature"
                value={formData.certSignature}
                onChange={(e) => updateFormData('certSignature', e.target.value)}
                className={errors.certSignature ? 'border-red-500' : ''}
                placeholder="Enter signature"
              />
              {errors.certSignature && <p className="text-red-500 text-sm">{errors.certSignature}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 min-w-[120px]"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            {isSubmitting ? 'Submitting...' : 'Continue'}
          </Button>
        </div>
      </form>
    </div>
  );
}