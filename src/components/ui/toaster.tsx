'use client';

import React from 'react';
import { useNotifications } from '../../lib/notifications';
import { Notification } from '../../types/api';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from './utils';

// ============================================================================
// Toast Component
// ============================================================================

interface ToastProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getTitleColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  };

  const getMessageColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-700';
      case 'error':
        return 'text-red-700';
      case 'warning':
        return 'text-yellow-700';
      case 'info':
        return 'text-blue-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div
      className={cn(
        'relative flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out',
        getBackgroundColor(),
        'animate-in slide-in-from-right-full'
      )}
      role="alert"
      aria-live="polite"
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {getIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className={cn('text-sm font-semibold', getTitleColor())}>
          {notification.title}
        </h4>
        <p className={cn('mt-1 text-sm', getMessageColor())}>
          {notification.message}
        </p>

        {/* Action Button */}
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className={cn(
              'mt-2 text-sm font-medium underline hover:no-underline',
              getTitleColor()
            )}
          >
            {notification.action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => onRemove(notification.id)}
        className={cn(
          'flex-shrink-0 rounded-md p-1 hover:bg-black/5 transition-colors',
          getMessageColor()
        )}
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// ============================================================================
// Toaster Component
// ============================================================================

export const Toaster: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

// ============================================================================
// Toast Container (Alternative Layout)
// ============================================================================

export const ToastContainer: React.FC<{
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}> = ({ 
  position = 'top-right', 
  maxToasts = 5 
}) => {
  const { notifications, removeNotification } = useNotifications();
  
  const visibleNotifications = notifications.slice(0, maxToasts);

  if (visibleNotifications.length === 0) {
    return null;
  }

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div className={cn(
      'fixed z-50 flex flex-col gap-2 max-w-sm w-full',
      getPositionClasses()
    )}>
      {visibleNotifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

// ============================================================================
// Toast Provider (for app-wide integration)
// ============================================================================

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
};

// ============================================================================
// Hook for Toast Actions
// ============================================================================

export const useToast = () => {
  const { 
    success, 
    error, 
    warning, 
    info, 
    handleApiError, 
    handleApiSuccess,
    handleValidationErrors 
  } = useNotifications();

  return {
    success,
    error,
    warning,
    info,
    handleApiError,
    handleApiSuccess,
    handleValidationErrors,
  };
};

// ============================================================================
// Export Default
// ============================================================================

export default Toaster;

