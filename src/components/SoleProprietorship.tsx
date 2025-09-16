import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Plus,
  Trash2,
  Sparkles,
  Camera,
} from "lucide-react";
import {
  BUILDING_TYPES,
  LIBERIAN_COUNTIES,
} from "./shared/constants";
import { DUMMY_SOLE_PROPRIETORSHIP_DATA } from "./shared/dummyData";
import PhotoUpload from "./shared/PhotoUpload";
import { UploadedDocument } from "./shared/DocumentUpload";

interface SoleProprietorshipProps {
  initialData?: any;
  onComplete: (data: any) => void;
  onBack: () => void;
}

export default function SoleProprietorship({
  initialData,
  onComplete,
  onBack,
}: SoleProprietorshipProps) {
  const [formData, setFormData] = useState({
    // Enterprise Name
    enterpriseName: "",

    // Enterprise Address
    county: "",
    administrativeDistrict: "",
    taxDistrict: "",
    cityVillageTown: "",
    majorLandmark: "",
    streetRoad: "",
    buildingUnit: "",
    poBox: "",

    // Applicant Photo
    applicantPhoto: [] as UploadedDocument[],

    // TIN Information
    existingTinNumber: "",
    tinType: "", // 'individual', 'business', 'none'
    previousGstNumber: "",

    // Owner (required if Part A is not completed)
    ownerTin: "",
    ownerName: "",
    ownerPhone: "",
    ownerEmail: "",

    // Contact Person (if different from owner)
    contactTin: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",

    // Business Details
    businessCommencementDate: "",
    numberOfEmployees: "",
    fiscalYearEndMonth: "",
    estimatedAnnualTurnover: "",
    paysRent: "",

    // Business Activities
    isicCode: "",
    businessActivityDescription: "",
    isMainActivity: false,

    // Bank Account
    declaresBankAccount: "",
    accountNumber: "",
    accountHolderName: "",
    bankName: "",
    branchName: "",

    // Certification
    certFirstName: "",
    certMiddleName: "",
    certLastName: "",
    certSignature: "",
    certDate: "",

    ...initialData,
  });

  const [errors, setErrors] = useState<Record<string, string>>(
    {},
  );

  const validateTinNumber = (tin: string) => {
    if (!tin) return true; // TIN is optional
    // Basic Liberian TIN validation - typically 9 digits
    const tinPattern = /^\d{9}$/;
    return tinPattern.test(tin.replace(/\D/g, ""));
  };

  const formatTinNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    // Format as XXX-XXX-XXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6)
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 9)}`;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.enterpriseName.trim())
      newErrors.enterpriseName = "Enterprise name is required";
    if (!formData.county.trim())
      newErrors.county = "County is required";
    if (!formData.cityVillageTown.trim())
      newErrors.cityVillageTown =
        "City/Village/Town is required";
    if (!formData.businessActivityDescription.trim())
      newErrors.businessActivityDescription =
        "Business activity description is required";
    if (!formData.certFirstName.trim())
      newErrors.certFirstName =
        "First name is required for certification";
    if (!formData.certLastName.trim())
      newErrors.certLastName =
        "Last name is required for certification";

    // TIN validation
    if (
      formData.existingTinNumber &&
      !validateTinNumber(formData.existingTinNumber)
    ) {
      newErrors.existingTinNumber =
        "Please enter a valid 9-digit TIN number";
    }
    if (
      formData.ownerTin &&
      !validateTinNumber(formData.ownerTin)
    ) {
      newErrors.ownerTin =
        "Please enter a valid 9-digit TIN number";
    }
    if (
      formData.contactTin &&
      !validateTinNumber(formData.contactTin)
    ) {
      newErrors.contactTin =
        "Please enter a valid 9-digit TIN number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const fillSampleData = () => {
    setFormData((prev) => ({
      ...prev,
      ...DUMMY_SOLE_PROPRIETORSHIP_DATA,
    }));
    setErrors({});
  };

  const FISCAL_YEAR_MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl">
              Sole Proprietorship Registration (Form SP01)
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Primary registration form for sole proprietorship
              businesses
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={fillSampleData}
          className="text-blue-600 border-blue-300 hover:bg-blue-50"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Fill Sample Data
        </Button>
      </div>

      {/* Enterprise Name */}
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Name</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="enterpriseName">
              Enterprise Name (as Reserved or Registered) *
            </Label>
            <Input
              id="enterpriseName"
              value={formData.enterpriseName}
              onChange={(e) =>
                updateFormData("enterpriseName", e.target.value)
              }
              className={
                errors.enterpriseName ? "border-red-500" : ""
              }
              placeholder="Enter enterprise name"
            />
            {errors.enterpriseName && (
              <p className="text-red-500 text-sm">
                {errors.enterpriseName}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enterprise Address */}
      <Card>
        <CardHeader>
          <CardTitle>Enterprise Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="county">County *</Label>
              <Select
                value={formData.county}
                onValueChange={(value) =>
                  updateFormData("county", value)
                }
              >
                <SelectTrigger
                  className={
                    errors.county ? "border-red-500" : ""
                  }
                >
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {LIBERIAN_COUNTIES.map((county) => (
                    <SelectItem key={county} value={county}>
                      {county}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.county && (
                <p className="text-red-500 text-sm">
                  {errors.county}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="administrativeDistrict">
                Administrative District
              </Label>
              <Input
                id="administrativeDistrict"
                value={formData.administrativeDistrict}
                onChange={(e) =>
                  updateFormData(
                    "administrativeDistrict",
                    e.target.value,
                  )
                }
                placeholder="Enter administrative district"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxDistrict">Tax District</Label>
              <Input
                id="taxDistrict"
                value={formData.taxDistrict}
                onChange={(e) =>
                  updateFormData("taxDistrict", e.target.value)
                }
                placeholder="Enter tax district"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cityVillageTown">
                City/Village/Town *
              </Label>
              <Input
                id="cityVillageTown"
                value={formData.cityVillageTown}
                onChange={(e) =>
                  updateFormData(
                    "cityVillageTown",
                    e.target.value,
                  )
                }
                className={
                  errors.cityVillageTown ? "border-red-500" : ""
                }
                placeholder="Enter city, village, or town"
              />
              {errors.cityVillageTown && (
                <p className="text-red-500 text-sm">
                  {errors.cityVillageTown}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="majorLandmark">
                Major Landmark
              </Label>
              <Input
                id="majorLandmark"
                value={formData.majorLandmark}
                onChange={(e) =>
                  updateFormData(
                    "majorLandmark",
                    e.target.value,
                  )
                }
                placeholder="Enter major landmark"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="streetRoad">Street/Road</Label>
              <Input
                id="streetRoad"
                value={formData.streetRoad}
                onChange={(e) =>
                  updateFormData("streetRoad", e.target.value)
                }
                placeholder="Enter street or road"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buildingUnit">
                Building/Unit
              </Label>
              <Input
                id="buildingUnit"
                value={formData.buildingUnit}
                onChange={(e) =>
                  updateFormData("buildingUnit", e.target.value)
                }
                placeholder="Enter building/unit"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="poBox">P.O. Box</Label>
              <Input
                id="poBox"
                value={formData.poBox}
                onChange={(e) =>
                  updateFormData("poBox", e.target.value)
                }
                placeholder="P.O. Box 1234"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TIN Information */}
      <Card>
        <CardHeader>
          <CardTitle>TIN Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tinType">
              Do you have an existing TIN number?
            </Label>
            <Select
              value={formData.tinType}
              onValueChange={(value) =>
                updateFormData("tinType", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">
                  Yes - Individual TIN
                </SelectItem>
                <SelectItem value="business">
                  Yes - Business TIN
                </SelectItem>
                {/* <SelectItem value="none">No - I need a new TIN</SelectItem> */}
              </SelectContent>
            </Select>
          </div>

          {(formData.tinType === "individual" ||
            formData.tinType === "business") && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="existingTinNumber">
                  Existing TIN Number
                </Label>
                <Input
                  id="existingTinNumber"
                  value={formData.existingTinNumber}
                  onChange={(e) =>
                    updateFormData(
                      "existingTinNumber",
                      formatTinNumber(e.target.value),
                    )
                  }
                  placeholder="XXX-XXX-XXX"
                  maxLength={11}
                  className={
                    errors.existingTinNumber
                      ? "border-red-500"
                      : ""
                  }
                />
                {errors.existingTinNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.existingTinNumber}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter your 9-digit TIN number
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applicant Photo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            Applicant Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PhotoUpload
            title="Upload Applicant Photo"
            description="Upload a clear, recent photograph of the business owner/applicant"
            accept="image/jpeg,image/png"
            maxSize={2}
            uploadedDocuments={formData.applicantPhoto}
            onUpload={(documents) =>
              updateFormData("applicantPhoto", documents)
            }
            isRequired={true}
          />
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">
              Photo Requirements:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>
                • Recent photograph (taken within the last 6
                months)
              </li>
              <li>
                • Clear, well-lit image showing face clearly
              </li>
              <li>
                • Professional or passport-style photo preferred
              </li>
              <li>• Maximum file size: 2MB</li>
              <li>• Accepted formats: JPEG, PNG</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Owner */}
      <Card>
        <CardHeader>
          <CardTitle>
            Owner (required if Part A is not completed)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerTin">TIN</Label>
              <Input
                id="ownerTin"
                value={formData.ownerTin}
                onChange={(e) =>
                  updateFormData(
                    "ownerTin",
                    formatTinNumber(e.target.value),
                  )
                }
                placeholder="XXX-XXX-XXX"
                maxLength={11}
                className={
                  errors.ownerTin ? "border-red-500" : ""
                }
              />
              {errors.ownerTin && (
                <p className="text-red-500 text-sm">
                  {errors.ownerTin}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                9-digit TIN number
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerName">Name</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) =>
                  updateFormData("ownerName", e.target.value)
                }
                placeholder="Enter owner name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ownerPhone">
                Telephone/Mobile Phone
              </Label>
              <Input
                id="ownerPhone"
                value={formData.ownerPhone}
                onChange={(e) =>
                  updateFormData("ownerPhone", e.target.value)
                }
                placeholder="+231-XXX-XXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Email</Label>
              <Input
                id="ownerEmail"
                type="email"
                value={formData.ownerEmail}
                onChange={(e) =>
                  updateFormData("ownerEmail", e.target.value)
                }
                placeholder="Enter email address"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Person */}
      <Card>
        <CardHeader>
          <CardTitle>
            Contact Person (if different from owner)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactTin">TIN</Label>
              <Input
                id="contactTin"
                value={formData.contactTin}
                onChange={(e) =>
                  updateFormData(
                    "contactTin",
                    formatTinNumber(e.target.value),
                  )
                }
                placeholder="XXX-XXX-XXX"
                maxLength={11}
                className={
                  errors.contactTin ? "border-red-500" : ""
                }
              />
              {errors.contactTin && (
                <p className="text-red-500 text-sm">
                  {errors.contactTin}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                9-digit TIN number (optional)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactName">Name</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) =>
                  updateFormData("contactName", e.target.value)
                }
                placeholder="Enter contact name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPhone">
                Telephone/Mobile Phone
              </Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) =>
                  updateFormData("contactPhone", e.target.value)
                }
                placeholder="+231-XXX-XXXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  updateFormData("contactEmail", e.target.value)
                }
                placeholder="Enter email address"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card>
        <CardHeader>
          <CardTitle>Business Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessCommencementDate">
                Business Commencement Date
              </Label>
              <Input
                id="businessCommencementDate"
                type="date"
                value={formData.businessCommencementDate}
                onChange={(e) =>
                  updateFormData(
                    "businessCommencementDate",
                    e.target.value,
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfEmployees">
                Number of Employees
              </Label>
              <Input
                id="numberOfEmployees"
                type="number"
                value={formData.numberOfEmployees}
                onChange={(e) =>
                  updateFormData(
                    "numberOfEmployees",
                    e.target.value,
                  )
                }
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fiscalYearEndMonth">
                Fiscal Year End Month
              </Label>
              <Select
                value={formData.fiscalYearEndMonth}
                onValueChange={(value) =>
                  updateFormData("fiscalYearEndMonth", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  {FISCAL_YEAR_MONTHS.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimatedAnnualTurnover">
                Estimated/Actual (prior year) Annual Turnover
                (in Liberian Dollars)
              </Label>
              <Input
                id="estimatedAnnualTurnover"
                type="number"
                value={formData.estimatedAnnualTurnover}
                onChange={(e) =>
                  updateFormData(
                    "estimatedAnnualTurnover",
                    e.target.value,
                  )
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paysRent">Do you pay rent?</Label>
            <Select
              value={formData.paysRent}
              onValueChange={(value) =>
                updateFormData("paysRent", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Yes or No" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Business Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Business Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="isicCode">
              ISIC Code* (Official Use)
            </Label>
            <Input
              id="isicCode"
              value={formData.isicCode}
              onChange={(e) =>
                updateFormData("isicCode", e.target.value)
              }
              placeholder="ISIC code (for official use)"
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessActivityDescription">
              Business Activity Description *
            </Label>
            <Textarea
              id="businessActivityDescription"
              value={formData.businessActivityDescription}
              onChange={(e) =>
                updateFormData(
                  "businessActivityDescription",
                  e.target.value,
                )
              }
              placeholder="Describe your business activities in detail"
              className={
                errors.businessActivityDescription
                  ? "border-red-500"
                  : ""
              }
              rows={3}
            />
            {errors.businessActivityDescription && (
              <p className="text-red-500 text-sm">
                {errors.businessActivityDescription}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isMainActivity"
              checked={formData.isMainActivity}
              onCheckedChange={(checked) =>
                updateFormData("isMainActivity", checked)
              }
            />
            <Label htmlFor="isMainActivity">Main</Label>
          </div>
        </CardContent>
      </Card>

      {/* Bank Account */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="declaresBankAccount">
              Do you wish to declare your Bank Account for tax
              refunds?
            </Label>
            <Select
              value={formData.declaresBankAccount}
              onValueChange={(value) =>
                updateFormData("declaresBankAccount", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Yes or No" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.declaresBankAccount === "yes" && (
            <div className="space-y-4">
              <h4>Account Details:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">
                    Account Number
                  </Label>
                  <Input
                    id="accountNumber"
                    value={formData.accountNumber}
                    onChange={(e) =>
                      updateFormData(
                        "accountNumber",
                        e.target.value,
                      )
                    }
                    placeholder="Enter account number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountHolderName">
                    Account Holder Name
                  </Label>
                  <Input
                    id="accountHolderName"
                    value={formData.accountHolderName}
                    onChange={(e) =>
                      updateFormData(
                        "accountHolderName",
                        e.target.value,
                      )
                    }
                    placeholder="Enter account holder name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank</Label>
                  <Input
                    id="bankName"
                    value={formData.bankName}
                    onChange={(e) =>
                      updateFormData("bankName", e.target.value)
                    }
                    placeholder="Enter bank name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchName">Branch</Label>
                  <Input
                    id="branchName"
                    value={formData.branchName}
                    onChange={(e) =>
                      updateFormData(
                        "branchName",
                        e.target.value,
                      )
                    }
                    placeholder="Enter branch name"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Certification */}
      <Card>
        <CardHeader>
          <CardTitle>Certification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certFirstName">
                First Name *
              </Label>
              <Input
                id="certFirstName"
                value={formData.certFirstName}
                onChange={(e) =>
                  updateFormData(
                    "certFirstName",
                    e.target.value,
                  )
                }
                className={
                  errors.certFirstName ? "border-red-500" : ""
                }
                placeholder="Enter first name"
              />
              {errors.certFirstName && (
                <p className="text-red-500 text-sm">
                  {errors.certFirstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="certMiddleName">
                Middle Name
              </Label>
              <Input
                id="certMiddleName"
                value={formData.certMiddleName}
                onChange={(e) =>
                  updateFormData(
                    "certMiddleName",
                    e.target.value,
                  )
                }
                placeholder="Enter middle name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certLastName">Last Name *</Label>
              <Input
                id="certLastName"
                value={formData.certLastName}
                onChange={(e) =>
                  updateFormData("certLastName", e.target.value)
                }
                className={
                  errors.certLastName ? "border-red-500" : ""
                }
                placeholder="Enter last name"
              />
              {errors.certLastName && (
                <p className="text-red-500 text-sm">
                  {errors.certLastName}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="certSignature">Signature</Label>
              <Input
                id="certSignature"
                value={formData.certSignature}
                onChange={(e) =>
                  updateFormData(
                    "certSignature",
                    e.target.value,
                  )
                }
                placeholder="Enter signature"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="certDate">Date</Label>
              <Input
                id="certDate"
                type="date"
                value={formData.certDate}
                onChange={(e) =>
                  updateFormData("certDate", e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}