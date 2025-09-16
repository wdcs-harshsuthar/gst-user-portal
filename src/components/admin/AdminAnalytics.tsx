import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Download,
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Activity
} from 'lucide-react';

// Mock data for analytics
const mockAnalyticsData = {
  registrationTrends: [
    { month: 'Jan', individual: 120, business: 80, total: 200 },
    { month: 'Feb', individual: 150, business: 95, total: 245 },
    { month: 'Mar', individual: 180, business: 110, total: 290 },
    { month: 'Apr', individual: 160, business: 130, total: 290 },
    { month: 'May', individual: 200, business: 140, total: 340 },
    { month: 'Jun', individual: 180, business: 160, total: 340 },
  ],
  
  statusDistribution: [
    { name: 'Approved', value: 340, color: '#10B981' },
    { name: 'Under Review', value: 85, color: '#F59E0B' },
    { name: 'Pending', value: 45, color: '#6B7280' },
    { name: 'Rejected', value: 12, color: '#EF4444' },
  ],

  countyDistribution: [
    { county: 'Montserrado', applications: 280, percentage: 58.3 },
    { county: 'Nimba', applications: 85, percentage: 17.7 },
    { county: 'Bong', applications: 45, percentage: 9.4 },
    { county: 'Margibi', applications: 32, percentage: 6.7 },
    { county: 'Others', applications: 38, percentage: 7.9 },
  ],

  revenueData: [
    { month: 'Jan', revenue: 15400, applications: 200 },
    { month: 'Feb', revenue: 18900, applications: 245 },
    { month: 'Mar', revenue: 22350, applications: 290 },
    { month: 'Apr', revenue: 22350, applications: 290 },
    { month: 'May', revenue: 26200, applications: 340 },
    { month: 'Jun', revenue: 26200, applications: 340 },
  ],

  processingTimes: [
    { type: 'Individual', avgDays: 5.2, target: 7 },
    { type: 'Sole Proprietorship', avgDays: 7.8, target: 10 },
    { type: 'Business', avgDays: 12.4, target: 14 },
    { type: 'Branch Registration', avgDays: 4.1, target: 5 },
  ]
};

interface AdminAnalyticsProps {
  dateRange?: string;
  onExport?: (type: string) => void;
}

export default function AdminAnalytics({ dateRange = '6months', onExport }: AdminAnalyticsProps) {
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed'>('overview');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [filterPeriod, setFilterPeriod] = useState(dateRange);

  const keyMetrics = useMemo(() => {
    const totalApplications = mockAnalyticsData.statusDistribution.reduce((sum, item) => sum + item.value, 0);
    const approvedApplications = mockAnalyticsData.statusDistribution.find(item => item.name === 'Approved')?.value || 0;
    const pendingApplications = mockAnalyticsData.statusDistribution.find(item => item.name === 'Under Review')?.value || 0;
    const totalRevenue = mockAnalyticsData.revenueData.reduce((sum, item) => sum + item.revenue, 0);
    const avgProcessingTime = mockAnalyticsData.processingTimes.reduce((sum, item) => sum + item.avgDays, 0) / mockAnalyticsData.processingTimes.length;
    
    return {
      totalApplications,
      approvedApplications,
      pendingApplications,
      approvalRate: ((approvedApplications / totalApplications) * 100).toFixed(1),
      totalRevenue,
      avgProcessingTime: avgProcessingTime.toFixed(1),
      monthlyGrowth: 15.2 // Mock growth rate
    };
  }, []);

  const renderChart = () => {
    const data = mockAnalyticsData.registrationTrends;
    
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="individual" stroke="#4F63D2" strokeWidth={2} />
            <Line type="monotone" dataKey="business" stroke="#10B981" strokeWidth={2} />
            <Line type="monotone" dataKey="total" stroke="#F59E0B" strokeWidth={2} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="individual" stackId="1" stroke="#4F63D2" fill="#4F63D2" fillOpacity={0.6} />
            <Area type="monotone" dataKey="business" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
          </AreaChart>
        );
      default:
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="individual" fill="#4F63D2" />
            <Bar dataKey="business" fill="#10B981" />
          </BarChart>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
          <p className="text-muted-foreground">GST Registration system insights and metrics</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filterPeriod} onValueChange={setFilterPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="3months">3 Months</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={() => onExport?.('analytics')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{keyMetrics.totalApplications.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">+{keyMetrics.monthlyGrowth}%</span>
                </div>
              </div>
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approval Rate</p>
                <p className="text-2xl font-bold">{keyMetrics.approvalRate}%</p>
                <Progress value={parseFloat(keyMetrics.approvalRate)} className="mt-2" />
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue Generated</p>
                <p className="text-2xl font-bold">${keyMetrics.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground mt-1">This period</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Processing Time</p>
                <p className="text-2xl font-bold">{keyMetrics.avgProcessingTime} days</p>
                <div className="flex items-center mt-1">
                  <Clock className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-500">Target: 9 days</span>
                </div>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trends">Registration Trends</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
          <TabsTrigger value="geography">Geographic Data</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Registration Trends
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant={chartType === 'bar' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={chartType === 'line' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('line')}
                  >
                    <LineChartIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={chartType === 'area' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('area')}
                  >
                    <Activity className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                {renderChart()}
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5" />
                  Application Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockAnalyticsData.statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockAnalyticsData.statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAnalyticsData.statusDistribution.map((status) => (
                  <div key={status.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: status.color }}
                      />
                      <span className="font-medium">{status.name}</span>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{status.value}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Applications by County
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.countyDistribution.map((county) => (
                  <div key={county.county} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{county.county}</span>
                      <span className="text-sm text-muted-foreground">
                        {county.applications} applications ({county.percentage}%)
                      </span>
                    </div>
                    <Progress value={county.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Processing Times by Type
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockAnalyticsData.processingTimes.map((item) => (
                  <div key={item.type} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{item.type}</span>
                      <div className="text-right">
                        <span className="text-sm">{item.avgDays} days avg</span>
                        <span className="text-xs text-muted-foreground ml-2">
                          (Target: {item.target} days)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(item.avgDays / item.target) * 100} 
                        className="h-2 flex-1" 
                      />
                      {item.avgDays <= item.target ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={mockAnalyticsData.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10B981" 
                      fill="#10B981" 
                      fillOpacity={0.6} 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}