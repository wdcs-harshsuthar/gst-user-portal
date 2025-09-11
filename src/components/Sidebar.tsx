import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  LayoutDashboard, 
  DollarSign, 
  FileText,
  User,
  Building2,
  Receipt,
  CreditCard,
  Clock,
  HelpCircle,
  Settings,
  Download,
  Bell,
  LogOut,
  Home,
  CheckCircle
} from 'lucide-react';
import { useAppData } from './shared/AppDataManager';

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
  onLogout: () => void;
}

export default function Sidebar({ currentSection, onSectionChange, onLogout }: SidebarProps) {
  const { applications, unreadCount } = useAppData();
  const applicationCount = applications.length || 0;
  
  const mainMenuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Quick Actions'
    },
    {
      id: 'applications',
      label: 'My Applications',
      icon: FileText,
      description: 'Track Application Status',
      badge: applicationCount.toString()
    },
    {
      id: 'fees',
      label: 'Fees & Payments',
      icon: DollarSign,
      description: 'GST Registration Fees'
    }
  ];

  const registrationItems = [
    {
      id: 'individual',
      label: 'Individual Registration',
      icon: User,
      description: 'Personal GST Registration'
    },
    {
      id: 'business',
      label: 'Business Registration',
      icon: Building2,
      description: 'Company GST Registration'
    },
    {
      id: 'property',
      label: 'Property Declaration',
      icon: Home,
      description: 'Residential Property Form'
    }
  ];

  const servicesItems = [
    {
      id: 'certificates',
      label: 'Certificates',
      icon: CheckCircle,
      description: 'Download GST Certificates'
    },
    {
      id: 'receipts',
      label: 'Payment Receipts',
      icon: Receipt,
      description: 'Transaction History'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: Download,
      description: 'Forms & Guidelines'
    }
  ];

  const supportItems = [
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'System Updates',
      badge: unreadCount > 0 ? unreadCount.toString() : undefined
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      description: 'Get Assistance'
    },
    {
      id: 'settings',
      label: 'Account Settings',
      icon: Settings,
      description: 'Manage Profile'
    }
  ];

  const renderMenuItem = (item: any, section?: string) => {
    const Icon = item.icon;
    const isActive = currentSection === item.id;
    
    return (
      <Button
        key={item.id}
        variant="ghost"
        className={`w-full justify-start h-auto p-3 rounded-lg transition-all duration-200 ${
          isActive 
            ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm border border-sidebar-border' 
            : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        }`}
        onClick={() => onSectionChange(item.id)}
      >
        <div className="flex items-center gap-3 w-full">
          <Icon className={`h-4 w-4 flex-shrink-0 ${
            isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground/60'
          }`} />
          <div className="text-left flex-1 min-w-0">
            <div className={`text-sm truncate ${
              isActive ? 'text-sidebar-primary-foreground' : 'text-sidebar-foreground'
            }`}>
              {item.label}
            </div>
            <div className={`text-xs truncate ${
              isActive ? 'text-sidebar-primary-foreground/70' : 'text-sidebar-foreground/50'
            }`}>
              {item.description}
            </div>
          </div>
          {(item.badge !== undefined || item.id === 'applications') && (
            <Badge 
              className={`text-xs px-1.5 py-0.5 h-auto flex-shrink-0 ${
                isActive 
                  ? 'bg-sidebar-primary-foreground/20 text-sidebar-primary-foreground' 
                  : 'bg-sidebar-accent text-sidebar-accent-foreground'
              }`}
            >
              {item.id === 'applications' ? applicationCount : item.badge}
            </Badge>
          )}
        </div>
      </Button>
    );
  };

  const renderSectionHeader = (title: string) => (
    <div className="px-3 py-2">
      <h3 className="text-xs font-medium text-sidebar-foreground/50 uppercase tracking-wider">
        {title}
      </h3>
    </div>
  );

  return (
    <div className="w-72 bg-sidebar border-r border-sidebar-border shadow-sm h-full flex flex-col">
      {/* Logo/Header Section */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
            <FileText className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h3 className="font-medium text-sidebar-foreground">GST Portal</h3>
            <p className="text-xs text-sidebar-foreground/60">Liberia Revenue Authority</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Main Section */}
        <div className="space-y-1">
          {renderSectionHeader('Main')}
          <div className="space-y-1">
            {mainMenuItems.map((item) => renderMenuItem(item, 'main'))}
          </div>
        </div>

        {/* <Separator className="bg-sidebar-border" /> */}

        {/* Registration Section */}
        {/* <div className="space-y-1">
          {renderSectionHeader('Registration')}
          <div className="space-y-1">
            {registrationItems.map((item) => renderMenuItem(item, 'registration'))}
          </div>
        </div> */}

        <Separator className="bg-sidebar-border" />

        {/* Services Section */}
        <div className="space-y-1">
          {renderSectionHeader('Services')}
          <div className="space-y-1">
            {servicesItems.map((item) => renderMenuItem(item, 'services'))}
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Support Section */}
        <div className="space-y-1">
          {renderSectionHeader('Support')}
          <div className="space-y-1">
            {supportItems.map((item) => renderMenuItem(item, 'support'))}
          </div>
        </div>
      </nav>

      {/* User Profile & Logout */}
      {/* <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-sidebar-accent mb-3">
          <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-sidebar-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-sidebar-accent-foreground truncate">John M. Johnson</div>
            <div className="text-xs text-sidebar-accent-foreground/60 truncate">john.johnson@email.com</div>
          </div>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start p-3 text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          onClick={onLogout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          <span className="text-sm">Sign Out</span>
        </Button>
      </div> */}

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-center">
          <p className="text-xs text-sidebar-foreground/40">
            © 2025 Republic of Liberia
          </p>
          <p className="text-xs text-sidebar-foreground/40">
            Liberia Revenue Authority
          </p>
        </div>
      </div>
    </div>
  );
}