/**
 * Application Configuration
 * 
 * This file centralizes all application configuration including
 * environment variables, feature flags, and API settings.
 */

import { AppConfig } from '../types/api';

// ============================================================================
// Environment Variables
// ============================================================================

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return value;
};

const getOptionalEnvVar = (key: string, defaultValue?: string): string | undefined => {
  return process.env[key] || defaultValue;
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true';
};

const getNumberEnvVar = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    console.warn(`Invalid number for ${key}: ${value}, using default: ${defaultValue}`);
    return defaultValue;
  }
  return parsed;
};

// ============================================================================
// API Configuration
// ============================================================================

export const apiConfig = {
  baseUrl: getOptionalEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:3000/api'),
  timeout: getNumberEnvVar('NEXT_PUBLIC_API_TIMEOUT', 30000),
  retryAttempts: getNumberEnvVar('NEXT_PUBLIC_API_RETRY_ATTEMPTS', 3),
  retryDelay: getNumberEnvVar('NEXT_PUBLIC_API_RETRY_DELAY', 1000),
};

// ============================================================================
// Authentication Configuration
// ============================================================================

export const authConfig = {
  secret: getOptionalEnvVar('NEXTAUTH_SECRET', 'fallback-secret-for-development'),
  url: getOptionalEnvVar('NEXTAUTH_URL', 'http://localhost:3000'),
  jwtSecret: getOptionalEnvVar('JWT_SECRET', 'fallback-jwt-secret'),
  jwtRefreshSecret: getOptionalEnvVar('JWT_REFRESH_SECRET', 'fallback-refresh-secret'),
  jwtExpiresIn: getOptionalEnvVar('JWT_EXPIRES_IN', '1h'),
  jwtRefreshExpiresIn: getOptionalEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
};

// ============================================================================
// Database Configuration
// ============================================================================

export const databaseConfig = {
  url: getOptionalEnvVar('DATABASE_URL'),
  host: getOptionalEnvVar('DATABASE_HOST', 'localhost'),
  port: getNumberEnvVar('DATABASE_PORT', 5432),
  name: getOptionalEnvVar('DATABASE_NAME', 'gst_portal'),
  user: getOptionalEnvVar('DATABASE_USER'),
  password: getOptionalEnvVar('DATABASE_PASSWORD'),
};

// ============================================================================
// File Upload Configuration
// ============================================================================

export const uploadConfig = {
  maxFileSize: getNumberEnvVar('NEXT_PUBLIC_MAX_FILE_SIZE', 10 * 1024 * 1024), // 10MB
  maxFilesPerUpload: getNumberEnvVar('NEXT_PUBLIC_MAX_FILES_PER_UPLOAD', 10),
  uploadDir: getOptionalEnvVar('UPLOAD_DIR', './uploads'),
  cloudinary: {
    cloudName: getOptionalEnvVar('CLOUDINARY_CLOUD_NAME'),
    apiKey: getOptionalEnvVar('CLOUDINARY_API_KEY'),
    apiSecret: getOptionalEnvVar('CLOUDINARY_API_SECRET'),
  },
};

// ============================================================================
// Email Configuration
// ============================================================================

export const emailConfig = {
  smtp: {
    host: getOptionalEnvVar('SMTP_HOST', 'smtp.gmail.com'),
    port: getNumberEnvVar('SMTP_PORT', 587),
    user: getOptionalEnvVar('SMTP_USER'),
    password: getOptionalEnvVar('SMTP_PASSWORD'),
  },
  from: getOptionalEnvVar('SMTP_FROM', 'noreply@gstportal.gov.lr'),
};

// ============================================================================
// Payment Configuration
// ============================================================================

export const paymentConfig = {
  gatewayUrl: getOptionalEnvVar('PAYMENT_GATEWAY_URL'),
  gatewayKey: getOptionalEnvVar('PAYMENT_GATEWAY_KEY'),
  gatewaySecret: getOptionalEnvVar('PAYMENT_GATEWAY_SECRET'),
};

// ============================================================================
// Redis Configuration
// ============================================================================

export const redisConfig = {
  url: getOptionalEnvVar('REDIS_URL', 'redis://localhost:6379'),
  password: getOptionalEnvVar('REDIS_PASSWORD'),
};

// ============================================================================
// Monitoring Configuration
// ============================================================================

export const monitoringConfig = {
  sentryDsn: getOptionalEnvVar('SENTRY_DSN'),
  googleAnalyticsId: getOptionalEnvVar('GOOGLE_ANALYTICS_ID'),
};

// ============================================================================
// Feature Flags
// ============================================================================

export const featureFlags = {
  registration: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_REGISTRATION', true),
  payments: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_PAYMENTS', true),
  notifications: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_NOTIFICATIONS', true),
  analytics: getBooleanEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', false),
};

// ============================================================================
// Application Limits
// ============================================================================

export const appLimits = {
  maxFileSize: uploadConfig.maxFileSize,
  maxFilesPerUpload: uploadConfig.maxFilesPerUpload,
  maxRegistrationsPerUser: getNumberEnvVar('MAX_REGISTRATIONS_PER_USER', 5),
  maxLoginAttempts: getNumberEnvVar('MAX_LOGIN_ATTEMPTS', 5),
  sessionTimeout: getNumberEnvVar('SESSION_TIMEOUT', 30 * 60 * 1000), // 30 minutes
};

// ============================================================================
// Environment Information
// ============================================================================

export const environment = {
  nodeEnv: getOptionalEnvVar('NODE_ENV', 'development'),
  isDevelopment: getOptionalEnvVar('NODE_ENV', 'development') === 'development',
  isProduction: getOptionalEnvVar('NODE_ENV', 'development') === 'production',
  isTest: getOptionalEnvVar('NODE_ENV', 'development') === 'test',
  debug: getBooleanEnvVar('NEXT_PUBLIC_DEBUG', false),
};

// ============================================================================
// Main Application Configuration
// ============================================================================

export const appConfig: AppConfig = {
  api: apiConfig,
  features: featureFlags,
  limits: appLimits,
};

// ============================================================================
// Validation Functions
// ============================================================================

export const validateConfig = (): void => {
  const requiredVars = [
    'NEXTAUTH_SECRET',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    if (environment.isProduction) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }
  }
};

// ============================================================================
// Configuration Helpers
// ============================================================================

export const getApiUrl = (endpoint: string): string => {
  const baseUrl = apiConfig.baseUrl.endsWith('/') 
    ? apiConfig.baseUrl.slice(0, -1) 
    : apiConfig.baseUrl;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

export const getUploadUrl = (filename: string): string => {
  return `${apiConfig.baseUrl}/upload/${filename}`;
};

export const isFeatureEnabled = (feature: keyof typeof featureFlags): boolean => {
  return featureFlags[feature];
};

export const getConfigForEnvironment = () => {
  return {
    api: apiConfig,
    auth: authConfig,
    database: databaseConfig,
    upload: uploadConfig,
    email: emailConfig,
    payment: paymentConfig,
    redis: redisConfig,
    monitoring: monitoringConfig,
    features: featureFlags,
    limits: appLimits,
    environment,
  };
};

// Initialize configuration validation
if (typeof window === 'undefined') {
  validateConfig();
}

