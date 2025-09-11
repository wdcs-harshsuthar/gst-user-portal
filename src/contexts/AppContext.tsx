'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  AppState, 
  AuthState, 
  RegistrationState, 
  User, 
  GSTRegistration, 
  RegistrationStatus,
  FormType 
} from '../types/api';
import { apiClient, setAuthToken, setAuthRefreshToken, clearAuthTokens } from '../lib/api-client';
import { notificationManager } from '../lib/notifications';

// ============================================================================
// Action Types
// ============================================================================

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_THEME'; payload: string }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: any }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_NOTIFICATIONS' };

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SET_REFRESH_TOKEN'; payload: string | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOGOUT' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken: string } };

type RegistrationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_REGISTRATION'; payload: GSTRegistration | null }
  | { type: 'SET_REGISTRATIONS'; payload: GSTRegistration[] }
  | { type: 'ADD_REGISTRATION'; payload: GSTRegistration }
  | { type: 'UPDATE_REGISTRATION'; payload: GSTRegistration }
  | { type: 'DELETE_REGISTRATION'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<RegistrationState['filters']> }
  | { type: 'CLEAR_FILTERS' };

// ============================================================================
// Initial States
// ============================================================================

const initialAppState: AppState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  notifications: [],
  theme: 'red',
  language: 'en',
};

const initialAuthState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const initialRegistrationState: RegistrationState = {
  currentRegistration: null,
  registrations: [],
  isLoading: false,
  error: null,
  filters: {},
};

// ============================================================================
// Reducers
// ============================================================================

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
    default:
      return state;
  }
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: !!action.payload };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_REFRESH_TOKEN':
      return { ...state, refreshToken: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'LOGOUT':
      return {
        ...initialAuthState,
        isLoading: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    default:
      return state;
  }
};

const registrationReducer = (state: RegistrationState, action: RegistrationAction): RegistrationState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_REGISTRATION':
      return { ...state, currentRegistration: action.payload };
    case 'SET_REGISTRATIONS':
      return { ...state, registrations: action.payload };
    case 'ADD_REGISTRATION':
      return { ...state, registrations: [action.payload, ...state.registrations] };
    case 'UPDATE_REGISTRATION':
      return {
        ...state,
        registrations: state.registrations.map(reg =>
          reg.id === action.payload.id ? action.payload : reg
        ),
        currentRegistration: state.currentRegistration?.id === action.payload.id 
          ? action.payload 
          : state.currentRegistration,
      };
    case 'DELETE_REGISTRATION':
      return {
        ...state,
        registrations: state.registrations.filter(reg => reg.id !== action.payload),
        currentRegistration: state.currentRegistration?.id === action.payload 
          ? null 
          : state.currentRegistration,
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_FILTERS':
      return { ...state, filters: {} };
    default:
      return state;
  }
};

// ============================================================================
// Context Types
// ============================================================================

interface AppContextType {
  // App State
  appState: AppState;
  setLoading: (loading: boolean) => void;
  setTheme: (theme: string) => void;
  setLanguage: (language: string) => void;

  // Auth State
  authState: AuthState;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: any) => Promise<boolean>;
  refreshAuth: () => Promise<boolean>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;

  // Registration State
  registrationState: RegistrationState;
  createRegistration: (data: any) => Promise<boolean>;
  updateRegistration: (id: string, data: any) => Promise<boolean>;
  deleteRegistration: (id: string) => Promise<boolean>;
  submitRegistration: (id: string) => Promise<boolean>;
  fetchRegistrations: () => Promise<void>;
  fetchRegistration: (id: string) => Promise<void>;
  setFilters: (filters: Partial<RegistrationState['filters']>) => void;
  clearFilters: () => void;

  // Notifications
  addNotification: (notification: any) => string;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

// ============================================================================
// Context Creation
// ============================================================================

const AppContext = createContext<AppContextType | undefined>(undefined);

