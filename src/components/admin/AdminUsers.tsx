import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { 
  Users, 
  Search, 
  Eye, 
  Mail, 
  Phone, 
  MapPin, 
  User,
  Building2,
  Calendar,
  FileText,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { RegistrationData } from '../../App';

interface AdminUsersProps {
  applications: RegistrationData[];
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'individual' | 'business';
  registrationDate: string;
  applications: RegistrationData[];
  totalApplications: number;
  approvedApplications: number;
  totalPaid: number;
  lastActivity: string;
}

export default function AdminUsers({ applications }: AdminUsersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // Generate user profiles from applications
  const generateUserProfiles = (): UserProfile[] => {
    const userMap = new Map<string, UserProfile>();

    applications.forEach(app => {
      const email = app.individualData?.email || app.businessData?.businessEmail;
      const name = app.individualData?.firstName && app.individualData?.lastName
        ? `${app.individualData.firstName} ${app.individualData.lastName}`
        : app.businessData?.businessName || 'Unknown User';
      
      if (!email) return;

      if (!userMap.has(email)) {
        userMap.set(email, {
          id: email,
          name,
          email,
          phone: app.individualData?.phone || app.businessData?.businessPhone,
          type: app.applicantType === 'individual' ? 'individual' : 'business',
          registrationDate: app.submissionDate || new Date().toISOString(),
          applications: [],
          totalApplications: 0,
          approvedApplications: 0,
          totalPaid: 0,
          lastActivity: app.submissionDate || new Date().toISOString()
        });
      }

      const user = userMap.get(email)!;
      user.applications.push(app);
      user.totalApplications++;
      if (app.status === 'approved') {
        user.approvedApplications++;
        user.totalPaid += app.paymentData?.totalAmount || 0;
      }
      
      // Update last activity if this application is more recent
      if (new Date(app.submissionDate || 0) > new Date(user.lastActivity)) {
        user.lastActivity = app.submissionDate || user.lastActivity;
      }
    });

    return Array.from(userMap.values()).sort((a, b) => 
      new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
    );
  };

  const users = generateUserProfiles();

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = !searchTerm || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || user.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  // User statistics
  const totalUsers = users.length;
  const individualUsers = users.filter(u => u.type === 'individual').length;
  const businessUsers = users.filter(u => u.type === 'business').length;
  const activeUsers = users.filter(u => {
    const daysSinceActivity = Math.floor((Date.now() - new Date(u.lastActivity).getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceActivity <= 30;
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage registered users and their application history</p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {totalUsers} Registered Users
        </Badge>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl text-gray-900">{totalUsers}</p>
              </div>
              <Users className="h-10 w-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Individual Users</p>
                <p className="text-3xl text-gray-900">{individualUsers}</p>
                <p className="text-sm text-blue-600">{((individualUsers / totalUsers) * 100).toFixed(0)}% of total</p>
              </div>
              <User className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Business Users</p>
                <p className="text-3xl text-gray-900">{businessUsers}</p>
                <p className="text-sm text-purple-600">{((businessUsers / totalUsers) * 100).toFixed(0)}% of total</p>
              </div>
              <Building2 className="h-10 w-10 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active (30 days)</p>
                <p className="text-3xl text-gray-900">{activeUsers}</p>
                <p className="text-sm text-green-600">{((activeUsers / totalUsers) * 100).toFixed(0)}% active</p>
              </div>
              <TrendingUp className="h-10 w-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search Users</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>User Type</Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types ({totalUsers})</SelectItem>
                  <SelectItem value="individual">Individual ({individualUsers})</SelectItem>
                  <SelectItem value="business">Business ({businessUsers})</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button variant="outline" className="w-full">
                Export User List
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead>Last Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          {user.type === 'individual' ? 
                            <User className="h-4 w-4 text-blue-600" /> : 
                            <Building2 className="h-4 w-4 text-blue-600" />
                          }
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(user.registrationDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{user.totalApplications}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {user.totalApplications > 0 ? 
                            `${((user.approvedApplications / user.totalApplications) * 100).toFixed(0)}%` : 
                            'N/A'
                          }
                        </span>
                        <Badge 
                          variant="outline" 
                          className={user.approvedApplications > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                        >
                          {user.approvedApplications} approved
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">L${user.totalPaid.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(user.lastActivity)}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>User Profile - {user.name}</DialogTitle>
                            <DialogDescription>
                              Complete user information and application history
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedUser && (
                            <div className="space-y-6">
                              {/* User Info */}
                              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                  <Label className="text-sm text-gray-600">Full Name</Label>
                                  <p className="font-medium">{selectedUser.name}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Email Address</Label>
                                  <p>{selectedUser.email}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">User Type</Label>
                                  <Badge className="capitalize">{selectedUser.type}</Badge>
                                </div>
                                <div>
                                  <Label className="text-sm text-gray-600">Registration Date</Label>
                                  <p>{formatDateTime(selectedUser.registrationDate)}</p>
                                </div>
                                {selectedUser.phone && (
                                  <div>
                                    <Label className="text-sm text-gray-600">Phone Number</Label>
                                    <p>{selectedUser.phone}</p>
                                  </div>
                                )}
                                <div>
                                  <Label className="text-sm text-gray-600">Last Activity</Label>
                                  <p>{formatDateTime(selectedUser.lastActivity)}</p>
                                </div>
                              </div>

                              {/* Statistics */}
                              <div className="grid grid-cols-3 gap-4">
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-medium text-blue-600">{selectedUser.totalApplications}</div>
                                    <div className="text-sm text-gray-600">Total Applications</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-medium text-green-600">{selectedUser.approvedApplications}</div>
                                    <div className="text-sm text-gray-600">Approved</div>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="p-4 text-center">
                                    <div className="text-2xl font-medium text-purple-600">L${selectedUser.totalPaid.toFixed(0)}</div>
                                    <div className="text-sm text-gray-600">Total Paid</div>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Application History */}
                              <div>
                                <h4 className="font-medium mb-3">Application History</h4>
                                <div className="border rounded-lg">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Reference</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Amount</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedUser.applications.map((app, idx) => (
                                        <TableRow key={idx}>
                                          <TableCell className="font-mono text-sm">
                                            {app.applicationReference}
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant="outline">
                                              {app.applicantType === 'individual' ? 'Individual' : 'Business'}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="text-sm">
                                            {formatDate(app.submissionDate || '')}
                                          </TableCell>
                                          <TableCell>
                                            <Badge className={getStatusColor(app.status)}>
                                              {app.status?.replace('-', ' ')?.toUpperCase() || 'UNKNOWN'}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>
                                            L${app.paymentData?.totalAmount?.toFixed(2) || '0.00'}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}