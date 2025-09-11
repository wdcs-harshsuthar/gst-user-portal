'use client';

/**
 * Notification System
 * 
 * A comprehensive notification system with toaster support,
 * global error handling, and user feedback management.
 */

import { Notification, NotificationType } from '../types/api';

// ============================================================================
// Notification Manager
// ============================================================================

class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];
  private nextId = 1;

  // ============================================================================
  // Core Methods
  // ============================================================================

  addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): string {
    const id = `notification-${this.nextId++}`;
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date().toISOString(),
    };

    this.notifications.unshift(newNotification);
    this.notifyListeners();

    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      const duration = notification.duration || this.getDefaultDuration(notification.type);
      setTimeout(() => {
        this.removeNotification(id);
      }, duration);
    }

    return id;
  }

  removeNotification(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notifyListeners();
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.notifyListeners();
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  // ============================================================================
  // Convenience Methods
  // ============================================================================

  success(title: string, message: string, options?: Partial<Notification>): string {
    return this.addNotification({
      type: 'success',
      title,
      message,
      ...options,
    });
  }

  error(title: string, message: string, options?: Partial<Notification>): string {
    return this.addNotification({
      type: 'error',
      title,
      message,
      duration: 0, // Don't auto-remove errors
      ...options,
    });
  }

  warning(title: string, message: string, options?: Partial<Notification>): string {
    return this.addNotification({
      type: 'warning',
      title,
      message,
      ...options,
    });
  }

  info(title: string, message: string, options?: Partial<Notification>): string {
    return this.addNotification({
      type: 'info',
      title,
      message,
      ...options,
    });
  }

  // ============================================================================
  // API Error Handling
  // ============================================================================

  handleApiError(error: any, context?: string): string {
    let title = 'Error';
    let message = 'An unexpected error occurred';

    if (error?.error) {
      const apiError = error.error;
      title = this.getErrorTitle(apiError.code);
      message = apiError.message;

      if (context) {
        message = `${context}: ${message}`;
      }

      if (apiError.field) {
        message = `${apiError.field}: ${message}`;
      }
    } else if (error?.message) {
      message = error.message;
      if (context) {
        message = `${context}: ${message}`;
      }
    }

    return this.error(title, message, {
      action: error?.error?.code === 'AUTHENTICATION_ERROR' ? {
        label: 'Login',
        onClick: () => {
          // Handle login redirect
          window.location.href = '/login';
        },
      } : undefined,
    });
  }

  handleApiSuccess(message: string, context?: string): string {
    const fullMessage = context ? `${context}: ${message}` : message;
    return this.success('Success', fullMessage);
  }

  // ============================================================================
  // Form Validation
  // ============================================================================

  handleValidationErrors(errors: Record<string, string>): void {
    Object.entries(errors).forEach(([field, message]) => {
      this.error('Validation Error', `${field}: ${message}`);
    });
  }

  // ============================================================================
  // File Upload
  // ============================================================================

  handleUploadProgress(filename: string, progress: number): void {
    // You could implement a progress notification here
    console.log(`Uploading ${filename}: ${progress}%`);
  }

  handleUploadSuccess(filename: string): string {
    return this.success('Upload Complete', `${filename} uploaded successfully`);
  }

  handleUploadError(filename: string, error: string): string {
    return this.error('Upload Failed', `Failed to upload ${filename}: ${error}`);
  }

  // ============================================================================
  // Event Listeners
  // ============================================================================

  subscribe(listener: (notifications: Notification[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.notifications));
  }

  // ============================================================================
  // Helper Methods
  // ============================================================================

  private getDefaultDuration(type: NotificationType): number {
    switch (type) {
      case 'success':
        return 5000; // 5 seconds
      case 'error':
        return 0; // Don't auto-remove
      case 'warning':
        return 7000; // 7 seconds
      case 'info':
        return 4000; // 4 seconds
      default:
        return 5000;
    }
  }

  private getErrorTitle(code: string): string {
    switch (code) {
      case 'VALIDATION_ERROR':
        return 'Validation Error';
      case 'AUTHENTICATION_ERROR':
        return 'Authentication Required';
      case 'AUTHORIZATION_ERROR':
        return 'Access Denied';
      case 'NOT_FOUND':
        return 'Not Found';
      case 'CONFLICT':
        return 'Conflict';
      case 'RATE_LIMIT':
        return 'Rate Limit Exceeded';
      case 'SERVER_ERROR':
        return 'Server Error';
      case 'NETWORK_ERROR':
        return 'Network Error';
      case 'TIMEOUT':
        return 'Request Timeout';
      default:
        return 'Error';
    }
  }
}

