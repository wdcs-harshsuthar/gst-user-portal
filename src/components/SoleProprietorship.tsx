import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, ArrowRight, User, Plus, Trash2, Sparkles } from 'lucide-react';
import { BUILDING_TYPES, LIBERIAN_COUNTIES } from './shared/constants';
import { DUMMY_SOLE_PROPRIETORSHIP_DATA } from './shared/dummyData';

interface SoleProprietorshipProps {
  initialData?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function SoleProprietorship({ initialData, onComplete, onBack }: SoleProprietorshipProps) {
  const [formData, setFormData] = useState({
    oldTin: '',
    registeredName: '',
    tradeName: '',
    registrationDate: '',
    businessRegNumber: '',
    nassCorpNumber: '',
    taxStartDate: '',
    taxCloseDate: '',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    streetAddress: '',
    landmark: '',
    city: '',
    district: '',
    county: '',
    buildingType: '',
    paysRent: false,
    rentAmount: '',
    numberOfEmployees: '',
    businessActivityDescription: '',
    mainActivity: '',
    businessLicenses: [{ number: '', type: '', startDate: '', endDate: '' }],
    bankName: '',
    accountNumber: '',
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.registeredName.trim()) newErrors.registeredName = 'Registered name is required';
    if (!formData.businessRegNumber.trim()) newErrors.businessRegNumber = 'Business registration number is required';
    if (!formData.streetAddress.trim()) newErrors.streetAddress = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.county.trim()) newErrors.county = 'County is required';
    if (!formData.buildingType) newErrors.buildingType = 'Building type is required';
    if (!formData.mainActivity.trim()) newErrors.mainActivity = 'Main activity is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }));
    }
  };

  const fillSampleData = () => {
    setFormData((prev: any) => ({ ...prev, ...DUMMY_SOLE_PROPRIETORSHIP_DATA }));
    setErrors({});
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
      businessLicenses: prev.businessLicenses.filter((_: any, i: number) => i !== index)
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl">Sole Proprietorship Registration (Form SP01)</h2>
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

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="oldTin">Old TIN (if applicable)</Label>
            <Input
              id="oldTin"
              value={formData.oldTin}
              onChange={(e) => updateFormData('oldTin', e.target.value)}
              placeholder="Enter existing TIN number"
            />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registrationDate">Registration Date</Label>
              <Input
                id="registrationDate"
                type="date"
                value={formData.registrationDate}
                onChange={(e) => updateFormData('registrationDate', e.target.value)}
              />
            </div>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxStartDate">Tax Start Date</Label>
              <Input
                id="taxStartDate"
                type="date"
                value={formData.taxStartDate}
                onChange={(e) => updateFormData('taxStartDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxCloseDate">Tax Close Date</Label>
              <Input
                id="taxCloseDate"
                type="date"
                value={formData.taxCloseDate}
                onChange={(e) => updateFormData('taxCloseDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Person */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Person (if other than owner)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPersonName">Contact Person Name</Label>
              <Input
                id="contactPersonName"
                value={formData.contactPersonName}
                onChange={(e) => updateFormData('contactPersonName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPersonPhone">Phone Number</Label>
              <Input
                id="contactPersonPhone"
                value={formData.contactPersonPhone}
                onChange={(e) => updateFormData('contactPersonPhone', e.target.value)}
                placeholder="+231-XXX-XXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPersonEmail">Email Address</Label>
              <Input
                id="contactPersonEmail"
                type="email"
                value={formData.contactPersonEmail}
                onChange={(e) => updateFormData('contactPersonEmail', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Address</CardTitle>
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
        </CardContent>
      </Card>

      {/* Building Information */}
      <Card>
        <CardHeader>
          <CardTitle>Building Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buildingType">Building Type *</Label>
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
              <Label htmlFor="numberOfEmployees">Number of Employees</Label>
              <Input
                id="numberOfEmployees"
                type="number"
                value={formData.numberOfEmployees}
                onChange={(e) => updateFormData('numberOfEmployees', e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="paysRent"
                checked={formData.paysRent}
                onCheckedChange={(checked) => updateFormData('paysRent', checked)}
              />
              <Label htmlFor="paysRent">Pays rent for business premises</Label>
            </div>

            {formData.paysRent && (
              <div className="space-y-2 ml-6">
                <Label htmlFor="rentAmount">Monthly Rent Amount (LRD)</Label>
                <Input
                  id="rentAmount"
                  type="number"
                  value={formData.rentAmount}
                  onChange={(e) => updateFormData('rentAmount', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Business Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Business Activity Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="businessActivityDescription">Business Activity Description</Label>
            <Textarea
              id="businessActivityDescription"
              value={formData.businessActivityDescription}
              onChange={(e) => updateFormData('businessActivityDescription', e.target.value)}
              placeholder="Describe your business activities in detail"
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

      {/* Bank Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Account Information (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                value={formData.accountNumber}
                onChange={(e) => updateFormData('accountNumber', e.target.value)}
              />
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
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}