import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  FileCheck,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Download,
  Search,
  Filter,
  AlertCircle,
  MessageSquare,
  User,
  Building2,
  Calendar,
  RefreshCw
} from 'lucide-react';

interface Application {
  id: string;
  applicantName: string;
  applicationType: 'individual' | 'business';
  submissionDate: string;
  documentsStatus: 'pending' | 'verified' | 'rejected' | 'incomplete';
  documents: Document[];
  priority: 'high' | 'medium' | 'low';
  reviewNotes: string;
  verifierComments: string;
  gstNumber?: string;
}

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadDate: string;
  fileUrl: string;
  verifierNotes: string;
  isRequired: boolean;
}

const MOCK_APPLICATIONS: Application[] = [
  {
    id: 'APP-2025-001',
    applicantName: 'John Michael Thompson',
    applicationType: 'individual',
    submissionDate: '2025-01-04 09:30 AM',
    documentsStatus: 'pending',
    priority: 'high',
    reviewNotes: '',
    verifierComments: '',
    documents: [
      {
        id: 'doc1',
        name: 'National ID Card',
        type: 'identification',
        status: 'pending',
        uploadDate: '2025-01-04 09:30 AM',
        fileUrl: '#',
        verifierNotes: '',
        isRequired: true
      },
      {
        id: 'doc2',
        name: 'Proof of Address',
        type: 'address_proof',
        status: 'pending',
        uploadDate: '2025-01-04 09:32 AM',
        fileUrl: '#',
        verifierNotes: '',
        isRequired: true
      },
      {
        id: 'doc3',
        name: 'Tax Clearance Certificate',
        type: 'tax_document',
        status: 'pending',
        uploadDate: '2025-01-04 09:35 AM',
        fileUrl: '#',
        verifierNotes: '',
        isRequired: false
      }
    ]
  },
  {
    id: 'APP-2025-002',
    applicantName: 'Sunrise Trading Company',
    applicationType: 'business',
    submissionDate: '2025-01-04 08:15 AM',
    documentsStatus: 'incomplete',
    priority: 'medium',
    reviewNotes: 'Missing business registration certificate',
    verifierComments: '',
    documents: [
      {
        id: 'doc4',
        name: 'Certificate of Incorporation',
        type: 'business_registration',
        status: 'verified',
        uploadDate: '2025-01-04 08:15 AM',
        fileUrl: '#',
        verifierNotes: 'Document verified successfully',
        isRequired: true
      },
      {
        id: 'doc5',
        name: 'Business Registration Certificate',
        type: 'business_license',
        status: 'rejected',
        uploadDate: '2025-01-04 08:18 AM',
        fileUrl: '#',
        verifierNotes: 'Document is expired. Please upload current certificate.',
        isRequired: true
      }
    ]
  }
];