// ============================================================================
// Provider Component
// ============================================================================

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [appState, appDispatch] = useReducer(appReducer, initialAppState);
  const [authState, authDispatch] = useReducer(authReducer, initialAuthState);
  const [registrationState, registrationDispatch] = useReducer(registrationReducer, initialRegistrationState);

  // ============================================================================
  // Initialize App
  // ============================================================================

  useEffect(() => {
    // Load saved auth state from localStorage
    const savedToken = localStorage.getItem('auth_token');
    const savedRefreshToken = localStorage.getItem('refresh_token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthToken(savedToken);
        setAuthRefreshToken(savedRefreshToken);
        
        authDispatch({ type: 'SET_USER', payload: user });
        authDispatch({ type: 'SET_TOKEN', payload: savedToken });
        authDispatch({ type: 'SET_REFRESH_TOKEN', payload: savedRefreshToken });
        authDispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: savedToken, refreshToken: savedRefreshToken || '' } });
      } catch (error) {
        console.error('Failed to load saved auth state:', error);
        clearAuthTokens();
      }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      appDispatch({ type: 'SET_THEME', payload: savedTheme });
    }

    // Load saved language
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      appDispatch({ type: 'SET_LANGUAGE', payload: savedLanguage });
    }
  }, []);

  // ============================================================================
  // App Actions
  // ============================================================================

  const setLoading = (loading: boolean) => {
    appDispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setTheme = (theme: string) => {
    appDispatch({ type: 'SET_THEME', payload: theme });
    localStorage.setItem('theme', theme);
  };

  const setLanguage = (language: string) => {
    appDispatch({ type: 'SET_LANGUAGE', payload: language });
    localStorage.setItem('language', language);
  };

  // ============================================================================
  // Auth Actions
  // ============================================================================

  const login = async (email: string, password: string): Promise<boolean> => {
    authDispatch({ type: 'SET_LOADING', payload: true });
    authDispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiClient.post('/auth/login', { email, password });
      
      if (response.success && response.data) {
        const { user, token, refreshToken } = response.data;
        
        // Save to localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Set tokens in API client
        setAuthToken(token);
        setAuthRefreshToken(refreshToken);
        
        // Update state
        authDispatch({ type: 'LOGIN_SUCCESS', payload: { user, token, refreshToken } });
        
        notificationManager.success('Login Successful', 'Welcome back!');
        return true;
      } else {
        authDispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Login failed' });
        notificationManager.handleApiError(response, 'Login');
        return false;
      }
    } catch (error) {
      authDispatch({ type: 'SET_ERROR', payload: 'Login failed' });
      notificationManager.handleApiError(error, 'Login');
      return false;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Clear API client tokens
    clearAuthTokens();
    
    // Update state
    authDispatch({ type: 'LOGOUT' });
    registrationDispatch({ type: 'SET_CURRENT_REGISTRATION', payload: null });
    registrationDispatch({ type: 'SET_REGISTRATIONS', payload: [] });
    
    notificationManager.info('Logged Out', 'You have been logged out successfully');
  };

  const register = async (userData: any): Promise<boolean> => {
    authDispatch({ type: 'SET_LOADING', payload: true });
    authDispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiClient.post('/auth/register', userData);
      
      if (response.success) {
        notificationManager.success('Registration Successful', 'Please check your email to verify your account');
        return true;
      } else {
        authDispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Registration failed' });
        notificationManager.handleApiError(response, 'Registration');
        return false;
      }
    } catch (error) {
      authDispatch({ type: 'SET_ERROR', payload: 'Registration failed' });
      notificationManager.handleApiError(error, 'Registration');
      return false;
    }
  };

  const refreshAuth = async (): Promise<boolean> => {
    if (!authState.refreshToken) return false;

    try {
      const response = await apiClient.post('/auth/refresh', {
        refreshToken: authState.refreshToken,
      });
      
      if (response.success && response.data) {
        const { token, refreshToken } = response.data;
        
        // Save to localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);
        
        // Set tokens in API client
        setAuthToken(token);
        setAuthRefreshToken(refreshToken);
        
        // Update state
        authDispatch({ type: 'SET_TOKEN', payload: token });
        authDispatch({ type: 'SET_REFRESH_TOKEN', payload: refreshToken });
        
        return true;
      } else {
        logout();
        return false;
      }
    } catch (error) {
      logout();
      return false;
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    authDispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await apiClient.put('/auth/profile', userData);
      
      if (response.success && response.data) {
        const updatedUser = response.data;
        
        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update state
        authDispatch({ type: 'SET_USER', payload: updatedUser });
        
        notificationManager.success('Profile Updated', 'Your profile has been updated successfully');
        return true;
      } else {
        notificationManager.handleApiError(response, 'Profile Update');
        return false;
      }
    } catch (error) {
      notificationManager.handleApiError(error, 'Profile Update');
      return false;
    }
  };

  // ============================================================================
  // Registration Actions
  // ============================================================================

  const createRegistration = async (data: any): Promise<boolean> => {
    registrationDispatch({ type: 'SET_LOADING', payload: true });
    registrationDispatch({ type: 'SET_ERROR', payload: null });

    try {
      const response = await apiClient.post('/registrations', data);
      
      if (response.success && response.data) {
        registrationDispatch({ type: 'ADD_REGISTRATION', payload: response.data });
        notificationManager.success('Registration Created', 'Your registration has been created successfully');
        return true;
      } else {
        registrationDispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Failed to create registration' });
        notificationManager.handleApiError(response, 'Create Registration');
        return false;
      }
    } catch (error) {
      registrationDispatch({ type: 'SET_ERROR', payload: 'Failed to create registration' });
      notificationManager.handleApiError(error, 'Create Registration');
      return false;
    }
  };

  const updateRegistration = async (id: string, data: any): Promise<boolean> => {
    registrationDispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await apiClient.put(`/registrations/${id}`, data);
      
      if (response.success && response.data) {
        registrationDispatch({ type: 'UPDATE_REGISTRATION', payload: response.data });
        notificationManager.success('Registration Updated', 'Your registration has been updated successfully');
        return true;
      } else {
        notificationManager.handleApiError(response, 'Update Registration');
        return false;
      }
    } catch (error) {
      notificationManager.handleApiError(error, 'Update Registration');
      return false;
    }
  };

  const deleteRegistration = async (id: string): Promise<boolean> => {
    registrationDispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await apiClient.delete(`/registrations/${id}`);
      
      if (response.success) {
        registrationDispatch({ type: 'DELETE_REGISTRATION', payload: id });
        notificationManager.success('Registration Deleted', 'Your registration has been deleted successfully');
        return true;
      } else {
        notificationManager.handleApiError(response, 'Delete Registration');
        return false;
      }
    } catch (error) {
      notificationManager.handleApiError(error, 'Delete Registration');
      return false;
    }
  };

  const submitRegistration = async (id: string): Promise<boolean> => {
    registrationDispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await apiClient.post(`/registrations/${id}/submit`);
      
      if (response.success && response.data) {
        registrationDispatch({ type: 'UPDATE_REGISTRATION', payload: response.data });
        notificationManager.success('Registration Submitted', 'Your registration has been submitted for review');
        return true;
      } else {
        notificationManager.handleApiError(response, 'Submit Registration');
        return false;
      }
    } catch (error) {
      notificationManager.handleApiError(error, 'Submit Registration');
      return false;
    }
  };

  const fetchRegistrations = async (): Promise<void> => {
    registrationDispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await apiClient.get('/registrations');
      
      if (response.success && response.data) {
        registrationDispatch({ type: 'SET_REGISTRATIONS', payload: response.data });
      } else {
        registrationDispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Failed to fetch registrations' });
        notificationManager.handleApiError(response, 'Fetch Registrations');
      }
    } catch (error) {
      registrationDispatch({ type: 'SET_ERROR', payload: 'Failed to fetch registrations' });
      notificationManager.handleApiError(error, 'Fetch Registrations');
    }
  };

  const fetchRegistration = async (id: string): Promise<void> => {
    registrationDispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await apiClient.get(`/registrations/${id}`);
      
      if (response.success && response.data) {
        registrationDispatch({ type: 'SET_CURRENT_REGISTRATION', payload: response.data });
      } else {
        registrationDispatch({ type: 'SET_ERROR', payload: response.error?.message || 'Failed to fetch registration' });
        notificationManager.handleApiError(response, 'Fetch Registration');
      }
    } catch (error) {
      registrationDispatch({ type: 'SET_ERROR', payload: 'Failed to fetch registration' });
      notificationManager.handleApiError(error, 'Fetch Registration');
    }
  };

  const setFilters = (filters: Partial<RegistrationState['filters']>) => {
    registrationDispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearFilters = () => {
    registrationDispatch({ type: 'CLEAR_FILTERS' });
  };

  // ============================================================================
  // Notification Actions
  // ============================================================================

  const addNotification = (notification: any): string => {
    return notificationManager.addNotification(notification);
  };

  const removeNotification = (id: string): void => {
    notificationManager.removeNotification(id);
  };

  const clearNotifications = (): void => {
    notificationManager.clearAllNotifications();
  };

  // ============================================================================
  // Context Value
  // ============================================================================

  const contextValue: AppContextType = {
    // App State
    appState,
    setLoading,
    setTheme,
    setLanguage,

    // Auth State
    authState,
    login,
    logout,
    register,
    refreshAuth,
    updateProfile,

    // Registration State
    registrationState,
    createRegistration,
    updateRegistration,
    deleteRegistration,
    submitRegistration,
    fetchRegistrations,
    fetchRegistration,
    setFilters,
    clearFilters,

    // Notifications
    addNotification,
    removeNotification,
    clearNotifications,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// ============================================================================
// Custom Hooks
// ============================================================================

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const useAuth = () => {
  const { authState, login, logout, register, refreshAuth, updateProfile } = useApp();
  return {
    ...authState,
    login,
    logout,
    register,
    refreshAuth,
    updateProfile,
  };
};

export const useRegistrations = () => {
  const { 
    registrationState, 
    createRegistration, 
    updateRegistration, 
    deleteRegistration, 
    submitRegistration, 
    fetchRegistrations, 
    fetchRegistration,
    setFilters,
    clearFilters 
  } = useApp();
  
  return {
    ...registrationState,
    createRegistration,
    updateRegistration,
    deleteRegistration,
    submitRegistration,
    fetchRegistrations,
    fetchRegistration,
    setFilters,
    clearFilters,
  };
};

export const useNotifications = () => {
  const { addNotification, removeNotification, clearNotifications } = useApp();
  return {
    addNotification,
    removeNotification,
    clearNotifications,
  };
};

export default AppContext;

