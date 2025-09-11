/**
 * API Types and Interfaces
 * 
 * This file defines all TypeScript types for API requests, responses,
 * and state management throughout the application.
 */

// ============================================================================
// Base API Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  timestamp: string;
}

export interface ApiError {
  name: string;
  code: string;
  message: string;
  details?: any;
  field?: string;
  statusCode: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// ============================================================================
// Authentication Types
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  userType: UserType;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
}

// ============================================================================
// User Types
// ============================================================================

export type UserType = 'individual' | 'business';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  userType: UserType;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface UserProfile extends User {
  profile?: {
    avatar?: string;
    address?: Address;
    businessInfo?: BusinessInfo;
  };
}

// ============================================================================
// GST Registration Types
// ============================================================================

export type RegistrationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'requires_clarification'
  | 'completed';

export type FormType = 'IN-01' | 'RF-01';

export interface GSTRegistration {
  id: string;
  userId: string;
  formType: FormType;
  status: RegistrationStatus;
  personalInfo: PersonalInfo;
  businessInfo?: BusinessInfo;
  propertyInfo?: PropertyInfo[];
  documents: Document[];
  fees: FeeInfo;
  submittedAt?: string;
  reviewedAt?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  reviewNotes?: string;
  rejectionReason?: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  nationality: string;
  address: Address;
  identificationType: string;
  identificationNumber: string;
}

export interface BusinessInfo {
  businessName: string;
  businessType: string;
  registrationNumber: string;
  taxId: string;
  address: Address;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  businessDescription: string;
  annualRevenue?: number;
  employeeCount?: number;
}

export interface PropertyInfo {
  id: string;
  propertyType: 'residential' | 'commercial' | 'industrial';
  address: Address;
  propertyValue: number;
  constructionYear: number;
  propertySize: number;
  ownershipType: 'owned' | 'rented' | 'leased';
  documents: Document[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Document {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  verifiedAt?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verificationNotes?: string;
}

export interface FeeInfo {
  registrationFee: number;
  processingFee: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  paymentReference?: string;
  paidAt?: string;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface CreateRegistrationRequest {
  formType: FormType;
  personalInfo: PersonalInfo;
  businessInfo?: BusinessInfo;
  propertyInfo?: Omit<PropertyInfo, 'id'>[];
}

export interface UpdateRegistrationRequest {
  personalInfo?: Partial<PersonalInfo>;
  businessInfo?: Partial<BusinessInfo>;
  propertyInfo?: PropertyInfo[];
}

export interface SubmitRegistrationRequest {
  registrationId: string;
  documents: string[]; // Document IDs
}

export interface ReviewRegistrationRequest {
  registrationId: string;
  status: RegistrationStatus;
  notes?: string;
  rejectionReason?: string;
}

export interface UploadDocumentRequest {
  registrationId: string;
  file: File;
  documentType: string;
}

export interface UploadDocumentResponse {
  document: Document;
  uploadUrl?: string;
}

// ============================================================================
// Admin Types - Removed as only user registration is needed
// ============================================================================

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: string;
}

// ============================================================================
// Global State Types
// ============================================================================

export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  notifications: Notification[];
  theme: string;
  language: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface RegistrationState {
  currentRegistration: GSTRegistration | null;
  registrations: GSTRegistration[];
  isLoading: boolean;
  error: string | null;
  filters: {
    status?: RegistrationStatus;
    formType?: FormType;
    dateRange?: {
      start: string;
      end: string;
    };
  };
}

// ============================================================================
// Form State Types
// ============================================================================

export interface FormState<T = any> {
  data: T;
  errors: Record<string, string>;
  isSubmitting: boolean;
  isDirty: boolean;
  isValid: boolean;
}

export interface ServerActionState<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
}

export interface AppConfig {
  api: ApiConfig;
  features: {
    registration: boolean;
    payments: boolean;
    notifications: boolean;
    analytics: boolean;
  };
  limits: {
    maxFileSize: number;
    maxFilesPerUpload: number;
    maxRegistrationsPerUser: number;
  };
}

// ============================================================================
// Utility Types
// ============================================================================

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestConfig {
  method: ApiMethod;
  url: string;
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  timeout?: number;
  retry?: boolean;
}

export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  defaultHeaders: Record<string, string>;
}

// ============================================================================
// Error Types
// ============================================================================

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
    public details?: any,
    public field?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, field?: string, details?: any) {
    super('VALIDATION_ERROR', message, 400, details, field);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication required') {
    super('AUTHENTICATION_ERROR', message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Insufficient permissions') {
    super('AUTHORIZATION_ERROR', message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string = 'Resource') {
    super('NOT_FOUND', `${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends ApiError {
  constructor(message: string) {
    super('CONFLICT', message, 409);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends ApiError {
  constructor(message: string = 'Rate limit exceeded') {
    super('RATE_LIMIT', message, 429);
    this.name = 'RateLimitError';
  }
}

export class ServerError extends ApiError {
  constructor(message: string = 'Internal server error') {
    super('SERVER_ERROR', message, 500);
    this.name = 'ServerError';
  }
}
