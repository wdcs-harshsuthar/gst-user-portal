import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Shield, 
  FileCheck, 
  Home, 
  ArrowLeft,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface RoleCredentials {
  email: string;
  password: string;
  role: 'super-admin' | 'admin' | 'officer' | 'document-verifier' | 'property-verifier' | 'application-verifier';
  name: string;
  department: string;
}

interface RoleBasedLoginProps {
  onLogin: (role: RoleCredentials['role'], user: RoleCredentials) => void;
  onBack: () => void;
  title?: string;
  subtitle?: string;
}

export default function RoleBasedLogin({ 
  onLogin, 
  onBack, 
  title = "LRA Staff Portal",
  subtitle = "Role-Based Access System"
}: RoleBasedLoginProps) {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Enhanced credentials with all role types
  const roleCredentials: RoleCredentials[] = [
    // Admin roles
    {
      email: 'admin@lra.gov.lr',
      password: 'admin123',
      role: 'super-admin',
      name: 'Sarah Johnson',
      department: 'Revenue Administration'
    },
    {
      email: 'officer@lra.gov.lr',
      password: 'admin123',
      role: 'officer',
      name: 'Michael Roberts',
      department: 'Tax Processing'
    },
    // Verifier roles
    {
      email: 'document.verifier@lra.gov.lr',
      password: 'doc123',
      role: 'document-verifier',
      name: 'Sarah Johnson',
      department: 'Document Verification Unit'
    },
    {
      email: 'property.verifier@lra.gov.lr',
      password: 'prop123',
      role: 'property-verifier',
      name: 'Michael Davis',
      department: 'Field Inspection Unit'
    },
    {
      email: 'application.verifier@lra.gov.lr',
      password: 'app123',
      role: 'application-verifier',
      name: 'Patricia Johnson',
      department: 'Final Approval Unit'
    }
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Find matching credentials
    const user = roleCredentials.find(u => 
      u.email === loginData.email && u.password === loginData.password
    );
    
    if (user) {
      onLogin(user.role, user);
      setLoginData({ email: '', password: '' });
    } else {
      setLoginError('Invalid email or password. Please check the demo credentials below.');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'document-verifier': return FileCheck;
      case 'property-verifier': return Home;
      case 'application-verifier': return Shield;
      default: return Shield;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'document-verifier': return 'text-blue-600';
      case 'property-verifier': return 'text-green-600';
      case 'application-verifier': return 'text-purple-600';
      default: return 'text-red-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="flex items-center gap-3 justify-center">
            <Shield className="h-8 w-8" />
            <div className="text-center">
              <h1 className="text-xl">{title}</h1>
              <p className="text-blue-200 text-sm">{subtitle}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl mb-2">Staff Login</h2>
            <p className="text-gray-600">Access your designated portal</p>
          </div>

          {loginError && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-700">
                {loginError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your official email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              <Shield className="mr-2 h-5 w-5" />
              Login to Portal
            </Button>
          </form>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Demo Credentials:</h4>
            <div className="text-xs text-gray-600 space-y-2">
              {/* Admin Credentials */}
              <div className="border-b border-gray-200 pb-2">
                <p className="font-medium text-gray-700 mb-1">Administrative Access:</p>
                <p><strong>Super Admin:</strong> admin@lra.gov.lr / admin123</p>
                <p><strong>Officer:</strong> officer@lra.gov.lr / admin123</p>
              </div>
              
              {/* Verifier Credentials */}
              <div>
                <p className="font-medium text-gray-700 mb-1">Verifier Access:</p>
                {roleCredentials
                  .filter(cred => cred.role.includes('verifier'))
                  .map((cred, index) => {
                    const Icon = getRoleIcon(cred.role);
                    return (
                      <div key={index} className="flex items-center gap-2 py-1">
                        <Icon className={`h-3 w-3 ${getRoleColor(cred.role)}`} />
                        <span>
                          <strong>{cred.role.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {cred.email} / {cred.password}
                        </span>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="w-full mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Main Menu
            </Button>
            <p className="text-sm text-gray-500">© 2025 Republic of Liberia - Liberia Revenue Authority</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}