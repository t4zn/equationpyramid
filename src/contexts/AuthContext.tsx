
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, User } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  authState: AuthState;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const initialState: AuthState = {
  user: null,
  loading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          const user: User = {
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata?.username
          };
          
          setAuthState({
            user,
            loading: false,
            error: null
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null
          });
        }
      }
    );
    
    // THEN check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const user: User = {
            id: session.user.id,
            email: session.user.email,
            username: session.user.user_metadata?.username
          };
          
          setAuthState({
            user,
            loading: false,
            error: null
          });
        } else {
          setAuthState({
            user: null,
            loading: false,
            error: null
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setAuthState({
          user: null,
          loading: false,
          error: 'Failed to check authentication status'
        });
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
      
    } catch (error: any) {
      console.error('Error signing up:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Failed to sign up' 
      }));
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in",
      });
      
    } catch (error: any) {
      console.error('Error signing in:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Failed to sign in' 
      }));
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out",
      });
      
    } catch (error: any) {
      console.error('Error signing out:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Failed to sign out' 
      }));
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const value = {
    authState,
    signUp,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
