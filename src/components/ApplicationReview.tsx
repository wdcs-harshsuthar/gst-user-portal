import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  Edit, 
  CreditCard, 
  DollarSign,
  FileText,
  User,
  Building2,
  Home,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Receipt,
  Download,
  Upload,
  Printer
} from 'lucide-react';
import { RegistrationData } from './UserApp';

interface ApplicationReviewProps {
  registrationData: RegistrationData;
  onComplete: (paymentData: any) => void;
  onBack: () => void;
  onEdit: (step: string) => void;
}

interface PaymentData {
  paymentMethod: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  billingAddress: string;
  mobileMoneyNumber: string;
  bankAccountNumber: string;
  bankName: string;
  agreedToTerms: boolean;
  processingFee: number;
  totalAmount: number;
  challanNumber?: string;
  bankReceiptFile?: File | null;
}

export default function ApplicationReview({ 
  registrationData, 
  onComplete, 
  onBack, 
  onEdit 
}: ApplicationReviewProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    mobileMoneyNumber: '',
    bankAccountNumber: '',
    bankName: '',
    agreedToTerms: false,
    processingFee: 2.50,
    totalAmount: 0,
    bankReceiptFile: null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [challanGenerated, setChallanGenerated] = useState(false);

  // Calculate fees based on application type
  const calculateFees = () => {
    let baseFee = 200.00; // Uniform fee of L$200.00 for all registration types
    
    // Add late registration penalty if applicable
    const hasExistingTin = registrationData.individualData?.existingTin || registrationData.businessData?.existingTin;
    const latePenalty = hasExistingTin ? 0 : 0; // Would calculate based on actual logic
    
    const subtotal = baseFee + latePenalty;
    const processingFee = paymentData.paymentMethod === 'offline' ? 0 : paymentData.processingFee; // No processing fee for offline
    const total = subtotal + processingFee;

    return {
      baseFee,
      latePenalty,
      processingFee,
      subtotal,
      total
    };
  };

  const fees = React.useMemo(() => calculateFees(), [
    registrationData.applicantType,
    registrationData.businessType,
    registrationData.individualData?.existingTin,
    registrationData.businessData?.existingTin,
    paymentData.paymentMethod,
    paymentData.processingFee
  ]);

  React.useEffect(() => {
    const newTotalAmount = fees.total;
    setPaymentData(prev => {
      if (prev.totalAmount !== newTotalAmount) {
        return { ...prev, totalAmount: newTotalAmount };
      }
      return prev;
    });
  }, [fees.total]);

  const updatePaymentData = (field: string, value: any) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generateChallanNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const sequentialNumber = Math.floor(Math.random() * 999999).toString().padStart(6, '0'); // Random 6-digit number for demo
    
    // Format: LRA/CH/YYYY/XXXXXX
    return `LRA/CH/${year}/${sequentialNumber}`;
  };

  const downloadChallan = () => {
    const challanNumber = generateChallanNumber();
    updatePaymentData('challanNumber', challanNumber);
    setChallanGenerated(true);

    const applicantName = registrationData.individualData?.firstName && registrationData.individualData?.lastName
      ? `${registrationData.individualData.firstName} ${registrationData.individualData.lastName}`
      : registrationData.businessData?.businessName || 'Unknown Applicant';

    const challanData = {
      title: 'LIBERIA REVENUE AUTHORITY',
      subtitle: 'GST Registration Payment Challan',
      challanNumber: challanNumber,
      applicationReference: `LRA/GST/${new Date().getFullYear()}/TEMP-${Math.floor(Math.random() * 999999).toString().padStart(6, '0')}`, // Temporary reference until completion
      applicantName: applicantName,
      applicationType: registrationData.applicantType,
      businessType: registrationData.businessType,
      paymentDetails: {
        baseFee: fees.baseFee,
        latePenalty: fees.latePenalty,
        total: fees.total
      },
      bankDetails: {
        bankName: 'Central Bank of Liberia',
        accountName: 'Liberia Revenue Authority',
        accountNumber: 'LRA-GST-001-2025',
        routingNumber: 'CBL-001',
        swiftCode: 'CBLRLRMX'
      },
      instructions: [
        'Take this challan to any authorized bank branch',
        'Make payment using the bank details provided above',
        'Obtain official bank receipt after payment',
        'Upload the bank receipt to complete your application',
        'Keep this challan and bank receipt for your records'
      ],
      generatedDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    // Create formatted challan content
    const challanContent = `
=================================================================
                    LIBERIA REVENUE AUTHORITY
                  GST Registration Payment Challan
=================================================================

Challan Number: ${challanData.challanNumber}
Generated Date: ${challanData.generatedDate}
Valid Until: ${challanData.validUntil}

-----------------------------------------------------------------
APPLICANT INFORMATION
-----------------------------------------------------------------
Name: ${challanData.applicantName}
Application Type: ${challanData.applicationType}
${challanData.businessType ? `Business Type: ${challanData.businessType}` : ''}

-----------------------------------------------------------------
PAYMENT DETAILS
-----------------------------------------------------------------
Registration Fee: L${challanData.paymentDetails.baseFee.toFixed(2)}
${challanData.paymentDetails.latePenalty > 0 ? `Late Penalty: L${challanData.paymentDetails.latePenalty.toFixed(2)}` : ''}
TOTAL AMOUNT: L${challanData.paymentDetails.total.toFixed(2)}

-----------------------------------------------------------------
BANK PAYMENT DETAILS
-----------------------------------------------------------------
Bank Name: ${challanData.bankDetails.bankName}
Account Name: ${challanData.bankDetails.accountName}
Account Number: ${challanData.bankDetails.accountNumber}
Routing Number: ${challanData.bankDetails.routingNumber}
SWIFT Code: ${challanData.bankDetails.swiftCode}

-----------------------------------------------------------------
PAYMENT INSTRUCTIONS
-----------------------------------------------------------------
${challanData.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

-----------------------------------------------------------------
IMPORTANT NOTES
-----------------------------------------------------------------
• This challan is valid for 30 days from generation date
• Payment must be made in Liberian Dollars (L$) only
• Keep the bank receipt for application completion
• Contact LRA at +231-XXX-XXXX for assistance

=================================================================
    © 2025 Republic of Liberia - Liberia Revenue Authority
=================================================================
    `;

    // Download as text file
    const dataBlob = new Blob([challanContent], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `GST_Payment_Challan_${challanNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, bankReceiptFile: 'Please upload a valid image (JPG, PNG) or PDF file' }));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, bankReceiptFile: 'File size must be less than 5MB' }));
        return;
      }

      updatePaymentData('bankReceiptFile', file);
    }
  };

  const validatePayment = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!paymentData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    if (!paymentData.agreedToTerms) {
      newErrors.agreedToTerms = 'You must agree to the terms and conditions';
    }

    // Validate based on payment method
    if (paymentData.paymentMethod === 'card') {
      if (!paymentData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
      if (!paymentData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
      if (!paymentData.cvv.trim()) newErrors.cvv = 'CVV is required';
      if (!paymentData.cardholderName.trim()) newErrors.cardholderName = 'Cardholder name is required';
    } else if (paymentData.paymentMethod === 'mobile') {
      if (!paymentData.mobileMoneyNumber.trim()) newErrors.mobileMoneyNumber = 'Mobile money number is required';
    } else if (paymentData.paymentMethod === 'bank') {
      if (!paymentData.bankAccountNumber.trim()) newErrors.bankAccountNumber = 'Bank account number is required';
      if (!paymentData.bankName.trim()) newErrors.bankName = 'Bank name is required';
    } else if (paymentData.paymentMethod === 'offline') {
      if (!challanGenerated) {
        newErrors.challanNumber = 'Please generate and download the payment challan first';
      }
      if (!paymentData.bankReceiptFile) {
        newErrors.bankReceiptFile = 'Please upload the bank payment receipt';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePayment()) {
      onComplete(paymentData);
    }
  };

  const renderPersonalInfo = () => {
    const data = registrationData.individualData;
    if (!data) return null;

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit('individual')}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Full Name</Label>
              <p className="font-medium">{`${data.title || ''} ${data.firstName} ${data.middleName || ''} ${data.lastName}`.trim()}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Date of Birth</Label>
              <p>{data.dateOfBirth}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Gender</Label>
              <p className="capitalize">{data.gender}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Marital Status</Label>
              <p className="capitalize">{data.maritalStatus}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Nationality</Label>
              <p>{data.nationality}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Occupation</Label>
              <p>{data.occupation}</p>
            </div>
          </div>

          {data.hasGstNumber && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <Label className="text-sm text-blue-700">Existing GST Number</Label>
              <p className="font-mono text-blue-900">{data.existingGstNumber}</p>
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">ID Type</Label>
              <p>{data.identificationType}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">ID Number</Label>
              <p className="font-mono">{data.idNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{data.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-500" />
            <span>{data.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{`${data.streetAddress}, ${data.city}, ${data.county}`}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderBusinessInfo = () => {
    const data = registrationData.businessData;
    if (!data) return null;

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Business Information
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit('business')}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Business Name</Label>
              <p className="font-medium">{data.businessName}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Business Type</Label>
              <p className="capitalize">{data.businessType}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Registration Number</Label>
              <p className="font-mono">{data.registrationNumber}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Date of Incorporation</Label>
              <p>{data.dateOfIncorporation}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600">Business Phone</Label>
              <p>{data.businessPhone}</p>
            </div>
            <div>
              <Label className="text-sm text-gray-600">Business Email</Label>
              <p>{data.businessEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{`${data.businessAddress}, ${data.businessCity}, ${data.businessCounty}`}</span>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPropertyInfo = () => {
    const data = registrationData.propertyData;
    if (!data) return null;

    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Property Declaration
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit('property')}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.properties && data.properties.length > 0 && (
            <div className="space-y-4">
              <Label className="text-sm text-gray-600">Declared Properties</Label>
              
              {/* Primary Property Information */}
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="h-4 w-4 text-blue-600" />
                  <Label className="text-sm font-semibold text-blue-800">Primary Property</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{data.streetAddress || 'Not specified'}</p>
                    {data.landmark && <p className="text-sm text-gray-500">{data.landmark}</p>}
                    <p className="text-sm">{data.city}, {data.county}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Property Details</p>
                    <p className="font-medium">$ {data.declaredValue ? Number(data.declaredValue).toLocaleString() : '0'}</p>
                    <p className="text-sm text-gray-600">
                      {data.bedrooms} bedrooms, {data.bathrooms} bathrooms
                    </p>
                    {data.currentCondition && (
                      <Badge variant="outline" className="mt-1">{data.currentCondition}</Badge>
                    )}
                  </div>
                </div>
                
                {/* Construction Details */}
                {(data.foundation || data.walls || data.roof) && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-sm text-gray-600 mb-2">Construction</p>
                    <div className="flex flex-wrap gap-2">
                      {data.foundation && <Badge variant="secondary">Foundation: {data.foundation}</Badge>}
                      {data.walls && <Badge variant="secondary">Walls: {data.walls}</Badge>}
                      {data.roof && <Badge variant="secondary">Roof: {data.roof}</Badge>}
                    </div>
                  </div>
                )}
              </div>

              {/* Additional Properties from Property Schedule */}
              {data.properties && data.properties.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm text-gray-600">Additional Properties ({data.properties.length})</Label>
                  {data.properties.map((property: any, index: number) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {property.location || `Property ${index + 1}`}
                          </p>
                          {property.description && (
                            <p className="text-sm text-gray-600 mt-1">{property.description}</p>
                          )}
                        </div>
                        {property.classification && (
                          <Badge variant="outline" className="ml-2">{property.classification}</Badge>
                        )}
                      </div>
                      
                      {property.value && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-700">
                            $ {Number(property.value).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Property Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Receipt className="h-4 w-4 text-gray-600" />
                  <Label className="text-sm font-semibold text-gray-700">Property Tax Summary</Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Declared Value</p>
                    <p className="font-medium">
                      $ {(() => {
                        const primaryValue = Number(data.declaredValue) || 0;
                        const additionalValue = data.properties ? 
                          data.properties.reduce((sum: number, prop: any) => sum + (Number(prop.value) || 0), 0) : 0;
                        return (primaryValue + additionalValue).toLocaleString();
                      })()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tax Rate</p>
                    <p className="font-medium">{data.taxRate || '0.25'}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Annual Tax Amount</p>
                    <p className="font-medium text-blue-600">
                      $ {data.annualTaxAmount ? Number(data.annualTaxAmount).toLocaleString() : '0'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Eye className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl">Review Application & Payment</h2>
        </div>
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Step {registrationData.entryPoint === 'individual' && registrationData.applicantType === 'individual' ? '3' : '4'} of {registrationData.entryPoint === 'individual' && registrationData.applicantType === 'individual' ? '4' : '5'}
        </Badge>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please review your application details carefully. You can edit any section by clicking the "Edit" button. 
          Once payment is processed, changes will require additional fees.
        </AlertDescription>
      </Alert>

      {/* Application Summary */}
      <div className="space-y-6">
        <h3 className="text-xl font-medium">Application Summary</h3>
        
        {renderPersonalInfo()}
        {renderBusinessInfo()}
        {renderPropertyInfo()}
      </div>

      {/* Fee Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Fee Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Registration Fee ({registrationData.applicantType})</span>
              <span>L${fees.baseFee.toFixed(2)}</span>
            </div>
            {fees.latePenalty > 0 && (
              <div className="flex justify-between text-red-600">
                <span>Late Registration Penalty</span>
                <span>L${fees.latePenalty.toFixed(2)}</span>
              </div>
            )}

            <Separator />
            <div className="flex justify-between font-medium text-lg">
              <span>Total Amount</span>
              <span>L${fees.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Payment Method *</Label>
            <RadioGroup 
              value={paymentData.paymentMethod} 
              onValueChange={(value) => updatePaymentData('paymentMethod', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card">Credit/Debit Card</Label>
                <Badge variant="outline" className="ml-2">Instant</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mobile" id="mobile" />
                <Label htmlFor="mobile">Mobile Money (Orange Money, MTN)</Label>
                <Badge variant="outline" className="ml-2">Instant</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank">Bank Transfer</Label>
                <Badge variant="outline" className="ml-2">1-2 Days</Badge>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="offline" id="offline" />
                <Label htmlFor="offline">Offline Payment to Bank</Label>
                <Badge variant="outline" className="ml-2 bg-green-50 text-green-700">No Processing Fee</Badge>
              </div>
            </RadioGroup>
            {errors.paymentMethod && <p className="text-red-500 text-sm">{errors.paymentMethod}</p>}
          </div>

          {/* Card Payment Fields */}
          {paymentData.paymentMethod === 'card' && (
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium">Card Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardholderName">Cardholder Name *</Label>
                  <Input
                    id="cardholderName"
                    value={paymentData.cardholderName}
                    onChange={(e) => updatePaymentData('cardholderName', e.target.value)}
                    className={errors.cardholderName ? 'border-red-500' : ''}
                  />
                  {errors.cardholderName && <p className="text-red-500 text-sm">{errors.cardholderName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <Input
                    id="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={(e) => updatePaymentData('cardNumber', e.target.value)}
                    placeholder="1234 5678 9012 3456"
                    className={errors.cardNumber ? 'border-red-500' : ''}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm">{errors.cardNumber}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date *</Label>
                  <Input
                    id="expiryDate"
                    value={paymentData.expiryDate}
                    onChange={(e) => updatePaymentData('expiryDate', e.target.value)}
                    placeholder="MM/YY"
                    className={errors.expiryDate ? 'border-red-500' : ''}
                  />
                  {errors.expiryDate && <p className="text-red-500 text-sm">{errors.expiryDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input
                    id="cvv"
                    value={paymentData.cvv}
                    onChange={(e) => updatePaymentData('cvv', e.target.value)}
                    placeholder="123"
                    maxLength={4}
                    className={errors.cvv ? 'border-red-500' : ''}
                  />
                  {errors.cvv && <p className="text-red-500 text-sm">{errors.cvv}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Mobile Money Fields */}
          {paymentData.paymentMethod === 'mobile' && (
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium">Mobile Money Details</h4>
              <div className="space-y-2">
                <Label htmlFor="mobileMoneyNumber">Mobile Money Number *</Label>
                <Input
                  id="mobileMoneyNumber"
                  value={paymentData.mobileMoneyNumber}
                  onChange={(e) => updatePaymentData('mobileMoneyNumber', e.target.value)}
                  placeholder="+231-XXX-XXXX"
                  className={errors.mobileMoneyNumber ? 'border-red-500' : ''}
                />
                {errors.mobileMoneyNumber && <p className="text-red-500 text-sm">{errors.mobileMoneyNumber}</p>}
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  You will receive a payment prompt on your mobile device to complete this transaction.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Bank Transfer Fields */}
          {paymentData.paymentMethod === 'bank' && (
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium">Bank Transfer Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Select value={paymentData.bankName} onValueChange={(value) => updatePaymentData('bankName', value)}>
                    <SelectTrigger className={errors.bankName ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LBDI">Liberia Bank for Development and Investment</SelectItem>
                      <SelectItem value="FBL">First National Bank Liberia</SelectItem>
                      <SelectItem value="UBA">United Bank for Africa</SelectItem>
                      <SelectItem value="GTB">Guaranty Trust Bank</SelectItem>
                      <SelectItem value="ECB">Ecobank Liberia</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.bankName && <p className="text-red-500 text-sm">{errors.bankName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bankAccountNumber">Account Number *</Label>
                  <Input
                    id="bankAccountNumber"
                    value={paymentData.bankAccountNumber}
                    onChange={(e) => updatePaymentData('bankAccountNumber', e.target.value)}
                    className={errors.bankAccountNumber ? 'border-red-500' : ''}
                  />
                  {errors.bankAccountNumber && <p className="text-red-500 text-sm">{errors.bankAccountNumber}</p>}
                </div>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Processing time: 1-2 business days. You will receive confirmation once payment is verified.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Offline Payment Fields */}
          {paymentData.paymentMethod === 'offline' && (
            <div className="space-y-6 border rounded-lg p-4 bg-green-50">
              <h4 className="font-medium">Offline Bank Payment</h4>
              
              {/* Step 1: Generate Challan */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <h5 className="font-medium">Generate Payment Challan</h5>
                </div>
                <p className="text-sm text-gray-600 ml-8">
                  Download the payment challan with bank details and take it to any authorized bank.
                </p>
                <div className="ml-8">
                  {!challanGenerated ? (
                    <Button
                      type="button"
                      onClick={downloadChallan}
                      variant="outline"
                      className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Generate & Download Challan
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm">Challan Generated: {paymentData.challanNumber}</span>
                    </div>
                  )}
                </div>
                {errors.challanNumber && <p className="text-red-500 text-sm ml-8">{errors.challanNumber}</p>}
              </div>

              <Separator />

              {/* Step 2: Make Payment */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
                  <h5 className="font-medium">Make Payment at Bank</h5>
                </div>
                <div className="ml-8 space-y-2">
                  <p className="text-sm text-gray-600">Visit any authorized bank branch with the challan and make payment of:</p>
                  <p className="text-lg font-medium text-green-600">L${fees.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Obtain an official bank receipt after payment.</p>
                </div>
              </div>

              <Separator />

              {/* Step 3: Upload Receipt */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
                  <h5 className="font-medium">Upload Bank Receipt</h5>
                </div>
                <div className="ml-8 space-y-3">
                  <p className="text-sm text-gray-600">
                    Upload a clear photo or scan of your bank payment receipt to complete the application.
                  </p>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bankReceipt">Bank Receipt *</Label>
                    <Input
                      id="bankReceipt"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleReceiptUpload}
                      className={errors.bankReceiptFile ? 'border-red-500' : ''}
                    />
                    {errors.bankReceiptFile && <p className="text-red-500 text-sm">{errors.bankReceiptFile}</p>}
                    
                    {paymentData.bankReceiptFile && (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Receipt uploaded: {paymentData.bankReceiptFile.name}</span>
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-500">
                      Supported formats: JPG, PNG, PDF (Max size: 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your application will be processed within 1-2 business days after receipt verification. 
                  You will receive email confirmation once the payment is verified.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="space-y-4">
            <Separator />
            <div className="flex items-start space-x-2">
              <Checkbox
                id="agreedToTerms"
                checked={paymentData.agreedToTerms}
                onCheckedChange={(checked) => updatePaymentData('agreedToTerms', checked)}
              />
              <div className="space-y-1">
                <Label htmlFor="agreedToTerms" className="text-sm">
                  I agree to the terms and conditions, privacy policy, and authorize the Liberia Revenue Authority to process this {paymentData.paymentMethod === 'offline' ? 'application and verify the uploaded payment receipt' : 'payment'} for GST registration services. *
                </Label>
                {errors.agreedToTerms && <p className="text-red-500 text-sm">{errors.agreedToTerms}</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Property Declaration
        </Button>
        <Button 
          type="submit" 
          className={`${paymentData.paymentMethod === 'offline' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
          size="lg"
        >
          {paymentData.paymentMethod === 'offline' ? (
            <>
              <Upload className="mr-2 h-5 w-5" />
              Submit Application with Receipt
            </>
          ) : (
            <>
              <DollarSign className="mr-2 h-5 w-5" />
              Proceed to Payment (L${fees.total.toFixed(2)})
            </>
          )}
        </Button>
      </div>
    </form>
  );
}