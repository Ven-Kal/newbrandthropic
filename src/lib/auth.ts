
import { supabase } from "./supabase";
import { toast } from "@/components/ui/use-toast";

// Define UserProfile type
export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  role: "consumer" | "admin";
}

// Fetch user profile from users table
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    console.log("Fetching user profile for:", userId);
    
    // Add a small delay to avoid potential race conditions
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const { data, error } = await supabase
      .from("users")
      .select("user_id, name, email, role")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    console.log("User profile data:", data);
    
    if (!data) {
      // If no profile exists yet, try to create one from auth data
      const { data: authUser } = await supabase.auth.getUser();
      if (authUser?.user) {
        try {
          // Create a new profile entry
          const { data: newProfile, error: insertError } = await supabase
            .from("users")
            .insert({
              user_id: userId,
              name: authUser.user.user_metadata.name || authUser.user.user_metadata.full_name || authUser.user.email?.split('@')[0] || 'User',
              email: authUser.user.email || '',
              role: "consumer",
              is_verified: true
            })
            .select()
            .single();
          
          if (insertError) {
            console.error("Error creating user profile:", insertError);
            return null;
          }
          
          console.log("Created new user profile:", newProfile);
          return newProfile as UserProfile;
        } catch (createError) {
          console.error("Failed to create profile:", createError);
          return null;
        }
      }
    }
    
    return data as UserProfile;
  } catch (err) {
    console.error("Unexpected error in fetchUserProfile:", err);
    return null;
  }
};

// Google Sign-In
export const signInWithGoogle = async (): Promise<boolean> => {
  try {
    console.log("Starting Google Sign-In");
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) {
      console.error("Google Sign-In error:", error);
      toast({ 
        title: "Google Sign-In failed", 
        description: error.message, 
        variant: "destructive" 
      });
      return false;
    }
    
    // The redirect will handle the rest
    return true;
  } catch (err) {
    console.error("Unexpected error in Google Sign-In:", err);
    toast({ 
      title: "Google Sign-In error", 
      description: "An unexpected error occurred", 
      variant: "destructive" 
    });
    return false;
  }
};

// Email + password login
export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log("Login attempt for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error("Login error:", error);
      toast({ 
        title: "Login failed", 
        description: error.message, 
        variant: "destructive" 
      });
      return false;
    }
    
    console.log("Login successful for:", email);
    toast({ title: "Login successful", description: "Welcome back!" });
    return true;
  } catch (err) {
    console.error("Unexpected error in login:", err);
    toast({ 
      title: "Login error", 
      description: "An unexpected error occurred", 
      variant: "destructive" 
    });
    return false;
  }
};

// Register a new user using OTP-based authentication
export const register = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    console.log("Starting registration for:", email);
    
    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      toast({ 
        title: "Email already in use", 
        description: "This email is already registered. Try logging in instead.", 
        variant: "destructive" 
      });
      return false;
    }

    // Use Supabase's built-in OTP signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
      }
    });
    
    if (error) {
      console.error("Registration error:", error);
      if (error.message.includes('already registered')) {
        toast({ 
          title: "Email already in use", 
          description: "This email is already registered. Try logging in instead.", 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Registration failed", 
          description: error.message, 
          variant: "destructive" 
        });
      }
      return false;
    }
    
    if (!data.user) {
      toast({ 
        title: "Registration error", 
        description: "Unable to create user account", 
        variant: "destructive" 
      });
      return false;
    }
    
    // If email confirmation is disabled, the user will be automatically signed in
    // If email confirmation is enabled, user needs to check their email
    if (data.user && !data.session) {
      toast({ 
        title: "Check your email", 
        description: "Please check your email for a confirmation link to complete registration", 
        variant: "default" 
      });
    } else {
      // User is automatically signed in, create profile
      const { error: profileError } = await supabase
        .from("users")
        .insert({
          user_id: data.user.id,
          name,
          email,
          role: "consumer",
          is_verified: true,
        });
        
      if (profileError) {
        console.error("Error creating user profile:", profileError);
      }
      
      toast({ 
        title: "Registration successful", 
        description: "Welcome to Brandthropic!", 
        variant: "default"
      });
    }
    
    return true;
  } catch (err) {
    console.error("Unexpected error in register:", err);
    toast({ 
      title: "Registration error", 
      description: "An unexpected error occurred", 
      variant: "destructive" 
    });
    return false;
  }
};

// Send OTP code to user email using Supabase's built-in OTP
export const sendOTP = async (email: string, forRegistration = false): Promise<boolean> => {
  try {
    console.log("Sending OTP for:", email, "Registration:", forRegistration);
    
    if (forRegistration) {
      // For registration, just return true as we'll handle it in the register function
      return true;
    } else {
      // For login, send OTP
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });

      if (error) {
        console.error("OTP send error:", error);
        toast({ 
          title: "OTP delivery failed", 
          description: error.message, 
          variant: "destructive" 
        });
        return false;
      }

      toast({ 
        title: "OTP sent", 
        description: "Check your email for the login code" 
      });
      return true;
    }
  } catch (err) {
    console.error("Error sending OTP:", err);
    toast({ 
      title: "OTP error", 
      description: "Failed to send verification code", 
      variant: "destructive" 
    });
    return false;
  }
};

// OTP login using Supabase's built-in verification
export const loginWithOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    console.log("Verifying OTP for:", email);
    
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    });

    if (error) {
      console.error("OTP verification error:", error);
      toast({ 
        title: "Invalid OTP", 
        description: "Please check the verification code and try again", 
        variant: "destructive" 
      });
      return false;
    }
    
    if (data.user) {
      // Check if user profile exists, create if not
      const profile = await fetchUserProfile(data.user.id);
      if (!profile) {
        const { error: profileError } = await supabase
          .from("users")
          .insert({
            user_id: data.user.id,
            name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
            email: data.user.email || '',
            role: "consumer",
            is_verified: true,
          });
          
        if (profileError) {
          console.error("Error creating user profile:", profileError);
        }
      }
      
      toast({ title: "Login successful", description: "Welcome back!" });
      return true;
    }
    
    return false;
  } catch (err) {
    console.error("Error in OTP login:", err);
    toast({ 
      title: "Login error", 
      description: "An unexpected error occurred", 
      variant: "destructive" 
    });
    return false;
  }
};

// Update password
export const updatePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      toast({ 
        title: "Password update failed", 
        description: error.message, 
        variant: "destructive" 
      });
      return false;
    }

    toast({ title: "Password updated", description: "Your password has been changed successfully" });
    return true;
  } catch (err) {
    console.error("Error updating password:", err);
    toast({ 
      title: "Password update error", 
      description: "An unexpected error occurred", 
      variant: "destructive" 
    });
    return false;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    
    if (error) {
      toast({ 
        title: "Password reset failed", 
        description: error.message, 
        variant: "destructive" 
      });
      return false;
    }
    
    toast({ 
      title: "Reset link sent", 
      description: "Check your email for the password reset link" 
    });
    return true;
  } catch (err) {
    console.error("Error in resetPassword:", err);
    toast({ 
      title: "Reset error", 
      description: "Failed to send reset link", 
      variant: "destructive" 
    });
    return false;
  }
};

// Sign out
export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      toast({ 
        title: "Logout error", 
        description: "Failed to sign out", 
        variant: "destructive" 
      });
    } else {
      toast({ title: "Logged out", description: "See you soon!" });
    }
  } catch (err) {
    console.error("Error in logout:", err);
    toast({ 
      title: "Logout error", 
      description: "Failed to sign out", 
      variant: "destructive" 
    });
  }
};