export default function DocumentVerifierPortal() {
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'rejected'>('verified');

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.documentsStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'incomplete': return 'bg-orange-100 text-orange-800';
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

  const handleDocumentVerification = (documentId: string, status: 'verified' | 'rejected', notes: string) => {
    if (!selectedApplication) return;

    const updatedApplications = applications.map(app => {
      if (app.id === selectedApplication.id) {
        const updatedDocuments = app.documents.map(doc => {
          if (doc.id === documentId) {
            return { ...doc, status, verifierNotes: notes };
          }
          return doc;
        });

        // Update overall application status based on document statuses
        const allVerified = updatedDocuments.filter(d => d.isRequired).every(d => d.status === 'verified');
        const hasRejected = updatedDocuments.some(d => d.status === 'rejected');
        const hasPending = updatedDocuments.some(d => d.status === 'pending');

        let newStatus: Application['documentsStatus'] = 'pending';
        if (allVerified) newStatus = 'verified';
        else if (hasRejected) newStatus = 'rejected';
        else if (hasPending) newStatus = 'pending';
        else newStatus = 'incomplete';

        return {
          ...app,
          documents: updatedDocuments,
          documentsStatus: newStatus
        };
      }
      return app;
    });

    setApplications(updatedApplications);
    setSelectedApplication(updatedApplications.find(app => app.id === selectedApplication.id) || null);
    setSelectedDocument(null);
    setVerificationNotes('');
  };

  const openDocumentViewer = (document: Document) => {
    setSelectedDocument(document);
    setVerificationNotes(document.verifierNotes);
    setVerificationStatus(document.status === 'rejected' ? 'rejected' : 'verified');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileCheck className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-semibold">Document Verification Portal</h1>
            <p className="text-sm text-muted-foreground">Review and verify submitted documents</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Badge variant="secondary">
            {applications.filter(app => app.documentsStatus === 'pending').length} Pending Reviews
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-semibold">{applications.filter(a => a.documentsStatus === 'pending').length}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-semibold">{applications.filter(a => a.documentsStatus === 'verified').length}</p>
                <p className="text-sm text-muted-foreground">Verified</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-semibold">{applications.filter(a => a.documentsStatus === 'rejected').length}</p>
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
                <p className="text-2xl font-semibold">{applications.filter(a => a.documentsStatus === 'incomplete').length}</p>
                <p className="text-sm text-muted-foreground">Incomplete</p>
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="incomplete">Incomplete</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Applications for Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedApplication?.id === application.id ? 'ring-2 ring-primary bg-primary/5' : ''
                  }`}
                  onClick={() => setSelectedApplication(application)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {application.applicationType === 'individual' ? (
                          <User className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Building2 className="h-4 w-4 text-purple-600" />
                        )}
                        <h3 className="font-semibold">{application.applicantName}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{application.id}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{application.submissionDate}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge className={getStatusColor(application.documentsStatus)}>
                        {application.documentsStatus}
                      </Badge>
                      <Badge className={getPriorityColor(application.priority)}>
                        {application.priority}
                      </Badge>
                    </div>
                  </div>
                  {application.reviewNotes && (
                    <Alert className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs">
                        {application.reviewNotes}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Document Details */}
        {selectedApplication && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents - {selectedApplication.applicantName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedApplication.documents.map((document) => (
                  <div key={document.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{document.name}</h4>
                          {document.isRequired && (
                            <Badge variant="outline" className="text-xs">Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{document.type}</p>
                        <p className="text-xs text-muted-foreground">{document.uploadDate}</p>
                        {document.verifierNotes && (
                          <p className="text-xs text-blue-600 mt-1">{document.verifierNotes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(document.status)}>
                          {document.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDocumentViewer(document)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedApplication.documentsStatus === 'verified' && (
                <Alert className="mt-4">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    All required documents have been verified successfully.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Document Viewer Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Review - {selectedDocument?.name}
            </DialogTitle>
            <DialogDescription>
              Review the document and provide verification status with notes.
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-6">
              {/* Document Viewer Area */}
              <div className="bg-gray-100 border rounded-lg p-8 text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Document Preview</p>
                <p className="text-sm text-gray-500">{selectedDocument.name}</p>
                <Button className="mt-4" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Original
                </Button>
              </div>

              {/* Verification Form */}
              <div className="space-y-4">
                <div>
                  <Label>Verification Status</Label>
                  <Select value={verificationStatus} onValueChange={(value: 'verified' | 'rejected') => setVerificationStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="verified">Verified ✓</SelectItem>
                      <SelectItem value="rejected">Rejected ✗</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Verification Notes</Label>
                  <Textarea
                    placeholder="Add your verification notes here..."
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setSelectedDocument(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => handleDocumentVerification(selectedDocument.id, verificationStatus, verificationNotes)}
                    className={verificationStatus === 'rejected' ? 'bg-red-600 hover:bg-red-700' : ''}
                  >
                    {verificationStatus === 'verified' ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Verify Document
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Document
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}