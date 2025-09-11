/**
 * API Client
 * 
 * A comprehensive API client with proper error handling, retry logic,
 * request/response interceptors, and TypeScript support.
 */

import { 
  ApiResponse, 
  ApiError, 
  ApiRequestConfig, 
  ApiClientConfig,
  ApiMethod,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
  ServerError
} from '../types/api';
import { apiConfig, getApiUrl } from '../config/app';

// ============================================================================
// API Client Class
// ============================================================================

export class ApiClient {
  private config: ApiClientConfig;
  private token: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(config?: Partial<ApiClientConfig>) {
    this.config = {
      baseURL: apiConfig.baseUrl || 'http://localhost:3000/api',
      timeout: apiConfig.timeout,
      retryAttempts: apiConfig.retryAttempts,
      retryDelay: apiConfig.retryDelay,
      defaultHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...config,
    };
  }

  // ============================================================================
  // Token Management
  // ============================================================================

  setToken(token: string | null): void {
    this.token = token;
  }

  setRefreshToken(refreshToken: string | null): void {
    this.refreshToken = refreshToken;
  }

  getToken(): string | null {
    return this.token;
  }

  clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
  }

  // ============================================================================
  // Request Methods
  // ============================================================================

  async get<T = any>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', url, ...config });
  }

  async post<T = any>(url: string, data?: any, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data, ...config });
  }

  async put<T = any>(url: string, data?: any, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data, ...config });
  }

  async patch<T = any>(url: string, data?: any, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', url, data, ...config });
  }

  async delete<T = any>(url: string, config?: Partial<ApiRequestConfig>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url, ...config });
  }

  // ============================================================================
  // Main Request Method
  // ============================================================================

  async request<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    const requestConfig = this.buildRequestConfig(config);
    
    try {
      const response = await this.executeRequest<T>(requestConfig);
      return this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ============================================================================
  // Request Configuration
  // ============================================================================

  private buildRequestConfig(config: ApiRequestConfig): RequestInit & { url: string; timeout?: number } {
    const url = config.url.startsWith('http') ? config.url : `${this.config.baseURL}${config.url}`;
    
    const headers = new Headers({
      ...this.config.defaultHeaders,
      ...config.headers,
    });

    // Add authorization header if token exists
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const requestConfig: RequestInit & { url: string; timeout?: number } = {
      method: config.method,
      headers,
      url,
      timeout: config.timeout || this.config.timeout,
    };

    // Add body for methods that support it
    if (config.data && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
      if (config.data instanceof FormData) {
        // Remove Content-Type header for FormData (browser will set it with boundary)
        headers.delete('Content-Type');
        requestConfig.body = config.data;
      } else {
        requestConfig.body = JSON.stringify(config.data);
      }
    }

    // Add query parameters
    if (config.params) {
      const searchParams = new URLSearchParams();
      Object.entries(config.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        requestConfig.url += `?${queryString}`;
      }
    }

    return requestConfig;
  }

  // ============================================================================
  // Request Execution
  // ============================================================================

  private async executeRequest<T>(config: RequestInit & { url: string; timeout?: number }): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(config.url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // ============================================================================
  // Response Handling
  // ============================================================================

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    let data: any;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      data = null;
    }

    if (!response.ok) {
      throw this.createErrorFromResponse(response, data);
    }

    return {
      success: true,
      data: data?.data || data,
      message: data?.message,
      timestamp: new Date().toISOString(),
    };
  }

  // ============================================================================
  // Error Handling
  // ============================================================================

  private handleError(error: any): ApiResponse {
    if (error instanceof ApiError) {
      return {
        success: false,
        error: {
          name: error.name,
          code: error.code,
          message: error.message,
          details: error.details,
          field: error.field,
          statusCode: error.statusCode,
        },
        timestamp: new Date().toISOString(),
      };
    }

    if (error.name === 'AbortError') {
      return {
        success: false,
        error: {
          name: 'AbortError',
          code: 'TIMEOUT',
          message: 'Request timeout',
          statusCode: 408,
        },
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: false,
      error: {
        name: 'NetworkError',
        code: 'NETWORK_ERROR',
        message: error.message || 'Network error',
        statusCode: 0,
      },
      timestamp: new Date().toISOString(),
    };
  }

  private createErrorFromResponse(response: Response, data: any): ApiError {
    const statusCode = response.status;
    const errorData = data?.error || data;
    
    switch (statusCode) {
      case 400:
        const validationError = new ValidationError(
          errorData?.message || 'Validation error',
          errorData?.field,
          errorData?.details
        );
        return validationError;
      
      case 401:
        const authError = new AuthenticationError(errorData?.message);
        return authError;
      
      case 403:
        const authzError = new AuthorizationError(errorData?.message);
        return authzError;
      
      case 404:
        const notFoundError = new NotFoundError(errorData?.message || 'Resource not found');
        return notFoundError;
      
      case 409:
        const conflictError = new ConflictError(errorData?.message || 'Conflict');
        return conflictError;
      
      case 429:
        const rateLimitError = new RateLimitError(errorData?.message);
        return rateLimitError;
      
      case 500:
      default:
        const serverError = new ServerError(errorData?.message);
        return serverError;
    }
  }

  // ============================================================================
  // Retry Logic
  // ============================================================================

  private async retryRequest<T>(
    config: ApiRequestConfig,
    attempt: number = 1
  ): Promise<ApiResponse<T>> {
    if (attempt > this.config.retryAttempts) {
      throw new ServerError('Max retry attempts exceeded');
    }

    try {
      return await this.request<T>(config);
    } catch (error) {
      if (this.shouldRetry(error, attempt)) {
        await this.delay(this.config.retryDelay * attempt);
        return this.retryRequest<T>(config, attempt + 1);
      }
      throw error;
    }
  }

  private shouldRetry(error: any, attempt: number): boolean {
    if (attempt >= this.config.retryAttempts) return false;
    
    if (error instanceof ApiError) {
      // Retry on server errors and rate limits
      return error.statusCode >= 500 || error.statusCode === 429;
    }
    
    // Retry on network errors
    return error.name === 'AbortError' || error.message?.includes('fetch');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ============================================================================
  // Token Refresh
  // ============================================================================

  private async refreshAccessToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = this.performTokenRefresh();

    try {
      const newToken = await this.refreshPromise;
      this.isRefreshing = false;
      this.refreshPromise = null;
      return newToken;
    } catch (error) {
      this.isRefreshing = false;
      this.refreshPromise = null;
      this.clearTokens();
      throw error;
    }
  }

  private async performTokenRefresh(): Promise<string> {
    if (!this.refreshToken) {
      throw new AuthenticationError('No refresh token available');
    }

    const response = await this.post('/auth/refresh', {
      refreshToken: this.refreshToken,
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
      this.setRefreshToken(response.data.refreshToken);
      return response.data.token;
    }

    throw new AuthenticationError('Token refresh failed');
  }

  // ============================================================================
  // File Upload
  // ============================================================================

  async uploadFile(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request({
      method: 'POST',
      url,
      data: formData,
      headers: {
        // Don't set Content-Type for FormData
      },
    });
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getBaseURL(): string {
    return this.config.baseURL;
  }

  setBaseURL(baseURL: string): void {
    this.config.baseURL = baseURL;
  }
}

// ============================================================================
// Default API Client Instance
// ============================================================================

export const apiClient = new ApiClient();

// ============================================================================
// API Client Factory
// ============================================================================

export const createApiClient = (config?: Partial<ApiClientConfig>): ApiClient => {
  return new ApiClient(config);
};

// ============================================================================
// Convenience Functions
// ============================================================================

export const setAuthToken = (token: string | null): void => {
  apiClient.setToken(token);
};

export const setAuthRefreshToken = (refreshToken: string | null): void => {
  apiClient.setRefreshToken(refreshToken);
};

export const clearAuthTokens = (): void => {
  apiClient.clearTokens();
};

export const isAuthenticated = (): boolean => {
  return apiClient.isAuthenticated();
};

// ============================================================================
// Request Interceptors (for future use)
// ============================================================================

export interface RequestInterceptor {
  onRequest?: (config: ApiRequestConfig) => ApiRequestConfig | Promise<ApiRequestConfig>;
  onRequestError?: (error: any) => any;
}

export interface ResponseInterceptor {
  onResponse?: (response: ApiResponse) => ApiResponse | Promise<ApiResponse>;
  onResponseError?: (error: any) => any;
}

export class InterceptorManager {
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  addRequestInterceptor(interceptor: RequestInterceptor): number {
    this.requestInterceptors.push(interceptor);
    return this.requestInterceptors.length - 1;
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): number {
    this.responseInterceptors.push(interceptor);
    return this.responseInterceptors.length - 1;
  }

  removeRequestInterceptor(id: number): void {
    this.requestInterceptors.splice(id, 1);
  }

  removeResponseInterceptor(id: number): void {
    this.responseInterceptors.splice(id, 1);
  }

  getRequestInterceptors(): RequestInterceptor[] {
    return [...this.requestInterceptors];
  }

  getResponseInterceptors(): ResponseInterceptor[] {
    return [...this.responseInterceptors];
  }
}

export const interceptorManager = new InterceptorManager();
