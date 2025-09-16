import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  User,
  Building2,
  Plus,
  Trash2,
  Upload,
  Receipt,
  Hash,
  Copy,
  Star,
  CheckCircle,
  XCircle,
  DollarSign,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { formatGSTNumberForDisplay } from './shared/gstUtils';

interface Application {
  entryPoint?: 'individual' | 'business';
  applicantType?: string;
  businessType?: string;
  individualData?: any;
  businessData?: any;
  soleProprietorshipData?: any;
  ownersShareholdersData?: any;
  propertyData?: any;
  paymentData?: any;
  submissionDate?: string;
  applicationReference?: string;
  status?: 'submitted' | 'pending-receipt' | 'under-review' | 'processing' | 'approved' | 'rejected';
  gstNumber?: string;
  gstGeneratedDate?: string;
  gstGeneratedBy?: string;
}

interface UserDashboardProps {
  applications: Application[];
  onStartNewApplication: () => void;
  onDeleteApplication: (applicationReference: string) => void;
  onUploadReceipt: (applicationReference: string, receiptFile: File) => void;
}

export default function UserDashboard({ 
  applications, 
  onStartNewApplication, 
  onDeleteApplication,
  onUploadReceipt
}: UserDashboardProps) {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [receiptUploadApp, setReceiptUploadApp] = useState<Application | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [copiedGST, setCopiedGST] = useState<string>('');

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);
    const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
    
    return `${formattedDate} at ${formattedTime}`;
  };

  const getApplicationType = (app: Application) => {
    if (app.applicantType === 'individual') return 'Individual';
    if (app.businessType === 'sole proprietorship') return 'Sole Proprietorship';
    if (app.entryPoint === 'business') return 'Business';
    return 'Unknown';
  };

  const getApplicationIcon = (app: Application) => {
    if (app.applicantType === 'individual') return User;
    return Building2;
  };

  const getStatus = (app: Application) => {
    // Use the application's status if available, otherwise calculate based on submission date
    if (app.status) {
      switch (app.status) {
        case 'submitted':
          return { status: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 };
        case 'pending-receipt':
          return { status: 'Pending Receipt', color: 'bg-orange-100 text-orange-800', icon: Upload };
        case 'under-review':
          return { status: 'Under Review', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
        case 'processing':
          return { status: 'Processing', color: 'bg-purple-100 text-purple-800', icon: AlertCircle };
        case 'approved':
          return { status: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle2 };
        case 'rejected':
          return { status: 'Rejected', color: 'bg-red-100 text-red-800', icon: AlertCircle };
      }
    }

    // Fallback to time-based status for demo purposes
    const daysSinceSubmission = app.submissionDate 
      ? Math.floor((Date.now() - new Date(app.submissionDate).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    if (daysSinceSubmission < 1) return { status: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: CheckCircle2 };
    if (daysSinceSubmission < 3) return { status: 'Under Review', color: 'bg-yellow-100 text-yellow-800', icon: Clock };
    if (daysSinceSubmission < 7) return { status: 'Processing', color: 'bg-orange-100 text-orange-800', icon: AlertCircle };
    return { status: 'Approved', color: 'bg-green-100 text-green-800', icon: CheckCircle2 };
  };

  const downloadApplication = (app: Application) => {
    const applicationData = {
      applicationReference: app.applicationReference,
      submissionDate: formatDateTime(app.submissionDate),
      applicationType: app.entryPoint,
      applicantType: app.applicantType,
      businessType: app.businessType,
      individualData: app.individualData,
      businessData: app.businessData,
      soleProprietorshipData: app.soleProprietorshipData,
      ownersShareholdersData: app.ownersShareholdersData,
      propertyData: app.propertyData,
      paymentData: app.paymentData,
      status: app.status,
      gstNumber: app.gstNumber,
      gstGeneratedDate: app.gstGeneratedDate
    };

    const dataStr = JSON.stringify(applicationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `GST_Application_${app.applicationReference}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteApplication = (applicationReference: string) => {
    onDeleteApplication(applicationReference);
  };

  const handleReceiptUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        setUploadError('Please upload a valid image (JPG, PNG) or PDF file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size must be less than 5MB');
        return;
      }

      setReceiptFile(file);
      setUploadError('');
    }
  };

  const submitReceiptUpload = () => {
    if (receiptUploadApp && receiptFile) {
      onUploadReceipt(receiptUploadApp.applicationReference!, receiptFile);
      setReceiptUploadApp(null);
      setReceiptFile(null);
      setUploadError('');
    }
  };

  const getApplicantName = (app: Application) => {
    if (app.individualData?.firstName && app.individualData?.lastName) {
      return `${app.individualData.firstName} ${app.individualData.lastName}`;
    }
    if (app.businessData?.registeredName) {
      return app.businessData.registeredName;
    }
    if (app.soleProprietorshipData?.registeredName) {
      return app.soleProprietorshipData.registeredName;
    }
    if (app.ownersShareholdersData?.registeredName) {
      return app.ownersShareholdersData.registeredName;
    }
    return 'Unknown Applicant';
  };

  const isPendingReceipt = (app: Application) => {
    return app.status === 'pending-receipt' && app.paymentData?.paymentMethod === 'offline';
  };

  const copyGSTNumber = (gstNumber: string) => {
    navigator.clipboard.writeText(gstNumber);
    setCopiedGST(gstNumber);
    setTimeout(() => setCopiedGST(''), 2000);
  };

  // Count approved applications with GST numbers
  const approvedApplications = applications.filter(app => app.status === 'approved' && app.gstNumber);
  const pendingReceiptCount = applications.filter(app => isPendingReceipt(app)).length;

  return (
    <div className="space-y-8">
      {/* Alert for pending receipts */}
      {pendingReceiptCount > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <Upload className="h-4 w-4" />
          <AlertDescription>
            You have {pendingReceiptCount} application{pendingReceiptCount > 1 ? 's' : ''} awaiting receipt upload to complete the registration process.
          </AlertDescription>
        </Alert>
      )}

      {/* GST Numbers Display for Approved Applications */}
      {approvedApplications.length > 0 && (
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Star className="h-5 w-5" />
              Your GST Registration Numbers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {approvedApplications.map((app, index) => (
              <div key={index} className="bg-white border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Hash className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-mono text-lg text-green-800">
                        {formatGSTNumberForDisplay(app.gstNumber!)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {getApplicationType(app)} • Approved {formatDate(app.gstGeneratedDate)}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyGSTNumber(app.gstNumber!)}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    {copiedGST === app.gstNumber ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription className="text-green-700">
                Keep your GST number(s) safe! You'll need them for filing returns, issuing invoices, and all GST-related transactions.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl text-gray-900">{applications.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Receipts</p>
                <p className="text-2xl text-gray-900">{pendingReceiptCount}</p>
              </div>
              <Upload className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Review</p>
                <p className="text-2xl text-gray-900">
                  {applications.filter(app => app.status === 'under-review' || app.status === 'processing').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl text-gray-900">
                  {applications.filter(app => app.status === 'approved').length}
                </p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <CardTitle className="text-[16px] font-normal font-bold">Recent Applications</CardTitle>
      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference Number</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>GST Number</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex flex-col items-center">
                        <FileText className="h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl text-gray-900 mb-2">No Applications Yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md">
                          You haven't submitted any GST registration applications yet. 
                          Start your first application to register for GST in Liberia.
                        </p>
                        <Button onClick={onStartNewApplication} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="mr-2 h-5 w-5" />
                          Start New Application
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((app, index) => {
                    const status = getStatus(app);
                    const Icon = getApplicationIcon(app);
                    const StatusIcon = status.icon;
                    const needsReceipt = isPendingReceipt(app);
                    
                    return (
                      <TableRow key={index} className={needsReceipt ? 'bg-orange-50' : ''}>
                        <TableCell className="font-mono text-sm">
                          {app.applicationReference}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-500" />
                            <span className="truncate max-w-[200px]">
                              {getApplicantName(app)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {getApplicationType(app)}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(app.submissionDate)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <StatusIcon className="h-4 w-4" />
                            <Badge className={status.color}>
                              {status.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {app.gstNumber ? (
                            <div className="flex items-center gap-2">
                              <Hash className="h-3 w-3 text-green-600" />
                              <span className="font-mono text-sm text-green-700">
                                {app.gstNumber.substring(0, 15)}...
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyGSTNumber(app.gstNumber!)}
                                className="h-6 w-6 p-0"
                              >
                                {copiedGST === app.gstNumber ? 
                                  <CheckCircle2 className="h-3 w-3 text-green-600" /> : 
                                  <Copy className="h-3 w-3 text-gray-400" />
                                }
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">Pending</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {/* Upload Receipt Button for pending applications */}
                            {needsReceipt && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100"
                                    onClick={() => setReceiptUploadApp(app)}
                                  >
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Upload Payment Receipt</DialogTitle>
                                    <DialogDescription>
                                      Upload your bank payment receipt for application {app.applicationReference}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="receiptFile">Bank Receipt *</Label>
                                      <Input
                                        id="receiptFile"
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleReceiptUpload}
                                      />
                                      {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
                                      {receiptFile && (
                                        <div className="flex items-center gap-2 text-green-600 text-sm">
                                          <CheckCircle2 className="h-4 w-4" />
                                          <span>File selected: {receiptFile.name}</span>
                                        </div>
                                      )}
                                      <p className="text-xs text-gray-500">
                                        Supported formats: JPG, PNG, PDF (Max size: 5MB)
                                      </p>
                                    </div>
                                    
                                    <Alert>
                                      <Receipt className="h-4 w-4" />
                                      <AlertDescription>
                                        Make sure your receipt clearly shows the payment amount, date, and reference to your GST application.
                                      </AlertDescription>
                                    </Alert>
                                    
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setReceiptUploadApp(null);
                                          setReceiptFile(null);
                                          setUploadError('');
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={submitReceiptUpload}
                                        disabled={!receiptFile}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        <Upload className="mr-2 h-4 w-4" />
                                        Upload Receipt
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}

                            {/* View Details Dialog */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedApplication(app)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Application Details</DialogTitle>
                                  <DialogDescription>
                                    View complete details for application {app.applicationReference}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedApplication && (
                                  <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <p className="text-sm text-gray-600">Reference Number</p>
                                        <p className="font-mono">{selectedApplication.applicationReference}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">Application Type</p>
                                        <p>{getApplicationType(selectedApplication)}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">Applicant Name</p>
                                        <p>{getApplicantName(selectedApplication)}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">Submission Date</p>
                                        <p>{formatDateTime(selectedApplication.submissionDate)}</p>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <Badge className={getStatus(selectedApplication).color}>
                                          {getStatus(selectedApplication).status}
                                        </Badge>
                                      </div>
                                      {selectedApplication.paymentData && (
                                        <div>
                                          <p className="text-sm text-gray-600">Payment Method</p>
                                          <p className="capitalize">{selectedApplication.paymentData.paymentMethod}</p>
                                        </div>
                                      )}
                                    </div>

                                    {/* GST Number Display */}
                                    {selectedApplication.gstNumber && (
                                      <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Hash className="h-5 w-5 text-green-600" />
                                          <h4 className="font-medium text-green-800">Your GST Registration Number</h4>
                                        </div>
                                        <div className="bg-white border border-green-300 rounded-lg p-3 mb-3">
                                          <div className="flex items-center justify-between">
                                            <span className="font-mono text-lg text-green-800">
                                              {formatGSTNumberForDisplay(selectedApplication.gstNumber)}
                                            </span>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => copyGSTNumber(selectedApplication.gstNumber!)}
                                              className="text-green-700 border-green-300 hover:bg-green-100"
                                            >
                                              {copiedGST === selectedApplication.gstNumber ? 
                                                <CheckCircle2 className="h-4 w-4" /> : 
                                                <Copy className="h-4 w-4" />
                                              }
                                            </Button>
                                          </div>
                                        </div>
                                        {selectedApplication.gstGeneratedDate && (
                                          <p className="text-sm text-green-600">
                                            Generated on {formatDateTime(selectedApplication.gstGeneratedDate)}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    
                                    {selectedApplication.individualData && (
                                      <div>
                                        <h4 className="font-medium mb-2">Personal Information</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <p><span className="text-gray-600">Phone:</span> {selectedApplication.individualData.phone}</p>
                                          <p><span className="text-gray-600">Email:</span> {selectedApplication.individualData.email}</p>
                                          <p><span className="text-gray-600">Occupation:</span> {selectedApplication.individualData.occupation}</p>
                                          <p><span className="text-gray-600">County:</span> {selectedApplication.individualData.county}</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {selectedApplication.businessData && (
                                      <div>
                                        <h4 className="font-medium mb-2">Business Information</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <p><span className="text-gray-600">Organization Type:</span> {selectedApplication.businessData.organizationType}</p>
                                          <p><span className="text-gray-600">Registration Number:</span> {selectedApplication.businessData.businessRegNumber}</p>
                                          <p><span className="text-gray-600">Contact:</span> {selectedApplication.businessData.contactName}</p>
                                          <p><span className="text-gray-600">Phone:</span> {selectedApplication.businessData.contactPhone}</p>
                                        </div>
                                      </div>
                                    )}
                                    
                                    {selectedApplication.propertyData && (
                                      <div>
                                        <h4 className="font-medium mb-2">Property Information</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                          <p><span className="text-gray-600">Owner:</span> {selectedApplication.propertyData.ownerFullName}</p>
                                          <p><span className="text-gray-600">Declared Value:</span> ${selectedApplication.propertyData.declaredValue}</p>
                                          <p><span className="text-gray-600">County:</span> {selectedApplication.propertyData.county}</p>
                                          <p><span className="text-gray-600">City:</span> {selectedApplication.propertyData.city}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            {/* Download Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadApplication(app)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>

                            {/* Delete Button */}
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Application</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this application? This action cannot be undone.
                                    <br /><br />
                                    <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                                      {app.applicationReference}
                                    </span>
                                    <br />
                                    <span className="text-sm text-gray-600">
                                      Applicant: {getApplicantName(app)}
                                    </span>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteApplication(app.applicationReference!)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete Application
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}