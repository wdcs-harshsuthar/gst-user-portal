'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { FormState, ServerActionState } from '../types/api';

// ============================================================================
// Form State Hook
// ============================================================================

export interface UseFormStateOptions<T> {
  initialData?: T;
  validate?: (data: T) => Record<string, string>;
  onSubmit?: (data: T) => Promise<void>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  resetOnSuccess?: boolean;
}

export const useFormState = <T extends Record<string, any>>(
  options: UseFormStateOptions<T> = {}
) => {
  const {
    initialData = {} as T,
    validate,
    onSubmit,
    onSuccess,
    onError,
    resetOnSuccess = false,
  } = options;

  const [formState, setFormState] = useState<FormState<T>>({
    data: initialData,
    errors: {},
    isSubmitting: false,
    isDirty: false,
    isValid: true,
  });

  const initialDataRef = useRef(initialData);

  // ============================================================================
  // Update Form Data
  // ============================================================================

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormState(prev => {
      const newData = { ...prev.data, [field]: value };
      const newErrors = { ...prev.errors };
      
      // Remove error for this field when user starts typing
      if (newErrors[field as string]) {
        delete newErrors[field as string];
      }
      
      // Validate field if validator exists
      if (validate) {
        const fieldErrors = validate(newData);
        if (fieldErrors[field as string]) {
          newErrors[field as string] = fieldErrors[field as string];
        }
      }
      
      const isDirty = JSON.stringify(newData) !== JSON.stringify(initialDataRef.current);
      const isValid = Object.keys(newErrors).length === 0;
      
      return {
        ...prev,
        data: newData,
        errors: newErrors,
        isDirty,
        isValid,
      };
    });
  }, [validate]);

  const updateFields = useCallback((updates: Partial<T>) => {
    setFormState(prev => {
      const newData = { ...prev.data, ...updates };
      const newErrors = { ...prev.errors };
      
      // Remove errors for updated fields
      Object.keys(updates).forEach(field => {
        if (newErrors[field]) {
          delete newErrors[field];
        }
      });
      
      // Validate if validator exists
      if (validate) {
        const fieldErrors = validate(newData);
        Object.assign(newErrors, fieldErrors);
      }
      
      const isDirty = JSON.stringify(newData) !== JSON.stringify(initialDataRef.current);
      const isValid = Object.keys(newErrors).length === 0;
      
      return {
        ...prev,
        data: newData,
        errors: newErrors,
        isDirty,
        isValid,
      };
    });
  }, [validate]);

  // ============================================================================
  // Form Submission
  // ============================================================================

  const submit = useCallback(async () => {
    if (!onSubmit) return;

    // Validate before submission
    if (validate) {
      const errors = validate(formState.data);
      if (Object.keys(errors).length > 0) {
        setFormState(prev => ({
          ...prev,
          errors,
          isValid: false,
        }));
        return;
      }
    }

    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      errors: {},
    }));

    try {
      await onSubmit(formState.data);
      
      if (onSuccess) {
        onSuccess(formState.data);
      }
      
      if (resetOnSuccess) {
        reset();
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      
      if (onError) {
        onError(errorMessage);
      }
      
      setFormState(prev => ({
        ...prev,
        errors: { general: errorMessage },
      }));
    } finally {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
      }));
    }
  }, [formState.data, onSubmit, validate, onSuccess, onError, resetOnSuccess]);

  // ============================================================================
  // Form Management
  // ============================================================================

  const reset = useCallback(() => {
    setFormState({
      data: initialDataRef.current,
      errors: {},
      isSubmitting: false,
      isDirty: false,
      isValid: true,
    });
  }, []);

  const setErrors = useCallback((errors: Record<string, string>) => {
    setFormState(prev => ({
      ...prev,
      errors,
      isValid: Object.keys(errors).length === 0,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      errors: {},
      isValid: true,
    }));
  }, []);

  const setData = useCallback((data: T) => {
    setFormState(prev => {
      const isDirty = JSON.stringify(data) !== JSON.stringify(initialDataRef.current);
      return {
        ...prev,
        data,
        isDirty,
      };
    });
  }, []);

  // ============================================================================
  // Validation
  // ============================================================================

  const validateForm = useCallback(() => {
    if (!validate) return true;
    
    const errors = validate(formState.data);
    setFormState(prev => ({
      ...prev,
      errors,
      isValid: Object.keys(errors).length === 0,
    }));
    
    return Object.keys(errors).length === 0;
  }, [formState.data, validate]);

  const validateField = useCallback((field: keyof T) => {
    if (!validate) return true;
    
    const errors = validate(formState.data);
    const fieldError = errors[field as string];
    
    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: fieldError || '',
      },
    }));
    
    return !fieldError;
  }, [formState.data, validate]);

  // ============================================================================
  // Field Helpers
  // ============================================================================

  const getFieldError = useCallback((field: keyof T) => {
    return formState.errors[field as string] || '';
  }, [formState.errors]);

  const hasFieldError = useCallback((field: keyof T) => {
    return !!formState.errors[field as string];
  }, [formState.errors]);

  const getFieldValue = useCallback((field: keyof T) => {
    return formState.data[field];
  }, [formState.data]);

  // ============================================================================
  // Return Hook Interface
  // ============================================================================

  return {
    // Form State
    data: formState.data,
    errors: formState.errors,
    isSubmitting: formState.isSubmitting,
    isDirty: formState.isDirty,
    isValid: formState.isValid,
    
    // Actions
    updateField,
    updateFields,
    submit,
    reset,
    setErrors,
    clearErrors,
    setData,
    
    // Validation
    validateForm,
    validateField,
    
    // Field Helpers
    getFieldError,
    hasFieldError,
    getFieldValue,
  };
};

