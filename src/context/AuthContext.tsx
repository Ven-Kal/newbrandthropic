
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import {
  UserProfile,
  fetchUserProfile,
  login as authLogin,
  register as authRegister,
  sendOTP as authSendOTP,
  loginWithOTP as authLoginWithOTP,
  logout as authLogout,
  resetPassword as authResetPassword,
  updatePassword as authUpdatePassword,
  signInWithGoogle as authSignInWithGoogle,
} from "@/lib/auth";

// Define the context interface
interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signInWithGoogle: () => Promise<boolean>;
  sendOTP: (email: string, forRegistration?: boolean) => Promise<boolean>;
  loginWithOTP: (email: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider implementation
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener on mount and check for existing session
  useEffect(() => {
    console.log("Setting up auth state listener");
    
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, !!currentSession);
        setSession(currentSession);

        if (currentSession?.user) {
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(async () => {
            try {
              const profile = await fetchUserProfile(currentSession.user.id);
              console.log("Fetched user profile:", profile);
              if (profile) {
                setUser(profile);
              } else {
                console.warn("User authenticated but profile not found");
                // If no profile exists, create one
                const { error } = await supabase
                  .from("users")
                  .insert({
                    user_id: currentSession.user.id,
                    name: currentSession.user.user_metadata?.name || currentSession.user.user_metadata?.full_name || currentSession.user.email?.split('@')[0] || 'User',
                    email: currentSession.user.email || '',
                    role: "consumer",
                    is_verified: true,
                  });
                
                if (!error) {
                  // Fetch the newly created profile
                  const newProfile = await fetchUserProfile(currentSession.user.id);
                  if (newProfile) {
                    setUser(newProfile);
                  }
                }
              }
              setIsLoading(false);
            } catch (error) {
              console.error("Error fetching user profile:", error);
              setIsLoading(false);
            }
          }, 100);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for an existing session
    const initializeAuth = async () => {
      try {
        console.log("Checking for existing session");
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        console.log("Existing session:", !!currentSession);
        setSession(currentSession);

        if (currentSession?.user) {
          try {
            const profile = await fetchUserProfile(currentSession.user.id);
            console.log("Fetched user profile on init:", profile);
            if (profile) {
              setUser(profile);
            } else {
              console.warn("Session exists but profile not found");
            }
          } catch (error) {
            console.error("Error fetching user profile on init:", error);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Wrap auth functions without additional loading state management
  const login = async (email: string, password: string): Promise<boolean> => {
    return await authLogin(email, password);
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    return await authSignInWithGoogle();
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    return await authRegister(name, email, password);
  };

  const sendOTP = async (email: string, forRegistration = false): Promise<boolean> => {
    return await authSendOTP(email, forRegistration);
  };

  const loginWithOTP = async (email: string, otp: string): Promise<boolean> => {
    return await authLoginWithOTP(email, otp);
  };
  
  const updatePassword = async (newPassword: string): Promise<boolean> => {
    return await authUpdatePassword(newPassword);
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    return await authResetPassword(email);
  };

  const logout = async (): Promise<void> => {
    await authLogout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user && !!session,
        isLoading,
        login,
        signInWithGoogle,
        register,
        sendOTP,
        loginWithOTP,
        logout,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume context
export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
