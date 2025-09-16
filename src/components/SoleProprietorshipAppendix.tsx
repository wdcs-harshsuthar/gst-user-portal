import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, ArrowRight, Store, Plus, Trash2, Sparkles, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { 
  BUILDING_TYPES, 
  LIBERIAN_COUNTIES 
} from './shared/constants';

interface BusinessLicense {
  number: string;
  type: string;
  startDate: string;
  endDate: string;
}

interface SoleProprietorshipAppendixProps {
  initialData?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function SoleProprietorshipAppendix({ initialData, onComplete, onBack }: SoleProprietorshipAppendixProps) {
  const [formData, setFormData] = useState({
    // OWNER & COMPANY
    isMainCompany: initialData?.isMainCompany ?? null,
    oldCompanyTins: initialData?.oldCompanyTins || ['', '', ''],
    registeredName: initialData?.registeredName || '',
    mainTradeName: initialData?.mainTradeName || '',
    registrationDate: initialData?.registrationDate || '',
    businessRegNumber: initialData?.businessRegNumber || '',
    employerNassCorpNumber: initialData?.employerNassCorpNumber || '',
    taxStartDate: initialData?.taxStartDate || '',
    taxCloseDate: initialData?.taxCloseDate || '',
    
    // COMPANY CONTACT
    contactFullName: initialData?.contactFullName || '',
    contactMobilePhone: initialData?.contactMobilePhone || '',
    contactEmail: initialData?.contactEmail || '',
    
    // MAIN ADDRESS
    streetAndHouseNumber: initialData?.streetAndHouseNumber || '',
    locationDescription: initialData?.locationDescription || '',
    cityVillageTown: initialData?.cityVillageTown || '',
    district: initialData?.district || '',
    county: initialData?.county || '',
    country: initialData?.country || 'Liberia',
    poBox: initialData?.poBox || '',
    buildingType: initialData?.buildingType || '',
    payingRent: initialData?.payingRent ?? null,
    numberOfEmployees: initialData?.numberOfEmployees || '',
    
    // BUSINESS ACTIVITY & LICENSE
    businessActivityCode: initialData?.businessActivityCode || '',
    businessActivityDescription: initialData?.businessActivityDescription || '',
    mainActivities: initialData?.mainActivities || [
      { description: '', selected: false },
      { description: '', selected: false },
      { description: '', selected: false }
    ],
    businessLicenses: initialData?.businessLicenses || [
      { number: '', type: '', startDate: '', endDate: '' },
      { number: '', type: '', startDate: '', endDate: '' },
      { number: '', type: '', startDate: '', endDate: '' }
    ] as BusinessLicense[],
    
    // BANK ACCOUNT INFORMATION
    bankAccountNumber: initialData?.bankAccountNumber || '',
    bankAccountHolder: initialData?.bankAccountHolder || '',
    bankName: initialData?.bankName || '',
    bankBranchAddress: initialData?.bankBranchAddress || '',
    
    // CERTIFICATION
    cfoFullName: initialData?.cfoFullName || '',
    cfoSignature: initialData?.cfoSignature || '',
    cfoDate: initialData?.cfoDate || '',
    cfoTelephone: initialData?.cfoTelephone || '',
    ceoFullName: initialData?.ceoFullName || '',
    ceoSignature: initialData?.ceoSignature || '',
    ceoDate: initialData?.ceoDate || '',
    ceoTelephone: initialData?.ceoTelephone || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const fillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      isMainCompany: true,
      registeredName: 'TechSolutions Sole Proprietorship',
      mainTradeName: 'TechSolutions',
      registrationDate: '2024-01-15',
      businessRegNumber: 'SP-2024-001234',
      employerNassCorpNumber: 'NASS-SP-2024-5678',
      taxStartDate: '2024-02-01',
      contactFullName: 'John K. Marwolo',
      contactMobilePhone: '+231-555-0100',
      contactEmail: 'john@techsolutions.lr',
      streetAndHouseNumber: '15th Street, Sinkor',
      locationDescription: 'Near Bella Casa Hotel',
      cityVillageTown: 'Monrovia',
      district: 'Greater Monrovia',
      county: 'Montserrado',
      country: 'Liberia',
      buildingType: 'commercial',
      payingRent: true,
      numberOfEmployees: '5',
      businessActivityDescription: 'Technology consulting and software development services',
      cfoFullName: 'John K. Marwolo',
      cfoSignature: 'John K. Marwolo',
      cfoTelephone: '+231-555-0100',
      cfoDate: new Date().toISOString().split('T')[0],
      ceoFullName: 'John K. Marwolo',
      ceoSignature: 'John K. Marwolo',
      ceoTelephone: '+231-555-0100',
      ceoDate: new Date().toISOString().split('T')[0]
    }));
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required field validations
    if (formData.isMainCompany === null) newErrors.isMainCompany = 'Main company field is required';
    if (!formData.registeredName.trim()) newErrors.registeredName = 'Registered name is required';
    if (!formData.mainTradeName.trim()) newErrors.mainTradeName = 'Main trade name is required';
    if (!formData.taxStartDate) newErrors.taxStartDate = 'Tax start date is required';
    if (!formData.streetAndHouseNumber.trim()) newErrors.streetAndHouseNumber = 'Street and house number is required';
    if (!formData.locationDescription.trim()) newErrors.locationDescription = 'Location description is required';
    if (!formData.cityVillageTown.trim()) newErrors.cityVillageTown = 'City/Village/Town is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.county.trim()) newErrors.county = 'County is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.buildingType) newErrors.buildingType = 'Building type is required';
    if (formData.payingRent === null) newErrors.payingRent = 'Paying rent field is required';
    if (!formData.businessActivityDescription.trim()) newErrors.businessActivityDescription = 'Business activity description is required';
    if (!formData.cfoFullName.trim()) newErrors.cfoFullName = 'CFO full name is required';
    if (!formData.cfoSignature.trim()) newErrors.cfoSignature = 'CFO signature is required';
    if (!formData.cfoDate) newErrors.cfoDate = 'CFO date is required';
    if (!formData.cfoTelephone.trim()) newErrors.cfoTelephone = 'CFO telephone is required';
    if (!formData.ceoFullName.trim()) newErrors.ceoFullName = 'CEO full name is required';
    if (!formData.ceoSignature.trim()) newErrors.ceoSignature = 'CEO signature is required';
    if (!formData.ceoDate) newErrors.ceoDate = 'CEO date is required';
    if (!formData.ceoTelephone.trim()) newErrors.ceoTelephone = 'CEO telephone is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    }
  };

  // Business License Management
  const updateBusinessLicense = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      businessLicenses: prev.businessLicenses.map((license, i) => 
        i === index ? { ...license, [field]: value } : license
      )
    }));
  };

  // Main Activity Management
  const updateMainActivity = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      mainActivities: prev.mainActivities.map((activity, i) => 
        i === index ? { ...activity, [field]: value } : activity
      )
    }));
  };

  // Old TIN Management
  const updateOldCompanyTin = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      oldCompanyTins: prev.oldCompanyTins.map((tin, i) => i === index ? value : tin)
    }));
  };

  return (
    <div className="w-full p-[0px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Store className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl">SP01 Sole Proprietorship Appendix</h2>
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

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>SP01 Sole Proprietorship Appendix:</strong><br />
          This form should be completed by individuals with Sole Proprietorship businesses. 
          All required fields are marked with an asterisk (*). This appendix will be attached to your IN01 form.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* OWNER & COMPANY */}
        <Card>
          <CardHeader>
            <CardTitle>Section 1: Owner & Company</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Main Company */}
            <div className="space-y-4">
              <Label>1a. Main Company *</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="mainCompanyYes"
                    name="mainCompany"
                    checked={formData.isMainCompany === true}
                    onChange={() => updateFormData('isMainCompany', true)}
                  />
                  <Label htmlFor="mainCompanyYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="mainCompanyNo"
                    name="mainCompany"
                    checked={formData.isMainCompany === false}
                    onChange={() => updateFormData('isMainCompany', false)}
                  />
                  <Label htmlFor="mainCompanyNo">No</Label>
                </div>
              </div>
              {errors.isMainCompany && <p className="text-red-500 text-sm">{errors.isMainCompany}</p>}
            </div>

            <Separator />

            {/* Old Company TINs */}
            <div className="space-y-4">
              <Label>1b. Old Company TIN (if you had more than one TIN, list all TINs under which your business operates)</Label>
              <div className="space-y-2">
                {[0, 1, 2].map((index) => (
                  <div key={index} className="space-y-2">
                    <Label>TIN {index + 1}</Label>
                    <Input
                      value={formData.oldCompanyTins[index]}
                      onChange={(e) => updateOldCompanyTin(index, e.target.value)}
                      placeholder={`Old TIN ${index + 1} (if applicable)`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Names and Registration Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registeredName">1c. Registered Name *</Label>
                <Input
                  id="registeredName"
                  value={formData.registeredName}
                  onChange={(e) => updateFormData('registeredName', e.target.value)}
                  className={errors.registeredName ? 'border-red-500' : ''}
                />
                {errors.registeredName && <p className="text-red-500 text-sm">{errors.registeredName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainTradeName">1d. Main Trade Name *</Label>
                <Input
                  id="mainTradeName"
                  value={formData.mainTradeName}
                  onChange={(e) => updateFormData('mainTradeName', e.target.value)}
                  className={errors.mainTradeName ? 'border-red-500' : ''}
                />
                {errors.mainTradeName && <p className="text-red-500 text-sm">{errors.mainTradeName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationDate">1e. Registration Date (mm/dd/yyyy)</Label>
                <Input
                  id="registrationDate"
                  type="date"
                  value={formData.registrationDate}
                  onChange={(e) => updateFormData('registrationDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessRegNumber">1f. Business Reg. #</Label>
                <Input
                  id="businessRegNumber"
                  value={formData.businessRegNumber}
                  onChange={(e) => updateFormData('businessRegNumber', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employerNassCorpNumber">1g. Employer NASSCORP #</Label>
                <Input
                  id="employerNassCorpNumber"
                  value={formData.employerNassCorpNumber}
                  onChange={(e) => updateFormData('employerNassCorpNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxStartDate">1h. Tax Start Date * (mm/dd/yyyy)</Label>
                <Input
                  id="taxStartDate"
                  type="date"
                  value={formData.taxStartDate}
                  onChange={(e) => updateFormData('taxStartDate', e.target.value)}
                  className={errors.taxStartDate ? 'border-red-500' : ''}
                />
                {errors.taxStartDate && <p className="text-red-500 text-sm">{errors.taxStartDate}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxCloseDate">1i. Tax Close Date (mm/dd/yyyy)</Label>
              <Input
                id="taxCloseDate"
                type="date"
                value={formData.taxCloseDate}
                onChange={(e) => updateFormData('taxCloseDate', e.target.value)}
                className="md:w-1/2"
              />
            </div>
          </CardContent>
        </Card>

        {/* COMPANY CONTACT */}
        <Card>
          <CardHeader>
            <CardTitle>Section 2: Company Contact (If Other Than Owner)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactFullName">2a. Contact Full Name</Label>
                <Input
                  id="contactFullName"
                  value={formData.contactFullName}
                  onChange={(e) => updateFormData('contactFullName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactMobilePhone">2b. Mobile/Phone #</Label>
                <Input
                  id="contactMobilePhone"
                  value={formData.contactMobilePhone}
                  onChange={(e) => updateFormData('contactMobilePhone', e.target.value)}
                  placeholder="+231-XXX-XXXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactEmail">2c. E-mail</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => updateFormData('contactEmail', e.target.value)}
                  placeholder="contact@company.lr"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* MAIN ADDRESS */}
        <Card>
          <CardHeader>
            <CardTitle>Section 3: Main Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="streetAndHouseNumber">3a. Street and House # * (If Applicable)</Label>
                <Input
                  id="streetAndHouseNumber"
                  value={formData.streetAndHouseNumber}
                  onChange={(e) => updateFormData('streetAndHouseNumber', e.target.value)}
                  className={errors.streetAndHouseNumber ? 'border-red-500' : ''}
                />
                {errors.streetAndHouseNumber && <p className="text-red-500 text-sm">{errors.streetAndHouseNumber}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="locationDescription">3b. Clear Description of Location *</Label>
                <Input
                  id="locationDescription"
                  value={formData.locationDescription}
                  onChange={(e) => updateFormData('locationDescription', e.target.value)}
                  className={errors.locationDescription ? 'border-red-500' : ''}
                />
                {errors.locationDescription && <p className="text-red-500 text-sm">{errors.locationDescription}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cityVillageTown">3c. City/Village/Town *</Label>
                <Input
                  id="cityVillageTown"
                  value={formData.cityVillageTown}
                  onChange={(e) => updateFormData('cityVillageTown', e.target.value)}
                  className={errors.cityVillageTown ? 'border-red-500' : ''}
                />
                {errors.cityVillageTown && <p className="text-red-500 text-sm">{errors.cityVillageTown}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">3d. District *</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => updateFormData('district', e.target.value)}
                  className={errors.district ? 'border-red-500' : ''}
                />
                {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="county">3e. County *</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">3f. Country *</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => updateFormData('country', e.target.value)}
                  className={errors.country ? 'border-red-500' : ''}
                />
                {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="poBox">3g. PO Box</Label>
                <Input
                  id="poBox"
                  value={formData.poBox}
                  onChange={(e) => updateFormData('poBox', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buildingType">3h. Type of Building Where Business is Located * (select 1 only)</Label>
                <Select 
                  value={formData.buildingType} 
                  onValueChange={(value) => updateFormData('buildingType', value)}
                >
                  <SelectTrigger className={errors.buildingType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select building type" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUILDING_TYPES.map(buildingType => (
                      <SelectItem key={buildingType.value} value={buildingType.value}>{buildingType.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.buildingType && <p className="text-red-500 text-sm">{errors.buildingType}</p>}
              </div>
              <div className="space-y-2">
                <Label>3i. Do You Pay Rent? *</Label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="payingRentYes"
                      name="payingRent"
                      checked={formData.payingRent === true}
                      onChange={() => updateFormData('payingRent', true)}
                    />
                    <Label htmlFor="payingRentYes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="payingRentNo"
                      name="payingRent"
                      checked={formData.payingRent === false}
                      onChange={() => updateFormData('payingRent', false)}
                    />
                    <Label htmlFor="payingRentNo">No</Label>
                  </div>
                </div>
                {errors.payingRent && <p className="text-red-500 text-sm">{errors.payingRent}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfEmployees">3j. # of Employees</Label>
              <Input
                id="numberOfEmployees"
                type="number"
                value={formData.numberOfEmployees}
                onChange={(e) => updateFormData('numberOfEmployees', e.target.value)}
                placeholder="Number of employees"
                className="md:w-1/2"
              />
            </div>
          </CardContent>
        </Card>

        {/* BUSINESS ACTIVITY & LICENSE */}
        <Card>
          <CardHeader>
            <CardTitle>Section 4: Business Activity & License</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessActivityCode">Code (OFFICIAL USE)</Label>
                <Input
                  id="businessActivityCode"
                  value={formData.businessActivityCode}
                  onChange={(e) => updateFormData('businessActivityCode', e.target.value)}
                  placeholder="For official use only"
                  disabled
                  className="bg-gray-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessActivityDescription">4a. Business Activity Description *</Label>
              <Textarea
                id="businessActivityDescription"
                value={formData.businessActivityDescription}
                onChange={(e) => updateFormData('businessActivityDescription', e.target.value)}
                placeholder="Describe your business activities in detail"
                rows={4}
                className={errors.businessActivityDescription ? 'border-red-500' : ''}
              />
              {errors.businessActivityDescription && <p className="text-red-500 text-sm">{errors.businessActivityDescription}</p>}
            </div>

            <div className="space-y-4">
              <Label>4b. Main Activity * (1 only)</Label>
              <div className="space-y-3">
                {formData.mainActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="text-sm font-medium">Activity {index + 1}</span>
                    <Input
                      value={activity.description}
                      onChange={(e) => updateMainActivity(index, 'description', e.target.value)}
                      placeholder={`Main activity ${index + 1}`}
                      className="flex-1"
                    />
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={activity.selected}
                        onCheckedChange={(checked) => {
                          // Only allow one activity to be selected
                          const updatedActivities = formData.mainActivities.map((act, i) => ({
                            ...act,
                            selected: i === index ? checked : false
                          }));
                          updateFormData('mainActivities', updatedActivities);
                        }}
                      />
                      <Label className="text-sm">Yes</Label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Business Licenses */}
            <div className="space-y-4">
              <Label>4c. Business Licenses (Up to 3 licenses)</Label>
              <div className="space-y-4">
                {formData.businessLicenses.map((license, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-medium">License {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`license-number-${index}`}>Business License #</Label>
                        <Input
                          id={`license-number-${index}`}
                          value={license.number}
                          onChange={(e) => updateBusinessLicense(index, 'number', e.target.value)}
                          placeholder="License number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`license-type-${index}`}>Business License Type</Label>
                        <Input
                          id={`license-type-${index}`}
                          value={license.type}
                          onChange={(e) => updateBusinessLicense(index, 'type', e.target.value)}
                          placeholder="License type"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`license-start-${index}`}>Start Date (mm/dd/yyyy)</Label>
                        <Input
                          id={`license-start-${index}`}
                          type="date"
                          value={license.startDate}
                          onChange={(e) => updateBusinessLicense(index, 'startDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`license-end-${index}`}>End Date (mm/dd/yyyy)</Label>
                        <Input
                          id={`license-end-${index}`}
                          type="date"
                          value={license.endDate}
                          onChange={(e) => updateBusinessLicense(index, 'endDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* BANK ACCOUNT INFORMATION */}
        <Card>
          <CardHeader>
            <CardTitle>Section 5: Bank Account Information (Optional)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">5a. Account Number</Label>
                <Input
                  id="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={(e) => updateFormData('bankAccountNumber', e.target.value)}
                  placeholder="Bank account number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountHolder">5b. Account Holder</Label>
                <Input
                  id="bankAccountHolder"
                  value={formData.bankAccountHolder}
                  onChange={(e) => updateFormData('bankAccountHolder', e.target.value)}
                  placeholder="Account holder name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">5c. Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => updateFormData('bankName', e.target.value)}
                  placeholder="Bank name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankBranchAddress">5d. Branch Address</Label>
                <Input
                  id="bankBranchAddress"
                  value={formData.bankBranchAddress}
                  onChange={(e) => updateFormData('bankBranchAddress', e.target.value)}
                  placeholder="Bank branch address"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CERTIFICATION */}
        <Card>
          <CardHeader>
            <CardTitle>Section 6: Certification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 border rounded-lg p-4">
              <p className="text-sm">
                I hereby certify that the information provided in this form is true and correct to the best of my knowledge and belief. 
                I understand that providing false information is a violation of Liberian tax law and may result in penalties.
              </p>
            </div>

            {/* CFO Information */}
            <div className="space-y-4">
              <h4 className="font-medium">CFO (Chief Financial Officer)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cfoFullName">6a. CFO Full Name *</Label>
                  <Input
                    id="cfoFullName"
                    value={formData.cfoFullName}
                    onChange={(e) => updateFormData('cfoFullName', e.target.value)}
                    className={errors.cfoFullName ? 'border-red-500' : ''}
                  />
                  {errors.cfoFullName && <p className="text-red-500 text-sm">{errors.cfoFullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cfoTelephone">6d. CFO Telephone # *</Label>
                  <Input
                    id="cfoTelephone"
                    value={formData.cfoTelephone}
                    onChange={(e) => updateFormData('cfoTelephone', e.target.value)}
                    placeholder="+231-XXX-XXXX"
                    className={errors.cfoTelephone ? 'border-red-500' : ''}
                  />
                  {errors.cfoTelephone && <p className="text-red-500 text-sm">{errors.cfoTelephone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cfoSignature">6b. CFO Signature *</Label>
                  <Input
                    id="cfoSignature"
                    value={formData.cfoSignature}
                    onChange={(e) => updateFormData('cfoSignature', e.target.value)}
                    placeholder="Type full name as signature"
                    className={errors.cfoSignature ? 'border-red-500' : ''}
                  />
                  {errors.cfoSignature && <p className="text-red-500 text-sm">{errors.cfoSignature}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cfoDate">6c. CFO Date *</Label>
                  <Input
                    id="cfoDate"
                    type="date"
                    value={formData.cfoDate}
                    onChange={(e) => updateFormData('cfoDate', e.target.value)}
                    className={errors.cfoDate ? 'border-red-500' : ''}
                  />
                  {errors.cfoDate && <p className="text-red-500 text-sm">{errors.cfoDate}</p>}
                </div>
              </div>
            </div>

            <Separator />

            {/* CEO Information */}
            <div className="space-y-4">
              <h4 className="font-medium">CEO (Chief Executive Officer)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ceoFullName">6e. CEO Full Name *</Label>
                  <Input
                    id="ceoFullName"
                    value={formData.ceoFullName}
                    onChange={(e) => updateFormData('ceoFullName', e.target.value)}
                    className={errors.ceoFullName ? 'border-red-500' : ''}
                  />
                  {errors.ceoFullName && <p className="text-red-500 text-sm">{errors.ceoFullName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ceoTelephone">6h. CEO Telephone # *</Label>
                  <Input
                    id="ceoTelephone"
                    value={formData.ceoTelephone}
                    onChange={(e) => updateFormData('ceoTelephone', e.target.value)}
                    placeholder="+231-XXX-XXXX"
                    className={errors.ceoTelephone ? 'border-red-500' : ''}
                  />
                  {errors.ceoTelephone && <p className="text-red-500 text-sm">{errors.ceoTelephone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ceoSignature">6f. CEO Signature *</Label>
                  <Input
                    id="ceoSignature"
                    value={formData.ceoSignature}
                    onChange={(e) => updateFormData('ceoSignature', e.target.value)}
                    placeholder="Type full name as signature"
                    className={errors.ceoSignature ? 'border-red-500' : ''}
                  />
                  {errors.ceoSignature && <p className="text-red-500 text-sm">{errors.ceoSignature}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ceoDate">6g. CEO Date *</Label>
                  <Input
                    id="ceoDate"
                    type="date"
                    value={formData.ceoDate}
                    onChange={(e) => updateFormData('ceoDate', e.target.value)}
                    className={errors.ceoDate ? 'border-red-500' : ''}
                  />
                  {errors.ceoDate && <p className="text-red-500 text-sm">{errors.ceoDate}</p>}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Individual Registration
          </Button>

          <Button
            type="submit"
            className="flex items-center gap-2"
          >
            Continue to Property Declaration
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}