import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Progress } from "./components/ui/progress";
import { Badge } from "./components/ui/badge";
import { Label } from "./components/ui/label";
import { useTheme } from "./hooks/useTheme";
import { Stepper, StepperStep } from "./components/ui/stepper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  CheckCircle2,
  FileText,
  Building2,
  User,
  Home,
  Download,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  DollarSign,
  Eye,
  Upload,
  Bell,
  HelpCircle,
  Shield,
  Clock,
  MapPin,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import EntryPointSelection from "./components/EntryPointSelection";
import IndividualRegistration from "./components/IndividualRegistration";
import BusinessRegistration from "./components/BusinessRegistration";
import SoleProprietorship from "./components/SoleProprietorship";
import OwnersShareholders from "./components/OwnersShareholders";
import ResidentialPropertyDeclaration from "./components/ResidentialPropertyDeclaration";
import ApplicationReview from "./components/ApplicationReview";
import Fees from "./components/Fees";
import Sidebar from "./components/Sidebar";
import { DUMMY_COMPLETED_APPLICATIONS } from "./components/shared/dummyData";

export type RegistrationData = {
  entryPoint?: "individual" | "business";
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
  status?:
    | "submitted"
    | "pending-receipt"
    | "under-review"
    | "processing"
    | "approved"
    | "rejected";
  uploadedDocuments?: {
    id: string;
    file: File;
    documentType: string;
    uploadDate: string;
    verified?: boolean;
    verifiedBy?: string;
    verificationDate?: string;
    verificationNotes?: string;
  }[];
};

export type Step =
  | "entry"
  | "individual"
  | "business"
  | "sole-proprietorship"
  | "owners-shareholders"
  | "property"
  | "review"
  | "complete"
  | "help";

interface UserAppProps {
  onBackToSelector: () => void;
  initialFormType?: "IN-01" | "RF-01" | null;
  cleanMode?: boolean;
  dashboardMode?: boolean;
}

