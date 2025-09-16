import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Download, 
  FileText,
  Users,
  PieChart,
  Activity,
  Target,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { RegistrationData } from '../../App';

interface AdminReportsProps {
  applications: RegistrationData[];
}

export default function AdminReports({ applications }: AdminReportsProps) {
  const [reportPeriod, setReportPeriod] = useState('all');
  const [reportType, setReportType] = useState('overview');

  // Calculate date ranges
  const getDateRange = (period: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (period) {
      case 'today':
        return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000) };
      case 'week':
        const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return { start: weekStart, end: today };
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        return { start: monthStart, end: today };
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        return { start: quarterStart, end: today };
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        return { start: yearStart, end: today };
      default:
        return { start: new Date(0), end: new Date() };
    }
  };

  // Filter applications by date range
  const { start, end } = getDateRange(reportPeriod);
  const filteredApplications = applications.filter(app => {
    if (!app.submissionDate) return false;
    const appDate = new Date(app.submissionDate);
    return appDate >= start && appDate <= end;
  });

  // Calculate statistics
  const totalApplications = filteredApplications.length;
  const approvedApplications = filteredApplications.filter(app => app.status === 'approved').length;
  const rejectedApplications = filteredApplications.filter(app => app.status === 'rejected').length;
  const pendingApplications = filteredApplications.filter(app => 
    app.status === 'under-review' || app.status === 'processing' || app.status === 'pending-receipt'
  ).length;

  const totalRevenue = filteredApplications
    .filter(app => app.status === 'approved' && app.paymentData?.totalAmount)
    .reduce((sum, app) => sum + (app.paymentData.totalAmount || 0), 0);

  const averageProcessingTime = 7; // Mock data - would calculate actual processing times
  const approvalRate = totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0;

  // Application type breakdown
  const individualApps = filteredApplications.filter(app => app.applicantType === 'individual').length;
  const businessApps = filteredApplications.filter(app => app.entryPoint === 'business').length;
  const soleProprietorshipApps = filteredApplications.filter(app => app.businessType === 'sole proprietorship').length;

  // Payment method breakdown
  const paymentMethods = filteredApplications.reduce((acc, app) => {
    const method = app.paymentData?.paymentMethod || 'unknown';
    acc[method] = (acc[method] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Status breakdown
  const statusBreakdown = {
    'pending-receipt': filteredApplications.filter(app => app.status === 'pending-receipt').length,
    'under-review': filteredApplications.filter(app => app.status === 'under-review').length,
    'processing': filteredApplications.filter(app => app.status === 'processing').length,
    'approved': approvedApplications,
    'rejected': rejectedApplications
  };

  // Monthly trend data (mock - would calculate actual trends)
  const monthlyData = [
    { month: 'Jan', applications: 45, revenue: 2250 },
    { month: 'Feb', applications: 52, revenue: 2600 },
    { month: 'Mar', applications: 48, revenue: 2400 },
    { month: 'Apr', applications: 61, revenue: 3050 },
    { month: 'May', applications: 58, revenue: 2900 },
    { month: 'Jun', applications: 67, revenue: 3350 },
  ];

  const exportReport = () => {
    const reportData = {
      reportType: 'GST Registration Analytics',
      period: reportPeriod,
      generatedDate: new Date().toISOString(),
      summary: {
        totalApplications,
        approvedApplications,
        rejectedApplications,
        pendingApplications,
        totalRevenue,
        approvalRate: Math.round(approvalRate),
        averageProcessingTime
      },
      breakdowns: {
        applicationTypes: {
          individual: individualApps,
          business: businessApps,
          soleProprietorship: soleProprietorshipApps
        },
        paymentMethods,
        statusBreakdown
      },
      applications: filteredApplications.map(app => ({
        reference: app.applicationReference,
        applicant: app.individualData?.firstName && app.individualData?.lastName
          ? `${app.individualData.firstName} ${app.individualData.lastName}`
          : app.businessData?.businessName || 'Unknown',
        type: app.applicantType,
        status: app.status,
        submissionDate: app.submissionDate,
        amount: app.paymentData?.totalAmount
      }))
    };

    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `GST_Report_${reportPeriod}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into GST registration system performance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportReport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Period</label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="financial">Financial Analysis</SelectItem>
                  <SelectItem value="operational">Operational Metrics</SelectItem>
                  <SelectItem value="trends">Trend Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Data Range</label>
              <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
                {reportPeriod === 'all' ? 'All available data' : 
                 `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-3xl text-gray-900">{totalApplications}</p>
                <p className="text-sm text-blue-600 mt-1">
                  {reportPeriod !== 'all' ? `in ${reportPeriod}` : 'all time'}
                </p>
              </div>
              <FileText className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approval Rate</p>
                <p className="text-3xl text-gray-900">{approvalRate.toFixed(1)}%</p>
                <Progress value={approvalRate} className="w-full mt-2" />
              </div>
              <Target className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl text-gray-900">{formatCurrency(totalRevenue)}</p>
                <p className="text-sm text-green-600 mt-1">
                  Avg: {formatCurrency(approvedApplications > 0 ? totalRevenue / approvedApplications : 0)}
                </p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Processing</p>
                <p className="text-3xl text-gray-900">{averageProcessingTime}</p>
                <p className="text-sm text-orange-600 mt-1">days</p>
              </div>
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Application Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Application Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Approved</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{statusBreakdown.approved}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${totalApplications > 0 ? (statusBreakdown.approved / totalApplications) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-10">
                    {totalApplications > 0 ? Math.round((statusBreakdown.approved / totalApplications) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Under Review</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{statusBreakdown['under-review']}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${totalApplications > 0 ? (statusBreakdown['under-review'] / totalApplications) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-10">
                    {totalApplications > 0 ? Math.round((statusBreakdown['under-review'] / totalApplications) * 100) : 0}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Processing</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{statusBreakdown.processing}</span>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${totalApplications > 0 ? (statusBreakdown.processing / totalApplications) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-10">
                    {totalApplications > 0 ? Math.round((statusBreakdown.processing / totalApplications) * 100) : 0}%
                  </span>
                </div>
              </div>

              {statusBreakdown.rejected > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm">Rejected</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{statusBreakdown.rejected}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${totalApplications > 0 ? (statusBreakdown.rejected / totalApplications) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-10">
                      {totalApplications > 0 ? Math.round((statusBreakdown.rejected / totalApplications) * 100) : 0}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Total Processed:</span>
                  <span className="font-medium">{approvedApplications + rejectedApplications}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Actions:</span>
                  <span className="font-medium text-orange-600">{pendingApplications}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Types */}
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
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Individual Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{individualApps}</span>
                  <Badge variant="outline">
                    {totalApplications > 0 ? Math.round((individualApps / totalApplications) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Business Applications</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{businessApps}</span>
                  <Badge variant="outline">
                    {totalApplications > 0 ? Math.round((businessApps / totalApplications) * 100) : 0}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Sole Proprietorship</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{soleProprietorshipApps}</span>
                  <Badge variant="outline">
                    {totalApplications > 0 ? Math.round((soleProprietorshipApps / totalApplications) * 100) : 0}%
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Payment Methods</h4>
              <div className="space-y-1 text-xs">
                {Object.entries(paymentMethods).map(([method, count]) => (
                  <div key={method} className="flex justify-between">
                    <span className="capitalize">
                      {method === 'offline' ? 'Bank Payment' : 
                       method === 'card' ? 'Credit/Debit Card' : 
                       method === 'mobile' ? 'Mobile Money' : method}
                    </span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Processing Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Processing Time</span>
                <span className="font-medium">{averageProcessingTime} days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Fastest Processing</span>
                <span className="font-medium text-green-600">1 day</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">SLA Compliance</span>
                <span className="font-medium text-blue-600">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Application Completeness</span>
                <span className="font-medium">98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">First-Time Approval</span>
                <span className="font-medium text-green-600">87%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resubmission Rate</span>
                <span className="font-medium text-orange-600">8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Fee per Application</span>
                <span className="font-medium">{formatCurrency(approvedApplications > 0 ? totalRevenue / approvedApplications : 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Collection Rate</span>
                <span className="font-medium text-green-600">96%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Payment Success Rate</span>
                <span className="font-medium text-blue-600">99%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Report Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Key Findings</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• {approvalRate.toFixed(0)}% approval rate indicates strong application quality</li>
                <li>• {pendingApplications} applications currently pending review</li>
                <li>• Individual applications represent {((individualApps / totalApplications) * 100).toFixed(0)}% of total volume</li>
                <li>• Average processing time of {averageProcessingTime} days meets target SLA</li>
                <li>• Total revenue of {formatCurrency(totalRevenue)} generated from approved applications</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Recommendations</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Continue monitoring applications requiring receipt verification</li>
                <li>• Consider automation for routine individual applications</li>
                <li>• Review rejected applications for process improvements</li>
                <li>• Optimize payment processing for better user experience</li>
                <li>• Implement proactive communication for pending applications</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}