import React, { useState, useEffect, useCallback, useMemo, Suspense, lazy, startTransition } from "react";
import {
  Card,
  CardHeader,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Label } from "../components/ui/label";
import { Stepper, StepperStep } from "../components/ui/stepper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  CheckCircle2,
  FileText,
  Building2,
  User,
  Home,
  Download,
  LayoutDashboard,
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
import { PageLoadingSpinner } from "../components/shared/LoadingSpinner";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";
import Sidebar from "../components/Sidebar";
import { DUMMY_COMPLETED_APPLICATIONS } from "../components/shared/dummyData";

// Lazy load components for better performance
const EntryPointSelection = lazy(() => import("../components/EntryPointSelection"));
const IndividualRegistration = lazy(() => import("../components/IndividualRegistration"));
const BusinessRegistration = lazy(() => import("../components/BusinessRegistration"));
const SoleProprietorship = lazy(() => import("../components/SoleProprietorship"));
// Removed OwnersShareholders component - OS01 form step no longer used
const ResidentialPropertyDeclaration = lazy(() => import("../components/ResidentialPropertyDeclaration"));
const ApplicationReview = lazy(() => import("../components/ApplicationReview"));
const UserDashboard = lazy(() => import("../components/UserDashboard"));
const Fees = lazy(() => import("../components/Fees"));
const BranchRegistration = lazy(() => import("../components/BranchRegistration"));