// ============================================================================
// Server Action Form Hook
// ============================================================================

export interface UseServerActionFormOptions<T> {
  action: (formData: FormData) => Promise<ServerActionState>;
  initialData?: T;
  onSuccess?: (result: any) => void;
  onError?: (error: string) => void;
  resetOnSuccess?: boolean;
}

export const useServerActionForm = <T extends Record<string, any>>(
  options: UseServerActionFormOptions<T>
) => {
  const { action, initialData = {} as T, onSuccess, onError, resetOnSuccess = false } = options;
  
  const [serverState, setServerState] = useState<ServerActionState>({
    success: false,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<T>(initialData);

  const submit = useCallback(async (formData: FormData) => {
    setIsSubmitting(true);
    setServerState({ success: false });

    try {
      const result = await action(formData);
      setServerState(result);
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result.data);
        }
        if (resetOnSuccess) {
          setData(initialData);
        }
      } else {
        if (onError) {
          onError(result.error || 'An error occurred');
        }
      }
    } catch (error: any) {
      const errorState: ServerActionState = {
        success: false,
        error: error.message || 'An error occurred',
      };
      setServerState(errorState);
      
      if (onError) {
        onError(errorState.error || 'An error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [action, onSuccess, onError, resetOnSuccess, initialData]);

  const updateField = useCallback((field: keyof T, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
    setServerState({ success: false });
  }, [initialData]);

  return {
    data,
    serverState,
    isSubmitting,
    submit,
    updateField,
    reset,
  };
};

// ============================================================================
// Form Validation Utilities
// ============================================================================

export const createValidator = <T>(
  rules: Record<keyof T, (value: any, data: T) => string | undefined>
) => {
  return (data: T): Record<string, string> => {
    const errors: Record<string, string> = {};
    
    Object.entries(rules).forEach(([field, rule]) => {
      const error = rule(data[field as keyof T], data);
      if (error) {
        errors[field] = error;
      }
    });
    
    return errors;
  };
};

export const commonValidators = {
  required: (value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'This field is required';
    }
    return undefined;
  },
  
  email: (value: string) => {
    if (!value) return undefined;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
    return undefined;
  },
  
  minLength: (min: number) => (value: string) => {
    if (!value) return undefined;
    if (value.length < min) {
      return `Must be at least ${min} characters long`;
    }
    return undefined;
  },
  
  maxLength: (max: number) => (value: string) => {
    if (!value) return undefined;
    if (value.length > max) {
      return `Must be no more than ${max} characters long`;
    }
    return undefined;
  },
  
  phone: (value: string) => {
    if (!value) return undefined;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return undefined;
  },
  
  numeric: (value: any) => {
    if (!value) return undefined;
    if (isNaN(Number(value))) {
      return 'Must be a valid number';
    }
    return undefined;
  },
  
  positive: (value: any) => {
    if (!value) return undefined;
    const num = Number(value);
    if (isNaN(num) || num <= 0) {
      return 'Must be a positive number';
    }
    return undefined;
  },
};

