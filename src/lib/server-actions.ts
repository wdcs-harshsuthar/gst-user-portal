'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { ServerActionState } from '../types/api';
import { apiClient } from './api-client';

// ============================================================================
// Server Action Utilities
// ============================================================================

export const createServerAction = <TInput, TOutput>(
  action: (input: TInput) => Promise<TOutput>
) => {
  return async (input: TInput): Promise<ServerActionState<TOutput>> => {
    try {
      const result = await action(input);
      return {
        success: true,
        data: result,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred',
      };
    }
  };
};

export const createFormAction = <TInput>(
  action: (input: TInput) => Promise<void>
) => {
  return async (prevState: ServerActionState, formData: FormData): Promise<ServerActionState> => {
    try {
      // Convert FormData to object
      const input = Object.fromEntries(formData.entries()) as TInput;
      await action(input);
      
      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'An error occurred',
      };
    }
  };
};

// ============================================================================
// Authentication Server Actions
// ============================================================================

export const loginAction = createServerAction(
  async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', credentials);
    
    if (!response.success) {
      throw new Error(response.error?.message || 'Login failed');
    }
    
    return response.data;
  }
);

export const registerAction = createServerAction(
  async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    userType: string;
  }) => {
    const response = await apiClient.post('/auth/register', userData);
    
    if (!response.success) {
      throw new Error(response.error?.message || 'Registration failed');
    }
    
    return response.data;
  }
);

export const logoutAction = createServerAction(
  async () => {
    // Clear tokens
    apiClient.clearTokens();
    
    // Revalidate auth-related paths
    revalidatePath('/');
    revalidatePath('/login');
    revalidatePath('/user-dashboard');
    revalidatePath('/admin');
    
    // Redirect to home
    redirect('/');
  }
);

// ============================================================================
// Registration Server Actions
// ============================================================================

export const createRegistrationAction = createServerAction(
  async (registrationData: {
    formType: string;
    personalInfo: any;
    businessInfo?: any;
    propertyInfo?: any[];
  }) => {
    const response = await apiClient.post('/registrations', registrationData);
    
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to create registration');
    }
    
    // Revalidate registrations list
    revalidatePath('/user-dashboard');
    revalidateTag('registrations');
    
    return response.data;
  }
);

export const updateRegistrationAction = createServerAction(
  async (data: { id: string; updates: any }) => {
    const response = await apiClient.put(`/registrations/${data.id}`, data.updates);
    
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to update registration');
    }
    
    // Revalidate specific registration and list
    revalidatePath(`/user-dashboard`);
    revalidatePath(`/registrations/${data.id}`);
    revalidateTag('registrations');
    
    return response.data;
  }
);

export const submitRegistrationAction = createServerAction(
  async (registrationId: string) => {
    const response = await apiClient.post(`/registrations/${registrationId}/submit`);
    
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to submit registration');
    }
    
    // Revalidate registrations
    revalidatePath('/user-dashboard');
    revalidatePath('/admin');
    revalidateTag('registrations');
    
    return response.data;
  }
);

export const deleteRegistrationAction = createServerAction(
  async (registrationId: string) => {
    const response = await apiClient.delete(`/registrations/${registrationId}`);
    
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to delete registration');
    }
    
    // Revalidate registrations
    revalidatePath('/user-dashboard');
    revalidateTag('registrations');
    
    return response.data;
  }
);

// ============================================================================
// Form Server Actions
// ============================================================================

export const submitLoginForm = createFormAction(
  async (formData: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', formData);
    
    if (!response.success) {
      throw new Error(response.error?.message || 'Login failed');
    }
    
    // In a real app, you would set cookies or session here
    // For now, we'll just revalidate paths
    revalidatePath('/');
    revalidatePath('/user-dashboard');
  }
);

export const submitRegistrationForm = createFormAction(
  async (formData: {
    formType: string;
    firstName: string;
    lastName: string;
    email: string;
    mobileNumber: string;
    dateOfBirth: string;
    nationality: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    identificationType: string;
    identificationNumber: string;
  }) => {
    const personalInfo = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      mobileNumber: formData.mobileNumber,
      dateOfBirth: formData.dateOfBirth,
      nationality: formData.nationality,
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      identificationType: formData.identificationType,
      identificationNumber: formData.identificationNumber,
    };
    
    const registrationData = {
      formType: formData.formType,
      personalInfo,
    };
    
    const response = await apiClient.post('/registrations', registrationData);
    
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to create registration');
    }
    
    revalidatePath('/user-dashboard');
    revalidateTag('registrations');
  }
);

// ============================================================================
// File Upload Server Actions
// ============================================================================

export const uploadDocumentAction = createServerAction(
  async (data: { registrationId: string; file: File; documentType: string }) => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('documentType', data.documentType);
    formData.append('registrationId', data.registrationId);
    
    const response = await apiClient.post(`/registrations/${data.registrationId}/documents`, formData);
    
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to upload document');
    }
    
    // Revalidate registration details
    revalidatePath(`/registrations/${data.registrationId}`);
    revalidateTag('registrations');
    
    return response.data;
  }
);

// ============================================================================
// Admin Server Actions - Removed as only user registration is needed
// ============================================================================

// ============================================================================
// Utility Server Actions
// ============================================================================

export const revalidateRegistrationsAction = createServerAction(
  async () => {
    revalidateTag('registrations');
    revalidatePath('/user-dashboard');
    revalidatePath('/admin');
  }
);

export const revalidateUserDataAction = createServerAction(
  async () => {
    revalidatePath('/user-dashboard');
    revalidatePath('/profile');
  }
);

// ============================================================================
// Error Handling Server Actions
// ============================================================================

export const handleServerError = (error: unknown): ServerActionState => {
  console.error('Server action error:', error);
  
  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
    };
  }
  
  return {
    success: false,
    error: 'An unexpected error occurred',
  };
};

// ============================================================================
// Validation Server Actions
// ============================================================================

export const validateEmailAction = createServerAction(
  async (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
    
    // In a real app, you might check if email is already taken
    return { isValid: true };
  }
);

export const validateMobileNumberAction = createServerAction(
  async (mobileNumber: string) => {
    const mobileRegex = /^\+?[1-9]\d{1,14}$/;
    
    if (!mobileRegex.test(mobileNumber)) {
      throw new Error('Invalid mobile number format');
    }
    
    return { isValid: true };
  }
);

// ============================================================================
// Export All Actions
// ============================================================================

export const serverActions = {
  // Authentication
  login: loginAction,
  register: registerAction,
  logout: logoutAction,
  
  // Registrations
  createRegistration: createRegistrationAction,
  updateRegistration: updateRegistrationAction,
  submitRegistration: submitRegistrationAction,
  deleteRegistration: deleteRegistrationAction,
  
  // Forms
  submitLoginForm,
  submitRegistrationForm,
  
  // File Upload
  uploadDocument: uploadDocumentAction,
  
  // Admin actions removed - only user registration needed
  
  // Utilities
  revalidateRegistrations: revalidateRegistrationsAction,
  revalidateUserData: revalidateUserDataAction,
  
  // Validation
  validateEmail: validateEmailAction,
  validateMobileNumber: validateMobileNumberAction,
  
  // Error Handling
  handleError: handleServerError,
};