export type RegistrationData = {
  entryPoint?: "individual" | "business";
  applicantType?: string;
  businessType?: string;
  existingTin?: string;
  hasBranches?: boolean;
  individualData?: any;
  businessData?: any;
  soleProprietorshipData?: any;
  // Removed ownersShareholdersData - OS01 form no longer used
  branchData?: any;
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
  | "branch"
  | "property"
  | "review"
  | "complete"
  | "dashboard"
  | "fees"
  | "applications"
  | "certificates"
  | "receipts"
  | "documents"
  | "notifications"
  | "help"
  | "settings";

interface UserAppProps {
  onBackToSelector: () => void;
  initialFormType?: "IN-01" | "RF-01" | null;
  initialRoute?: 'sole-proprietorship' | 'partnership-corporation' | 'property-only' | null;
  questionnaireResult?: any;
  cleanMode?: boolean;
  dashboardMode?: boolean;
}

export default function UserApp({
  onBackToSelector,
  initialFormType,
  initialRoute,
  questionnaireResult,
  cleanMode,
  dashboardMode,
}: UserAppProps) {
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
    if (dashboardMode) {
      setCurrentStep("dashboard");
    } else if (initialRoute) {
      setIsFirstTimeUser(true);
      startNewApplicationWithRoute(initialRoute, questionnaireResult);
    } else if (initialFormType) {
      setIsFirstTimeUser(true);
      startNewApplicationWithForm(initialFormType);
    }
  }, [initialFormType, initialRoute, questionnaireResult, dashboardMode]);

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
    // Removed owners-shareholders step - OS01 form no longer used
    branch: {
      title: "Branch Registration",
      icon: Building2,
      subtitle: "Additional branch locations",
      description:
        "Register additional branches for your business or organization",
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
    dashboard: { title: "Dashboard", icon: LayoutDashboard },
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
    // Determine the actual step sequence based on the current registration path
    let stepSequence: string[] = [];

    if (registrationData.applicantType === "property-only") {
      // Property-only route: property → review
      stepSequence = ["property", "review"];
    } else if (
      registrationData.entryPoint === "individual" &&
      registrationData.applicantType === "individual"
    ) {
      // Individual route: entry → individual → property → review
      stepSequence = ["entry", "individual", "property", "review"];
    } else if (
      registrationData.entryPoint === "sole-proprietorship" &&
      registrationData.businessType === "sole proprietorship"
    ) {
      // Sole proprietorship route: entry → sole-proprietorship → [branch] → property → review
      stepSequence = ["entry", "sole-proprietorship"];
      if (registrationData.branchData || registrationData.hasBranches) {
        stepSequence.push("branch");
      }
      stepSequence.push("property", "review");
    } else if (
      registrationData.entryPoint === "individual" &&
      registrationData.applicantType !== "individual"
    ) {
      // Other individual business routes: entry → individual → business → [branch] → property → review
      stepSequence = ["entry", "individual", "business"];
      if (registrationData.branchData || registrationData.hasBranches) {
        stepSequence.push("branch");
      }
      stepSequence.push("property", "review");
    } else if (registrationData.entryPoint === "business") {
      // Business routes: entry → business → [branch] → property → review
      stepSequence = ["entry", "business"];
      if (registrationData.branchData || registrationData.hasBranches) {
        stepSequence.push("branch");
      }
      stepSequence.push("property", "review");
    } else {
      // Default fallback
      stepSequence = ["entry", "individual", "business", "sole-proprietorship", "property", "review"];
    }

    const stepIndex = stepSequence.indexOf(step);
    return stepIndex >= 0 ? stepIndex + 1 : 1;
  };

  const getTotalSteps = (): number => {
    let totalSteps = 0;
    
    if (registrationData.applicantType === "property-only") {
      // Property-only route: entry + property + review = 3 steps (but entry is skipped)
      totalSteps = 2;
    } else if (
      registrationData.entryPoint === "individual" &&
      registrationData.applicantType === "individual"
    ) {
      // Individual route: entry + individual + property + review = 4 steps
      totalSteps = 4;
    } else if (
      registrationData.entryPoint === "sole-proprietorship" &&
      registrationData.businessType === "sole proprietorship"
    ) {
      // Sole proprietorship route: entry + sole-proprietorship + property + review = 4 steps
      totalSteps = 4;
    } else if (
      registrationData.entryPoint === "individual" &&
      registrationData.applicantType !== "individual"
    ) {
      // Other business routes: entry + individual + business + property + review = 5 steps
      totalSteps = 5;
    } else if (registrationData.entryPoint === "business") {
      // Business routes: entry + business + property + review = 4 steps
      totalSteps = 4;
    } else {
      totalSteps = 5;
    }
    
    // Add 1 if branches are needed
    if (registrationData.hasBranches || registrationData.branchData) {
      totalSteps += 1;
    }
    
    return totalSteps;
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
        // For sole proprietorship, skip business step and go directly to sole-proprietorship
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
        } else {
          // For other business types, include business step only
          baseSteps.push({
            id: "business",
            title: "Business Details",
            description: "Company information",
            icon: Building2,
          });
          // Removed owners-shareholders step - OS01 form no longer used
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
      }
      // Removed owners-shareholders step - OS01 form no longer used
    }

    // Add branch step for business flows (always available before property)
    if (
      registrationData.entryPoint === "business" ||
      registrationData.businessType === "sole proprietorship"
    ) {
      baseSteps.push({
        id: "branch",
        title: "Branch Registration",
        description: "Additional branches",
        icon: Building2,
      });
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
    startTransition(() => {
      setCurrentStep(step);
      setSidebarOpen(false);
    });
  };

  const handleSectionChange = (section: string) => {
    startTransition(() => {
      if (section === "new-application") {
        startNewApplication();
      } else {
        navigateToStep(section as Step);
      }
    });
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

  const startNewApplicationWithRoute = (
    route: 'sole-proprietorship' | 'partnership-corporation' | 'property-only',
    result?: any
  ) => {
    // Initialize registration data based on route from questionnaire
    const initialData: RegistrationData = {};

    // Extract branch information from questionnaire result
    if (result) {
      initialData.hasBranches = result.hasBranches || false;
    }

    switch (route) {
      case 'sole-proprietorship':
        // Route 1: Sole Proprietorship → SP01 → [BR01] → ResidentialPropertyDeclaration
        initialData.entryPoint = "sole-proprietorship";
        initialData.applicantType = "sole-proprietorship";
        initialData.businessType = "sole proprietorship";
        setRegistrationData(initialData);
        setCompletedSteps(new Set(["entry"]));
        navigateToStep("sole-proprietorship");
        break;
      
      case 'partnership-corporation':
        // Route 2: Partnership/Corporation → RF01 → [BR01] → ResidentialPropertyDeclaration
        initialData.entryPoint = "business";
        initialData.applicantType = "business";
        setRegistrationData(initialData);
        setCompletedSteps(new Set(["entry"]));
        navigateToStep("business");
        break;

      case 'property-only':
        // Route 3: Property Owner → Residential Property Declaration only
        initialData.entryPoint = "individual";
        initialData.applicantType = "property-only";
        setRegistrationData(initialData);
        setCompletedSteps(new Set(["entry"]));
        navigateToStep("property");
        break;
      
      default:
        // Fallback to entry point selection
        setRegistrationData({});
        setCompletedSteps(new Set());
        navigateToStep("entry");
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
    
    // Determine business type based on applicant type
    let businessType = "";
    if (data.applicantType === "sole-proprietorship") {
      businessType = "sole proprietorship";
    }
    
    updateRegistrationData({
      individualData: individualData,
      applicantType: data.applicantType,
      businessType: businessType,
      uploadedDocuments: uploadedDocuments || [],
    });
    markStepComplete("individual");

    if (data.applicantType === "individual") {
      navigateToStep("property");
    } else {
      // For other business types, go to business registration
      navigateToStep("business");
    }
  };

  const handleBusinessComplete = (data: any) => {
    const wantsBranches = Boolean(
      data?.hasBranches ||
      data?.wantsBranches ||
      data?.branchCount > 0
    );

    updateRegistrationData({
      businessData: data,
      businessType: data.businessType,
      hasBranches: wantsBranches,
    });
    markStepComplete("business");

    if (data.businessType === "sole proprietorship") {
      navigateToStep("sole-proprietorship");
    } else {
      // After business details, always go to branch step (user may add none)
      navigateToStep("branch");
    }
  };

  const handleSoleProprietorshipComplete = (data: any) => {
    const wantsBranches = Boolean(
      data?.hasBranches ||
      data?.wantsBranches ||
      data?.branchCount > 0
    );
    updateRegistrationData({
      soleProprietorshipData: data,
      hasBranches: wantsBranches || registrationData.hasBranches,
    });
    markStepComplete("sole-proprietorship");
    
    // After sole proprietorship details, go to branch step next
    navigateToStep("branch");
  };

  // Removed handleOwnersShareholdersComplete - OS01 form no longer used

  const handleBranchComplete = (data: any) => {
    updateRegistrationData({ branchData: data });
    markStepComplete("branch");
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
    // Check if branch step was completed (branch step comes before property)
    if (registrationData.branchData || completedSteps.has("branch")) {
      return "branch";
    }
    
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

  const handleBackFromIndividual = () => {
    // Individual form always goes back to entry point selection
    navigateToStep("entry");
  };

  const handleBackFromBusiness = () => {
    // Business form always goes back to entry point selection
    navigateToStep("entry");
  };

  const handleBackFromSoleProprietorship = () => {
    // Sole proprietorship goes back to entry point selection
    navigateToStep("entry");
  };

  // Removed handleBackFromOwnersShareholders - OS01 form no longer used

  const handleBackFromBranch = () => {
    // Branch form goes back to the previous business form
    if (registrationData.soleProprietorshipData) {
      navigateToStep("sole-proprietorship");
    } else if (registrationData.businessData) {
      navigateToStep("business");
    } else {
      navigateToStep("individual");
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

    setTimeout(() => {
      navigateToStep("dashboard");
    }, 2000);
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
      // Removed ownersShareholdersData - OS01 form no longer used
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
    "branch",
    "property",
    "review",
    "complete",
  ].includes(currentStep);

  const renderCurrentStep = () => {
    // Add Back to Home button for non-form steps
    const renderBackToHomeButton = () => {
      if (!isFormStep && currentStep !== "dashboard") {
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
      case "dashboard":
        return (
          <UserDashboard
            applications={submittedApplications}
            onStartNewApplication={startNewApplication}
            onDeleteApplication={handleDeleteApplication}
            onUploadReceipt={handleUploadReceipt}
            onBackToHome={onBackToSelector}
          />
        );
      case "fees":
        return (
          <div className="space-y-6">
            {renderBackToHomeButton()}
            <Fees />
          </div>
        );
      case "applications":
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
            <UserDashboard
              applications={submittedApplications}
              onStartNewApplication={startNewApplication}
              onDeleteApplication={handleDeleteApplication}
              onUploadReceipt={handleUploadReceipt}
            />
          </div>
        );
      case "certificates":
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
      case "receipts":
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
      case "documents":
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
      case "notifications":
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
      case "settings":
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
                <Button
                  onClick={handleDownloadApplication}
                  variant="outline"
                  className="mx-auto"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Application Copy
                </Button>
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
                  <Button
                    onClick={() => navigateToStep("dashboard")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Go to Dashboard
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
            onBack={handleBackFromIndividual}
            initialData={registrationData.individualData}
          />
        );
      case "business":
        return (
          <BusinessRegistration
            onComplete={handleBusinessComplete}
            onBack={handleBackFromBusiness}
            existingData={registrationData.businessData}
          />
        );
      case "sole-proprietorship":
        return (
          <SoleProprietorship
            onComplete={handleSoleProprietorshipComplete}
            onBack={handleBackFromSoleProprietorship}
            existingData={
              registrationData.soleProprietorshipData
            }
          />
        );
      // Removed owners-shareholders case - OS01 form no longer used
      case "branch":
        return (
          <BranchRegistration
            onComplete={handleBranchComplete}
            onBack={handleBackFromBranch}
            initialData={registrationData.branchData}
          />
        );
      case "property":
        return (
          <ResidentialPropertyDeclaration
            onComplete={handlePropertyComplete}
            onBack={handleBackFromProperty}
            existingData={registrationData.propertyData}
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

  // Clean mode - simplified layout for email verification flow
  if (cleanMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="w-full px-6 py-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
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

        {/* Main Content with left-side vertical stepper */}
        <div className="w-full px-6 py-8">
          {isFormStep && currentStep !== "complete" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Progress:</span>
                      <span className="font-medium">{Math.round(getProgressPercentage())}%</span>
                    </div>
                    <Progress value={getProgressPercentage()} className="h-2 mt-2" />
                  </div>
                  <Stepper
                    steps={getStepperSteps()}
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    onStepClick={(stepId) => {
                      if (completedSteps.has(stepId)) {
                        navigateToStep(stepId as Step);
                      }
                    }}
                    orientation="vertical"
                  />
                </div>
              </div>
              <div className="lg:col-span-9">
                <Card className="w-full">
                  <CardContent className="p-8">
                    <Suspense fallback={<PageLoadingSpinner />}>
                      {renderCurrentStep()}
                    </Suspense>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="w-full">
              <CardContent className="p-8">
                <Suspense fallback={<PageLoadingSpinner />}>
                  {renderCurrentStep()}
                </Suspense>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 mt-12">
          <div className="w-full px-6 py-6 text-center">
            <p className="text-sm text-gray-600">
              © 2024 Liberia Revenue Authority. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Normal mode - full dashboard layout
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* App-wide sidebar hidden during form steps */}
      {!isFormStep && (
        <div
          className={`${sidebarOpen ? "block" : "hidden"} lg:block fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto`}
        >
          <Sidebar
            currentSection={currentStep}
            onSectionChange={handleSectionChange}
            onLogout={handleLogout}
          />
        </div>
      )}

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 m-[0px]">
        {/* Hide app header/nav during registration forms */}
        {!isFormStep && (
          <div className="bg-sidebar text-sidebar-foreground py-6 shadow-lg">
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden text-sidebar-foreground/80 hover:bg-sidebar-accent"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                  >
                    {sidebarOpen ? (
                      <X className="h-5 w-5" />
                    ) : (
                      <Menu className="h-5 w-5" />
                    )}
                  </Button>
                  <div>
                    <h1 className="text-2xl mb-2">Republic of Liberia</h1>
                    <p className="text-sidebar-foreground/70">
                      Ministry of Finance and Development Planning (LRA)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Progress (only show for form steps) */}
        {/* Remove top horizontal stepper when left rail is present */}

        {/* Content Area */}
        <div className="w-full p-6">
          {isFormStep && currentStep !== "complete" ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-3">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-4">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Progress:</span>
                      <span className="font-medium">{Math.round(getProgressPercentage())}%</span>
                    </div>
                    <Progress value={getProgressPercentage()} className="h-2 mt-2" />
                  </div>
                  <Stepper
                    steps={getStepperSteps()}
                    currentStep={currentStep}
                    completedSteps={completedSteps}
                    onStepClick={(stepId) => {
                      if (completedSteps.has(stepId)) {
                        navigateToStep(stepId as Step);
                      }
                    }}
                    orientation="vertical"
                  />
                </div>
              </div>
              <div className="lg:col-span-9">
                <Suspense fallback={<PageLoadingSpinner />}>
                  {renderCurrentStep()}
                </Suspense>
              </div>
            </div>
          ) : (
            <Suspense fallback={<PageLoadingSpinner />}>
              {renderCurrentStep()}
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}