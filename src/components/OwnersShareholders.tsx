import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { ArrowLeft, ArrowRight, Building2, Plus, Trash2, Sparkles } from 'lucide-react';
import { REGISTRATION_REASONS } from './shared/constants';
import { DUMMY_OWNERS_SHAREHOLDERS_DATA } from './shared/dummyData';

interface Owner {
  tin: string;
  fullName: string;
  startDate: string;
  endDate: string;
  numberOfShares: string;
  percentageOfShares: string;
}

interface OwnersShareholdersProps {
  initialData?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function OwnersShareholders({ initialData, onComplete, onBack }: OwnersShareholdersProps) {
  const [formData, setFormData] = useState({
    reason: 'new',
    existingTin: '',
    registeredName: '',
    tradeName: '',
    businessRegNumber: '',
    registrationDate: '',
    streetAddress: '',
    landmark: '',
    city: '',
    district: '',
    county: '',
    country: 'Liberia',
    poBox: '',
    email: '',
    phone: '',
    alternatePhone: '',
    owners: [
      { tin: '', fullName: '', startDate: '', endDate: '', numberOfShares: '', percentageOfShares: '' }
    ] as Owner[],
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
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

    // Validate at least one owner with complete information
    const validOwners = formData.owners.filter((owner: Owner) => 
      owner.fullName.trim() && owner.numberOfShares.trim() && owner.percentageOfShares.trim()
    );
    if (validOwners.length === 0) {
      newErrors.owners = 'At least one owner with complete information is required';
    }

    // Validate percentage totals
    const totalPercentage = formData.owners.reduce((sum, owner: Owner) => {
      const percentage = parseFloat(owner.percentageOfShares) || 0;
      return sum + percentage;
    }, 0);

    if (validOwners.length > 0 && Math.abs(totalPercentage - 100) > 0.01) {
      newErrors.percentage = 'Total percentage of shares must equal 100%';
    }

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
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const fillSampleData = () => {
    setFormData(prev => ({ ...prev, ...DUMMY_OWNERS_SHAREHOLDERS_DATA }));
    setErrors({});
  };

  const addOwner = () => {
    if (formData.owners.length < 10) {
      setFormData(prev => ({
        ...prev,
        owners: [...prev.owners, { tin: '', fullName: '', startDate: '', endDate: '', numberOfShares: '', percentageOfShares: '' }]
      }));
    }
  };

  const removeOwner = (index: number) => {
    if (formData.owners.length > 1) {
      setFormData(prev => ({
        ...prev,
        owners: prev.owners.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOwner = (index: number, field: keyof Owner, value: string) => {
    setFormData(prev => ({
      ...prev,
      owners: prev.owners.map((owner, i) => 
        i === index ? { ...owner, [field]: value } : owner
      )
    }));
    
    // Clear errors when updating owners
    if (errors.owners || errors.percentage) {
      setErrors(prev => ({ ...prev, owners: '', percentage: '' }));
    }
  };

  const getTotalPercentage = () => {
    return formData.owners.reduce((sum, owner: Owner) => {
      const percentage = parseFloat(owner.percentageOfShares) || 0;
      return sum + percentage;
    }, 0);
  };

  const getTotalShares = () => {
    return formData.owners.reduce((sum, owner: Owner) => {
      const shares = parseInt(owner.numberOfShares) || 0;
      return sum + shares;
    }, 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl">Owners & Shareholders (Form OS01)</h2>
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
            <div className="space-y-2">
              <Label htmlFor="existingTin">Existing TIN Number</Label>
              <Input
                id="existingTin"
                value={formData.existingTin}
                onChange={(e) => updateFormData('existingTin', e.target.value)}
                placeholder="Enter existing TIN number"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organization Information */}
      <Card>
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
              <Label htmlFor="registrationDate">Registration Date</Label>
              <Input
                id="registrationDate"
                type="date"
                value={formData.registrationDate}
                onChange={(e) => updateFormData('registrationDate', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
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
              <Input
                id="county"
                value={formData.county}
                onChange={(e) => updateFormData('county', e.target.value)}
                className={errors.county ? 'border-red-500' : ''}
              />
              {errors.county && <p className="text-red-500 text-sm">{errors.county}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
              />
            </div>
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
              <Label htmlFor="alternatePhone">Alternate Phone</Label>
              <Input
                id="alternatePhone"
                value={formData.alternatePhone}
                onChange={(e) => updateFormData('alternatePhone', e.target.value)}
                placeholder="+231-XXX-XXXX"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owners Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Owners/Shareholders Information
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addOwner}
              disabled={formData.owners.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Owner
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {errors.owners && <p className="text-red-500 text-sm">{errors.owners}</p>}
          {errors.percentage && <p className="text-red-500 text-sm">{errors.percentage}</p>}
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>TIN</TableHead>
                  <TableHead>Full Name *</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead># of Shares *</TableHead>
                  <TableHead>% of Shares *</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.owners.map((owner, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={owner.tin}
                        onChange={(e) => updateOwner(index, 'tin', e.target.value)}
                        placeholder="TIN"
                        className="min-w-[120px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={owner.fullName}
                        onChange={(e) => updateOwner(index, 'fullName', e.target.value)}
                        placeholder="Full name"
                        className="min-w-[200px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={owner.startDate}
                        onChange={(e) => updateOwner(index, 'startDate', e.target.value)}
                        className="min-w-[140px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={owner.endDate}
                        onChange={(e) => updateOwner(index, 'endDate', e.target.value)}
                        className="min-w-[140px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={owner.numberOfShares}
                        onChange={(e) => updateOwner(index, 'numberOfShares', e.target.value)}
                        placeholder="0"
                        className="min-w-[100px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        max="100"
                        value={owner.percentageOfShares}
                        onChange={(e) => updateOwner(index, 'percentageOfShares', e.target.value)}
                        placeholder="0.00"
                        className="min-w-[100px]"
                      />
                    </TableCell>
                    <TableCell>
                      {formData.owners.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOwner(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm">Total Shares:</Label>
              <p className="text-lg">{getTotalShares().toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm">Total Percentage:</Label>
              <p className={`text-lg ${Math.abs(getTotalPercentage() - 100) > 0.01 ? 'text-red-600' : 'text-green-600'}`}>
                {getTotalPercentage().toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p>* Required fields for each owner</p>
            <p>• Maximum 10 owners can be added</p>
            <p>• Total percentage of shares must equal 100%</p>
            <p>• At least one owner with complete information is required</p>
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