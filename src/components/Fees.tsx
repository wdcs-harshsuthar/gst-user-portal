import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { 
  DollarSign, 
  FileText, 
  Download,
  CreditCard,
  Calendar,
  Building2,
  User
} from 'lucide-react';

const feeStructure = [
  {
    category: 'Individual Registration',
    description: 'GST registration for individual taxpayers',
    fee: 200.00,
    currency: 'L$',
    applicableTo: 'Individual'
  },
  {
    category: 'Business Registration',
    description: 'GST registration for business entities',
    fee: 200.00,
    currency: 'L$',
    applicableTo: 'Business'
  },
  {
    category: 'Sole Proprietorship',
    description: 'GST registration for sole proprietorship',
    fee: 200.00,
    currency: 'L$',
    applicableTo: 'Sole Proprietorship'
  },
  {
    category: 'Amendment Fee',
    description: 'Fee for modifying existing GST registration',
    fee: 15.00,
    currency: 'L$',
    applicableTo: 'All'
  },
  {
    category: 'Late Registration Penalty',
    description: 'Penalty for late GST registration',
    fee: 100.00,
    currency: 'L$',
    applicableTo: 'All'
  },
  {
    category: 'Certificate Replacement',
    description: 'Fee for replacing lost or damaged GST certificate',
    fee: 10.00,
    currency: 'L$',
    applicableTo: 'All'
  }
];

const paymentMethods = [
  {
    method: 'Bank Transfer',
    description: 'Direct bank transfer to LRA account',
    processingTime: '1-2 business days',
    available: true
  },
  {
    method: 'Mobile Money',
    description: 'Orange Money, MTN Mobile Money',
    processingTime: 'Instant',
    available: true
  },
  {
    method: 'Cash Payment',
    description: 'Payment at LRA offices',
    processingTime: 'Instant',
    available: true
  },
  {
    method: 'Credit/Debit Card',
    description: 'Visa, Mastercard payments',
    processingTime: 'Instant',
    available: false
  }
];

export default function Fees() {
  const downloadFeeSchedule = () => {
    const feeData = {
      title: 'GST Registration Fee Schedule - Republic of Liberia',
      lastUpdated: new Date().toISOString().split('T')[0],
      feeStructure,
      paymentMethods,
      notes: [
        'All fees are subject to change with prior notice',
        'Payment must be made before application processing',
        'Fees are non-refundable once application is submitted',
        'Late registration penalties apply 30 days after required registration date'
      ]
    };

    const dataStr = JSON.stringify(feeData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'GST_Fee_Schedule.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getIconForCategory = (category: string) => {
    if (category.includes('Individual')) return User;
    if (category.includes('Business') || category.includes('Proprietorship')) return Building2;
    return FileText;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">GST Registration Fees</h2>
          <p className="text-gray-600">
            Official fee schedule for GST registration in the Republic of Liberia
          </p>
        </div>
        <Button onClick={downloadFeeSchedule} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Download Fee Schedule
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Individual Fee</p>
                <p className="text-2xl text-gray-900">L$200</p>
              </div>
              <User className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Business Fee</p>
                <p className="text-2xl text-gray-900">L$200</p>
              </div>
              <Building2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Amendment Fee</p>
                <p className="text-2xl text-gray-900">L$15</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Late Penalty</p>
                <p className="text-2xl text-gray-900">L$100</p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Structure Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Fee Structure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Fee ($)</TableHead>
                  <TableHead>Applicable To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeStructure.map((fee, index) => {
                  const Icon = getIconForCategory(fee.category);
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span>{fee.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        {fee.description}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-lg">
                          {fee.currency}{fee.fee.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {fee.applicableTo}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method, index) => (
              <div 
                key={index}
                className={`p-4 border rounded-lg ${
                  method.available 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium ${
                    method.available ? 'text-green-900' : 'text-gray-500'
                  }`}>
                    {method.method}
                  </h4>
                  <Badge 
                    variant={method.available ? "default" : "secondary"}
                    className={method.available ? "bg-green-600" : ""}
                  >
                    {method.available ? 'Available' : 'Coming Soon'}
                  </Badge>
                </div>
                <p className={`text-sm mb-2 ${
                  method.available ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {method.description}
                </p>
                <p className={`text-xs ${
                  method.available ? 'text-green-600' : 'text-gray-500'
                }`}>
                  Processing time: {method.processingTime}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Important Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">Payment Required Before Processing</h4>
                <p className="text-sm text-blue-700">
                  All registration fees must be paid in full before your application can be processed.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Late Registration Penalties</h4>
                <p className="text-sm text-yellow-700">
                  A penalty of L$100 applies if you register more than 30 days after the required registration date.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <DollarSign className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900">Non-Refundable Fees</h4>
                <p className="text-sm text-red-700">
                  All fees are non-refundable once your application has been submitted for processing.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}