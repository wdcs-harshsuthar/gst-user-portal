// GST Number Generation and Email Utilities

export interface GSTNumberData {
  gstNumber: string;
  generatedDate: string;
  generatedBy: string;
  applicationType: string;
}

export interface EmailNotificationData {
  recipientEmail: string;
  recipientName: string;
  gstNumber: string;
  applicationReference: string;
  applicationType: string;
  approvalDate: string;
  adminName: string;
}

/**
 * Generates a unique GST number for Liberia
 * Format: GST-LR-YYYYMMDD-XXXXXX
 * Where:
 * - GST: Goods and Services Tax identifier
 * - LR: Liberia country code
 * - YYYYMMDD: Date of generation
 * - XXXXXX: 6-digit unique sequence number
 */
export const generateGSTNumber = (applicationType: string, adminName: string): GSTNumberData => {
  const now = new Date();
  const dateString = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  
  // Generate a 6-digit unique sequence (in real system, this would be from database)
  const sequence = Math.floor(100000 + Math.random() * 900000);
  
  // Add type prefix for different application types
  let typeCode = 'IN'; // Individual
  if (applicationType === 'business') {
    typeCode = 'BU'; // Business
  } else if (applicationType === 'sole proprietorship') {
    typeCode = 'SP'; // Sole Proprietorship
  }
  
  const gstNumber = `GST-LR-${typeCode}-${dateString}-${sequence}`;
  
  return {
    gstNumber,
    generatedDate: now.toISOString(),
    generatedBy: adminName,
    applicationType
  };
};

/**
 * Simulates sending an email notification with GST number
 * In a real system, this would integrate with an email service like SendGrid, AWS SES, etc.
 */
export const sendGSTApprovalEmail = async (emailData: EmailNotificationData): Promise<boolean> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real system, you would call your email service here
    console.log('📧 GST Approval Email Sent:', {
      to: emailData.recipientEmail,
      subject: `GST Registration Approved - ${emailData.gstNumber}`,
      gstNumber: emailData.gstNumber,
      applicationReference: emailData.applicationReference,
      approvalDate: emailData.approvalDate
    });
    
    // Simulate successful email send
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

/**
 * Generates the email content for GST approval notification
 */
export const generateGSTApprovalEmailContent = (emailData: EmailNotificationData): string => {
  const formattedDate = new Date(emailData.approvalDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return `
=================================================================
                    LIBERIA REVENUE AUTHORITY
              GST Registration Approval Notification
=================================================================

Dear ${emailData.recipientName},

Congratulations! Your GST registration application has been approved.

-----------------------------------------------------------------
APPLICATION DETAILS
-----------------------------------------------------------------
Application Reference: ${emailData.applicationReference}
Application Type: ${emailData.applicationType}
Approval Date: ${formattedDate}
Approved By: ${emailData.adminName}

-----------------------------------------------------------------
YOUR GST REGISTRATION NUMBER
-----------------------------------------------------------------
GST Number: ${emailData.gstNumber}

Please keep this GST number safe as you will need it for:
• Filing GST returns
• Issuing GST invoices
• Claiming input tax credits
• All GST-related transactions

-----------------------------------------------------------------
NEXT STEPS
-----------------------------------------------------------------
1. Update your business records with your new GST number
2. Begin collecting GST on applicable transactions
3. File your first GST return by the due date
4. Contact us if you need assistance with GST compliance

-----------------------------------------------------------------
IMPORTANT REMINDERS
-----------------------------------------------------------------
• Your GST registration is effective immediately
• Keep all GST-related records for at least 5 years
• File GST returns on time to avoid penalties
• Contact LRA for any questions about GST compliance

-----------------------------------------------------------------
CONTACT INFORMATION
-----------------------------------------------------------------
Liberia Revenue Authority
GST Help Desk: +231-XXX-XXXX
Email: gst-support@lra.gov.lr
Website: www.lra.gov.lr

Office Hours: Monday - Friday, 8:00 AM - 5:00 PM

-----------------------------------------------------------------
Thank you for registering with the Liberia Revenue Authority.

This is an automated notification. Please do not reply to this email.

=================================================================
    © 2025 Republic of Liberia - Liberia Revenue Authority
=================================================================
  `;
};

/**
 * Validates GST number format
 */
export const validateGSTNumber = (gstNumber: string): boolean => {
  const gstPattern = /^GST-LR-(IN|BU|SP)-\d{8}-\d{6}$/;
  return gstPattern.test(gstNumber);
};

/**
 * Formats GST number for display
 */
export const formatGSTNumberForDisplay = (gstNumber: string): string => {
  if (!gstNumber) return 'Not Generated';
  
  // Add spaces for better readability
  return gstNumber.replace(/-/g, ' - ');
};

/**
 * Gets the application type from GST number
 */
export const getApplicationTypeFromGST = (gstNumber: string): string => {
  if (gstNumber.includes('-IN-')) return 'Individual';
  if (gstNumber.includes('-BU-')) return 'Business';
  if (gstNumber.includes('-SP-')) return 'Sole Proprietorship';
  return 'Unknown';
};