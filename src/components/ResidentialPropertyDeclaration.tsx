import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { ArrowLeft, ArrowRight, Home, Sparkles, Camera, CheckCircle, Plus, Trash2 } from 'lucide-react';
import PhotoUpload from './shared/PhotoUpload';
import { UploadedDocument } from './shared/DocumentUpload';
import { LIBERIAN_COUNTIES, LIBERIAN_DISTRICTS } from './shared/constants';

// Constants for property materials and options
const FOUNDATION_OPTIONS = [
  'Concrete',
  'Stone',
  'Brick',
  'Wood',
  'Mud Brick',
  'Other'
];

const WALL_OPTIONS = [
  'Concrete Block',
  'Brick',
  'Wood',
  'Zinc Sheet',
  'Mud Brick',
  'Plaster',
  'Other'
];

const ROOF_OPTIONS = [
  'Zinc Sheet',
  'Tile',
  'Concrete',
  'Thatch',
  'Shingle',
  'Other'
];

const FLOOR_OPTIONS = [
  'Concrete',
  'Tile',
  'Wood',
  'Earth/Dirt',
  'Marble',
  'Linoleum',
  'Other'
];

const WINDOW_OPTIONS = [
  'Glass with Frame',
  'Wood Shutters',
  'Metal Frame',
  'No Windows',
  'Other'
];

interface PropertyScheduleEntry {
  no: number;
  location: string;
  description: string;
  area: string;
  lotNo: string;
  classification: {
    residential: boolean;
    industrial: boolean;
    commercial: boolean;
    farmland: boolean;
    vacantLand: boolean;
  };
  purchaseConstructionCost: string;
  ownership: string;
  tenant: string;
  annualRent: string;
}

interface PropertyLedgerEntry {
  year: string;
  assessedValue: string;
  taxRate: string;
  amountOfTax: string;
  arrears: string;
  totalTaxDue: string;
}

interface PaymentRecord {
  billingDate: string;
  amountPaid: string;
  paymentDate: string;
  receiptNo: string;
  balanceDue: string;
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
    // Basic Information
    tin: initialData?.tin || '',
    houseNumber: initialData?.houseNumber || '',
    
    // Owner Address
    ownerCounty: initialData?.ownerCounty || '',
    ownerDistrict: initialData?.ownerDistrict || '',
    ownerCity: initialData?.ownerCity || '',
    ownerStreet: initialData?.ownerStreet || '',
    ownerHouseNumber: initialData?.ownerHouseNumber || '',
    ownerTelephone: initialData?.ownerTelephone || '',
    
    // Property Owner's Name
    ownerLastName: initialData?.ownerLastName || '',
    ownerFirstName: initialData?.ownerFirstName || '',
    
    // Declared Property Value & Tax Calculation
    declaredPropertyValue: initialData?.declaredPropertyValue || '',
    taxRate: '0.25', // Fixed at 0.25%
    taxAmountPerYear: initialData?.taxAmountPerYear || '',
    
    // Location of Property
    propertyCounty: initialData?.propertyCounty || '',
    propertyDistrict: initialData?.propertyDistrict || '',
    propertyCity: initialData?.propertyCity || '',
    propertyCommunity: initialData?.propertyCommunity || '',
    propertyStreet: initialData?.propertyStreet || '',
    propertyHouseNumber: initialData?.propertyHouseNumber || '',
    propertyLandmark: initialData?.propertyLandmark || '',
    
    // Property Description - Quantities
    stories: initialData?.stories || '',
    bedrooms: initialData?.bedrooms || '',
    bathrooms: initialData?.bathrooms || '',
    windows: initialData?.windows || '',
    porches: initialData?.porches || '',
    garages: initialData?.garages || '',
    shops: initialData?.shops || '',
    
    // Property Description - Materials
    foundation: initialData?.foundation || '',
    walls: initialData?.walls || '',
    roof: initialData?.roof || '',
    floor: initialData?.floor || '',
    windowType: initialData?.windowType || '',
    otherDescription: initialData?.otherDescription || '',
    
    // Caretaker/Occupant
    caretakerName: initialData?.caretakerName || '',
    
    // Contact
    contactTelephone: initialData?.contactTelephone || '',
    contactEmail: initialData?.contactEmail || '',
    
    // Date/Year of Construction
    constructionDate: initialData?.constructionDate || '',
    
    // Current Condition
    damageDescription: initialData?.damageDescription || '',
    
