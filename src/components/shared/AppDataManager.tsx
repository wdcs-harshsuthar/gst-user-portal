import { useState, useEffect } from 'react';
import { DUMMY_COMPLETED_APPLICATIONS } from './dummyData';

export interface Application {
  id?: string;
  entryPoint?: 'individual' | 'business';
  applicantType?: string;
  businessType?: string;
  existingTin?: string;
  individualData?: any;
  businessData?: any;
  soleProprietorshipData?: any;
  ownersShareholdersData?: any;
  propertyData?: any;
  paymentData?: any;
  submissionDate?: string;
  applicationReference?: string;
  status?: 'submitted' | 'pending-receipt' | 'under-review' | 'processing' | 'approved' | 'rejected';
  gstNumber?: string;
  gstGeneratedDate?: string;
  gstGeneratedBy?: string;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  accountType: 'individual' | 'business';
  isVerified: boolean;
  registrationDate: string;
  lastLoginDate: string;
}

export interface NotificationItem {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  applicationReference?: string;
}

class AppDataManager {
  private static instance: AppDataManager;
  private applications: Application[] = [];
  private userProfile: UserProfile | null = null;
  private notifications: NotificationItem[] = [];

  private constructor() {
    this.loadData();
    this.initializeDummyData();
  }

  public static getInstance(): AppDataManager {
    if (!AppDataManager.instance) {
      AppDataManager.instance = new AppDataManager();
    }
    return AppDataManager.instance;
  }

  private loadData() {
    // Load applications
    const savedApplications = localStorage.getItem('gst_applications');
    if (savedApplications) {
      try {
        this.applications = JSON.parse(savedApplications);
      } catch (error) {
        console.error('Error loading applications:', error);
        this.applications = [...DUMMY_COMPLETED_APPLICATIONS];
      }
    } else {
      this.applications = [...DUMMY_COMPLETED_APPLICATIONS];
    }

    // Load user profile
    const savedProfile = localStorage.getItem('gst_user_profile');
    if (savedProfile) {
      try {
        this.userProfile = JSON.parse(savedProfile);
      } catch (error) {
        console.error('Error loading user profile:', error);
        this.initializeUserProfile();
      }
    } else {
      this.initializeUserProfile();
    }

    // Load notifications
    const savedNotifications = localStorage.getItem('gst_notifications');
    if (savedNotifications) {
      try {
        this.notifications = JSON.parse(savedNotifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
        this.initializeNotifications();
      }
    } else {
      this.initializeNotifications();
    }
  }

  private saveData() {
    localStorage.setItem('gst_applications', JSON.stringify(this.applications));
    localStorage.setItem('gst_user_profile', JSON.stringify(this.userProfile));
    localStorage.setItem('gst_notifications', JSON.stringify(this.notifications));
  }

  private initializeUserProfile() {
    this.userProfile = {
      id: 'user_' + Date.now(),
      firstName: 'John',
      lastName: 'Moses Johnson',
      email: 'john.johnson@email.com',
      phone: '+231-777-123456',
      accountType: 'individual',
      isVerified: true,
      registrationDate: new Date().toISOString(),
      lastLoginDate: new Date().toISOString()
    };
  }

  private initializeNotifications() {
    this.notifications = [
      {
        id: 'notif_1',
        type: 'info',
        title: 'Application Update',
        message: 'Your individual registration application is under review by our team.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        isRead: false,
        applicationReference: 'GST-1704123456789-LR'
      },
      {
        id: 'notif_2',
        type: 'success',
        title: 'Payment Confirmed',
        message: 'Your registration fee payment has been successfully processed.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        isRead: false
      },
      {
        id: 'notif_3',
        type: 'warning',
        title: 'Reminder',
        message: "Don't forget to complete your property declaration form.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        isRead: true
      }
    ];
  }

  private initializeDummyData() {
    // Add GST numbers to approved applications
    this.applications = this.applications.map((app, index) => {
      if (app.status === 'approved' || Math.random() > 0.5) {
        return {
          ...app,
          status: 'approved' as const,
          gstNumber: `GST-LR-${2024}-${String(index + 1).padStart(7, '0')}`,
          gstGeneratedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          gstGeneratedBy: 'LRA System'
        };
      }
      return app;
    });

    this.saveData();
  }

  // Application management
  public getApplications(): Application[] {
    return [...this.applications];
  }

  public addApplication(application: Application): void {
    application.id = 'app_' + Date.now();
    this.applications.push(application);
    this.saveData();
    
    // Add notification for new application
    this.addNotification({
      type: 'info',
      title: 'Application Submitted',
      message: `Your application ${application.applicationReference} has been submitted successfully.`,
      applicationReference: application.applicationReference
    });
  }

  public updateApplication(id: string, updates: Partial<Application>): void {
    const index = this.applications.findIndex(app => app.id === id || app.applicationReference === id);
    if (index !== -1) {
      this.applications[index] = { ...this.applications[index], ...updates };
      this.saveData();
    }
  }

  public deleteApplication(id: string): void {
    this.applications = this.applications.filter(app => app.id !== id && app.applicationReference !== id);
    this.saveData();
  }

  public getApplicationStats() {
    const total = this.applications.length;
    const pending = this.applications.filter(app => app.status === 'pending-receipt').length;
    const underReview = this.applications.filter(app => 
      app.status === 'under-review' || app.status === 'processing'
    ).length;
    const approved = this.applications.filter(app => app.status === 'approved').length;
    const rejected = this.applications.filter(app => app.status === 'rejected').length;

    return { total, pending, underReview, approved, rejected };
  }

  // User profile management
  public getUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  public updateUserProfile(updates: Partial<UserProfile>): void {
    if (this.userProfile) {
      this.userProfile = { ...this.userProfile, ...updates };
      this.saveData();
    }
  }

  // Notification management
  public getNotifications(): NotificationItem[] {
    return [...this.notifications].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public addNotification(notification: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>): void {
    const newNotification: NotificationItem = {
      ...notification,
      id: 'notif_' + Date.now(),
      timestamp: new Date().toISOString(),
      isRead: false
    };
    this.notifications.push(newNotification);
    this.saveData();
  }

  public markNotificationAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.saveData();
    }
  }

