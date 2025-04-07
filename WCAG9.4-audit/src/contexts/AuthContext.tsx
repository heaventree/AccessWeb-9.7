import React, { createContext, useReducer, useEffect } from 'react';
import { 
  getCurrentUser, 
  login as loginApi, 
  logout as logoutApi, 
  register as registerApi,
  verifyEmail as verifyEmailApi,
  createPasswordResetToken as createPasswordResetTokenApi,
  resetPassword as resetPasswordApi,
  saveToken
} from '../utils/auth';
import { User, AuthError, RegisterParams } from '../types/auth';

// Define the Auth Context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: AuthError }>;
  register: (params: RegisterParams) => Promise<{ success: boolean; verificationToken?: string; error?: AuthError }>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<boolean>;
  createPasswordResetToken: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  isDevelopmentMode: boolean;
}

// Define actions for our reducer
type AuthAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_USER' }
  | { type: 'SET_LOADING'; payload: boolean };

// Define our Auth State
interface AuthState {
  user: User | null;
  loading: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  loading: true
};

// Reducer function
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const isDevelopmentMode = process.env.NODE_ENV === 'development';

  // Check if user is authenticated on initial load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await getCurrentUser();
        if (user) {
          dispatch({ type: 'SET_USER', payload: user });
        } else {
          dispatch({ type: 'CLEAR_USER' });
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error);
        dispatch({ type: 'CLEAR_USER' });
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await loginApi(email, password);
      saveToken(response.token);
      dispatch({ type: 'SET_USER', payload: response.user });
      return { success: true };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      let authError: AuthError;
      
      if (error instanceof Error) {
        authError = error.message as AuthError;
      } else {
        authError = 'server-error';
      }
      
      return { 
        success: false, 
        error: authError
      };
    }
  };

  // Register function
  const register = async (params: RegisterParams) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const response = await registerApi(params);
      dispatch({ type: 'SET_LOADING', payload: false });
      return { 
        success: true,
        verificationToken: response.verificationToken
      };
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      let authError: AuthError;
      
      if (error instanceof Error) {
        authError = error.message as AuthError;
      } else {
        authError = 'server-error';
      }
      
      return { 
        success: false, 
        error: authError
      };
    }
  };

  // Logout function
  const logout = () => {
    logoutApi();
    dispatch({ type: 'CLEAR_USER' });
  };

  // Verify email function
  const verifyEmail = async (token: string) => {
    try {
      await verifyEmailApi(token);
      return true;
    } catch (error) {
      console.error('Failed to verify email:', error);
      return false;
    }
  };

  // Create password reset token function
  const createPasswordResetToken = async (email: string) => {
    try {
      await createPasswordResetTokenApi(email);
      return true;
    } catch (error) {
      console.error('Failed to create password reset token:', error);
      return false;
    }
  };

  // Reset password function
  const resetPassword = async (token: string, newPassword: string) => {
    try {
      await resetPasswordApi(token, newPassword);
      return true;
    } catch (error) {
      console.error('Failed to reset password:', error);
      return false;
    }
  };

  // Context value
  const value = {
    isAuthenticated: !!state.user,
    user: state.user,
    loading: state.loading,
    login,
    register,
    logout,
    verifyEmail,
    createPasswordResetToken,
    resetPassword,
    isDevelopmentMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};