    // Property Owner's Schedule
    ownerScheduleName: initialData?.ownerScheduleName || '',
    ownerScheduleHomeAddress: initialData?.ownerScheduleHomeAddress || '',
    ownerScheduleWorkAddress: initialData?.ownerScheduleWorkAddress || '',
    ownerScheduleTelephone: initialData?.ownerScheduleTelephone || '',
    ownerScheduleEmail: initialData?.ownerScheduleEmail || '',
    
    // Property Schedule (1-19 entries)
    propertySchedule: initialData?.propertySchedule || [
      {
        no: 1,
        location: '',
        description: '',
        area: '',
        lotNo: '',
        classification: {
          residential: false,
          industrial: false,
          commercial: false,
          farmland: false,
          vacantLand: false
        },
        purchaseConstructionCost: '',
        ownership: '',
        tenant: '',
        annualRent: ''
      }
    ] as PropertyScheduleEntry[],
    
    // Certification
    certificationOwnerNames: initialData?.certificationOwnerNames || '',
    
    // Property Ledger Card
    ledgerPropertyOwnerName: initialData?.ledgerPropertyOwnerName || '',
    ledgerOwnerAddress: initialData?.ledgerOwnerAddress || '',
    ledgerOwnerCounty: initialData?.ledgerOwnerCounty || '',
    ledgerOwnerDistrict: initialData?.ledgerOwnerDistrict || '',
    ledgerOwnerCity: initialData?.ledgerOwnerCity || '',
    ledgerOwnerCommunity: initialData?.ledgerOwnerCommunity || '',
    ledgerOwnerStreet: initialData?.ledgerOwnerStreet || '',
    ledgerOwnerTelephone: initialData?.ledgerOwnerTelephone || '',
    
    // Ledger Location of Property
    ledgerPropertyCounty: initialData?.ledgerPropertyCounty || '',
    ledgerPropertyDistrict: initialData?.ledgerPropertyDistrict || '',
    ledgerPropertyCity: initialData?.ledgerPropertyCity || '',
    ledgerPropertyCommunity: initialData?.ledgerPropertyCommunity || '',
    ledgerPropertyLandmark: initialData?.ledgerPropertyLandmark || '',
    
    // Ledger Property Description
    ledgerConstructionDate: initialData?.ledgerConstructionDate || '',
    ledgerZoneNo: initialData?.ledgerZoneNo || '',
    ledgerBlockNo: initialData?.ledgerBlockNo || '',
    
    // Billing Information Table
    propertyLedger: initialData?.propertyLedger || [
      {
        year: '',
        assessedValue: '',
        taxRate: '0.25%',
        amountOfTax: '',
        arrears: '',
        totalTaxDue: ''
      }
    ] as PropertyLedgerEntry[],
    
    // Payment Record Table
    paymentRecords: initialData?.paymentRecords || [
      {
        billingDate: '',
        amountPaid: '',
        paymentDate: '',
        receiptNo: '',
        balanceDue: ''
      }
    ] as PaymentRecord[],
    
    // Additional Fields
    nameOfFirm: initialData?.nameOfFirm || '',
    
    // Documentation Checklist
    propertyScheduleSubmitted: initialData?.propertyScheduleSubmitted || false,
    certifiedDeclarationSubmitted: initialData?.certifiedDeclarationSubmitted || false,
    declarationFormFilled: initialData?.declarationFormFilled || false,
    photoOfPropertyAttached: initialData?.photoOfPropertyAttached || false,
    selfDeclared: initialData?.selfDeclared || false,
    
    // Comments
    comments: initialData?.comments || '',
    
    // Property Photos
    frontViewPhotos: initialData?.frontViewPhotos || [] as UploadedDocument[],
    backViewPhotos: initialData?.backViewPhotos || [] as UploadedDocument[],
    leftSidePhotos: initialData?.leftSidePhotos || [] as UploadedDocument[],
    rightSidePhotos: initialData?.rightSidePhotos || [] as UploadedDocument[],
    overviewPhotos: initialData?.overviewPhotos || [] as UploadedDocument[],
    interiorPhotos: initialData?.interiorPhotos || [] as UploadedDocument[],
    
