import React, { useState, useCallback, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { ArrowLeft, ArrowRight, Building2, Plus, Trash2, Sparkles, MapPin, User, FileText, Save, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { LIBERIAN_COUNTIES, LIBERIAN_DISTRICTS } from './shared/constants';
import { DUMMY_BRANCH_DATA } from './shared/dummyData';
import { LoadingSpinner, ButtonLoadingSpinner } from './shared/LoadingSpinner';
import { branchRegistrationSchema, validateField } from './shared/FormValidation';

interface BranchEntry {
  // 2. Branch Detail
  branchName: string;
  dateOpened: string;
  
  // 3. Branch Address
  country: string;
  county: string;
  district: string;
  taxDistrict: string;
  cityVillageTown: string;
  majorLandmark: string;
  streetRoad: string;
  buildingUnit: string;
  poBox: string;
  
  // 4. Contact Details
  contactNumber: string;
  alternateTelephone: string;
  email: string;
  alternateEmail: string;
  managerName: string; // Contact Person Full Name
  
  // 5. Certification
  firstName: string;
  middleName: string;
  lastName: string;
  position: string;
  signature: string;
  signatureDate: string;
  
  // Legacy fields (for backward compatibility)
  branchAddress?: string;
  natureOfBusiness?: string;
  managerIdNumber?: string;
  managerIdType?: string;
  employeeCount?: string;
  localBusinessLicenses?: string;
  licenseNumbers?: string;
}

interface BranchRegistrationProps {
  initialData?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
  parentEntityInfo?: {
    name: string;
    tin: string;
    headOfficeAddress: string;
  };
}

const ID_TYPES = [
  'National ID',
  'Passport',
  'Driver\'s License',
  'Voter Registration Card'
];

export default function BranchRegistration({ 
  initialData, 
  onComplete, 
  onBack,
  parentEntityInfo 
}: BranchRegistrationProps) {
  const [formData, setFormData] = useState({
    // Parent Entity Information
    parentEntityName: initialData?.parentEntityName || parentEntityInfo?.name || '',
    parentTin: initialData?.parentTin || parentEntityInfo?.tin || '',
    headOfficeAddress: initialData?.headOfficeAddress || parentEntityInfo?.headOfficeAddress || '',
    
    // Branches
    branches: initialData?.branches || [
      {
        // 2. Branch Detail
        branchName: '',
        dateOpened: '',
        
        // 3. Branch Address
        country: 'Liberia',
        county: '',
        district: '',
        taxDistrict: '',
        cityVillageTown: '',
        majorLandmark: '',
        streetRoad: '',
        buildingUnit: '',
        poBox: '',
        
        // 4. Contact Details
        contactNumber: '',
        alternateTelephone: '',
        email: '',
        alternateEmail: '',
        managerName: '',
        
        // 5. Certification
        firstName: '',
        middleName: '',
        lastName: '',
        position: '',
        signature: '',
        signatureDate: new Date().toISOString().split('T')[0],
        
        // Legacy fields (for backward compatibility)
        branchAddress: '',
        natureOfBusiness: '',
        managerIdNumber: '',
        managerIdType: '',
        employeeCount: '',
        localBusinessLicenses: '',
        licenseNumbers: ''
      }
    ] as BranchEntry[],
    
    // Declaration
    declarationConfirmed: initialData?.declarationConfirmed || false,
    signatoryName: initialData?.signatoryName || '',
    signatoryDate: initialData?.signatoryDate || new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateFormData = useCallback((field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Real-time validation for specific fields
    if (field === 'parentTin' && value) {
      const validation = validateField(branchRegistrationSchema.shape.parentTin, value, 'Parent TIN');
      if (!validation.isValid && validation.error) {
        setErrors(prev => ({ ...prev, [field]: validation.error! }));
      }
    }
  }, [errors]);

  const updateBranch = useCallback((index: number, field: keyof BranchEntry, value: string) => {
    const updatedBranches = [...formData.branches];
    updatedBranches[index] = { ...updatedBranches[index], [field]: value };
    
    // Clear district when county changes
    if (field === 'county') {
      updatedBranches[index].district = '';
    }
    
    updateFormData('branches', updatedBranches);
    
    // Clear specific branch field error
    const errorKey = `branch_${index}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }

    // Real-time validation for email and phone fields
    if (field === 'email' && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setErrors(prev => ({ ...prev, [errorKey]: 'Please enter a valid email address' }));
      }
    }
    
    if (field === 'contactNumber' && value) {
      if (!/^(\+231|231|0)?[0-9]{8,9}$/.test(value)) {
        setErrors(prev => ({ ...prev, [errorKey]: 'Please enter a valid Liberian phone number' }));
      }
    }
  }, [formData.branches, errors, updateFormData]);

  const addBranch = () => {
    if (formData.branches.length < 10) {
      const newBranch: BranchEntry = {
        // 2. Branch Detail
        branchName: '',
        dateOpened: '',
        
        // 3. Branch Address
        country: 'Liberia',
        county: '',
        district: '',
        taxDistrict: '',
        cityVillageTown: '',
        majorLandmark: '',
        streetRoad: '',
        buildingUnit: '',
        poBox: '',
        
        // 4. Contact Details
        contactNumber: '',
        alternateTelephone: '',
        email: '',
        alternateEmail: '',
        managerName: '',
        
        // 5. Certification
        firstName: '',
        middleName: '',
        lastName: '',
        position: '',
        signature: '',
        signatureDate: new Date().toISOString().split('T')[0],
        
        // Legacy fields (for backward compatibility)
        branchAddress: '',
        natureOfBusiness: '',
        managerIdNumber: '',
        managerIdType: '',
        employeeCount: '',
        localBusinessLicenses: '',
        licenseNumbers: ''
      };
      updateFormData('branches', [...formData.branches, newBranch]);
    }
  };

  const removeBranch = (index: number) => {
    if (formData.branches.length > 1) {
      const updatedBranches = formData.branches.filter((_: BranchEntry, i: number) => i !== index);
      updateFormData('branches', updatedBranches);
      
      // Clear errors for removed branch
      const newErrors = { ...errors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`branch_${index}_`)) {
          delete newErrors[key];
        }
      });
      setErrors(newErrors);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate parent entity information
    if (!formData.parentEntityName || !formData.parentEntityName.trim()) {
      newErrors.parentEntityName = 'Parent entity name is required';
    }
    if (!formData.parentTin || !formData.parentTin.trim()) {
      newErrors.parentTin = 'Parent TIN is required';
    }

    // Validate branches
    formData.branches.forEach((branch: BranchEntry, index: number) => {
      // 2. Branch Detail - Required fields
      if (!branch.branchName || !branch.branchName.trim()) {
        newErrors[`branch_${index}_branchName`] = 'Branch name is required';
      }
      if (!branch.dateOpened) {
        newErrors[`branch_${index}_dateOpened`] = 'Start date is required';
      }
      
      // 3. Branch Address - Required fields
      if (!branch.county) {
        newErrors[`branch_${index}_county`] = 'County is required';
      }
      if (!branch.cityVillageTown || !branch.cityVillageTown.trim()) {
        newErrors[`branch_${index}_cityVillageTown`] = 'City/Village/Town is required';
      }
      
      // 4. Contact Details - Required fields
      if (!branch.contactNumber || !branch.contactNumber.trim()) {
        newErrors[`branch_${index}_contactNumber`] = 'Telephone/Mobile number is required';
      }
      if (!branch.email || !branch.email.trim()) {
        newErrors[`branch_${index}_email`] = 'Email address is required';
      } else if (!/\S+@\S+\.\S+/.test(branch.email)) {
        newErrors[`branch_${index}_email`] = 'Valid email address is required';
      }
      if (!branch.managerName || !branch.managerName.trim()) {
        newErrors[`branch_${index}_managerName`] = 'Contact person full name is required';
      }
      
      // 5. Certification - Required fields
      if (!branch.firstName || !branch.firstName.trim()) {
        newErrors[`branch_${index}_firstName`] = 'First name is required';
      }
      if (!branch.lastName || !branch.lastName.trim()) {
        newErrors[`branch_${index}_lastName`] = 'Last name is required';
      }
      if (!branch.position || !branch.position.trim()) {
        newErrors[`branch_${index}_position`] = 'Position is required';
      }
      if (!branch.signature || !branch.signature.trim()) {
        newErrors[`branch_${index}_signature`] = 'Signature is required';
      }
      if (!branch.signatureDate) {
        newErrors[`branch_${index}_signatureDate`] = 'Date is required';
      }
      
      // Validate alternate email if provided
      if (branch.alternateEmail && branch.alternateEmail.trim() && !/\S+@\S+\.\S+/.test(branch.alternateEmail)) {
        newErrors[`branch_${index}_alternateEmail`] = 'Valid alternate email address is required';
      }
    });

    // Validate declaration
    if (!formData.declarationConfirmed) {
      newErrors.declarationConfirmed = 'Declaration confirmation is required';
    }
    if (!formData.signatoryName || !formData.signatoryName.trim()) {
      newErrors.signatoryName = 'Signatory name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fillDummyData = () => {
    setFormData((prev) => ({ ...prev, ...DUMMY_BRANCH_DATA }));
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (validateForm()) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setHasUnsavedChanges(false);
        onComplete(formData);
      }
    } catch (error) {
      console.error('Submission error:', error);
      setErrors(prev => ({ ...prev, general: 'An error occurred while submitting. Please try again.' }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-save functionality
  const handleAutoSave = useCallback(() => {
    if (hasUnsavedChanges) {
      localStorage.setItem('br01_draft', JSON.stringify(formData));
      setHasUnsavedChanges(false);
    }
  }, [formData, hasUnsavedChanges]);

  // Load draft data on mount
  React.useEffect(() => {
    const draftData = localStorage.getItem('br01_draft');
    if (draftData && !initialData) {
      try {
        const parsed = JSON.parse(draftData);
        setFormData(parsed);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [initialData]);

  // Progress calculation
  const completionProgress = useMemo(() => {
    // Required fields: 2 main + 11 required per branch
    const totalRequiredFields = 2 + (formData.branches.length * 11);
    let completedRequiredFields = 0;
    
    // Count main required fields
    if (formData.parentEntityName) completedRequiredFields++;
    if (formData.parentTin) completedRequiredFields++;
    
    // Count branch required fields
    formData.branches.forEach((branch: BranchEntry) => {
      // 2. Branch Detail (2 required)
      if (branch.branchName) completedRequiredFields++;
      if (branch.dateOpened) completedRequiredFields++;
      
      // 3. Branch Address (2 required)
      if (branch.county) completedRequiredFields++;
      if (branch.cityVillageTown) completedRequiredFields++;
      
      // 4. Contact Details (3 required)
      if (branch.contactNumber) completedRequiredFields++;
      if (branch.email) completedRequiredFields++;
      if (branch.managerName) completedRequiredFields++;
      
      // 5. Certification (4 required)
      if (branch.firstName) completedRequiredFields++;
      if (branch.lastName) completedRequiredFields++;
      if (branch.position) completedRequiredFields++;
      if (branch.signature) completedRequiredFields++;
    });
    
    return Math.round((completedRequiredFields / totalRequiredFields) * 100);
  }, [formData]);

  return (
    <div className="container-full space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-semibold text-gray-900">Branch Registration Appendix (BR01)</h2>
            <Badge variant="secondary" className="text-xs">
              {completionProgress}% Complete
            </Badge>
          </div>
          <p className="text-gray-600">
            Complete one BR01 form for each additional branch of your entity
          </p>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionProgress}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    Unsaved Changes
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Changes will be auto-saved</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAutoSave}
            className="flex items-center gap-2"
            disabled={!hasUnsavedChanges}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={fillDummyData}
            className="flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Fill Sample Data
          </Button>
        </div>
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <strong>BR01 Form Requirements:</strong><br />
          This form must be completed by taxpayers who wish to register additional branches for an existing 
          Sole Proprietorship, Partnership, Corporation, NGO, or other organization. One BR01 form must be 
          completed for each branch.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. Organization Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              1. Organization Detail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="organizationTin">Organization/Company/Individual TIN *</Label>
                <Input
                  id="organizationTin"
                  value={formData.parentTin}
                  onChange={(e) => updateFormData('parentTin', e.target.value)}
                  className={errors.parentTin ? 'border-red-500' : ''}
                  placeholder="Enter organization TIN"
                />
                {errors.parentTin && <p className="text-red-500 text-sm">{errors.parentTin}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="registeredName">Registered Name *</Label>
                <Input
                  id="registeredName"
                  value={formData.parentEntityName}
                  onChange={(e) => updateFormData('parentEntityName', e.target.value)}
                  className={errors.parentEntityName ? 'border-red-500' : ''}
                  placeholder="Enter registered name"
                />
                {errors.parentEntityName && <p className="text-red-500 text-sm">{errors.parentEntityName}</p>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branch Sections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Branch Registration
              </CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addBranch}
                disabled={formData.branches.length >= 10}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Branch
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {formData.branches.map((branch: BranchEntry, index: number) => (
              <div key={index} className="border rounded-lg p-6 space-y-6 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-lg">Branch {index + 1}</h4>
                  {formData.branches.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeBranch(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* 2. Branch Detail */}
                <div className="space-y-4">
                  <h5 className="font-medium flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    2. Branch Detail
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`branchName_${index}`}>Branch Name *</Label>
                      <Input
                        id={`branchName_${index}`}
                        value={branch.branchName}
                        onChange={(e) => updateBranch(index, 'branchName', e.target.value)}
                        className={errors[`branch_${index}_branchName`] ? 'border-red-500' : ''}
                        placeholder="Enter branch name"
                      />
                      {errors[`branch_${index}_branchName`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_branchName`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`startDate_${index}`}>Start Date *</Label>
                      <Input
                        id={`startDate_${index}`}
                        type="date"
                        value={branch.dateOpened}
                        onChange={(e) => updateBranch(index, 'dateOpened', e.target.value)}
                        className={errors[`branch_${index}_dateOpened`] ? 'border-red-500' : ''}
                      />
                      {errors[`branch_${index}_dateOpened`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_dateOpened`]}</p>}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 3. Branch Address */}
                <div className="space-y-4">
                  <h5 className="font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    3. Branch Address
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`country_${index}`}>Country *</Label>
                      <Select 
                        value={branch.country || 'Liberia'} 
                        onValueChange={(value) => updateBranch(index, 'country', value)}
                      >
                        <SelectTrigger className={errors[`branch_${index}_country`] ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Liberia">Liberia</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors[`branch_${index}_country`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_country`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`county_${index}`}>County *</Label>
                      <Select 
                        value={branch.county} 
                        onValueChange={(value) => updateBranch(index, 'county', value)}
                      >
                        <SelectTrigger className={errors[`branch_${index}_county`] ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          {LIBERIAN_COUNTIES.map(county => (
                            <SelectItem key={county} value={county}>
                              {county}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`branch_${index}_county`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_county`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`administrativeDistrict_${index}`}>Administrative District</Label>
                      <Select 
                        value={branch.district} 
                        onValueChange={(value) => updateBranch(index, 'district', value)}
                        disabled={
                          !branch.county ||
                          !LIBERIAN_DISTRICTS[
                            branch.county as keyof typeof LIBERIAN_DISTRICTS
                          ]
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            branch.county &&
                            LIBERIAN_DISTRICTS[
                              branch.county as keyof typeof LIBERIAN_DISTRICTS
                            ]
                              ? "Select district"
                              : "Please select a county first"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {branch.county &&
                            LIBERIAN_DISTRICTS[
                              branch.county as keyof typeof LIBERIAN_DISTRICTS
                            ] &&
                            LIBERIAN_DISTRICTS[
                              branch.county as keyof typeof LIBERIAN_DISTRICTS
                            ].map((district: string) => (
                              <SelectItem key={district} value={district}>
                                {district}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`taxDistrict_${index}`}>Tax District</Label>
                      <Input
                        id={`taxDistrict_${index}`}
                        value={branch.taxDistrict || ''}
                        onChange={(e) => updateBranch(index, 'taxDistrict', e.target.value)}
                        placeholder="Enter tax district"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`cityVillageTown_${index}`}>City/Village/Town *</Label>
                      <Input
                        id={`cityVillageTown_${index}`}
                        value={branch.cityVillageTown || ''}
                        onChange={(e) => updateBranch(index, 'cityVillageTown', e.target.value)}
                        className={errors[`branch_${index}_cityVillageTown`] ? 'border-red-500' : ''}
                        placeholder="Enter city, village, or town"
                      />
                      {errors[`branch_${index}_cityVillageTown`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_cityVillageTown`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`majorLandmark_${index}`}>Major Landmark</Label>
                      <Input
                        id={`majorLandmark_${index}`}
                        value={branch.majorLandmark || ''}
                        onChange={(e) => updateBranch(index, 'majorLandmark', e.target.value)}
                        placeholder="Enter major landmark"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`streetRoad_${index}`}>Street/Road</Label>
                      <Input
                        id={`streetRoad_${index}`}
                        value={branch.streetRoad || ''}
                        onChange={(e) => updateBranch(index, 'streetRoad', e.target.value)}
                        placeholder="Enter street or road"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`buildingUnit_${index}`}>Building/Unit</Label>
                      <Input
                        id={`buildingUnit_${index}`}
                        value={branch.buildingUnit || ''}
                        onChange={(e) => updateBranch(index, 'buildingUnit', e.target.value)}
                        placeholder="Enter building or unit"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`poBox_${index}`}>P.O. Box</Label>
                      <Input
                        id={`poBox_${index}`}
                        value={branch.poBox || ''}
                        onChange={(e) => updateBranch(index, 'poBox', e.target.value)}
                        placeholder="Enter P.O. Box"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 4. Contact Details */}
                <div className="space-y-4">
                  <h5 className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4" />
                    4. Contact Details
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`telephoneMobile_${index}`}>Telephone/Mobile Number *</Label>
                      <Input
                        id={`telephoneMobile_${index}`}
                        value={branch.contactNumber}
                        onChange={(e) => updateBranch(index, 'contactNumber', e.target.value)}
                        className={errors[`branch_${index}_contactNumber`] ? 'border-red-500' : ''}
                        placeholder="+231-XXX-XXXX"
                      />
                      {errors[`branch_${index}_contactNumber`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_contactNumber`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`alternateTelephone_${index}`}>Alternate Telephone/Mobile Number</Label>
                      <Input
                        id={`alternateTelephone_${index}`}
                        value={branch.alternateTelephone || ''}
                        onChange={(e) => updateBranch(index, 'alternateTelephone', e.target.value)}
                        placeholder="+231-XXX-XXXX"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`emailAddress_${index}`}>Email Address *</Label>
                      <Input
                        id={`emailAddress_${index}`}
                        type="email"
                        value={branch.email}
                        onChange={(e) => updateBranch(index, 'email', e.target.value)}
                        className={errors[`branch_${index}_email`] ? 'border-red-500' : ''}
                        placeholder="branch@company.com"
                      />
                      {errors[`branch_${index}_email`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_email`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`alternateEmail_${index}`}>Alternate Email Address</Label>
                      <Input
                        id={`alternateEmail_${index}`}
                        type="email"
                        value={branch.alternateEmail || ''}
                        onChange={(e) => updateBranch(index, 'alternateEmail', e.target.value)}
                        placeholder="alternate@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`contactPersonName_${index}`}>Contact Person Full Name *</Label>
                    <Input
                      id={`contactPersonName_${index}`}
                      value={branch.managerName}
                      onChange={(e) => updateBranch(index, 'managerName', e.target.value)}
                      className={errors[`branch_${index}_managerName`] ? 'border-red-500' : ''}
                      placeholder="Enter contact person full name"
                    />
                    {errors[`branch_${index}_managerName`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_managerName`]}</p>}
                  </div>
                </div>

                <Separator />

                {/* 5. Certification */}
                <div className="space-y-4">
                  <h5 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    5. Certification
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`firstName_${index}`}>First Name *</Label>
                      <Input
                        id={`firstName_${index}`}
                        value={branch.firstName || ''}
                        onChange={(e) => updateBranch(index, 'firstName', e.target.value)}
                        className={errors[`branch_${index}_firstName`] ? 'border-red-500' : ''}
                        placeholder="Enter first name"
                      />
                      {errors[`branch_${index}_firstName`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_firstName`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`middleName_${index}`}>Middle Name</Label>
                      <Input
                        id={`middleName_${index}`}
                        value={branch.middleName || ''}
                        onChange={(e) => updateBranch(index, 'middleName', e.target.value)}
                        placeholder="Enter middle name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`lastName_${index}`}>Last Name *</Label>
                      <Input
                        id={`lastName_${index}`}
                        value={branch.lastName || ''}
                        onChange={(e) => updateBranch(index, 'lastName', e.target.value)}
                        className={errors[`branch_${index}_lastName`] ? 'border-red-500' : ''}
                        placeholder="Enter last name"
                      />
                      {errors[`branch_${index}_lastName`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_lastName`]}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`position_${index}`}>Position *</Label>
                      <Input
                        id={`position_${index}`}
                        value={branch.position || ''}
                        onChange={(e) => updateBranch(index, 'position', e.target.value)}
                        className={errors[`branch_${index}_position`] ? 'border-red-500' : ''}
                        placeholder="Enter position/title"
                      />
                      {errors[`branch_${index}_position`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_position`]}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`signatureDate_${index}`}>Date *</Label>
                      <Input
                        id={`signatureDate_${index}`}
                        type="date"
                        value={branch.signatureDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => updateBranch(index, 'signatureDate', e.target.value)}
                        className={errors[`branch_${index}_signatureDate`] ? 'border-red-500' : ''}
                      />
                      {errors[`branch_${index}_signatureDate`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_signatureDate`]}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`signature_${index}`}>Signature *</Label>
                    <Input
                      id={`signature_${index}`}
                      value={branch.signature || ''}
                      onChange={(e) => updateBranch(index, 'signature', e.target.value)}
                      className={errors[`branch_${index}_signature`] ? 'border-red-500' : ''}
                      placeholder="Type full name as signature"
                    />
                    {errors[`branch_${index}_signature`] && <p className="text-red-500 text-sm">{errors[`branch_${index}_signature`]}</p>}
                  </div>
                </div>
              </div>
            ))}

            <div className="text-sm text-muted-foreground">
              <p>• Maximum 10 branches can be registered</p>
              <p>• Each branch requires a separate BR01 form completion</p>
              <p>• All fields marked with * are required</p>
            </div>
          </CardContent>
        </Card>

        {/* Declaration */}
        <Card>
          <CardHeader>
            <CardTitle>Declaration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Declaration Statement:</strong><br />
                I hereby declare that the information provided above is true and correct to the best of my knowledge.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="declarationConfirmed"
                checked={formData.declarationConfirmed}
                onCheckedChange={(checked) => updateFormData('declarationConfirmed', checked)}
              />
              <Label htmlFor="declarationConfirmed" className="text-sm">
                I confirm that all information provided is true and accurate *
              </Label>
            </div>
            {errors.declarationConfirmed && <p className="text-red-500 text-sm">{errors.declarationConfirmed}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="signatoryName">Signature of Owner/Representative *</Label>
                <Input
                  id="signatoryName"
                  value={formData.signatoryName}
                  onChange={(e) => updateFormData('signatoryName', e.target.value)}
                  className={errors.signatoryName ? 'border-red-500' : ''}
                  placeholder="Type full name as signature"
                />
                {errors.signatoryName && <p className="text-red-500 text-sm">{errors.signatoryName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signatoryDate">Date</Label>
                <Input
                  id="signatoryDate"
                  type="date"
                  value={formData.signatoryDate}
                  onChange={(e) => updateFormData('signatoryDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* General Error Display */}
        {errors.general && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onBack}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground hidden sm:block">
              {completionProgress}% Complete • {formData.branches.length} Branch{formData.branches.length !== 1 ? 'es' : ''}
            </div>
            
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ButtonLoadingSpinner />
                  Submitting...
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}