export default function UserApp({
  onBackToSelector,
  initialFormType,
  cleanMode,
  dashboardMode,
}: UserAppProps) {
  const { getInlineStyles } = useTheme();
  const [currentStep, setCurrentStep] = useState<Step>("entry");
  const [registrationData, setRegistrationData] =
    useState<RegistrationData>({});
  const [completedSteps, setCompletedSteps] = useState<
    Set<string>
  >(new Set());
  const [submittedApplications, setSubmittedApplications] =
    useState<RegistrationData[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] =
    useState<boolean>(false);

  // Handle automatic routing based on questionnaire result or dashboard mode
  useEffect(() => {
    if (initialFormType) {
      setIsFirstTimeUser(true);
      startNewApplicationWithForm(initialFormType);
    }
  }, [initialFormType]);

  const stepConfig = {
    entry: {
      title: "Get Started",
      icon: FileText,
      subtitle: "Choose your registration path",
      description:
        "Select whether you are registering as an individual or business entity",
    },
    individual: {
      title: "Individual Registration",
      icon: User,
      subtitle: "Personal information and details",
      description:
        "Provide your personal details and identification information",
    },
    business: {
      title: "Business Registration",
      icon: Building2,
      subtitle: "Company information and structure",
      description:
        "Enter your business details and organizational structure",
    },
    "sole-proprietorship": {
      title: "Sole Proprietorship",
      icon: User,
      subtitle: "Business owner details",
      description:
        "Complete sole proprietorship specific information",
    },
    "owners-shareholders": {
      title: "Owners & Shareholders",
      icon: Building2,
      subtitle: "Ownership structure information",
      description:
        "Detail the ownership and shareholder structure",
    },
    property: {
      title: "Property Declaration",
      icon: Home,
      subtitle: "Residential property information",
      description:
        "Declare your residential and commercial properties",
    },
    review: {
      title: "Review & Payment",
      icon: Eye,
      subtitle: "Verify details and complete payment",
      description: "Review all information and process payment",
    },
    complete: {
      title: "Complete",
      icon: CheckCircle2,
      subtitle: "Application submitted successfully",
      description: "Your application has been processed",
    },
    // dashboard removed
    fees: { title: "Fees & Payments", icon: DollarSign },
    applications: { title: "My Applications", icon: FileText },
    certificates: { title: "Certificates", icon: CheckCircle2 },
    receipts: { title: "Payment Receipts", icon: FileText },
    documents: { title: "Documents", icon: Download },
    notifications: { title: "Notifications", icon: Bell },
    help: { title: "Help & Support", icon: HelpCircle },
    settings: { title: "Account Settings", icon: Settings },
  };

  // Load submitted applications from localStorage on component mount
  useEffect(() => {
    const savedApplications = localStorage.getItem(
      "gst_applications",
    );
    if (savedApplications) {
      try {
        setSubmittedApplications(JSON.parse(savedApplications));
      } catch (error) {
        console.error(
          "Error loading saved applications:",
          error,
        );
        setSubmittedApplications(DUMMY_COMPLETED_APPLICATIONS);
      }
    } else {
      setSubmittedApplications(DUMMY_COMPLETED_APPLICATIONS);
    }
  }, []);

  // Save applications to localStorage whenever submittedApplications changes
  useEffect(() => {
    if (submittedApplications.length > 0) {
      localStorage.setItem(
        "gst_applications",
        JSON.stringify(submittedApplications),
      );
    } else {
      localStorage.removeItem("gst_applications");
    }
  }, [submittedApplications]);

  const getStepNumber = (step: Step): number => {
    const formSteps = [
      "entry",
      "individual",
      "business",
      "sole-proprietorship",
      "owners-shareholders",
      "property",
      "review",
    ];
    return formSteps.indexOf(step) + 1;
  };

  const getTotalSteps = (): number => {
    if (
      registrationData.entryPoint === "individual" &&
      registrationData.applicantType === "individual"
    ) {
      return 4;
    } else if (
      registrationData.entryPoint === "individual" &&
      registrationData.applicantType !== "individual"
    ) {
      if (
        registrationData.businessType === "sole proprietorship"
      ) {
        return 5;
      } else {
        return 5;
      }
    }
    return 5;
  };

  const getProgressPercentage = (): number => {
    const currentStepNumber = getStepNumber(currentStep);
    const totalSteps = getTotalSteps();
    return (currentStepNumber / totalSteps) * 100;
  };

  const getStepperSteps = (): StepperStep[] => {
    const baseSteps: StepperStep[] = [
      {
        id: "entry",
        title: "Get Started",
        description: "Choose registration path",
        icon: FileText,
      },
    ];

    if (registrationData.entryPoint === "individual") {
      baseSteps.push({
        id: "individual",
        title: "Personal Details",
        description: "Individual information",
        icon: User,
      });

      if (registrationData.applicantType !== "individual") {
        baseSteps.push({
          id: "business",
          title: "Business Details",
          description: "Company information",
          icon: Building2,
        });

        if (
          registrationData.businessType ===
          "sole proprietorship"
        ) {
          baseSteps.push({
            id: "sole-proprietorship",
            title: "Sole Proprietorship",
            description: "Business owner details",
            icon: User,
          });
        } else if (
          registrationData.businessType &&
          registrationData.businessType !==
            "sole proprietorship"
        ) {
          baseSteps.push({
            id: "owners-shareholders",
            title: "Ownership Structure",
            description: "Owners & shareholders",
            icon: Building2,
          });
        }
      }
    } else if (registrationData.entryPoint === "business") {
      baseSteps.push({
        id: "business",
        title: "Business Details",
        description: "Company information",
        icon: Building2,
      });

      if (
        registrationData.businessType === "sole proprietorship"
      ) {
        baseSteps.push({
          id: "sole-proprietorship",
          title: "Sole Proprietorship",
          description: "Business owner details",
          icon: User,
        });
      } else if (
        registrationData.businessType &&
        registrationData.businessType !== "sole proprietorship"
      ) {
        baseSteps.push({
          id: "owners-shareholders",
          title: "Ownership Structure",
          description: "Owners & shareholders",
          icon: Building2,
        });
      }
    }

    baseSteps.push(
      {
        id: "property",
        title: "Property Declaration",
        description: "Residential properties",
        icon: Home,
      },
      {
        id: "review",
        title: "Review & Payment",
        description: "Complete application",
        icon: Eye,
      },
    );

    return baseSteps;
  };

  const updateRegistrationData = (
    newData: Partial<RegistrationData>,
  ) => {
    setRegistrationData((prev) => ({ ...prev, ...newData }));
  };

  const markStepComplete = (step: string) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
  };

  const navigateToStep = (step: Step) => {
    setCurrentStep(step);
    setSidebarOpen(false);
  };

  const handleSectionChange = (section: string) => {
    if (section === "new-application") {
      startNewApplication();
    } else {
      navigateToStep(section as Step);
    }
  };

  const handleLogout = () => {
    // Clear any user session data if needed
    // localStorage.removeItem('gst_applications'); // Keep applications data
    onBackToSelector();
  };

  const startNewApplication = () => {
    setRegistrationData({});
    setCompletedSteps(new Set());
    navigateToStep("entry");
  };

  const startNewApplicationWithForm = (
    formType: "IN-01" | "RF-01",
  ) => {
    // Initialize registration data based on form type
    const initialData: RegistrationData = {};

    if (formType === "IN-01") {
      // Individual Registration Form - typically starts with individual path
      initialData.entryPoint = "individual";
      initialData.applicantType = "individual";
    } else {
      // Organization Registration Form - typically for businesses/organizations
      initialData.entryPoint = "business";
      // Will be determined based on the actual business structure
    }

    setRegistrationData(initialData);
    setCompletedSteps(new Set());

    // Navigate to the appropriate first step based on form type
    if (formType === "IN-01") {
      navigateToStep("individual");
    } else {
      navigateToStep("business");
    }
  };

  const handleDeleteApplication = (
    applicationReference: string,
  ) => {
    setSubmittedApplications((prev) =>
      prev.filter(
        (app) =>
          app.applicationReference !== applicationReference,
      ),
    );
  };

  const handleUploadReceipt = (
    applicationReference: string,
    receiptFile: File,
  ) => {
    setSubmittedApplications((prev) =>
      prev.map((app) => {
        if (app.applicationReference === applicationReference) {
          return {
            ...app,
            paymentData: {
              ...app.paymentData,
              bankReceiptFile: receiptFile,
              receiptUploadDate: new Date().toISOString(),
            },
            status: "under-review" as const,
          };
        }
        return app;
      }),
    );
  };

  const handleEntryPointComplete = (data: {
    entryPoint: "individual" | "business";
  }) => {
    updateRegistrationData(data);
    markStepComplete("entry");
    if (data.entryPoint === "individual") {
      navigateToStep("individual");
    } else {
      navigateToStep("business");
    }
  };

  const handleIndividualComplete = (data: any) => {
    const { uploadedDocuments, ...individualData } = data;
    updateRegistrationData({
      individualData: individualData,
      applicantType: data.applicantType,
      uploadedDocuments: uploadedDocuments || [],
    });
    markStepComplete("individual");

    if (data.applicantType === "individual") {
      navigateToStep("property");
    } else {
      navigateToStep("business");
    }
  };

  const handleBusinessComplete = (data: any) => {
    updateRegistrationData({
      businessData: data,
      businessType: data.businessType,
    });
    markStepComplete("business");

    if (data.businessType === "sole proprietorship") {
      navigateToStep("sole-proprietorship");
    } else {
      navigateToStep("owners-shareholders");
    }
  };

  const handleSoleProprietorshipComplete = (data: any) => {
    updateRegistrationData({ soleProprietorshipData: data });
    markStepComplete("sole-proprietorship");
    navigateToStep("property");
  };

  const handleOwnersShareholdersComplete = (data: any) => {
    updateRegistrationData({ ownersShareholdersData: data });
    markStepComplete("owners-shareholders");
    navigateToStep("property");
  };

  const handlePropertyComplete = (data: any) => {
    updateRegistrationData({ propertyData: data });
    markStepComplete("property");
    navigateToStep("review");
  };

  const generateApplicationReference = (): string => {
    const now = new Date();
    const year = now.getFullYear();

    // Get current applications count for sequential numbering
    const existingAppsCount = submittedApplications.length;
    const sequentialNumber = (existingAppsCount + 1)
      .toString()
      .padStart(6, "0");

    // Format: LRA/GST/YYYY/XXXXXX
    return `LRA/GST/${year}/${sequentialNumber}`;
  };

  const handleReviewComplete = (paymentData: any) => {
    const submissionDate = new Date().toISOString();
    const applicationReference = generateApplicationReference();

    let status: RegistrationData["status"] = "submitted";
    if (paymentData.paymentMethod === "offline") {
      status = paymentData.bankReceiptFile
        ? "under-review"
        : "pending-receipt";
    }

    // Add any documents uploaded during the registration process
    const uploadedDocuments =
      registrationData.uploadedDocuments || [];

    const completeApplication = {
      ...registrationData,
      paymentData,
      submissionDate,
      applicationReference,
      status,
      uploadedDocuments,
    };

    updateRegistrationData(completeApplication);
    markStepComplete("review");
    navigateToStep("complete");
  };

  const handleEditFromReview = (step: string) => {
    navigateToStep(step as Step);
  };

  // Function to navigate to the previous form step
  const getPreviousStep = (): Step | null => {
    // The review step is always preceded by the property step
    return "property";
  };

  const handleBackFromReview = () => {
    const previousStep = getPreviousStep();
    if (previousStep) {
      navigateToStep(previousStep);
    }
  };

  // Function to determine the previous step for Property Declaration
  const getPreviousStepFromProperty = (): Step | null => {
    // Determine which step preceded the property step based on registration flow
    if (
      registrationData.entryPoint === "individual" &&
      registrationData.applicantType === "individual"
    ) {
      return "individual";
    } else if (
      registrationData.businessType === "sole proprietorship"
    ) {
      return "sole-proprietorship";
    } else if (
      registrationData.ownersShareholdersData ||
      (registrationData.businessType &&
        registrationData.businessType !== "sole proprietorship")
    ) {
      return "owners-shareholders";
    } else if (
      registrationData.businessData ||
      registrationData.entryPoint === "business"
    ) {
      return "business";
    } else if (registrationData.individualData) {
      return "individual";
    }
    return "entry"; // fallback
  };

  const handleBackFromProperty = () => {
    const previousStep = getPreviousStepFromProperty();
    if (previousStep) {
      navigateToStep(previousStep);
    }
  };

  const handleCompleteStepFinish = () => {
    const completeApplication = { ...registrationData };
    setSubmittedApplications((prev) => [
      ...prev,
      completeApplication,
    ]);

    if (cleanMode) {
      // In clean mode, show a message instead of redirecting to dashboard
      return;
    }

    // No dashboard redirection; stay on complete
  };

  const formatSubmissionDateTime = () => {
    if (!registrationData.submissionDate) return "";

    const date = new Date(registrationData.submissionDate);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };

    const formattedDate = date.toLocaleDateString(
      "en-US",
      dateOptions,
    );
    const formattedTime = date.toLocaleTimeString(
      "en-US",
      timeOptions,
    );

    return `${formattedDate} at ${formattedTime}`;
  };

  const handleDownloadApplication = () => {
    const applicationData = {
      applicationReference:
        registrationData.applicationReference,
      submissionDate: formatSubmissionDateTime(),
      applicationType: registrationData.entryPoint,
      applicantType: registrationData.applicantType,
      businessType: registrationData.businessType,
      individualData: registrationData.individualData,
      businessData: registrationData.businessData,
      soleProprietorshipData:
        registrationData.soleProprietorshipData,
      ownersShareholdersData:
        registrationData.ownersShareholdersData,
      propertyData: registrationData.propertyData,
      paymentData: registrationData.paymentData,
      status: registrationData.status,
    };

    const dataStr = JSON.stringify(applicationData, null, 2);
    const dataBlob = new Blob([dataStr], {
      type: "application/json",
    });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    const safeAppRef =
      registrationData.applicationReference?.replace(
        /\//g,
        "_",
      ) || "unknown";
    link.download = `GST_Application_${safeAppRef}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const isFormStep = [
    "entry",
    "individual",
    "business",
    "sole-proprietorship",
    "owners-shareholders",
    "property",
    "review",
    "complete",
  ].includes(currentStep);

  const renderCurrentStep = () => {
    // Add Back to Home button for non-form steps
    const renderBackToHomeButton = () => {
      if (!isFormStep) {
        return (
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={onBackToSelector}
              className="flex items-center gap-2 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </div>
        );
      }
      return null;
    };

    switch (currentStep) {
      case "applications" as any:
        return (
          <div className="space-y-6">
            {renderBackToHomeButton()}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl">
                  Application Management
                </h2>
                <p className="text-muted-foreground">
                  Track and manage all your GST registration
                  applications
                </p>
              </div>
              <Button
                onClick={startNewApplication}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="mr-2 h-4 w-4" />
                New Application
              </Button>
            </div>
            {/* Dashboard removed */}
          </div>
        );
      case "certificates" as any:
        return (
          <div className="space-y-6">
            {renderBackToHomeButton()}
            <div>
              <h2 className="text-2xl">GST Certificates</h2>
              <p className="text-muted-foreground">
                Download and manage your GST certificates
              </p>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl mb-4">
                  Certificate Management
                </h3>
                <p className="text-muted-foreground mb-6">
                  Once your applications are approved, you can
                  download your official GST certificates here.
                </p>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  View Available Certificates
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case "receipts" as any:
        return (
          <div className="space-y-6">
            {renderBackToHomeButton()}
            <div>
              <h2 className="text-2xl">Payment Receipts</h2>
              <p className="text-muted-foreground">
                View and download receipts for all your
                transactions
              </p>
            </div>
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl mb-4">
                  Transaction History
                </h3>
                <p className="text-muted-foreground mb-6">
                  Access all your payment receipts and
                  transaction records for GST registration fees.
                </p>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt History
                </Button>
              </CardContent>
            </Card>
          </div>
        );
      case "documents" as any:
        return (
          <div className="space-y-6">
            {renderBackToHomeButton()}
            <div>
              <h2 className="text-2xl">Forms & Guidelines</h2>
              <p className="text-muted-foreground">
                Access official forms, guidelines, and
                documentation
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3>Registration Forms</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Download blank forms for GST registration
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Forms
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h3>Guidelines & Manuals</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Step-by-step guides and official
                    documentation
                  </p>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    View Guidelines
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "notifications" as any:
        return (
          <div className="space-y-6">
            {renderBackToHomeButton()}
            <div>
              <h2 className="text-2xl">System Notifications</h2>
              <p className="text-muted-foreground">
                Stay updated with your application status and
                system updates
              </p>
            </div>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <h4>Application Update</h4>
                      <p className="text-muted-foreground text-sm">
                        Your individual registration application
                        is under review by our team.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <h4>Payment Confirmed</h4>
                      <p className="text-muted-foreground text-sm">
                        Your registration fee payment has been
                        successfully processed.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        1 day ago
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <h4>Reminder</h4>
                      <p className="text-muted-foreground text-sm">
                        Don't forget to complete your property
                        declaration form.
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        3 days ago
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "help":
        return (
          <div className="space-y-6">
            {renderBackToHomeButton()}
            <div>
              <h2 className="text-2xl">Help & Support</h2>
              <p className="text-muted-foreground">
                Get assistance with your GST registration
                process
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h3>Contact Support</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label>Phone Support</Label>
                      <p className="text-muted-foreground">
                        +231-770-000-000
                      </p>
                    </div>
                    <div>
                      <Label>Email Support</Label>
                      <p className="text-muted-foreground">
                        gst-help@lra.gov.lr
                      </p>
                    </div>
                    <div>
                      <Label>Office Hours</Label>
                      <p className="text-muted-foreground">
                        Monday - Friday, 8:00 AM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h3>Frequently Asked Questions</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Find answers to common questions about GST
                    registration
                  </p>
                  <Button variant="outline" className="w-full">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    View FAQ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case "settings" as any:
        return (
          <div className="space-y-6">
            {renderBackToHomeButton()}
            <div>
              <h2 className="text-2xl">Account Settings</h2>
              <p className="text-muted-foreground">
                Manage your profile information and preferences
              </p>
            </div>
            <Card>
              <CardHeader>
                <h3>Profile Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <p className="text-muted-foreground">
                      John Moses Johnson
                    </p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <p className="text-muted-foreground">
                      john.johnson@email.com
                    </p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="text-muted-foreground">
                      +231-777-123456
                    </p>
                  </div>
                  <div>
                    <Label>Account Type</Label>
                    <p className="text-muted-foreground">
                      Individual Taxpayer
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "complete":
        return (
          <div className="text-center space-y-6 p-8">
            <div className="mb-8">
              <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl mb-4">
                Application Submitted Successfully!
              </h2>
              <p className="text-lg text-muted-foreground mb-2">
                Your GST registration application has been
                received and is being processed.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <strong>Application Reference:</strong>
                    <Badge
                      variant="outline"
                      className="text-sm px-3 py-1"
                    >
                      {registrationData.applicationReference}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Submitted on {formatSubmissionDateTime()}
                  </p>
                </div>
              </div>
            </div>

            {cleanMode ? (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Your application has been successfully
                  submitted. You will receive an email
                  confirmation shortly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownloadApplication}
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Application Copy
                  </Button>
                  <Button
                    onClick={onBackToSelector}
                    variant="secondary"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Thank you for using the GST Registration
                  Portal.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={handleDownloadApplication}
                    variant="outline"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Copy
                  </Button>
                  {/* Dashboard removed */}
                  <Button
                    onClick={onBackToSelector}
                    variant="secondary"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  You can track your application status in your
                  dashboard.
                </p>
              </div>
            )}
          </div>
        );
      case "entry":
        return (
          <EntryPointSelection
            onComplete={handleEntryPointComplete}
            onBackToHome={onBackToSelector}
          />
        );
      case "individual":
        return (
          <IndividualRegistration
            onComplete={handleIndividualComplete}
            initialData={registrationData.individualData}
            onBack={onBackToSelector}
          />
        );
      case "business":
        return (
          <BusinessRegistration
            onComplete={handleBusinessComplete}
            initialData={registrationData.businessData}
            onBack={onBackToSelector}
          />
        );
      case "sole-proprietorship":
        return (
          <SoleProprietorship
            onComplete={handleSoleProprietorshipComplete}
            initialData={registrationData.soleProprietorshipData}
            onBack={onBackToSelector}
          />
        );
      case "owners-shareholders":
        return (
          <OwnersShareholders
            onComplete={handleOwnersShareholdersComplete}
            initialData={registrationData.ownersShareholdersData}
            onBack={onBackToSelector}
          />
        );
      case "property":
        return (
          <ResidentialPropertyDeclaration
            onComplete={handlePropertyComplete}
            onBack={handleBackFromProperty}
            initialData={registrationData.propertyData}
          />
        );
      case "review":
        return (
          <ApplicationReview
            registrationData={registrationData}
            onComplete={handleReviewComplete}
            onBack={handleBackFromReview}
            onEdit={handleEditFromReview}
          />
        );
      default:
        return <div>Unknown step</div>;
    }
  };

  // Clean mode - simplified layout for registration forms
  if (cleanMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="w-full px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: getInlineStyles().primary.backgroundColor }}>
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  GST Registration Portal
                </h1>
                <p className="text-sm text-gray-600">
                  Liberia Revenue Authority
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        {isFormStep && currentStep !== "complete" && (
          <div className="bg-white border-b border-gray-200">
            <div className="w-full px-6 py-6">
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600">Progress:</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-2 transition-[width] duration-300 ease-out"
                        style={{ 
                          width: `${getProgressPercentage()}%`,
                          ...getInlineStyles().gradient
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{Math.round(getProgressPercentage())}%</span>
                </div>

                {/* Stepper */}
                <div className="w-full mt-6">
                  <div className="flex items-center justify-between w-full">
                    {/* Step 1 - Get Started */}
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                        style={{ backgroundColor: getInlineStyles().primary.backgroundColor }}
                      >
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold" style={{ color: getInlineStyles().textPrimary.color }}>Get Started</p>
                      <p className="text-xs text-gray-500 mt-1">Choose registration path</p>
                    </div>

                    {/* Connector */}
                    <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>

                    {/* Step 2 - Personal Details */}
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                        style={{ backgroundColor: getInlineStyles().primary.backgroundColor }}
                      >
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-sm font-semibold" style={{ color: getInlineStyles().textPrimary.color }}>Personal Details</p>
                      <p className="text-xs text-gray-500 mt-1">Individual information</p>
                    </div>

                    {/* Connector */}
                    <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>

                    {/* Step 3 - Property Declaration */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                        <Home className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-sm font-semibold text-gray-500">Property Declaration</p>
                      <p className="text-xs text-gray-500 mt-1">Residential properties</p>
                    </div>

                    {/* Connector */}
                    <div className="flex-1 h-0.5 bg-gray-300 mx-4"></div>

                    {/* Step 4 - Review & Payment */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mb-3">
                        <Eye className="w-6 h-6 text-gray-500" />
                      </div>
                      <p className="text-sm font-semibold text-gray-500">Review & Payment</p>
                      <p className="text-xs text-gray-500 mt-1">Complete application</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="w-full px-6 py-8">
          {renderCurrentStep()}
        </div>
      </div>
    );
  }

  // Normal mode removed; always render clean registration content
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
}