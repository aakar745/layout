'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore, initializeAuth } from '@/store/authStore';
import { getLayoutSocket } from '@/lib/socket/layoutSocket';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ForgotPasswordModal from './ForgotPasswordModal';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuthStatus, isAuthenticated, token } = useAuthStore();
  const initializeRef = useRef(false);
  const lastAuthState = useRef<{isAuthenticated: boolean; token: string | null}>({
    isAuthenticated: false,
    token: null
  });

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
    initializeRef.current = true;
    
    // Optional: Validate token on app load
    const validateStoredToken = async () => {
      const state = useAuthStore.getState();
      if (state.token && state.exhibitor) {
        // You can add token validation here if needed
        // For now, we trust the stored token
        console.log('Auth restored from localStorage');
      }
    };

    validateStoredToken();
  }, []);

  // Update socket authentication when auth state actually changes (not during init)
  useEffect(() => {
    if (typeof window !== 'undefined' && initializeRef.current) {
      // Check if auth state actually changed
      const hasChanged = 
        lastAuthState.current.isAuthenticated !== isAuthenticated ||
        lastAuthState.current.token !== token;
      
      if (hasChanged) {
        console.log('Updating socket authentication due to auth state change');
        const socket = getLayoutSocket();
        if (socket) {
          socket.updateAuthentication();
        }
        
        // Update last auth state
        lastAuthState.current = { isAuthenticated, token };
      }
    }
  }, [isAuthenticated, token]);

  return (
    <>
      {children}
      
      {/* Global Auth Modals */}
      <LoginModal />
      <RegisterModal />
      <ForgotPasswordModal />
    </>
  );
}
