import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  FileText, 
  Download, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  FileIcon,
  Image
} from 'lucide-react';

interface UploadedDocument {
  id: string;
  file?: File;
  documentType: string;
  uploadDate: string;
  verified?: boolean;
  verifiedBy?: string;
  verificationDate?: string;
  verificationNotes?: string;
}

interface DocumentViewerProps {
  documents: UploadedDocument[];
  applicationReference: string;
  adminUser: any;
  onDocumentVerify: (documentId: string, verified: boolean, notes: string) => void;
}

export default function DocumentViewer({ 
  documents, 
  applicationReference,
  adminUser,
  onDocumentVerify 
}: DocumentViewerProps) {
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocument | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const getDocumentIcon = (file?: File) => {
    if (!file || !file.type) {
      return FileIcon;
    }
    
    if (file.type.startsWith('image/')) {
      return Image;
    } else if (file.type === 'application/pdf') {
      return FileText;
    } else {
      return FileIcon;
    }
  };

  const getVerificationStatus = (doc: UploadedDocument) => {
    if (doc.verified === true) {
      return { 
        status: 'verified', 
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle2,
        text: 'Verified'
      };
    } else if (doc.verified === false) {
      return { 
        status: 'rejected', 
        color: 'bg-red-100 text-red-800',
        icon: XCircle,
        text: 'Rejected'
      };
    } else {
      return { 
        status: 'pending', 
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        text: 'Pending Review'
      };
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDocumentPreview = (doc: UploadedDocument) => {
    setSelectedDocument(doc);
    
    // Create preview URL for the file
    if (doc.file) {
      const url = URL.createObjectURL(doc.file);
      setPreviewUrl(url);
    }
    
    // Cleanup URL when component unmounts or document changes
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  };

  const handleDocumentDownload = (doc: UploadedDocument) => {
    if (!doc.file) return;
    
    const url = URL.createObjectURL(doc.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleVerification = (verified: boolean) => {
    if (selectedDocument) {
      onDocumentVerify(selectedDocument.id, verified, verificationNotes);
      setSelectedDocument(null);
      setVerificationNotes('');
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.documentType]) {
      acc[doc.documentType] = [];
    }
    acc[doc.documentType].push(doc);
    return acc;
  }, {} as Record<string, UploadedDocument[]>);

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'identification': 'Identification Documents',
      'business-registration': 'Business Registration',
      'tax-clearance': 'Tax Clearance',
      'financial-statements': 'Financial Statements',
      'bank-statement': 'Bank Statements',
      'other': 'Other Documents'
    };
    return labels[type] || type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!documents || documents.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Documents Uploaded</h3>
          <p className="text-gray-500">
            This application does not have any documents uploaded yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Document Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
            <div className="text-sm text-gray-600">Total Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(doc => doc.verified === true).length}
            </div>
            <div className="text-sm text-gray-600">Verified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {documents.filter(doc => doc.verified === undefined).length}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {documents.filter(doc => doc.verified === false).length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
      </div>

      {/* Documents by Type */}
      {Object.entries(groupedDocuments).map(([documentType, docs]) => (
        <Card key={documentType}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {getDocumentTypeLabel(documentType)}
              <Badge variant="outline">{docs.length} document{docs.length !== 1 ? 's' : ''}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {docs.map((doc) => {
                const IconComponent = getDocumentIcon(doc.file);
                const verificationStatus = getVerificationStatus(doc);
                const StatusIcon = verificationStatus.icon;
                
                return (
                  <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6 text-gray-500" />
                      <div>
                        <p className="font-medium">{doc.file?.name || 'Unknown file'}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{doc.file ? formatFileSize(doc.file.size) : 'Unknown size'}</span>
                          <span>Uploaded {formatDate(doc.uploadDate)}</span>
                          {doc.verifiedBy && (
                            <span>Verified by {doc.verifiedBy}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={verificationStatus.color}>
                          {verificationStatus.text}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {/* Preview Button */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDocumentPreview(doc)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh]">
                            <DialogHeader>
                              <DialogTitle>Document Review - {doc.file?.name || 'Unknown file'}</DialogTitle>
                              <DialogDescription>
                                Review and verify the uploaded document for compliance and authenticity.
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              {/* Document Preview */}
                              <div className="border rounded-lg p-4 bg-gray-50">
                                <div className="flex items-center justify-between mb-4">
                                  <div>
                                    <h4 className="font-medium">{doc.file?.name || 'Unknown file'}</h4>
                                    <p className="text-sm text-gray-500">
                                      {doc.file ? formatFileSize(doc.file.size) : 'Unknown size'} • Uploaded {formatDate(doc.uploadDate)}
                                    </p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDocumentDownload(doc)}
                                  >
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </Button>
                                </div>
                                
                                {/* File Preview */}
                                <div className="min-h-[400px] border rounded bg-white flex items-center justify-center">
                                  {doc.file?.type?.startsWith('image/') && previewUrl ? (
                                    <img 
                                      src={previewUrl} 
                                      alt={doc.file?.name || 'Document'}
                                      className="max-w-full max-h-[400px] object-contain"
                                    />
                                  ) : doc.file?.type === 'application/pdf' && previewUrl ? (
                                    <iframe
                                      src={previewUrl}
                                      className="w-full h-[400px]"
                                      title={doc.file?.name || 'Document'}
                                    />
                                  ) : (
                                    <div className="text-center text-gray-500">
                                      <IconComponent className="h-16 w-16 mx-auto mb-4" />
                                      <p>Preview not available for this file type</p>
                                      <p className="text-sm">Download the file to view its contents</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Verification Status */}
                              {doc.verified !== undefined && (
                                <Alert>
                                  <StatusIcon className="h-4 w-4" />
                                  <AlertDescription>
                                    <strong>Status:</strong> {verificationStatus.text}
                                    {doc.verifiedBy && (
                                      <>
                                        <br />
                                        <strong>Verified by:</strong> {doc.verifiedBy} on {formatDate(doc.verificationDate || '')}
                                      </>
                                    )}
                                    {doc.verificationNotes && (
                                      <>
                                        <br />
                                        <strong>Notes:</strong> {doc.verificationNotes}
                                      </>
                                    )}
                                  </AlertDescription>
                                </Alert>
                              )}

                              {/* Verification Actions */}
                              {doc.verified === undefined && (
                                <div className="space-y-4 border-t pt-4">
                                  <h4 className="font-medium">Document Verification</h4>
                                  
                                  <div className="space-y-2">
                                    <Label>Verification Notes</Label>
                                    <Textarea
                                      placeholder="Add notes about the document verification..."
                                      value={verificationNotes}
                                      onChange={(e) => setVerificationNotes(e.target.value)}
                                      rows={3}
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => handleVerification(true)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Verify Document
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      onClick={() => handleVerification(false)}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject Document
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* Download Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDocumentDownload(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}