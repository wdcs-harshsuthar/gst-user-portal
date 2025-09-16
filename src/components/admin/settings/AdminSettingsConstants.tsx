export const DEFAULT_SETTINGS = {
  // Fee Settings
  individualFee: 200.00,
  businessFee: 200.00,
  soleProprietorshipFee: 200.00,
  processingFee: 2.50,
  latePenaltyRate: 0.1,
  
  // System Settings
  autoApprovalEnabled: false,
  maxProcessingDays: 14,
  reminderDays: 7,
  sessionTimeout: 30,
  
  // Email Settings
  emailNotifications: true,
  adminAlerts: true,
  userUpdates: true,
  smtpServer: 'smtp.lra.gov.lr',
  smtpPort: 587,
  
  // Security Settings
  passwordMinLength: 8,
  requireTwoFactor: false,
  maxLoginAttempts: 5,
  ipWhitelist: '',
  
  // Backup Settings
  autoBackup: true,
  backupFrequency: 'daily',
  retentionDays: 90,
  
  // System Messages
  maintenanceMessage: '',
  userNotice: '',
  systemStatus: 'operational'
};

export const BACKUP_FREQUENCY_OPTIONS = [
  { value: 'hourly', label: 'Every Hour' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

export const SYSTEM_STATUS_OPTIONS = [
  { value: 'operational', label: 'Operational', color: 'bg-green-100 text-green-800' },
  { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'degraded', label: 'Degraded Performance', color: 'bg-orange-100 text-orange-800' },
  { value: 'outage', label: 'Service Outage', color: 'bg-red-100 text-red-800' }
];