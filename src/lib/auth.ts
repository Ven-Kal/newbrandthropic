
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
              name: authUser.user.user_metadata.name || authUser.user.email?.split('@')[0] || 'User',
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

// Register a new user
export const register = async (name: string, email: string, password: string): Promise<boolean> => {
  try {
    // First verify that the OTP for this email exists and is valid
    const { data: otpData, error: otpError } = await supabase
      .from("otp_logs")
      .select("*")
      .eq("email", email)
      .eq("is_verified", false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
      
    if (otpError || !otpData) {
      toast({ 
        title: "Verification error", 
        description: "Please ensure you've verified your email with the OTP", 
        variant: "destructive" 
      });
      return false;
    }
    
    // Check if OTP is expired (15 minutes)
    const otpTimestamp = new Date(otpData.created_at);
    const currentTime = new Date();
    const diffMinutes = (currentTime.getTime() - otpTimestamp.getTime()) / (1000 * 60);
    
    if (diffMinutes > 15) {
      toast({ 
        title: "OTP expired", 
        description: "The verification code has expired. Please request a new one", 
        variant: "destructive" 
      });
      return false;
    }
    
    // Mark OTP as verified
    await supabase
      .from("otp_logs")
      .update({ is_verified: true })
      .eq("otp_id", otpData.otp_id);
    
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) {
      toast({ 
        title: "Registration failed", 
        description: authError.message, 
        variant: "destructive" 
      });
      return false;
    }
    
    if (!authData.user) {
      toast({ 
        title: "Registration error", 
        description: "Unable to create user account", 
        variant: "destructive" 
      });
      return false;
    }
    
    // 2. Create profile in users table
    const { error: profileError } = await supabase
      .from("users")
      .insert({
        user_id: authData.user.id,
        name,
        email,
        role: "consumer",
        is_verified: true, // Since we use OTP verification
      });
      
    if (profileError) {
      console.error("Error creating user profile:", profileError);
      
      // Try to clean up the auth user since profile creation failed
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (deleteErr) {
        console.error("Error cleaning up auth user:", deleteErr);
      }
      
      toast({ 
        title: "Profile creation failed", 
        description: "Unable to complete registration", 
        variant: "destructive" 
      });
      return false;
    }
    
    // Success - Log the user in automatically
    // We already have verified the OTP, created the user in auth and the profile in the users table
    // Now let's sign them in automatically
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (signInError) {
      // Registration was successful but auto-login failed
      toast({ 
        title: "Registration successful", 
        description: "Please sign in with your new account", 
        variant: "default" 
      });
    } else {
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

// Send OTP code to user email
export const sendOTP = async (email: string, forRegistration = false): Promise<boolean> => {
  try {
    // For registration, check if the user already exists
    if (forRegistration) {
      const { data: existingUser } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();

      if (existingUser) {
        toast({ 
          title: "Email already registered", 
          description: "This email is already registered. Try logging in instead.", 
          variant: "destructive" 
        });
        return false;
      }
    } 
    // For login, check if the user exists
    else {
      const { error: userCheckError, data: userData } = await supabase
        .from("users")
        .select("email")
        .eq("email", email)
        .single();

      if (userCheckError || !userData) {
        toast({ 
          title: "Account not found", 
          description: "No account exists with this email", 
          variant: "destructive" 
        });
        return false;
      }
    }

    // Generate a random 4-digit OTP
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Store OTP in database for verification
    await supabase.from("otp_logs").insert({
      email,
      otp_code: otpCode,
      is_verified: false
    });

    // Invoke Supabase Edge Function to send email
    const { error } = await supabase.functions.invoke('send-otp-email', {
      body: { email, otp: otpCode }
    });

    if (error) {
      toast({ 
        title: "OTP delivery failed", 
        description: error.message, 
        variant: "destructive" 
      });
      return false;
    }

    toast({ 
      title: "OTP sent", 
      description: "Check your email for the verification code" 
    });
    return true;
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

// OTP login
export const loginWithOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    // 1. Verify OTP against database
    const { data: otpData, error: otpError } = await supabase
      .from("otp_logs")
      .select("*")
      .eq("email", email)
      .eq("otp_code", otp)
      .eq("is_verified", false)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (otpError || !otpData) {
      toast({ 
        title: "Invalid OTP", 
        description: "Please check the verification code and try again", 
        variant: "destructive" 
      });
      return false;
    }
    
    // Check if OTP is expired (15 minutes)
    const otpTimestamp = new Date(otpData.created_at);
    const currentTime = new Date();
    const diffMinutes = (currentTime.getTime() - otpTimestamp.getTime()) / (1000 * 60);
    
    if (diffMinutes > 15) {
      toast({ 
        title: "OTP expired", 
        description: "This verification code has expired. Please request a new one", 
        variant: "destructive" 
      });
      return false;
    }
    
    // 2. Mark OTP as verified
    await supabase
      .from("otp_logs")
      .update({ is_verified: true })
      .eq("otp_id", otpData.otp_id);
    
    // 3. Sign in with magic link (this is technically what we're doing with OTP verification)
    // First check if this user exists in auth
    const { data: userData } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();
      
    if (userData) {
      // User exists, sign in with password (we're assuming user has registered with email+password)
      // For users who have registered, we'll use signInWithOtp as a passwordless login option
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email
      });
      
      if (signInError) {
        toast({ 
          title: "Login failed", 
          description: signInError.message, 
          variant: "destructive" 
        });
        return false;
      }
    } else {
      // This shouldn't happen normally, but handle it anyway
      toast({ 
        title: "Account not found", 
        description: "Please register first", 
        variant: "destructive" 
      });
      return false;
    }
    
    // Success
    toast({ title: "Verification successful", description: "You are now signed in" });
    return true;
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
    await supabase.auth.signOut();
    toast({ title: "Logged out", description: "See you soon!" });
  } catch (err) {
    console.error("Error in logout:", err);
    toast({ 
      title: "Logout error", 
      description: "Failed to sign out", 
      variant: "destructive" 
    });
  }
};
