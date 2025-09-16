import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  XCircle, 
  X, 
  Bell,
  Clock,
  Mail,
  FileText,
  DollarSign
} from 'lucide-react';
import { cn } from '../ui/utils';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  persistent?: boolean;
  duration?: number;
  timestamp: Date;
  read?: boolean;
  category?: 'system' | 'application' | 'payment' | 'document';
  priority?: 'low' | 'medium' | 'high';
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const notification: Notification = {
      ...notificationData,
      id,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [notification, ...prev]);

    // Auto-remove non-persistent notifications
    if (!notification.persistent) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('gst-notifications');
      if (saved) {
        const parsedNotifications = JSON.parse(saved).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(parsedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  // Save notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gst-notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  }, [notifications]);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    unreadCount
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationDisplay />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Toast-style notification display
function NotificationDisplay() {
  const { notifications, removeNotification } = useNotifications();
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  // Show only non-persistent notifications as toasts
  useEffect(() => {
    const toasts = notifications.filter(n => !n.persistent).slice(0, 3);
    setVisibleNotifications(toasts);
  }, [notifications]);

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {visibleNotifications.map((notification) => (
        <Card 
          key={notification.id}
          className={cn(
            "shadow-lg transition-all duration-300 animate-in slide-in-from-right",
            getBackgroundColor(notification.type)
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {getIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{notification.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                {notification.action && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={notification.action.onClick}
                    className="mt-2"
                  >
                    {notification.action.label}
                  </Button>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNotification(notification.id)}
                className="shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Notification Center component
export function NotificationCenter() {
  const { 
    notifications, 
    removeNotification, 
    markAsRead, 
    markAllAsRead, 
    clearAll,
    unreadCount 
  } = useNotifications();

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'application':
        return <FileText className="h-4 w-4" />;
      case 'payment':
        return <DollarSign className="h-4 w-4" />;
      case 'document':
        return <FileText className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      default:
        return 'border-l-gray-300';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="w-full max-w-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount}</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={clearAll}>
            Clear all
          </Button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id}
              className={cn(
                "cursor-pointer transition-colors border-l-4",
                notification.read ? 'opacity-60' : '',
                getPriorityColor(notification.priority)
              )}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(notification.category)}
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={cn(
                        "font-medium text-sm",
                        !notification.read && "font-semibold"
                      )}>
                        {notification.title}
                      </h4>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {formatTime(notification.timestamp)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    {notification.action && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          notification.action!.onClick();
                        }}
                        className="mt-2"
                      >
                        {notification.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Helper hook for common notification types
export function useCommonNotifications() {
  const { addNotification } = useNotifications();

  const notifyApplicationSubmitted = useCallback((reference: string) => {
    addNotification({
      type: 'success',
      title: 'Application Submitted',
      message: `Your GST registration application ${reference} has been submitted successfully.`,
      category: 'application',
      priority: 'medium',
      persistent: true
    });
  }, [addNotification]);

  const notifyApplicationApproved = useCallback((reference: string, gstNumber: string) => {
    addNotification({
      type: 'success',
      title: 'Application Approved',
      message: `Your GST application ${reference} has been approved. GST Number: ${gstNumber}`,
      category: 'application',
      priority: 'high',
      persistent: true,
      action: {
        label: 'View Certificate',
        onClick: () => {
          // Navigate to certificate view
          console.log('Navigate to certificate');
        }
      }
    });
  }, [addNotification]);

  const notifyPaymentRequired = useCallback((amount: number, reference: string) => {
    addNotification({
      type: 'warning',
      title: 'Payment Required',
      message: `Payment of $${amount} is required for application ${reference}.`,
      category: 'payment',
      priority: 'high',
      persistent: true,
      action: {
        label: 'Make Payment',
        onClick: () => {
          // Navigate to payment
          console.log('Navigate to payment');
        }
      }
    });
  }, [addNotification]);

  const notifyDocumentRequired = useCallback((documentType: string, reference: string) => {
    addNotification({
      type: 'warning',
      title: 'Document Required',
      message: `${documentType} is required for application ${reference}.`,
      category: 'document',
      priority: 'medium',
      persistent: true,
      action: {
        label: 'Upload Document',
        onClick: () => {
          // Navigate to document upload
          console.log('Navigate to document upload');
        }
      }
    });
  }, [addNotification]);

  const notifySystemMaintenance = useCallback((message: string) => {
    addNotification({
      type: 'info',
      title: 'System Maintenance',
      message,
      category: 'system',
      priority: 'low',
      persistent: true
    });
  }, [addNotification]);

  return {
    notifyApplicationSubmitted,
    notifyApplicationApproved,
    notifyPaymentRequired,
    notifyDocumentRequired,
    notifySystemMaintenance
  };
}