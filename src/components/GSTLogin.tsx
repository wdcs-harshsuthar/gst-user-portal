import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import {
  ArrowLeft,
  LogIn,
  RefreshCw,
  Shield,
  Mail,
  Eye,
  EyeOff,
} from "lucide-react";

interface GSTLoginProps {
  onLogin: (email: string) => void;
  onBack: () => void;
}

export default function GSTLogin({
  onLogin,
  onBack,
}: GSTLoginProps) {
  const [email, setEmail] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    tempPassword?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: { email?: string; tempPassword?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!tempPassword.trim()) {
      newErrors.tempPassword = "Temporary password is required";
    } else if (tempPassword.length < 6) {
      newErrors.tempPassword = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      // For demo purposes, accept any valid credentials
      onLogin(email);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Existing GST Login
          </h1>
          <p className="text-lg text-gray-600">
            Access your GST account to check application status
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-6 w-6 text-primary" />
              Login to Your Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="form-group">
                <Label
                  htmlFor="email"
                  className="form-label"
                >
                  Email Address *
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email address"
                    className={`mt-1 pl-10 ${errors.email ? "border-destructive" : ""}`}
                  />
                  <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 mt-0.5" />
                </div>
                {errors.email && (
                  <p className="form-error">
                    {errors.email}
                  </p>
                )}
                <p className="form-description">
                  Enter the email address you used for GST registration
                </p>
              </div>

              {/* Temporary Password Field */}
              <div className="form-group">
                <Label htmlFor="tempPassword" className="form-label">
                  Temporary Password *
                </Label>
                <div className="relative">
                  <Input
                    id="tempPassword"
                    type={showPassword ? "text" : "password"}
                    value={tempPassword}
                    onChange={(e) => setTempPassword(e.target.value)}
                    placeholder="Enter your temporary password"
                    className={`mt-1 pr-10 ${errors.tempPassword ? "border-destructive" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 mt-0.5 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.tempPassword && (
                  <p className="form-error">{errors.tempPassword}</p>
                )}
                <p className="form-description">
                  Use the temporary password sent to your email after registration
                </p>
              </div>

              {/* Demo Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  For Demo Purposes:
                </h4>
                <p className="text-sm text-blue-700 mb-2">
                  Use any valid email address with any password (min 6 characters) to login and access your dashboard.
                </p>
                <p className="text-xs text-blue-600">
                  Example: john.doe@email.com with password: demo123
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login to Dashboard
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Help Links */}
        <Card className="mb-8 bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800 text-lg">
              Need Help?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-gray-700">
            <ul className="space-y-2 text-sm">
              <li>
                •{" "}
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 underline"
                >
                  Forgot your temporary password?
                </a>
              </li>
              <li>
                •{" "}
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 underline"
                >
                  Can't find your registration email?
                </a>
              </li>
              <li>
                •{" "}
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 underline"
                >
                  Login troubleshooting guide
                </a>
              </li>
              <li>• Contact LRA Support: +231 (0800) 3850</li>
            </ul>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <Button
            variant="outline"
            onClick={onBack}
            className="px-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Website
          </Button>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Liberia Revenue Authority • Secure Login Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}