import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Download,
  Bell
} from 'lucide-react';

const mockContent = {
  dashboard: {
    title: 'Dashboard',
    component: () => (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Applications</p>
                  <p className="text-2xl">2</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Payments</p>
                  <p className="text-2xl">1</p>
                </div>
                <DollarSign className="h-8 w-8 text-chart-3" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl">3</p>
                </div>
                <CheckCircle className="h-8 w-8 text-chart-2" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Notifications</p>
                  <p className="text-2xl">3</p>
                </div>
                <Bell className="h-8 w-8 text-chart-4" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Individual GST Registration</p>
                    <p className="text-sm text-muted-foreground">Submitted 2 days ago</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Property Declaration</p>
                    <p className="text-sm text-muted-foreground">Submitted 1 week ago</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Approved</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  New GST Registration
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Forms
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Check Application Status
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  },
  applications: {
    title: 'My Applications',
    component: () => (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1>Application Management</h1>
          <Button>New Application</Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Track and manage all your GST registration applications in one place.</p>
          </CardContent>
        </Card>
      </div>
    )
  },
  fees: {
    title: 'Fees & Payments',
    component: () => (
      <div className="space-y-6">
        <h1>GST Registration Fees</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">View fee structure and make payments for your GST registration.</p>
          </CardContent>
        </Card>
      </div>
    )
  },
  individual: {
    title: 'Individual Registration',
    component: () => (
      <div className="space-y-6">
        <h1>Individual GST Registration</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Register as an individual taxpayer for GST purposes.</p>
          </CardContent>
        </Card>
      </div>
    )
  },
  business: {
    title: 'Business Registration',
    component: () => (
      <div className="space-y-6">
        <h1>Business GST Registration</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Register your business entity for GST compliance.</p>
          </CardContent>
        </Card>
      </div>
    )
  },
  property: {
    title: 'Property Declaration',
    component: () => (
      <div className="space-y-6">
        <h1>Residential Property Declaration</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Declare your residential properties as required by law.</p>
          </CardContent>
        </Card>
      </div>
    )
  },
  certificates: {
    title: 'Certificates',
    component: () => (
      <div className="space-y-6">
        <h1>GST Certificates</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Download and manage your GST certificates and official documents.</p>
          </CardContent>
        </Card>
      </div>
    )
  },
  receipts: {
    title: 'Payment Receipts',
    component: () => (
      <div className="space-y-6">
        <h1>Transaction History</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">View and download receipts for all your payments and transactions.</p>
          </CardContent>
        </Card>
      </div>
    )
  },
  documents: {
    title: 'Documents',
    component: () => (
      <div className="space-y-6">
        <h1>Forms & Guidelines</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Access official forms, guidelines, and documentation for GST registration.</p>
          </CardContent>
        </Card>
      </div>
    )
  },
  notifications: {
    title: 'Notifications',
    component: () => (
      <div className="space-y-6">
        <h1>System Notifications</h1>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Application Update</p>
                  <p className="text-sm text-muted-foreground">Your individual registration is under review</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Payment Confirmed</p>
                  <p className="text-sm text-muted-foreground">Registration fee payment has been processed</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 border rounded-lg">
                <Bell className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium">Reminder</p>
                  <p className="text-sm text-muted-foreground">Property declaration deadline approaching</p>
                  <p className="text-xs text-muted-foreground">3 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
  help: {
    title: 'Help & Support',
    component: () => (
      <div className="space-y-6">
        <h1>Help & Support</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Get assistance with your GST registration process and account management.</p>
          </CardContent>
        </Card>
      </div>
    )
  },
  settings: {
    title: 'Account Settings',
    component: () => (
      <div className="space-y-6">
        <h1>Account Settings</h1>
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">Manage your profile information, preferences, and account security.</p>
          </CardContent>
        </Card>
      </div>
    )
  }
};

export default function SidebarDemo() {
  const [currentSection, setCurrentSection] = useState('dashboard');

  const handleLogout = () => {
    alert('Logout functionality would be implemented here');
  };

  const currentContent = mockContent[currentSection as keyof typeof mockContent] || mockContent.dashboard;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection}
        onLogout={handleLogout}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl text-foreground mb-4">
                {currentContent.title}
              </h1>
              <div className="w-16 h-1 bg-primary rounded"></div>
            </div>
            
            <currentContent.component />
          </div>
        </div>
      </div>
    </div>
  );
}