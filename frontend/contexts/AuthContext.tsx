import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthState, AuthData } from '@/types';
import { AuthService } from '@/services/authService';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';

interface AuthContextType extends Omit<AuthState, 'user'> {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
  // updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        if (token) {
          const user = await AuthService.getCurrentUser(token);
          setAuthState({ token, user, isAuthenticated: true, isLoading: false });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (e) {
        console.error('Failed to load token', e);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadToken();
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const { token } = await AuthService.login(email, password);
      const user = await AuthService.getCurrentUser(token);
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      setAuthState({ token, user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error('Sign in failed', error);
      setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: false, user: null, token: null }));
      throw error;
    }
  };

  const signUp = async (fullName: string, email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      await AuthService.register(fullName, email, password);
      // After successful registration, log the user in
      await signIn(email, password);
    } catch (error) {
      console.error('Sign up failed', error);
      setAuthState(prev => ({ ...prev, isLoading: false, isAuthenticated: false, user: null, token: null }));
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (e) {
      console.error('Sign out failed', e);
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      signIn,
      signUp,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
