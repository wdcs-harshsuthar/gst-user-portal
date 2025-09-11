export type ValidationErrors = Record<string, string>;

export const validateRequired = (value: string, fieldName: string): string => {
  return !value.trim() ? `${fieldName} is required` : '';
};

export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return 'Email is required';
  if (!emailRegex.test(email)) return 'Please enter a valid email address';
  return '';
};

export const validatePhone = (phone: string): string => {
  if (!phone.trim()) return 'Phone number is required';
  // Basic Liberian phone validation - adjust as needed
  const phoneRegex = /^\+?231[0-9\-\s]{6,}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Please enter a valid Liberian phone number';
  }
  return '';
};

export const validatePercentageTotal = (percentages: number[], tolerance: number = 0.01): string => {
  const total = percentages.reduce((sum, p) => sum + p, 0);
  return Math.abs(total - 100) > tolerance ? 'Total percentage must equal 100%' : '';
};

export const validatePositiveNumber = (value: string, fieldName: string): string => {
  if (!value.trim()) return '';
  const num = parseFloat(value);
  if (isNaN(num) || num < 0) return `${fieldName} must be a positive number`;
  return '';
};

export const createValidationState = () => {
  return {
    errors: {} as ValidationErrors,
    setError: (field: string, error: string) => ({}),
    clearError: (field: string) => ({}),
    hasErrors: () => false
  };
};