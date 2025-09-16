import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Eye, 
  Edit, 
  Trash2, 
  FileCheck, 
  Home, 
  CheckCircle, 
  AlertCircle,
  Settings,
  MapPin,
  Camera,
  FileText,
  UserCheck,
  ExternalLink,
  Tablet
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  permissions: string[];
  phoneNumber: string;
  employeeId: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
  icon: string;
  color: string;
}

const AVAILABLE_PERMISSIONS = [
  'view_applications',
  'edit_applications', 
  'approve_applications',
  'reject_applications',
  'view_documents',
  'verify_documents',
  'view_properties',
  'verify_properties',
  'upload_photos',
  'manage_users',
  'manage_roles',
  'view_reports',
  'manage_system_settings',
  'access_mobile_app',
  'field_operations'
];

const DEFAULT_ROLES: Role[] = [
  {
    id: 'document_verifier',
    name: 'Document Verifier',
    description: 'Reviews and verifies submitted documents, updates verification status',
    permissions: ['view_applications', 'view_documents', 'verify_documents'],
    userCount: 8,
    icon: 'FileCheck',
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'property_verifier',
    name: 'Property Verifier',
    description: 'Conducts physical property inspections, uploads photos and records details',
    permissions: ['view_applications', 'view_properties', 'verify_properties', 'upload_photos', 'access_mobile_app', 'field_operations'],
    userCount: 12,
    icon: 'Home',
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'application_verifier',
    name: 'Application Verifier',
    description: 'Reviews complete applications and makes final approval decisions',
    permissions: ['view_applications', 'edit_applications', 'approve_applications', 'reject_applications', 'view_documents', 'view_properties'],
    userCount: 6,
    icon: 'CheckCircle',
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'field_supervisor',
    name: 'Field Supervisor',
    description: 'Supervises property verification teams and manages field operations',
    permissions: ['view_applications', 'view_properties', 'verify_properties', 'access_mobile_app', 'field_operations', 'manage_users'],
    userCount: 4,
    icon: 'MapPin',
    color: 'bg-orange-100 text-orange-800'
  },
  {
    id: 'compliance_officer',
    name: 'Compliance Officer',
    description: 'Ensures regulatory compliance and handles audit requirements',
    permissions: ['view_applications', 'view_documents', 'view_properties', 'view_reports'],
    userCount: 3,
    icon: 'Shield',
    color: 'bg-red-100 text-red-800'
  }
];

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@lra.gov.lr',
    role: 'Document Verifier',
    department: 'Document Processing',
    status: 'active',
    lastLogin: '2025-01-04 09:15 AM',
    permissions: ['view_applications', 'view_documents', 'verify_documents'],
    phoneNumber: '+231-555-0123',
    employeeId: 'LRA-DOC-001'
  },
  {
    id: '2',
    name: 'Michael Davis',
    email: 'michael.davis@lra.gov.lr',
    role: 'Property Verifier',
    department: 'Field Operations',
    status: 'active',
    lastLogin: '2025-01-04 08:45 AM',
    permissions: ['view_applications', 'view_properties', 'verify_properties', 'upload_photos', 'access_mobile_app'],
    phoneNumber: '+231-555-0124',
    employeeId: 'LRA-PROP-001'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma.wilson@lra.gov.lr',
    role: 'Application Verifier',
    department: 'Application Review',
    status: 'active',
    lastLogin: '2025-01-04 10:30 AM',
    permissions: ['view_applications', 'approve_applications', 'reject_applications'],
    phoneNumber: '+231-555-0125',
    employeeId: 'LRA-APP-001'
  }
];

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [currentPortal, setCurrentPortal] = useState<string | null>(null);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phoneNumber: '',
    employeeId: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionIcon = (permission: string) => {
    const iconMap: { [key: string]: any } = {
      'view_applications': Eye,
      'verify_documents': FileCheck,
      'verify_properties': Home,
      'approve_applications': CheckCircle,
      'upload_photos': Camera,
      'access_mobile_app': MapPin,
      'manage_users': Users
    };
    return iconMap[permission] || FileText;
  };

  const handleCreateRole = () => {
    if (newRole.name && newRole.description) {
      const role: Role = {
        id: Date.now().toString(),
        name: newRole.name,
        description: newRole.description,
        permissions: newRole.permissions,
        userCount: 0,
        icon: 'Settings',
        color: 'bg-gray-100 text-gray-800'
      };
      setRoles([...roles, role]);
      setNewRole({ name: '', description: '', permissions: [] });
      setIsCreateRoleOpen(false);
    }
  };

  const handleCreateUser = () => {
    if (newUser.name && newUser.email && newUser.role) {
      const user: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        phoneNumber: newUser.phoneNumber,
        employeeId: newUser.employeeId,
        status: 'active',
        lastLogin: 'Never',
        permissions: roles.find(r => r.name === newUser.role)?.permissions || []
      };
      setUsers([...users, user]);
      setNewUser({ name: '', email: '', role: '', department: '', phoneNumber: '', employeeId: '' });
      setIsCreateUserOpen(false);
    }
  };

  const togglePermission = (permission: string) => {
    setNewRole(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const openRolePortal = (roleId: string) => {
    setCurrentPortal(roleId);
  };

  const closePortal = () => {
    setCurrentPortal(null);
  };

  // Import role portals
  const DocumentVerifierPortal = React.lazy(() => import('../roles/DocumentVerifierPortal'));
  const PropertyVerifierPortal = React.lazy(() => import('../roles/PropertyVerifierPortal'));
  const ApplicationVerifierPortal = React.lazy(() => import('../roles/ApplicationVerifierPortal'));

  // If a portal is open, render it
  if (currentPortal) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={closePortal}>
          ← Back to Role Management
        </Button>
        <React.Suspense fallback={<div>Loading portal...</div>}>
          {currentPortal === 'document_verifier' && <DocumentVerifierPortal />}
          {currentPortal === 'property_verifier' && <PropertyVerifierPortal />}
          {currentPortal === 'application_verifier' && <ApplicationVerifierPortal />}
        </React.Suspense>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold">Role Management</h1>
        </div>
        <div className="flex gap-2">
          <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
            <DialogTrigger asChild>
              <Button>
                <Shield className="h-4 w-4 mr-2" />
                Create Role
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
                <DialogDescription>
                  Define a new role with specific permissions for your team members.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Role Name</Label>
                  <Input
                    value={newRole.name}
                    onChange={(e) => setNewRole(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter role name"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={newRole.description}
                    onChange={(e) => setNewRole(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter role description"
                  />
                </div>
                <div>
                  <Label>Permissions</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {AVAILABLE_PERMISSIONS.map((permission) => {
                      const Icon = getPermissionIcon(permission);
                      return (
                        <div
                          key={permission}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border transition-colors ${
                            newRole.permissions.includes(permission)
                              ? 'bg-primary/10 border-primary'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                          onClick={() => togglePermission(permission)}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm">{permission.replace(/_/g, ' ')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRole}>Create Role</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Add a new team member and assign them to a role.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <Label>Employee ID</Label>
                    <Input
                      value={newUser.employeeId}
                      onChange={(e) => setNewUser(prev => ({ ...prev, employeeId: e.target.value }))}
                      placeholder="LRA-XXX-001"
                    />
                  </div>
                </div>
                <div>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@lra.gov.lr"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Role</Label>
                    <Select value={newUser.role} onValueChange={(value) => setNewUser(prev => ({ ...prev, role: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.name}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input
                      value={newUser.department}
                      onChange={(e) => setNewUser(prev => ({ ...prev, department: e.target.value }))}
                      placeholder="Enter department"
                    />
                  </div>
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <Input
                    value={newUser.phoneNumber}
                    onChange={(e) => setNewUser(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+231-XXX-XXXX"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateUser}>Add User</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="roles" className="w-full">
        <TabsList>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-6">
          {/* Quick Portal Access */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Quick Portal Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => openRolePortal('document_verifier')}
                >
                  <FileCheck className="h-6 w-6 text-blue-600" />
                  <div className="text-center">
                    <p className="font-medium">Document Verifier</p>
                    <p className="text-xs text-muted-foreground">Review & verify documents</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => openRolePortal('property_verifier')}
                >
                  <Tablet className="h-6 w-6 text-green-600" />
                  <div className="text-center">
                    <p className="font-medium">Property Verifier</p>
                    <p className="text-xs text-muted-foreground">Tablet app for field work</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => openRolePortal('application_verifier')}
                >
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                  <div className="text-center">
                    <p className="font-medium">Application Verifier</p>
                    <p className="text-xs text-muted-foreground">Final approval decisions</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${role.color}`}>
                        {role.icon === 'FileCheck' && <FileCheck className="h-5 w-5" />}
                        {role.icon === 'Home' && <Home className="h-5 w-5" />}
                        {role.icon === 'CheckCircle' && <CheckCircle className="h-5 w-5" />}
                        {role.icon === 'MapPin' && <MapPin className="h-5 w-5" />}
                        {role.icon === 'Shield' && <Shield className="h-5 w-5" />}
                        {role.icon === 'Settings' && <Settings className="h-5 w-5" />}
                      </div>
                      <CardTitle className="text-lg">{role.name}</CardTitle>
                    </div>
                    <Badge variant="outline">{role.userCount} users</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{role.description}</p>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs font-medium text-gray-600">Key Permissions:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {role.permissions.slice(0, 3).map((permission) => (
                          <Badge key={permission} variant="secondary" className="text-xs">
                            {permission.replace(/_/g, ' ')}
                          </Badge>
                        ))}
                        {role.permissions.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{role.permissions.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedRole(role)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Details
                      </Button>
                      {(role.id === 'document_verifier' || role.id === 'property_verifier' || role.id === 'application_verifier') && (
                        <Button 
                          size="sm"
                          onClick={() => openRolePortal(role.id)}
                          className="flex items-center gap-1"
                        >
                          {role.id === 'property_verifier' ? (
                            <Tablet className="h-3 w-3" />
                          ) : (
                            <ExternalLink className="h-3 w-3" />
                          )}
                          Portal
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedRole && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${selectedRole.color}`}>
                      {selectedRole.icon === 'FileCheck' && <FileCheck className="h-5 w-5" />}
                      {selectedRole.icon === 'Home' && <Home className="h-5 w-5" />}
                      {selectedRole.icon === 'CheckCircle' && <CheckCircle className="h-5 w-5" />}
                      {selectedRole.icon === 'MapPin' && <MapPin className="h-5 w-5" />}
                      {selectedRole.icon === 'Shield' && <Shield className="h-5 w-5" />}
                    </div>
                    {selectedRole.name} - Detailed Permissions
                  </CardTitle>
                  {(selectedRole.id === 'document_verifier' || selectedRole.id === 'property_verifier' || selectedRole.id === 'application_verifier') && (
                    <Button onClick={() => openRolePortal(selectedRole.id)}>
                      {selectedRole.id === 'property_verifier' ? (
                        <>
                          <Tablet className="h-4 w-4 mr-2" />
                          Open Tablet Portal
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open Portal
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Portal Information */}
                  {(selectedRole.id === 'document_verifier' || selectedRole.id === 'property_verifier' || selectedRole.id === 'application_verifier') && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Specialized Portal Available:</strong> {' '}
                        {selectedRole.id === 'document_verifier' && 'Document verification interface with document viewer and verification tools.'}
                        {selectedRole.id === 'property_verifier' && 'Tablet-optimized mobile app for field property inspections with camera integration.'}
                        {selectedRole.id === 'application_verifier' && 'Comprehensive application review interface for final approval decisions.'}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Permissions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedRole.permissions.map((permission) => {
                      const Icon = getPermissionIcon(permission);
                      return (
                        <div key={permission} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-medium text-sm">{permission.replace(/_/g, ' ').toUpperCase()}</p>
                            <p className="text-xs text-muted-foreground">
                              {permission === 'verify_documents' && 'Review and verify submitted documents'}
                              {permission === 'verify_properties' && 'Conduct physical property inspections'}
                              {permission === 'approve_applications' && 'Make final approval decisions'}
                              {permission === 'access_mobile_app' && 'Access tablet/mobile interface'}
                              {permission === 'upload_photos' && 'Upload and manage property photos'}
                              {permission === 'view_applications' && 'View application details'}
                              {permission === 'field_operations' && 'Manage field inspection operations'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Role & Permission Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'User Created', details: 'Michael Davis added as Property Verifier', time: '2 hours ago', type: 'success' },
                  { action: 'Role Updated', details: 'Document Verifier permissions modified', time: '4 hours ago', type: 'info' },
                  { action: 'User Suspended', details: 'John Smith account suspended', time: '1 day ago', type: 'warning' },
                  { action: 'New Role Created', details: 'Compliance Officer role created', time: '2 days ago', type: 'success' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`p-1 rounded-full ${activity.type === 'success' ? 'bg-green-100' : activity.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'}`}>
                      {activity.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                      {activity.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                      {activity.type === 'info' && <Settings className="h-4 w-4 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}