// ============================================================================
// Global Instance
// ============================================================================

export const notificationManager = new NotificationManager();

// ============================================================================
// React Hook for Notifications
// ============================================================================

import { useState, useEffect } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  return {
    notifications,
    addNotification: notificationManager.addNotification.bind(notificationManager),
    removeNotification: notificationManager.removeNotification.bind(notificationManager),
    clearAll: notificationManager.clearAllNotifications.bind(notificationManager),
    success: notificationManager.success.bind(notificationManager),
    error: notificationManager.error.bind(notificationManager),
    warning: notificationManager.warning.bind(notificationManager),
    info: notificationManager.info.bind(notificationManager),
    handleApiError: notificationManager.handleApiError.bind(notificationManager),
    handleApiSuccess: notificationManager.handleApiSuccess.bind(notificationManager),
    handleValidationErrors: notificationManager.handleValidationErrors.bind(notificationManager),
  };
};

// ============================================================================
// Global Error Handler
// ============================================================================

export class GlobalErrorHandler {
  private static instance: GlobalErrorHandler;
  private isInitialized = false;

  static getInstance(): GlobalErrorHandler {
    if (!GlobalErrorHandler.instance) {
      GlobalErrorHandler.instance = new GlobalErrorHandler();
    }
    return GlobalErrorHandler.instance;
  }

  initialize(): void {
    if (this.isInitialized) return;

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, 'Unhandled Promise Rejection');
    });

    // Handle global errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error, 'Global Error');
    });

    this.isInitialized = true;
  }

  handleError(error: any, context?: string): void {
    console.error('Global Error:', error, context);

    // Don't show notifications for certain types of errors
    if (this.shouldIgnoreError(error)) {
      return;
    }

    notificationManager.handleApiError(error, context);
  }

  private shouldIgnoreError(error: any): boolean {
    // Ignore network errors when offline
    if (error?.message?.includes('fetch') && !navigator.onLine) {
      return true;
    }

    // Ignore certain browser errors
    if (error?.message?.includes('ResizeObserver loop limit exceeded')) {
      return true;
    }

    return false;
  }
}

// ============================================================================
// API Error Handler
// ============================================================================

export const handleApiResponse = <T>(
  response: any,
  context?: string
): T | null => {
  if (response.success) {
    if (context) {
      notificationManager.handleApiSuccess('Operation completed successfully', context);
    }
    return response.data;
  } else {
    notificationManager.handleApiError(response, context);
    return null;
  }
};

// ============================================================================
// Form Error Handler
// ============================================================================

export const handleFormErrors = (errors: Record<string, string>): void => {
  if (Object.keys(errors).length > 0) {
    notificationManager.handleValidationErrors(errors);
  }
};

// ============================================================================
// Export Default Instance
// ============================================================================

export const globalErrorHandler = GlobalErrorHandler.getInstance();

// ============================================================================
// Utility Functions
// ============================================================================

export const showSuccess = (message: string, title: string = 'Success') => {
  return notificationManager.success(title, message);
};

export const showError = (message: string, title: string = 'Error') => {
  return notificationManager.error(title, message);
};

export const showWarning = (message: string, title: string = 'Warning') => {
  return notificationManager.warning(title, message);
};

export const showInfo = (message: string, title: string = 'Info') => {
  return notificationManager.info(title, message);
};

export const showApiError = (error: any, context?: string) => {
  return notificationManager.handleApiError(error, context);
};

export const showApiSuccess = (message: string, context?: string) => {
  return notificationManager.handleApiSuccess(message, context);
};

