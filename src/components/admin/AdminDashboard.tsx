import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  DollarSign,
  Calendar,
  ArrowRight,
  User,
  Building2,
  BarChart3
} from 'lucide-react';
import { RegistrationData } from '../../App';
import { AdminSection } from '../../AdminApp';

interface AdminDashboardProps {
  applications: RegistrationData[];
  onNavigateToSection: (section: AdminSection) => void;
}

export default function AdminDashboard({ applications, onNavigateToSection }: AdminDashboardProps) {
  
  // Calculate statistics
  const totalApplications = applications.length;
  const pendingReview = applications.filter(app => app.status === 'under-review' || app.status === 'processing').length;
  const pendingReceipts = applications.filter(app => app.status === 'pending-receipt').length;
  const approved = applications.filter(app => app.status === 'approved').length;
  const rejected = applications.filter(app => app.status === 'rejected').length;
  const todaySubmissions = applications.filter(app => {
    if (!app.submissionDate) return false;
    const today = new Date().toDateString();
    const appDate = new Date(app.submissionDate).toDateString();
    return today === appDate;
  }).length;

  // Calculate revenue
  const totalRevenue = applications
    .filter(app => app.status === 'approved' && app.paymentData?.totalAmount)
    .reduce((sum, app) => sum + (app.paymentData.totalAmount || 0), 0);

  // Application types breakdown
  const individualApps = applications.filter(app => app.applicantType === 'individual').length;
  const businessApps = applications.filter(app => app.entryPoint === 'business').length;
  const soleProprietorshipApps = applications.filter(app => app.businessType === 'sole proprietorship').length;

  // Recent applications (last 5)
  const recentApplications = applications
    .sort((a, b) => new Date(b.submissionDate || 0).getTime() - new Date(a.submissionDate || 0).getTime())
    .slice(0, 5);

  // Payment method statistics
  const paymentMethods = applications.reduce((acc, app) => {
    const method = app.paymentData?.paymentMethod || 'unknown';
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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

  const getApplicantName = (app: RegistrationData) => {
    if (app.individualData?.firstName && app.individualData?.lastName) {
      return `${app.individualData.firstName} ${app.individualData.lastName}`;
    }
    if (app.businessData?.registeredName) {
      return app.businessData.registeredName;
    }
    return 'Unknown Applicant';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Welcome to Admin Dashboard</h1>
          <p className="text-gray-600">Manage GST registration applications and monitor system performance</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Last updated</p>
          <p className="text-sm font-medium">{new Date().toLocaleString()}</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-3xl text-gray-900">{totalApplications}</p>
                <p className="text-sm text-green-600 mt-1">+{todaySubmissions} today</p>
              </div>
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-3xl text-gray-900">{pendingReview}</p>
                <p className="text-sm text-yellow-600 mt-1">Requires attention</p>
              </div>
              <Clock className="h-10 w-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-3xl text-gray-900">{approved}</p>
                <p className="text-sm text-green-600 mt-1">{((approved / totalApplications) * 100).toFixed(1)}% success rate</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl text-gray-900">${totalRevenue.toFixed(0)}</p>
                <p className="text-sm text-blue-600 mt-1">From approved apps</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Application Status Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{approved}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(approved / totalApplications) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Under Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{pendingReview}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${(pendingReview / totalApplications) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">Pending Receipts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{pendingReceipts}</span>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${(pendingReceipts / totalApplications) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {rejected > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Rejected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{rejected}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${(rejected / totalApplications) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button 
              onClick={() => onNavigateToSection('applications')} 
              className="w-full mt-4"
              variant="outline"
            >
              View All Applications
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Application Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Individual</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{individualApps}</span>
                  <Badge variant="outline">{((individualApps / totalApplications) * 100).toFixed(0)}%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Business</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{businessApps}</span>
                  <Badge variant="outline">{((businessApps / totalApplications) * 100).toFixed(0)}%</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Sole Proprietorship</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{soleProprietorshipApps}</span>
                  <Badge variant="outline">{((soleProprietorshipApps / totalApplications) * 100).toFixed(0)}%</Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Payment Methods</h4>
              <div className="space-y-1 text-xs">
                {Object.entries(paymentMethods).map(([method, count]) => (
                  <div key={method} className="flex justify-between">
                    <span className="capitalize">{method === 'offline' ? 'Bank Payment' : method}</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Applications
            </CardTitle>
            <Button 
              onClick={() => onNavigateToSection('applications')} 
              variant="outline" 
              size="sm"
            >
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
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
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentApplications.map((app, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-mono text-sm">
                      {app.applicationReference}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {getApplicantName(app)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {app.applicantType === 'individual' ? 'Individual' : 'Business'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(app.submissionDate)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status?.replace('-', ' ')?.toUpperCase() || 'UNKNOWN'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ${app.paymentData?.totalAmount?.toFixed(2) || '0.00'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigateToSection('applications')}>
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="font-medium mb-2">Review Applications</h3>
            <p className="text-sm text-gray-600 mb-4">Process pending GST registrations</p>
            <Badge className="bg-yellow-100 text-yellow-800">
              {pendingReview} pending
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigateToSection('users')}>
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="font-medium mb-2">Manage Users</h3>
            <p className="text-sm text-gray-600 mb-4">View and manage registered users</p>
            <Badge className="bg-blue-100 text-blue-800">
              {new Set(applications.map(app => app.individualData?.email || app.businessData?.businessEmail)).size} users
            </Badge>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigateToSection('reports')}>
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="font-medium mb-2">Generate Reports</h3>
            <p className="text-sm text-gray-600 mb-4">View analytics and generate reports</p>
            <Badge className="bg-purple-100 text-purple-800">
              Ready
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}