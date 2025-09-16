import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { 
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  Building2,
  Home,
  Eye,
  MessageSquare,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Shield,
  RefreshCw
} from 'lucide-react';

interface ApplicationForVerification {
  id: string;
  applicationId: string;
  applicantName: string;
  applicantType: 'individual' | 'business';
  submissionDate: string;
  applicationStatus: 'pending_verification' | 'approved' | 'rejected' | 'requires_clarification';
  documentStatus: 'verified' | 'rejected' | 'pending';
  propertyStatus: 'verified' | 'rejected' | 'pending' | 'not_applicable';
  priority: 'high' | 'medium' | 'low';
  assignedDate: string;
  reviewNotes: string;
  finalDecision: string;
  rejectionReason: string;
  applicantInfo: {
    email: string;
    phone: string;
    address: string;
    gstNumber?: string;
  };
  businessInfo?: {
    businessName: string;
    businessType: string;
    registrationNumber: string;
  };
  propertyInfo?: {
    address: string;
    declaredValue: number;
    bedrooms: number;
    bathrooms: number;
    estimatedValue?: number;
  };
  documentsSubmitted: number;
  documentsVerified: number;
  propertiesInspected: number;
  totalProperties: number;
}

const MOCK_APPLICATIONS: ApplicationForVerification[] = [
  {
    id: 'VER-2025-001',
    applicationId: 'LRA/GST/2025/000123',
    applicantName: 'John Michael Thompson',
    applicantType: 'individual',
    submissionDate: '2025-01-04 09:30 AM',
    applicationStatus: 'pending_verification',
    documentStatus: 'verified',
    propertyStatus: 'verified',
    priority: 'high',
    assignedDate: '2025-01-04 10:00 AM',
    reviewNotes: '',
    finalDecision: '',
    rejectionReason: '',
    applicantInfo: {
      email: 'john.thompson@email.com',
      phone: '+231-555-0123',
      address: '15 Broad Street, Central Monrovia',
      gstNumber: undefined
    },
    propertyInfo: {
      address: '15 Broad Street, Central Monrovia',
      declaredValue: 45000,
      bedrooms: 3,
      bathrooms: 2,
      estimatedValue: 48000
    },
    documentsSubmitted: 5,
    documentsVerified: 5,
    propertiesInspected: 1,
    totalProperties: 1
  },
  {
    id: 'VER-2025-002',
    applicationId: 'LRA/GST/2025/000124',
    applicantName: 'Sunrise Trading Company',
    applicantType: 'business',
    submissionDate: '2025-01-04 08:15 AM',
    applicationStatus: 'requires_clarification',
    documentStatus: 'verified',
    propertyStatus: 'rejected',
    priority: 'medium',
    assignedDate: '2025-01-04 09:00 AM',
    reviewNotes: 'Property valuation discrepancy needs clarification',
    finalDecision: '',
    rejectionReason: '',
    applicantInfo: {
      email: 'info@sunrisetrading.lr',
      phone: '+231-555-0124',
      address: '42 Randall Street, Sinkor'
    },
    businessInfo: {
      businessName: 'Sunrise Trading Company',
      businessType: 'Limited Liability Company',
      registrationNumber: 'LBR-LLC-2024-001'
    },
    propertyInfo: {
      address: '42 Randall Street, Sinkor',
      declaredValue: 125000,
      bedrooms: 0,
      bathrooms: 3,
      estimatedValue: 95000
    },
    documentsSubmitted: 8,
    documentsVerified: 7,
    propertiesInspected: 1,
    totalProperties: 1
  }
];

