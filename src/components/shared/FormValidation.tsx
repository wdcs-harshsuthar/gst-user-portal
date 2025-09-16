import { z } from 'zod';

// Liberian phone number validation
export const liberianPhoneSchema = z.string()
  .regex(/^(\+231|231|0)?[0-9]{8,9}$/, 'Please enter a valid Liberian phone number');

// TIN validation (Liberian format)
export const tinSchema = z.string()
  .regex(/^[0-9]{10}$/, 'TIN must be exactly 10 digits');

// GST number validation
export const gstSchema = z.string()
  .regex(/^GST[0-9]{7}$/, 'GST number must be in format GST1234567');

// Email validation
export const emailSchema = z.string()
  .email('Please enter a valid email address');

// Required string validation
export const requiredStringSchema = z.string()
  .min(1, 'This field is required')
  .trim();

// Optional string validation
export const optionalStringSchema = z.string().optional();

// Date validation
export const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please enter a valid date');

// Positive number validation
export const positiveNumberSchema = z.string()
  .regex(/^\d+$/, 'Must be a positive number')
  .transform(Number)
  .refine(val => val >= 0, 'Must be a positive number');

// Percentage validation (0-100)
export const percentageSchema = z.string()
  .regex(/^\d{1,3}(\.\d{1,2})?$/, 'Must be a valid percentage')
  .transform(Number)
  .refine(val => val >= 0 && val <= 100, 'Percentage must be between 0 and 100');

// Address validation
export const addressSchema = z.object({
  streetAddress: requiredStringSchema,
  county: requiredStringSchema,
  district: optionalStringSchema,
  postalCode: optionalStringSchema,
});

// BR01 form validation schema
export const branchRegistrationSchema = z.object({
  parentEntityName: requiredStringSchema,
  parentTin: tinSchema,
  headOfficeAddress: requiredStringSchema,
  branches: z.array(z.object({
    branchName: requiredStringSchema,
    branchAddress: requiredStringSchema,
    county: requiredStringSchema,
    district: optionalStringSchema,
    contactNumber: liberianPhoneSchema,
    email: emailSchema,
    dateOpened: dateSchema,
    natureOfBusiness: requiredStringSchema,
    managerName: requiredStringSchema,
    managerIdNumber: requiredStringSchema,
    managerIdType: requiredStringSchema,
    employeeCount: positiveNumberSchema,
    localBusinessLicenses: optionalStringSchema,
    licenseNumbers: optionalStringSchema,
  })).min(1, 'At least one branch is required'),
  declarationConfirmed: z.boolean().refine(val => val === true, 'Declaration must be confirmed'),
  signatoryName: requiredStringSchema,
  signatoryDate: dateSchema,
});

// Individual registration validation schema
export const individualRegistrationSchema = z.object({
  personalInfo: z.object({
    title: requiredStringSchema,
    firstName: requiredStringSchema,
    middleName: optionalStringSchema,
    lastName: requiredStringSchema,
    dateOfBirth: dateSchema,
    gender: requiredStringSchema,
    maritalStatus: requiredStringSchema,
    nationality: requiredStringSchema,
  }),
  identification: z.object({
    idType: requiredStringSchema,
    idNumber: requiredStringSchema,
    issuingAuthority: requiredStringSchema,
    issueDate: dateSchema,
    expirationDate: dateSchema.optional(),
  }),
  contact: z.object({
    phoneNumber: liberianPhoneSchema,
    email: emailSchema,
    alternatePhone: liberianPhoneSchema.optional(),
  }),
  address: addressSchema,
  employment: z.object({
    employmentType: requiredStringSchema,
    employerName: optionalStringSchema,
    monthlyIncome: positiveNumberSchema.optional(),
  }),
});

// Business registration validation schema
export const businessRegistrationSchema = z.object({
  entityInfo: z.object({
    businessName: requiredStringSchema,
    businessType: requiredStringSchema,
    registrationNumber: optionalStringSchema,
    dateOfIncorporation: dateSchema.optional(),
    principalBusinessActivity: requiredStringSchema,
  }),
  address: addressSchema,
  contact: z.object({
    phoneNumber: liberianPhoneSchema,
    email: emailSchema,
    website: z.string().url().optional(),
  }),
  financials: z.object({
    estimatedAnnualTurnover: positiveNumberSchema.optional(),
    numberOfEmployees: positiveNumberSchema,
  }),
});

// Validation helper functions
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown,
  fieldName: string
): { isValid: boolean; error?: string } {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.errors[0]?.message || `Invalid ${fieldName}` 
      };
    }
    return { isValid: false, error: `Invalid ${fieldName}` };
  }
}

export function validateForm<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { isValid: boolean; errors: Record<string, string>; data?: T } {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, errors: {}, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: 'Validation failed' } };
  }
}

// Real-time validation hook
export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  return {
    validateField: (value: unknown, fieldName: string) => 
      validateField(schema, value, fieldName),
    validateForm: (data: unknown) => validateForm(schema, data),
  };
}