  public markAllNotificationsAsRead(): void {
    this.notifications.forEach(n => n.isRead = true);
    this.saveData();
  }

  public getUnreadNotificationCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  // Utility methods
  public clearAllData(): void {
    this.applications = [];
    this.notifications = [];
    this.userProfile = null;
    localStorage.removeItem('gst_applications');
    localStorage.removeItem('gst_user_profile');
    localStorage.removeItem('gst_notifications');
  }

  public exportData(): string {
    return JSON.stringify({
      applications: this.applications,
      userProfile: this.userProfile,
      notifications: this.notifications,
      exportDate: new Date().toISOString()
    }, null, 2);
  }

  public importData(data: string): boolean {
    try {
      const parsed = JSON.parse(data);
      if (parsed.applications) this.applications = parsed.applications;
      if (parsed.userProfile) this.userProfile = parsed.userProfile;
      if (parsed.notifications) this.notifications = parsed.notifications;
      this.saveData();
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export default AppDataManager;

// React hook for using the data manager
export function useAppData() {
  const [dataManager] = useState(() => AppDataManager.getInstance());
  const [, forceUpdate] = useState({});

  const refresh = () => forceUpdate({});

  useEffect(() => {
    // Set up periodic refresh for demo purposes
    const interval = setInterval(() => {
      // Simulate some status updates
      const apps = dataManager.getApplications();
      let hasUpdates = false;

      apps.forEach(app => {
        if (app.status === 'under-review' && Math.random() > 0.9) {
          dataManager.updateApplication(app.id!, { 
            status: 'approved',
            gstNumber: `GST-LR-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999999)).padStart(7, '0')}`,
            gstGeneratedDate: new Date().toISOString()
          });
          hasUpdates = true;
        }
      });

      if (hasUpdates) {
        refresh();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [dataManager]);

  return {
    dataManager,
    refresh,
    applications: dataManager.getApplications(),
    userProfile: dataManager.getUserProfile(),
    notifications: dataManager.getNotifications(),
    stats: dataManager.getApplicationStats(),
    unreadCount: dataManager.getUnreadNotificationCount()
  };
}