export default function ApplicationVerifierPortal() {
  const [applications, setApplications] = useState<ApplicationForVerification[]>(MOCK_APPLICATIONS);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationForVerification | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [finalDecision, setFinalDecision] = useState<'approved' | 'rejected' | 'requires_clarification'>('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicationId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.applicationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending_verification': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'requires_clarification': return 'bg-orange-100 text-orange-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'not_applicable': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const openReviewDialog = (application: ApplicationForVerification) => {
    setSelectedApplication(application);
    setVerificationNotes(application.reviewNotes);
    setRejectionReason(application.rejectionReason);
    setIsReviewDialogOpen(true);
  };

  const submitFinalDecision = () => {
    if (!selectedApplication) return;

    const updatedApplications = applications.map(app => {
      if (app.id === selectedApplication.id) {
        return {
          ...app,
          applicationStatus: finalDecision,
          reviewNotes: verificationNotes,
          rejectionReason: finalDecision === 'rejected' ? rejectionReason : '',
          finalDecision: finalDecision
        };
      }
      return app;
    });

    setApplications(updatedApplications);
    setIsReviewDialogOpen(false);
    setSelectedApplication(null);
    setVerificationNotes('');
    setRejectionReason('');
  };

  const getCompletionPercentage = (app: ApplicationForVerification) => {
    let completed = 0;
    let total = 3;

    if (app.documentsVerified === app.documentsSubmitted) completed++;
    if (app.propertyStatus === 'verified' || app.propertyStatus === 'not_applicable') completed++;
    if (app.applicationStatus !== 'pending_verification') completed++;

    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Application Verification Portal</h1>
            <p className="text-sm text-muted-foreground">Review and make final decisions on GST applications</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Badge variant="secondary">
            {applications.filter(app => app.applicationStatus === 'pending_verification').length} Pending Review
          </Badge>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-semibold">{applications.filter(a => a.applicationStatus === 'pending_verification').length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-semibold">{applications.filter(a => a.applicationStatus === 'approved').length}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-semibold">{applications.filter(a => a.applicationStatus === 'rejected').length}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-semibold">{applications.filter(a => a.applicationStatus === 'requires_clarification').length}</p>
                <p className="text-sm text-muted-foreground">Need Clarification</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by applicant name or application ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending_verification">Pending Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="requires_clarification">Needs Clarification</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications for Final Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application Details</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {application.applicantType === 'individual' ? (
                          <User className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Building2 className="h-4 w-4 text-purple-600" />
                        )}
                        <span className="font-medium">{application.applicantName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{application.applicationId}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Submitted: {application.submissionDate}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Completion</span>
                        <span className="font-medium">{getCompletionPercentage(application)}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${application.documentStatus === 'verified' ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>Documents</span>
                        <Badge className={getStatusColor(application.documentStatus)} variant="outline">
                          {application.documentStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${application.propertyStatus === 'verified' ? 'bg-green-500' : application.propertyStatus === 'not_applicable' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                        <span>Property</span>
                        <Badge className={getStatusColor(application.propertyStatus)} variant="outline">
                          {application.propertyStatus === 'not_applicable' ? 'N/A' : application.propertyStatus}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(application.applicationStatus)}>
                      {application.applicationStatus.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(application.priority)} variant="outline">
                      {application.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openReviewDialog(application)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Application Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Application Review - {selectedApplication?.applicantName}
            </DialogTitle>
            <DialogDescription>
              Review the complete application details and make a final verification decision.
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Application Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      {selectedApplication.applicantType === 'individual' ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <Building2 className="h-5 w-5" />
                      )}
                      Applicant Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm text-gray-600">Name</Label>
                      <p className="font-medium">{selectedApplication.applicantName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedApplication.applicantInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedApplication.applicantInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedApplication.applicantInfo.address}</span>
                    </div>
                    
                    {selectedApplication.businessInfo && (
                      <>
                        <div>
                          <Label className="text-sm text-gray-600">Business Name</Label>
                          <p className="font-medium">{selectedApplication.businessInfo.businessName}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Business Type</Label>
                          <p>{selectedApplication.businessInfo.businessType}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Registration Number</Label>
                          <p className="font-mono">{selectedApplication.businessInfo.registrationNumber}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <FileText className="h-5 w-5" />
                      Verification Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Documents</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{selectedApplication.documentsVerified}/{selectedApplication.documentsSubmitted}</span>
                        <Badge className={getStatusColor(selectedApplication.documentStatus)}>
                          {selectedApplication.documentStatus}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Property Verification</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{selectedApplication.propertiesInspected}/{selectedApplication.totalProperties}</span>
                        <Badge className={getStatusColor(selectedApplication.propertyStatus)}>
                          {selectedApplication.propertyStatus === 'not_applicable' ? 'N/A' : selectedApplication.propertyStatus}
                        </Badge>
                      </div>
                    </div>

                    {selectedApplication.propertyInfo && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <Label className="text-sm text-blue-700">Property Details</Label>
                        <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                          <div>
                            <span className="text-gray-600">Declared Value:</span>
                            <p className="font-medium">${selectedApplication.propertyInfo.declaredValue.toLocaleString()}</p>
                          </div>
                          {selectedApplication.propertyInfo.estimatedValue && (
                            <div>
                              <span className="text-gray-600">Estimated Value:</span>
                              <p className="font-medium">${selectedApplication.propertyInfo.estimatedValue.toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                        {selectedApplication.propertyInfo.estimatedValue && 
                         selectedApplication.propertyInfo.estimatedValue !== selectedApplication.propertyInfo.declaredValue && (
                          <Alert className="mt-3">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">
                              Value discrepancy detected: ${Math.abs(selectedApplication.propertyInfo.estimatedValue - selectedApplication.propertyInfo.declaredValue).toLocaleString()} difference
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Decision Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Final Decision
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Decision</Label>
                    <Select value={finalDecision} onValueChange={(value: any) => setFinalDecision(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">✓ Approve Application</SelectItem>
                        <SelectItem value="rejected">✗ Reject Application</SelectItem>
                        <SelectItem value="requires_clarification">⚠ Request Clarification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Review Notes</Label>
                    <Textarea
                      placeholder="Add your review notes and observations..."
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      rows={4}
                    />
                  </div>

                  {finalDecision === 'rejected' && (
                    <div>
                      <Label>Rejection Reason</Label>
                      <Textarea
                        placeholder="Specify the reason for rejection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}

                  {finalDecision === 'requires_clarification' && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        The applicant will be notified to provide additional information or clarification.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={submitFinalDecision}
                      className={
                        finalDecision === 'rejected' 
                          ? 'bg-red-600 hover:bg-red-700' 
                          : finalDecision === 'requires_clarification'
                          ? 'bg-orange-600 hover:bg-orange-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }
                      disabled={!verificationNotes.trim() || (finalDecision === 'rejected' && !rejectionReason.trim())}
                    >
                      {finalDecision === 'approved' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve Application
                        </>
                      ) : finalDecision === 'rejected' ? (
                        <>
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject Application
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Request Clarification
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}