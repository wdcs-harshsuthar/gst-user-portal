import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  FileText, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Trash2,
  User,
  Building2,
  Upload,
  Receipt,
  MessageSquare,
  AlertCircle,
  Calendar,
  DollarSign,
  Hash,
  Home,
  MapPin,
  Camera,
  Navigation,
  Shield,
  Image as ImageIcon
} from 'lucide-react';
import { RegistrationData } from '../../UserApp';
import GSTApprovalPopup from './GSTApprovalPopup';
import DocumentViewer from './DocumentViewer';
import PropertyVerificationTab from './PropertyVerificationTab';
import { GSTNumberData, formatGSTNumberForDisplay } from '../shared/gstUtils';

interface AdminApplicationsProps {
  applications: RegistrationData[];
  onUpdateStatus: (applicationReference: string, status: RegistrationData['status'], notes?: string, gstData?: GSTNumberData) => void;
  onDeleteApplication: (applicationReference: string) => void;
  onDocumentVerify: (applicationReference: string, documentId: string, verified: boolean, notes: string) => void;
  adminUser: any;
}

export default function AdminApplications({ 
  applications, 
  onUpdateStatus, 
  onDeleteApplication,
  onDocumentVerify,
  adminUser 
}: AdminApplicationsProps) {
  const [selectedApplication, setSelectedApplication] = useState<RegistrationData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewStatus, setReviewStatus] = useState<RegistrationData['status']>('approved');
  const [showGSTApprovalPopup, setShowGSTApprovalPopup] = useState(false);
  const [pendingApprovalApp, setPendingApprovalApp] = useState<RegistrationData | null>(null);

  // Filter applications
  const filteredApplications = applications.filter(app => {
    const matchesSearch = !searchTerm || 
      app.applicationReference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getApplicantName(app).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    const matchesType = typeFilter === 'all' || 
      (typeFilter === 'individual' && app.applicantType === 'individual') ||
      (typeFilter === 'business' && app.entryPoint === 'business');
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort applications by submission date (newest first)
  const sortedApplications = filteredApplications.sort((a, b) => 
    new Date(b.submissionDate || 0).getTime() - new Date(a.submissionDate || 0).getTime()
  );

  const getApplicantName = (app: RegistrationData) => {
    if (app.individualData?.firstName && app.individualData?.lastName) {
      return `${app.individualData.firstName} ${app.individualData.lastName}`;
    }
    if (app.businessData?.registeredName) {
      return app.businessData.registeredName;
    }
    return 'Unknown Applicant';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'pending-receipt': return 'bg-orange-100 text-orange-800';
      case 'under-review': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'submitted': return CheckCircle2;
      case 'pending-receipt': return Upload;
      case 'under-review': return Clock;
      case 'processing': return Clock;
      case 'approved': return CheckCircle2;
      case 'rejected': return XCircle;
      default: return AlertCircle;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = () => {
    if (selectedApplication && reviewStatus) {
      // If approving, show GST approval popup
      if (reviewStatus === 'approved') {
        setPendingApprovalApp(selectedApplication);
        setShowGSTApprovalPopup(true);
        setSelectedApplication(null);
      } else {
        // For other status updates, proceed normally
        onUpdateStatus(selectedApplication.applicationReference!, reviewStatus, reviewNotes);
        setSelectedApplication(null);
        setReviewNotes('');
        setReviewStatus('approved');
      }
    }
  };

  const handleGSTApprovalComplete = (gstData: GSTNumberData, emailSent: boolean) => {
    if (pendingApprovalApp) {
      // Update application with GST data
      onUpdateStatus(
        pendingApprovalApp.applicationReference!, 
        'approved', 
        `${reviewNotes}\\n\\nGST Number Generated: ${gstData.gstNumber}\\nEmail Notification: ${emailSent ? 'Sent' : 'Failed'}`,
        gstData
      );
    }
    
    // Close popup and reset state
    setShowGSTApprovalPopup(false);
    setPendingApprovalApp(null);
    setReviewNotes('');
    setReviewStatus('approved');
  };

  const downloadApplication = (app: RegistrationData) => {
    const applicationData = {
      applicationReference: app.applicationReference,
      submissionDate: formatDate(app.submissionDate),
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
      gstNumber: (app as any).gstNumber,
      adminNotes: (app as any).adminNotes,
      statusUpdatedBy: (app as any).statusUpdatedBy
    };

    const dataStr = JSON.stringify(applicationData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `GST_Application_${app.applicationReference}_Admin.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDocumentVerification = (documentId: string, verified: boolean, notes: string) => {
    if (selectedApplication) {
      onDocumentVerify(selectedApplication.applicationReference!, documentId, verified, notes);
    }
  };

  const statusCounts = {
    all: applications.length,
    'pending-receipt': applications.filter(app => app.status === 'pending-receipt').length,
    'under-review': applications.filter(app => app.status === 'under-review').length,
    'processing': applications.filter(app => app.status === 'processing').length,
    'approved': applications.filter(app => app.status === 'approved').length,
    'rejected': applications.filter(app => app.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* GST Approval Popup */}
      <GSTApprovalPopup
        isOpen={showGSTApprovalPopup}
        onClose={() => {
          setShowGSTApprovalPopup(false);
          setPendingApprovalApp(null);
        }}
        application={pendingApprovalApp}
        adminUser={adminUser}
        onApprovalComplete={handleGSTApprovalComplete}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">Application Management</h1>
          <p className="text-gray-600">Review and manage GST registration applications</p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {applications.length} Total Applications
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-medium text-orange-600">{statusCounts['pending-receipt']}</div>
            <div className="text-sm text-gray-600">Pending Receipts</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-medium text-yellow-600">{statusCounts['under-review']}</div>
            <div className="text-sm text-gray-600">Under Review</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-medium text-purple-600">{statusCounts['processing']}</div>
            <div className="text-sm text-gray-600">Processing</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-medium text-green-600">{statusCounts['approved']}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-medium text-red-600">{statusCounts['rejected']}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-medium text-blue-600">{statusCounts['all']}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search Applications</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Reference number or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                  <SelectItem value="pending-receipt">Pending Receipts ({statusCounts['pending-receipt']})</SelectItem>
                  <SelectItem value="under-review">Under Review ({statusCounts['under-review']})</SelectItem>
                  <SelectItem value="processing">Processing ({statusCounts['processing']})</SelectItem>
                  <SelectItem value="approved">Approved ({statusCounts['approved']})</SelectItem>
                  <SelectItem value="rejected">Rejected ({statusCounts['rejected']})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Type Filter</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" />
                Export Results
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications ({sortedApplications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>GST Number</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedApplications.map((app, index) => {
                  const StatusIcon = getStatusIcon(app.status);
                  const needsAttention = app.status === 'pending-receipt' || app.status === 'under-review';
                  const hasGSTNumber = (app as any).gstNumber;
                  
                  return (
                    <TableRow key={index} className={needsAttention ? 'bg-yellow-50' : ''}>
                      <TableCell className="font-mono text-sm">
                        {app.applicationReference}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {app.applicantType === 'individual' ? 
                            <User className="h-4 w-4 text-gray-500" /> : 
                            <Building2 className="h-4 w-4 text-gray-500" />
                          }
                          <div>
                            <div className="font-medium max-w-[200px] truncate">
                              {getApplicantName(app)}
                            </div>
                            <div className="text-sm text-gray-500">
                              {app.individualData?.email || app.businessData?.businessEmail}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {app.applicantType === 'individual' ? 'Individual' : 
                           app.businessType === 'sole proprietorship' ? 'Sole Prop.' : 'Business'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatDate(app.submissionDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <StatusIcon className="h-4 w-4" />
                          <Badge className={getStatusColor(app.status)}>
                            {app.status?.replace('-', ' ')?.toUpperCase() || 'UNKNOWN'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {hasGSTNumber ? (
                          <div className="flex items-center gap-2">
                            <Hash className="h-3 w-3 text-green-600" />
                            <span className="font-mono text-sm text-green-700">
                              {formatGSTNumberForDisplay(hasGSTNumber).substring(0, 20)}...
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not Generated</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 text-gray-400" />
                          <span className="text-sm">${app.paymentData?.totalAmount?.toFixed(2) || '0.00'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* Review Button */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedApplication(app)}
                                className={needsAttention ? 'border-yellow-300 bg-yellow-50' : ''}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Application Review - {app.applicationReference}</DialogTitle>
                                <DialogDescription>
                                  Complete application details and admin actions
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedApplication && (
                                <Tabs defaultValue="details" className="space-y-4">
                                  <TabsList className="grid w-full grid-cols-5">
                                    <TabsTrigger value="details">Details</TabsTrigger>
                                    <TabsTrigger value="payment">Payment</TabsTrigger>
                                    <TabsTrigger value="documents">Documents</TabsTrigger>
                                    <TabsTrigger value="property">Property Verification</TabsTrigger>
                                    <TabsTrigger value="admin">Admin Actions</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="details" className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm text-gray-600">Application Reference</Label>
                                        <p className="font-mono">{selectedApplication.applicationReference}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-600">Submission Date</Label>
                                        <p>{formatDate(selectedApplication.submissionDate)}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-600">Applicant Name</Label>
                                        <p>{getApplicantName(selectedApplication)}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-gray-600">Application Type</Label>
                                        <p className="capitalize">{selectedApplication.applicantType}</p>
                                      </div>
                                    </div>

                                    {/* Show GST Number if approved */}
                                    {(selectedApplication as any).gstNumber && (
                                      <div className="border-2 border-green-200 bg-green-50 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Hash className="h-5 w-5 text-green-600" />
                                          <Label className="text-sm text-green-800">Generated GST Number</Label>
                                        </div>
                                        <p className="font-mono text-lg text-green-800">
                                          {formatGSTNumberForDisplay((selectedApplication as any).gstNumber)}
                                        </p>
                                      </div>
                                    )}

                                    {selectedApplication.individualData && (
                                      <div className="border rounded-lg p-4">
                                        <h4 className="font-medium mb-3">Personal Information</h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                          <div>
                                            <Label className="text-gray-600">Phone</Label>
                                            <p>{selectedApplication.individualData.phone}</p>
                                          </div>
                                          <div>
                                            <Label className="text-gray-600">Email</Label>
                                            <p>{selectedApplication.individualData.email}</p>
                                          </div>
                                          <div>
                                            <Label className="text-gray-600">Occupation</Label>
                                            <p>{selectedApplication.individualData.occupation}</p>
                                          </div>
                                          <div>
                                            <Label className="text-gray-600">County</Label>
                                            <p>{selectedApplication.individualData.county}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    {selectedApplication.businessData && (
                                      <div className="border rounded-lg p-4">
                                        <h4 className="font-medium mb-3">Business Information</h4>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                          <div>
                                            <Label className="text-gray-600">Business Name</Label>
                                            <p>{selectedApplication.businessData.businessName}</p>
                                          </div>
                                          <div>
                                            <Label className="text-gray-600">Registration Number</Label>
                                            <p>{selectedApplication.businessData.registrationNumber}</p>
                                          </div>
                                          <div>
                                            <Label className="text-gray-600">Business Phone</Label>
                                            <p>{selectedApplication.businessData.businessPhone}</p>
                                          </div>
                                          <div>
                                            <Label className="text-gray-600">Business Email</Label>
                                            <p>{selectedApplication.businessData.businessEmail}</p>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </TabsContent>

                                  <TabsContent value="payment" className="space-y-4">
                                    <div className="border rounded-lg p-4">
                                      <h4 className="font-medium mb-3">Payment Information</h4>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-gray-600">Payment Method</Label>
                                          <p className="capitalize">{selectedApplication.paymentData?.paymentMethod || 'N/A'}</p>
                                        </div>
                                        <div>
                                          <Label className="text-gray-600">Total Amount</Label>
                                          <p className="font-medium">${selectedApplication.paymentData?.totalAmount?.toFixed(2) || '0.00'}</p>
                                        </div>
                                        {selectedApplication.paymentData?.challanNumber && (
                                          <div>
                                            <Label className="text-gray-600">Challan Number</Label>
                                            <p className="font-mono">{selectedApplication.paymentData.challanNumber}</p>
                                          </div>
                                        )}
                                        {selectedApplication.paymentData?.receiptUploadDate && (
                                          <div>
                                            <Label className="text-gray-600">Receipt Uploaded</Label>
                                            <p>{formatDate(selectedApplication.paymentData.receiptUploadDate)}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {selectedApplication.paymentData?.paymentMethod === 'offline' && (
                                      <Alert>
                                        <Receipt className="h-4 w-4" />
                                        <AlertDescription>
                                          This application used offline bank payment. Please verify the uploaded receipt carefully.
                                        </AlertDescription>
                                      </Alert>
                                    )}
                                  </TabsContent>

                                  <TabsContent value="documents" className="space-y-4">
                                    <DocumentViewer 
                                      documents={selectedApplication.uploadedDocuments || []} 
                                      applicationReference={selectedApplication.applicationReference!}
                                      adminUser={adminUser}
                                      onDocumentVerify={handleDocumentVerification}
                                    />
                                  </TabsContent>

                                  <TabsContent value="property" className="space-y-4">
                                    <PropertyVerificationTab application={selectedApplication} />
                                  </TabsContent>

                                  <TabsContent value="admin" className="space-y-4">
                                    <div className="border rounded-lg p-4">
                                      <h4 className="font-medium mb-3">Admin Actions</h4>
                                      
                                      <div className="space-y-4">
                                        <div className="space-y-2">
                                          <Label>Update Application Status</Label>
                                          <Select value={reviewStatus} onValueChange={(value) => setReviewStatus(value as RegistrationData['status'])}>
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="pending-receipt">Pending Receipt</SelectItem>
                                              <SelectItem value="under-review">Under Review</SelectItem>
                                              <SelectItem value="processing">Processing</SelectItem>
                                              <SelectItem value="approved">Approved</SelectItem>
                                              <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>

                                        <div className="space-y-2">
                                          <Label>Admin Notes</Label>
                                          <Textarea
                                            value={reviewNotes}
                                            onChange={(e) => setReviewNotes(e.target.value)}
                                            placeholder="Add notes about the application review..."
                                            rows={3}
                                          />
                                        </div>

                                        <div className="flex gap-2">
                                          <Button onClick={handleStatusUpdate} className="bg-blue-600 hover:bg-blue-700">
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Update Status
                                          </Button>
                                          
                                          <Button 
                                            variant="outline" 
                                            onClick={() => downloadApplication(selectedApplication)}
                                          >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Data
                                          </Button>

                                          <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                              <Button variant="destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                              </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                              <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Application</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                  Are you sure you want to delete this application? This action cannot be undone.
                                                </AlertDialogDescription>
                                              </AlertDialogHeader>
                                              <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction 
                                                  onClick={() => {
                                                    onDeleteApplication(selectedApplication.applicationReference!);
                                                    setSelectedApplication(null);
                                                  }}
                                                  className="bg-red-600 hover:bg-red-700"
                                                >
                                                  Delete
                                                </AlertDialogAction>
                                              </AlertDialogFooter>
                                            </AlertDialogContent>
                                          </AlertDialog>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Show admin history if available */}
                                    {(selectedApplication as any).adminNotes && (
                                      <div className="border rounded-lg p-4 bg-gray-50">
                                        <h5 className="font-medium mb-2">Previous Admin Notes</h5>
                                        <p className="text-sm text-gray-700">{(selectedApplication as any).adminNotes}</p>
                                        {(selectedApplication as any).statusUpdatedBy && (
                                          <p className="text-xs text-gray-500 mt-2">
                                            Last updated by: {(selectedApplication as any).statusUpdatedBy}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                  </TabsContent>
                                </Tabs>
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
                              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Application</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete application {app.applicationReference}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => onDeleteApplication(app.applicationReference!)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}