    // Signature
    ownerSignature: initialData?.ownerSignature || '',
    signatureDate: initialData?.signatureDate || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate tax amount when declared value changes
      if (field === 'declaredPropertyValue') {
        const declaredValue = parseFloat(value) || 0;
        const taxRate = 0.25 / 100; // 0.25%
        newData.taxAmountPerYear = (declaredValue * taxRate).toFixed(2);
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Property Schedule Management
  const addPropertyScheduleEntry = () => {
    if (formData.propertySchedule.length < 19) {
      setFormData(prev => ({
        ...prev,
        propertySchedule: [...prev.propertySchedule, {
          no: prev.propertySchedule.length + 1,
          location: '',
          description: '',
          area: '',
          lotNo: '',
          classification: {
            residential: false,
            industrial: false,
            commercial: false,
            farmland: false,
            vacantLand: false
          },
          purchaseConstructionCost: '',
          ownership: '',
          tenant: '',
          annualRent: ''
        }]
      }));
    }
  };

  const removePropertyScheduleEntry = (index: number) => {
    if (formData.propertySchedule.length > 1) {
      setFormData(prev => ({
        ...prev,
        propertySchedule: prev.propertySchedule.filter((_, i) => i !== index)
          .map((entry, i) => ({ ...entry, no: i + 1 }))
      }));
    }
  };

  const updatePropertyScheduleEntry = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      propertySchedule: prev.propertySchedule.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  // Property Ledger Management
  const addPropertyLedgerEntry = () => {
    setFormData(prev => ({
      ...prev,
      propertyLedger: [...prev.propertyLedger, {
        year: '',
        assessedValue: '',
        taxRate: '0.25%',
        amountOfTax: '',
        arrears: '',
        totalTaxDue: ''
      }]
    }));
  };

  const removePropertyLedgerEntry = (index: number) => {
    if (formData.propertyLedger.length > 1) {
      setFormData(prev => ({
        ...prev,
        propertyLedger: prev.propertyLedger.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePropertyLedgerEntry = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      propertyLedger: prev.propertyLedger.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  // Payment Records Management
  const addPaymentRecord = () => {
    setFormData(prev => ({
      ...prev,
      paymentRecords: [...prev.paymentRecords, {
        billingDate: '',
        amountPaid: '',
        paymentDate: '',
        receiptNo: '',
        balanceDue: ''
      }]
    }));
  };

  const removePaymentRecord = (index: number) => {
    if (formData.paymentRecords.length > 1) {
      setFormData(prev => ({
        ...prev,
        paymentRecords: prev.paymentRecords.filter((_, i) => i !== index)
      }));
    }
  };

  const updatePaymentRecord = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      paymentRecords: prev.paymentRecords.map((entry, i) => 
        i === index ? { ...entry, [field]: value } : entry
      )
    }));
  };

  const fillSampleData = () => {
    setFormData(prev => ({
      ...prev,
      tin: 'TIN-2020-1234',
      houseNumber: '25',
      ownerCounty: 'Montserrado',
      ownerDistrict: 'Greater Monrovia',
      ownerCity: 'Monrovia',
      ownerStreet: 'Crown Hill',
      ownerHouseNumber: '25',
      ownerTelephone: '+231-555-0500',
      ownerLastName: 'Pewee',
      ownerFirstName: 'Elizabeth',
      declaredPropertyValue: '75000',
      taxAmountPerYear: '187.50',
      propertyCounty: 'Montserrado',
      propertyDistrict: 'Sinkor',
      propertyCity: 'Monrovia',
      propertyCommunity: 'Crown Hill Area',
      propertyStreet: 'Crown Hill',
      propertyHouseNumber: '25',
      propertyLandmark: 'Near Crown Hill Catholic Church',
      stories: '2',
      bedrooms: '3',
      bathrooms: '2',
      windows: '8',
      porches: '1',
      garages: '1',
      shops: '0',
      foundation: 'Concrete',
      walls: 'Concrete Block',
      roof: 'Zinc Sheet',
      floor: 'Tile',
      windowType: 'Glass with Frame',
      caretakerName: 'Elizabeth Pewee',
      contactTelephone: '+231-555-0500',
      contactEmail: 'elizabeth.pewee@email.lr',
      constructionDate: '2018-05-15',
      ownerSignature: 'Elizabeth Pewee',
      signatureDate: new Date().toISOString().split('T')[0]
    }));
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required field validations
    if (!formData.tin.trim()) newErrors.tin = 'TIN is required';
    if (!formData.ownerLastName.trim()) newErrors.ownerLastName = 'Owner last name is required';
    if (!formData.ownerFirstName.trim()) newErrors.ownerFirstName = 'Owner first name is required';
    if (!formData.declaredPropertyValue.trim()) newErrors.declaredPropertyValue = 'Declared property value is required';
    if (!formData.propertyCounty.trim()) newErrors.propertyCounty = 'Property county is required';
    if (!formData.propertyCity.trim()) newErrors.propertyCity = 'Property city is required';
    if (!formData.ownerSignature.trim()) newErrors.ownerSignature = 'Owner signature is required';
    if (!formData.signatureDate.trim()) newErrors.signatureDate = 'Signature date is required';

    // Photo validation
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Home className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl">Residential Property Declaration Form</h2>
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

      {/* Important Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800">
          <strong>Important:</strong> This form is mandatory for all GST registrations. 
          Tax rate is fixed at 0.25% for residential properties. Taxes are due on July 1st. 
          Failure to file within 30 days is punishable by 10% additional payment, increased by 5% monthly.
        </p>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>1. Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tin">TIN# *</Label>
              <Input
                id="tin"
                value={formData.tin}
                onChange={(e) => updateFormData('tin', e.target.value)}
                className={errors.tin ? 'border-red-500' : ''}
              />
              {errors.tin && <p className="text-red-500 text-sm">{errors.tin}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="houseNumber">House # (If Applicable)</Label>
              <Input
                id="houseNumber"
                value={formData.houseNumber}
                onChange={(e) => updateFormData('houseNumber', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owner Address */}
      <Card>
        <CardHeader>
          <CardTitle>3. Owner Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerCounty">County</Label>
              <Select value={formData.ownerCounty} onValueChange={(value) => updateFormData('ownerCounty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {LIBERIAN_COUNTIES.map(county => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerDistrict">District</Label>
              <Input
                id="ownerDistrict"
                value={formData.ownerDistrict}
                onChange={(e) => updateFormData('ownerDistrict', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerCity">Town/City</Label>
              <Input
                id="ownerCity"
                value={formData.ownerCity}
                onChange={(e) => updateFormData('ownerCity', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerStreet">Street</Label>
              <Input
                id="ownerStreet"
                value={formData.ownerStreet}
                onChange={(e) => updateFormData('ownerStreet', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerHouseNumber">House #</Label>
              <Input
                id="ownerHouseNumber"
                value={formData.ownerHouseNumber}
                onChange={(e) => updateFormData('ownerHouseNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerTelephone">Telephone #</Label>
              <Input
                id="ownerTelephone"
                value={formData.ownerTelephone}
                onChange={(e) => updateFormData('ownerTelephone', e.target.value)}
                placeholder="+231-XXX-XXXX"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Owner's Name */}
      <Card>
        <CardHeader>
          <CardTitle>4. Property Owner's Name</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerLastName">Last Name *</Label>
              <Input
                id="ownerLastName"
                value={formData.ownerLastName}
                onChange={(e) => updateFormData('ownerLastName', e.target.value)}
                className={errors.ownerLastName ? 'border-red-500' : ''}
              />
              {errors.ownerLastName && <p className="text-red-500 text-sm">{errors.ownerLastName}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerFirstName">First Name *</Label>
              <Input
                id="ownerFirstName"
                value={formData.ownerFirstName}
                onChange={(e) => updateFormData('ownerFirstName', e.target.value)}
                className={errors.ownerFirstName ? 'border-red-500' : ''}
              />
              {errors.ownerFirstName && <p className="text-red-500 text-sm">{errors.ownerFirstName}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Declared Property Value & Tax Calculation */}
      <Card>
        <CardHeader>
          <CardTitle>5. Declared Property Value & Tax Calculation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="declaredPropertyValue">Declared Property Value (USD OR ITS EQUIVALENT) *</Label>
              <Input
                id="declaredPropertyValue"
                value={formData.declaredPropertyValue}
                onChange={(e) => updateFormData('declaredPropertyValue', e.target.value)}
                placeholder="Enter value in USD"
                className={errors.declaredPropertyValue ? 'border-red-500' : ''}
              />
              {errors.declaredPropertyValue && <p className="text-red-500 text-sm">{errors.declaredPropertyValue}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (× 0.25%)</Label>
              <Input
                id="taxRate"
                value="0.25%"
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxAmountPerYear">Tax Amount Per Year (= calculated field)</Label>
              <Input
                id="taxAmountPerYear"
                value={formData.taxAmountPerYear}
                disabled
                className="bg-gray-100"
                placeholder="Automatically calculated"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location of Property */}
      <Card>
        <CardHeader>
          <CardTitle>6. Location of Property</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyCounty">County *</Label>
              <Select value={formData.propertyCounty} onValueChange={(value) => updateFormData('propertyCounty', value)}>
                <SelectTrigger className={errors.propertyCounty ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {LIBERIAN_COUNTIES.map(county => (
                    <SelectItem key={county} value={county}>{county}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.propertyCounty && <p className="text-red-500 text-sm">{errors.propertyCounty}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyDistrict">District</Label>
              <Input
                id="propertyDistrict"
                value={formData.propertyDistrict}
                onChange={(e) => updateFormData('propertyDistrict', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyCity">Town/City *</Label>
              <Input
                id="propertyCity"
                value={formData.propertyCity}
                onChange={(e) => updateFormData('propertyCity', e.target.value)}
                className={errors.propertyCity ? 'border-red-500' : ''}
              />
              {errors.propertyCity && <p className="text-red-500 text-sm">{errors.propertyCity}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyCommunity">Community</Label>
              <Input
                id="propertyCommunity"
                value={formData.propertyCommunity}
                onChange={(e) => updateFormData('propertyCommunity', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyStreet">Street</Label>
              <Input
                id="propertyStreet"
                value={formData.propertyStreet}
                onChange={(e) => updateFormData('propertyStreet', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyHouseNumber">House #</Label>
              <Input
                id="propertyHouseNumber"
                value={formData.propertyHouseNumber}
                onChange={(e) => updateFormData('propertyHouseNumber', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyLandmark">Landmark (use recognized building in your area)</Label>
              <Input
                id="propertyLandmark"
                value={formData.propertyLandmark}
                onChange={(e) => updateFormData('propertyLandmark', e.target.value)}
                placeholder="e.g., Near ABC Church"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Property Description */}
      {/* Property Description section removed */}

      {/* Caretaker & Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>8. Caretaker/Occupant's Name & Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="caretakerName">Caretaker/Occupant's Name</Label>
              <Input
                id="caretakerName"
                value={formData.caretakerName}
                onChange={(e) => updateFormData('caretakerName', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactTelephone">Telephone #</Label>
              <Input
                id="contactTelephone"
                value={formData.contactTelephone}
                onChange={(e) => updateFormData('contactTelephone', e.target.value)}
                placeholder="+231-XXX-XXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => updateFormData('contactEmail', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date of Construction & Current Condition */}
      <Card>
        <CardHeader>
          <CardTitle>10. Date/Year of Construction & 11. Current Condition</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="constructionDate">Date/Year of Construction</Label>
              <Input
                id="constructionDate"
                type="date"
                value={formData.constructionDate}
                onChange={(e) => updateFormData('constructionDate', e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="damageDescription">Current Condition - Damage (description field)</Label>
            <Textarea
              id="damageDescription"
              value={formData.damageDescription}
              onChange={(e) => updateFormData('damageDescription', e.target.value)}
              placeholder="Describe any damage or current condition of the property"
              rows={3}
            />
          </div>
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
          </div>

          {/* Required Exterior Photos */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-red-200">
              <div className="bg-red-100 p-2 rounded-lg">
                <Camera className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-red-800">Required Property Photos</h3>
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
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Property Owner's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Property Owner's Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Owner Information */}
          <div>
            <h4 className="font-medium mb-4">Owner Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerScheduleName">Name</Label>
                <Input
                  id="ownerScheduleName"
                  value={formData.ownerScheduleName}
                  onChange={(e) => updateFormData('ownerScheduleName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerScheduleTelephone">Telephone #</Label>
                <Input
                  id="ownerScheduleTelephone"
                  value={formData.ownerScheduleTelephone}
                  onChange={(e) => updateFormData('ownerScheduleTelephone', e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="ownerScheduleHomeAddress">Home Address</Label>
                <Textarea
                  id="ownerScheduleHomeAddress"
                  value={formData.ownerScheduleHomeAddress}
                  onChange={(e) => updateFormData('ownerScheduleHomeAddress', e.target.value)}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ownerScheduleWorkAddress">Work Address</Label>
                <Textarea
                  id="ownerScheduleWorkAddress"
                  value={formData.ownerScheduleWorkAddress}
                  onChange={(e) => updateFormData('ownerScheduleWorkAddress', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="ownerScheduleEmail">Email Address</Label>
              <Input
                id="ownerScheduleEmail"
                type="email"
                value={formData.ownerScheduleEmail}
                onChange={(e) => updateFormData('ownerScheduleEmail', e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Property Schedule Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Property Schedule Table (Rows 1-19)</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPropertyScheduleEntry}
                disabled={formData.propertySchedule.length >= 19}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </div>

            <div className="space-y-4">
              {formData.propertySchedule.map((entry, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Property #{entry.no}</CardTitle>
                      {formData.propertySchedule.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePropertyScheduleEntry(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={entry.location}
                          onChange={(e) => updatePropertyScheduleEntry(index, 'location', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Input
                          value={entry.description}
                          onChange={(e) => updatePropertyScheduleEntry(index, 'description', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Area</Label>
                        <Input
                          value={entry.area}
                          onChange={(e) => updatePropertyScheduleEntry(index, 'area', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Lot No.</Label>
                        <Input
                          value={entry.lotNo}
                          onChange={(e) => updatePropertyScheduleEntry(index, 'lotNo', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Purchase/Construction Cost</Label>
                        <Input
                          value={entry.purchaseConstructionCost}
                          onChange={(e) => updatePropertyScheduleEntry(index, 'purchaseConstructionCost', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Classification Checkboxes */}
                    <div>
                      <Label className="text-sm font-medium">Classification</Label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`residential-${index}`}
                            checked={entry.classification.residential}
                            onCheckedChange={(checked) => 
                              updatePropertyScheduleEntry(index, 'classification', {
                                ...entry.classification,
                                residential: checked
                              })
                            }
                          />
                          <Label htmlFor={`residential-${index}`} className="text-sm">R (Residential)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`industrial-${index}`}
                            checked={entry.classification.industrial}
                            onCheckedChange={(checked) => 
                              updatePropertyScheduleEntry(index, 'classification', {
                                ...entry.classification,
                                industrial: checked
                              })
                            }
                          />
                          <Label htmlFor={`industrial-${index}`} className="text-sm">I (Industrial)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`commercial-${index}`}
                            checked={entry.classification.commercial}
                            onCheckedChange={(checked) => 
                              updatePropertyScheduleEntry(index, 'classification', {
                                ...entry.classification,
                                commercial: checked
                              })
                            }
                          />
                          <Label htmlFor={`commercial-${index}`} className="text-sm">C (Commercial)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`farmland-${index}`}
                            checked={entry.classification.farmland}
                            onCheckedChange={(checked) => 
                              updatePropertyScheduleEntry(index, 'classification', {
                                ...entry.classification,
                                farmland: checked
                              })
                            }
                          />
                          <Label htmlFor={`farmland-${index}`} className="text-sm">FL (Farmland)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`vacantLand-${index}`}
                            checked={entry.classification.vacantLand}
                            onCheckedChange={(checked) => 
                              updatePropertyScheduleEntry(index, 'classification', {
                                ...entry.classification,
                                vacantLand: checked
                              })
                            }
                          />
                          <Label htmlFor={`vacantLand-${index}`} className="text-sm">VL (Vacant Land)</Label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label>Ownership</Label>
                        <Input
                          value={entry.ownership}
                          onChange={(e) => updatePropertyScheduleEntry(index, 'ownership', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tenant (If Applicable)</Label>
                        <Input
                          value={entry.tenant}
                          onChange={(e) => updatePropertyScheduleEntry(index, 'tenant', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Annual Rent</Label>
                        <Input
                          value={entry.annualRent}
                          onChange={(e) => updatePropertyScheduleEntry(index, 'annualRent', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Property Photos Document Section */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <Camera className="h-4 w-4 text-primary" />
                        <Label className="text-sm font-medium">Property Photos</Label>
                      </div>
                      <PhotoUpload
                        title="Property Photos"
                        description="Upload photos of this property (exterior, interior, relevant features)"
                        accept="image/jpeg,image/png,image/gif"
                        maxSize={5}
                        uploadedDocuments={entry.photoDocuments || []}
                        onUpload={(documents) => {
                          updatePropertyScheduleEntry(index, 'photoDocuments', documents);
                        }}
                      />

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Certification */}
          <div className="space-y-2">
            <Label htmlFor="certificationOwnerNames">Certification - State owner's name(s), if property is being leased by you</Label>
            <Textarea
              id="certificationOwnerNames"
              value={formData.certificationOwnerNames}
              onChange={(e) => updateFormData('certificationOwnerNames', e.target.value)}
              placeholder="List property owner names if applicable"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Property Ledger Card */}
      <Card>
        <CardHeader>
          <CardTitle>Property Ledger Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Property Owner Information */}
          <div>
            <h4 className="font-medium mb-4">Property Owner Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ledgerPropertyOwnerName">Property Owner's Name(s)</Label>
                <Input
                  id="ledgerPropertyOwnerName"
                  value={formData.ledgerPropertyOwnerName}
                  onChange={(e) => updateFormData('ledgerPropertyOwnerName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ledgerOwnerTelephone">Telephone #</Label>
                <Input
                  id="ledgerOwnerTelephone"
                  value={formData.ledgerOwnerTelephone}
                  onChange={(e) => updateFormData('ledgerOwnerTelephone', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="ledgerOwnerAddress">Owner's Address(es)</Label>
              <Textarea
                id="ledgerOwnerAddress"
                value={formData.ledgerOwnerAddress}
                onChange={(e) => updateFormData('ledgerOwnerAddress', e.target.value)}
                rows={2}
              />
            </div>

            {/* Owner's Address Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="ledgerOwnerCounty">County</Label>
                <Select value={formData.ledgerOwnerCounty} onValueChange={(value) => updateFormData('ledgerOwnerCounty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIBERIAN_COUNTIES.map(county => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ledgerOwnerDistrict">District</Label>
                <Input
                  id="ledgerOwnerDistrict"
                  value={formData.ledgerOwnerDistrict}
                  onChange={(e) => updateFormData('ledgerOwnerDistrict', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ledgerOwnerCity">Town/City</Label>
                <Input
                  id="ledgerOwnerCity"
                  value={formData.ledgerOwnerCity}
                  onChange={(e) => updateFormData('ledgerOwnerCity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ledgerOwnerCommunity">Community</Label>
                <Input
                  id="ledgerOwnerCommunity"
                  value={formData.ledgerOwnerCommunity}
                  onChange={(e) => updateFormData('ledgerOwnerCommunity', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Location of Property */}
          <div>
            <h4 className="font-medium mb-4">Location of Property</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ledgerPropertyCounty">County</Label>
                <Select value={formData.ledgerPropertyCounty} onValueChange={(value) => updateFormData('ledgerPropertyCounty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select county" />
                  </SelectTrigger>
                  <SelectContent>
                    {LIBERIAN_COUNTIES.map(county => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ledgerPropertyDistrict">District</Label>
                <Input
                  id="ledgerPropertyDistrict"
                  value={formData.ledgerPropertyDistrict}
                  onChange={(e) => updateFormData('ledgerPropertyDistrict', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ledgerPropertyCity">Town/City</Label>
                <Input
                  id="ledgerPropertyCity"
                  value={formData.ledgerPropertyCity}
                  onChange={(e) => updateFormData('ledgerPropertyCity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ledgerPropertyCommunity">Community</Label>
                <Input
                  id="ledgerPropertyCommunity"
                  value={formData.ledgerPropertyCommunity}
                  onChange={(e) => updateFormData('ledgerPropertyCommunity', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="ledgerPropertyLandmark">Landmark (Use recognizable building/junction where property is located)</Label>
              <Input
                id="ledgerPropertyLandmark"
                value={formData.ledgerPropertyLandmark}
                onChange={(e) => updateFormData('ledgerPropertyLandmark', e.target.value)}
                placeholder="e.g., Near Main Junction, Behind School"
              />
            </div>
          </div>

          <Separator />

          {/* Property Description */}
          <div>
            <h4 className="font-medium mb-4">Property Description</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ledgerConstructionDate">Date of Construction/Acquisition</Label>
                <Input
                  id="ledgerConstructionDate"
                  type="date"
                  value={formData.ledgerConstructionDate}
                  onChange={(e) => updateFormData('ledgerConstructionDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ledgerZoneNo">Zone No.</Label>
                <Input
                  id="ledgerZoneNo"
                  value={formData.ledgerZoneNo}
                  onChange={(e) => updateFormData('ledgerZoneNo', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ledgerBlockNo">Block No.</Label>
                <Input
                  id="ledgerBlockNo"
                  value={formData.ledgerBlockNo}
                  onChange={(e) => updateFormData('ledgerBlockNo', e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Billing Information Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Billing Information Table</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPropertyLedgerEntry}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Year
              </Button>
            </div>

            <div className="space-y-4">
              {formData.propertyLedger.map((entry, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Billing Year {index + 1}</CardTitle>
                      {formData.propertyLedger.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePropertyLedgerEntry(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      <div className="space-y-2">
                        <Label>Year</Label>
                        <Input
                          value={entry.year}
                          onChange={(e) => updatePropertyLedgerEntry(index, 'year', e.target.value)}
                          placeholder="2024"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Assessed Value</Label>
                        <Input
                          value={entry.assessedValue}
                          onChange={(e) => updatePropertyLedgerEntry(index, 'assessedValue', e.target.value)}
                          placeholder="USD"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tax Rate</Label>
                        <Input
                          value="0.25%"
                          disabled
                          className="bg-gray-100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount of Tax</Label>
                        <Input
                          value={entry.amountOfTax}
                          onChange={(e) => updatePropertyLedgerEntry(index, 'amountOfTax', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Arrears</Label>
                        <Input
                          value={entry.arrears}
                          onChange={(e) => updatePropertyLedgerEntry(index, 'arrears', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Total Tax Due</Label>
                        <Input
                          value={entry.totalTaxDue}
                          onChange={(e) => updatePropertyLedgerEntry(index, 'totalTaxDue', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Payment Record Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Payment Record Table</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPaymentRecord}
                className="text-blue-600 border-blue-300 hover:bg-blue-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </div>

            <div className="space-y-4">
              {formData.paymentRecords.map((record, index) => (
                <Card key={index} className="border-l-4 border-l-purple-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Payment Record {index + 1}</CardTitle>
                      {formData.paymentRecords.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePaymentRecord(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                      <div className="space-y-2">
                        <Label>Billing Date</Label>
                        <Input
                          type="date"
                          value={record.billingDate}
                          onChange={(e) => updatePaymentRecord(index, 'billingDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount Paid</Label>
                        <Input
                          value={record.amountPaid}
                          onChange={(e) => updatePaymentRecord(index, 'amountPaid', e.target.value)}
                          placeholder="USD"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Payment Date</Label>
                        <Input
                          type="date"
                          value={record.paymentDate}
                          onChange={(e) => updatePaymentRecord(index, 'paymentDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Receipt No.</Label>
                        <Input
                          value={record.receiptNo}
                          onChange={(e) => updatePaymentRecord(index, 'receiptNo', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Balance Due</Label>
                        <Input
                          value={record.balanceDue}
                          onChange={(e) => updatePaymentRecord(index, 'balanceDue', e.target.value)}
                          placeholder="USD"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Additional Fields */}
          <div className="space-y-2">
            <Label htmlFor="nameOfFirm">Name of Firm (If Appraisal Submitted)</Label>
            <Input
              id="nameOfFirm"
              value={formData.nameOfFirm}
              onChange={(e) => updateFormData('nameOfFirm', e.target.value)}
              placeholder="Enter firm name if professional appraisal was submitted"
            />
          </div>
        </CardContent>
      </Card>

      {/* Documentation Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Documentation Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="propertyScheduleSubmitted"
                checked={formData.propertyScheduleSubmitted}
                onCheckedChange={(checked) => updateFormData('propertyScheduleSubmitted', checked)}
              />
              <Label htmlFor="propertyScheduleSubmitted">Property Schedule Submitted</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="certifiedDeclarationSubmitted"
                checked={formData.certifiedDeclarationSubmitted}
                onCheckedChange={(checked) => updateFormData('certifiedDeclarationSubmitted', checked)}
              />
              <Label htmlFor="certifiedDeclarationSubmitted">Certified Declaration Submitted</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="declarationFormFilled"
                checked={formData.declarationFormFilled}
                onCheckedChange={(checked) => updateFormData('declarationFormFilled', checked)}
              />
              <Label htmlFor="declarationFormFilled">Declaration Form Filled</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="photoOfPropertyAttached"
                checked={formData.photoOfPropertyAttached}
                onCheckedChange={(checked) => updateFormData('photoOfPropertyAttached', checked)}
              />
              <Label htmlFor="photoOfPropertyAttached">Photo of Property Attached</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="selfDeclared"
                checked={formData.selfDeclared}
                onCheckedChange={(checked) => updateFormData('selfDeclared', checked)}
              />
              <Label htmlFor="selfDeclared">Self-Declared</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              value={formData.comments}
              onChange={(e) => updateFormData('comments', e.target.value)}
              placeholder="Additional comments or notes"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Signature of Owner/Caretaker & Date */}
      <Card>
        <CardHeader>
          <CardTitle>12. Signature of Owner/Caretaker & Date</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 border rounded-lg p-4">
            <p className="text-sm">
              I hereby declare that the information provided above is true and correct to the best of my knowledge. 
              I understand that providing false information is a violation of Liberian tax law and may result in penalties.
              Forms must be filed at the nearest LRA office where property is located.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerSignature">Signature of Property Owner/LPA *</Label>
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
              <Label htmlFor="signatureDate">Date *</Label>
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