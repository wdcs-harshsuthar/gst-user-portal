import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Upload,
  FileText,
  AlertTriangle,
  Users,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { LoadingSpinner, ButtonLoadingSpinner } from '../shared/LoadingSpinner';

interface Application {
  id: string;
  reference: string;
  applicantName: string;
  type: string;
  status: 'pending' | 'under-review' | 'approved' | 'rejected';
  submissionDate: string;
  county: string;
  assignedTo?: string;
}

interface BulkOperationsProps {
  applications: Application[];
  onBulkUpdate: (applicationIds: string[], action: string, data?: any) => Promise<void>;
  onExport: (applicationIds: string[], format: string) => void;
}

const mockApplications: Application[] = [
  {
    id: '1',
    reference: 'GST-2024-001',
    applicantName: 'John Doe',
    type: 'Individual',
    status: 'pending',
    submissionDate: '2024-01-15',
    county: 'Montserrado'
  },
  {
    id: '2', 
    reference: 'GST-2024-002',
    applicantName: 'ABC Trading Co.',
    type: 'Business',
    status: 'under-review',
    submissionDate: '2024-01-16',
    county: 'Nimba',
    assignedTo: 'Jane Smith'
  },
  {
    id: '3',
    reference: 'GST-2024-003', 
    applicantName: 'Mary Johnson',
    type: 'Sole Proprietorship',
    status: 'pending',
    submissionDate: '2024-01-17',
    county: 'Bong'
  }
];

export default function BulkOperations({ 
  applications = mockApplications, 
  onBulkUpdate,
  onExport 
}: BulkOperationsProps) {
  const [selectedApplications, setSelectedApplications] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState<string>('');
  const [bulkMessage, setBulkMessage] = useState('');
  const [assignee, setAssignee] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [isProcessing, setIsProcessing] = useState(false);
  const [operationProgress, setOperationProgress] = useState(0);

  // Filter applications based on search and filters
  const filteredApplications = React.useMemo(() => {
    return applications.filter(app => {
      const matchesSearch = app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.reference.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesType = typeFilter === 'all' || app.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [applications, searchQuery, statusFilter, typeFilter]);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedApplications(new Set(filteredApplications.map(app => app.id)));
    } else {
      setSelectedApplications(new Set());
    }
  }, [filteredApplications]);

  const handleSelectApplication = useCallback((applicationId: string, checked: boolean) => {
    setSelectedApplications(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(applicationId);
      } else {
        newSet.delete(applicationId);
      }
      return newSet;
    });
  }, []);

  const handleBulkOperation = async () => {
    if (selectedApplications.size === 0 || !bulkAction) return;
    
    setIsProcessing(true);
    setOperationProgress(0);
    
    try {
      const applicationIds = Array.from(selectedApplications);
      const data: any = { message: bulkMessage };
      
      if (bulkAction === 'assign' && assignee) {
        data.assignee = assignee;
      }
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setOperationProgress(prev => {
          const next = prev + 10;
          return next >= 100 ? 100 : next;
        });
      }, 200);
      
      await onBulkUpdate(applicationIds, bulkAction, data);
      
      clearInterval(progressInterval);
      setOperationProgress(100);
      
      // Reset form
      setSelectedApplications(new Set());
      setBulkAction('');
      setBulkMessage('');
      setAssignee('');
      
    } catch (error) {
      console.error('Bulk operation failed:', error);
    } finally {
      setTimeout(() => {
        setIsProcessing(false);
        setOperationProgress(0);
      }, 1000);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'under-review':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved':
        return 'default';
      case 'rejected':
        return 'destructive';
      case 'under-review':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Operations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Individual">Individual</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => onExport(Array.from(selectedApplications), 'csv')}
              disabled={selectedApplications.size === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </Button>
          </div>

          {/* Selection Summary */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <Checkbox
                checked={selectedApplications.size === filteredApplications.length && filteredApplications.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm font-medium">
                {selectedApplications.size} of {filteredApplications.length} applications selected
              </span>
            </div>
            
            <Badge variant="secondary">
              {filteredApplications.length} total applications
            </Badge>
          </div>

          {/* Applications List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredApplications.map((application) => (
              <div 
                key={application.id}
                className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50"
              >
                <Checkbox
                  checked={selectedApplications.has(application.id)}
                  onCheckedChange={(checked) => handleSelectApplication(application.id, checked as boolean)}
                />
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                  <div>
                    <p className="font-medium text-sm">{application.reference}</p>
                    <p className="text-xs text-muted-foreground">{application.applicantName}</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {application.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(application.status)}
                    <Badge variant={getStatusBadgeVariant(application.status)} className="text-xs">
                      {application.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(application.submissionDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">{application.county}</p>
                  </div>
                  <div>
                    {application.assignedTo ? (
                      <p className="text-xs text-muted-foreground">
                        Assigned to: {application.assignedTo}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">Unassigned</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedApplications.size > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MoreHorizontal className="h-5 w-5" />
              Bulk Actions ({selectedApplications.size} selected)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {isProcessing && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>Processing bulk operation...</p>
                    <Progress value={operationProgress} />
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bulkAction">Action</Label>
                <Select value={bulkAction} onValueChange={setBulkAction} disabled={isProcessing}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Approve Applications</SelectItem>
                    <SelectItem value="reject">Reject Applications</SelectItem>
                    <SelectItem value="review">Set to Under Review</SelectItem>
                    <SelectItem value="assign">Assign to Officer</SelectItem>
                    <SelectItem value="notify">Send Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {bulkAction === 'assign' && (
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assign to</Label>
                  <Select value={assignee} onValueChange={setAssignee} disabled={isProcessing}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select officer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="jane.smith">Jane Smith</SelectItem>
                      <SelectItem value="john.doe">John Doe</SelectItem>
                      <SelectItem value="mary.johnson">Mary Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {(bulkAction === 'reject' || bulkAction === 'notify' || bulkAction === 'approve') && (
              <div className="space-y-2">
                <Label htmlFor="bulkMessage">
                  {bulkAction === 'reject' ? 'Rejection Reason' : 
                   bulkAction === 'notify' ? 'Notification Message' : 
                   'Approval Notes'} (Optional)
                </Label>
                <Textarea
                  id="bulkMessage"
                  value={bulkMessage}
                  onChange={(e) => setBulkMessage(e.target.value)}
                  placeholder={
                    bulkAction === 'reject' ? 'Enter reason for rejection...' : 
                    bulkAction === 'notify' ? 'Enter notification message...' :
                    'Enter approval notes...'
                  }
                  disabled={isProcessing}
                  rows={3}
                />
              </div>
            )}

            <Separator />

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                This action will affect {selectedApplications.size} application{selectedApplications.size !== 1 ? 's' : ''}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedApplications(new Set())}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleBulkOperation}
                  disabled={!bulkAction || isProcessing || selectedApplications.size === 0}
                >
                  {isProcessing ? (
                    <>
                      <ButtonLoadingSpinner />
                      Processing...
                    </>
                  ) : (
                    <>
                      Apply Action
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}