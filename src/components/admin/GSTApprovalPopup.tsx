import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { 
  CheckCircle2, 
  Copy, 
  Mail, 
  Download, 
  Loader2,
  AlertCircle,
  User,
  Building2,
  Calendar,
  Hash
} from 'lucide-react';
import { 
  generateGSTNumber, 
  sendGSTApprovalEmail, 
  generateGSTApprovalEmailContent,
  formatGSTNumberForDisplay,
  GSTNumberData,
  EmailNotificationData 
} from '../shared/gstUtils';
import { RegistrationData } from '../../UserApp';

interface GSTApprovalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  application: RegistrationData | null;
  adminUser: any;
  onApprovalComplete: (gstData: GSTNumberData, emailSent: boolean) => void;
}

export default function GSTApprovalPopup({ 
  isOpen, 
  onClose, 
  application, 
  adminUser,
  onApprovalComplete 
}: GSTApprovalPopupProps) {
  const [step, setStep] = useState<'generating' | 'generated' | 'sending-email' | 'complete' | 'error'>('generating');
  const [gstData, setGstData] = useState<GSTNumberData | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen && application) {
      setStep('generating');
      setGstData(null);
      setEmailSent(false);
      setError('');
      setCopied(false);
      
      // Start the approval process
      handleApprovalProcess();
    }
  }, [isOpen, application]);

  const handleApprovalProcess = async () => {
    if (!application || !adminUser) return;

    try {
      // Step 1: Generate GST Number
      setStep('generating');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate processing time
      
      const applicationType = application.applicantType === 'individual' 
        ? 'individual' 
        : application.businessType || 'business';
      
      const generatedGST = generateGSTNumber(applicationType, adminUser.name);
      setGstData(generatedGST);
      setStep('generated');
      
      // Step 2: Send Email Notification with timeout handling
      const emailTimeout = setTimeout(() => {
        setError('GST number generated successfully, but email notification timed out. Please manually notify the applicant.');
        setStep('complete');
        onApprovalComplete(generatedGST, false);
      }, 10000); // 10 second timeout
      
      setTimeout(async () => {
        try {
          setStep('sending-email');
          
          const recipientEmail = application.individualData?.email || application.businessData?.businessEmail || '';
          const recipientName = application.individualData?.firstName && application.individualData?.lastName
            ? `${application.individualData.firstName} ${application.individualData.lastName}`
            : application.businessData?.businessName || 'Valued Customer';
          
          const emailData: EmailNotificationData = {
            recipientEmail,
            recipientName,
            gstNumber: generatedGST.gstNumber,
            applicationReference: application.applicationReference || '',
            applicationType: applicationType,
            approvalDate: new Date().toISOString(),
            adminName: adminUser.name
          };
          
          const emailSuccess = await sendGSTApprovalEmail(emailData);
          clearTimeout(emailTimeout); // Clear the timeout since we got a response
          
          setEmailSent(emailSuccess);
          
          if (emailSuccess) {
            setStep('complete');
          } else {
            setError('GST number generated successfully, but email notification failed. Please manually notify the applicant.');
            setStep('complete');
          }
          
          // Notify parent component
          onApprovalComplete(generatedGST, emailSuccess);
        } catch (emailErr) {
          clearTimeout(emailTimeout);
          setError('GST number generated successfully, but email notification failed. Please manually notify the applicant.');
          setStep('complete');
          onApprovalComplete(generatedGST, false);
        }
      }, 1500);
      
    } catch (err) {
      setError('Failed to generate GST number. Please try again.');
      setStep('error');
    }
  };

  const copyGSTNumber = () => {
    if (gstData?.gstNumber) {
      navigator.clipboard.writeText(gstData.gstNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadApprovalLetter = () => {
    if (!application || !gstData) return;
    
    const recipientName = application.individualData?.firstName && application.individualData?.lastName
      ? `${application.individualData.firstName} ${application.individualData.lastName}`
      : application.businessData?.businessName || 'Valued Customer';
    
    const emailData: EmailNotificationData = {
      recipientEmail: application.individualData?.email || application.businessData?.businessEmail || '',
      recipientName,
      gstNumber: gstData.gstNumber,
      applicationReference: application.applicationReference || '',
      applicationType: application.applicantType || 'individual',
      approvalDate: new Date().toISOString(),
      adminName: adminUser.name
    };
    
    const approvalLetter = generateGSTApprovalEmailContent(emailData);
    
    const dataBlob = new Blob([approvalLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `GST_Approval_Letter_${gstData.gstNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getApplicantName = () => {
    if (!application) return 'Unknown Applicant';
    
    if (application.individualData?.firstName && application.individualData?.lastName) {
      return `${application.individualData.firstName} ${application.individualData.lastName}`;
    }
    
    return application.businessData?.businessName || 'Unknown Applicant';
  };

  const getApplicantEmail = () => {
    return application?.individualData?.email || application?.businessData?.businessEmail || 'No email provided';
  };

  const renderStepContent = () => {
    switch (step) {
      case 'generating':
        return (
          <div className="text-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg mb-2">Generating GST Number</h3>
            <p className="text-gray-600">Creating unique GST registration number...</p>
          </div>
        );
      
      case 'generated':
        return (
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg mb-2">GST Number Generated!</h3>
            <p className="text-gray-600">Preparing email notification...</p>
          </div>
        );
      
      case 'sending-email':
        return (
          <div className="text-center py-8">
            <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
            <h3 className="text-lg mb-2">Sending Email Notification</h3>
            <p className="text-gray-600">Notifying applicant of approval...</p>
          </div>
        );
      
      case 'complete':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl text-green-800 mb-2">Application Approved Successfully!</h3>
              <p className="text-gray-600">GST number generated and applicant notified</p>
            </div>

            {/* Application Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Applicant:</span>
                <div className="flex items-center gap-2">
                  {application?.applicantType === 'individual' ? 
                    <User className="h-4 w-4 text-gray-500" /> : 
                    <Building2 className="h-4 w-4 text-gray-500" />
                  }
                  <span className="font-medium">{getApplicantName()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email:</span>
                <span className="font-medium">{getApplicantEmail()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Application Ref:</span>
                <span className="font-mono text-sm">{application?.applicationReference}</span>
              </div>
            </div>

            {/* GST Number Display */}
            {gstData && (
              <div className="border-2 border-green-200 bg-green-50 rounded-lg p-6">
                <div className="text-center mb-4">
                  <Hash className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-green-800">New GST Registration Number</h4>
                </div>
                
                <div className="bg-white border border-green-300 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-lg text-green-800">{formatGSTNumberForDisplay(gstData.gstNumber)}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyGSTNumber}
                      className="text-green-700 border-green-300 hover:bg-green-100"
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Generated:</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3 text-gray-500" />
                      <span className="font-medium">
                        {new Date(gstData.generatedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Approved By:</span>
                    <div className="font-medium mt-1">{gstData.generatedBy}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Status */}
            <Alert className={emailSent ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}>
              <Mail className="h-4 w-4" />
              <AlertDescription className={emailSent ? 'text-green-700' : 'text-orange-700'}>
                {emailSent 
                  ? 'Email notification sent successfully to the applicant.'
                  : 'Email notification could not be sent. Please manually notify the applicant.'
                }
              </AlertDescription>
            </Alert>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                onClick={downloadApprovalLetter}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Approval Letter
              </Button>
              <Button onClick={onClose} className="flex-1 bg-green-600 hover:bg-green-700">
                Complete Approval
              </Button>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg text-red-800 mb-2">Approval Failed</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={handleApprovalProcess} variant="outline">
                Try Again
              </Button>
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            GST Registration Approval
          </DialogTitle>
          <DialogDescription>
            Processing GST registration approval for {getApplicantName()}
          </DialogDescription>
        </DialogHeader>
        
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
}