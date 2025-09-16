import React from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { 
  Shield, 
  LayoutDashboard, 
  FileText, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut
} from 'lucide-react';
import { AdminSection } from '../../AdminApp';

interface AdminSidebarProps {
  currentSection: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  onLogout: () => void;
  adminUser: any;
}

export default function AdminSidebar({ 
  currentSection, 
  onSectionChange, 
  onLogout,
  adminUser 
}: AdminSidebarProps) {
  
  const menuItems = [
    {
      id: 'dashboard' as AdminSection,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Statistics'
    },
    {
      id: 'applications' as AdminSection,
      label: 'Applications',
      icon: FileText,
      description: 'Manage GST Applications',
      badge: 'New'
    },
    {
      id: 'users' as AdminSection,
      label: 'Users',
      icon: Users,
      description: 'User Management'
    },
    {
      id: 'roles' as AdminSection,
      label: 'Role Management',
      icon: Shield,
      description: 'Manage Roles & Permissions',
      badge: 'Admin'
    },
    {
      id: 'reports' as AdminSection,
      label: 'Reports',
      icon: BarChart3,
      description: 'Analytics & Reports'
    },
    {
      id: 'settings' as AdminSection,
      label: 'Settings',
      icon: Settings,
      description: 'System Configuration'
    }
  ];



  return (
    <div className="w-80 bg-white h-full shadow-2xl border-r">
      <div className="p-6 border-b bg-gradient-to-r from-red-50 to-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-medium text-gray-900">Admin Portal</h2>
            <p className="text-sm text-gray-600">LRA GST System</p>
          </div>
        </div>
        

      </div>

      <div className="p-6">
        <div className="space-y-2 mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Navigation</h3>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? 'default' : 'ghost'}
                className={`w-full justify-start h-auto p-3 ${
                  isActive 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => onSectionChange(item.id)}
              >
                <div className="flex items-center gap-3 w-full">
                  <Icon className="h-5 w-5" />
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            isActive ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p className={`text-xs ${isActive ? 'text-red-100' : 'text-gray-500'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>

        



      
      </div>
    </div>
  );
}