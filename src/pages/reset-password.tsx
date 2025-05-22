
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

export default function ResetPasswordPage() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isProcessingToken, setIsProcessingToken] = useState(true);

  // Check for password reset token in URL when component mounts
  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        // Get hash fragment from URL (for old style links)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        // Get query params from URL (for new style links)
        const queryParams = new URLSearchParams(window.location.search);
        
        // Check if there's a type=recovery param
        const isRecovery = hashParams.get('type') === 'recovery' || queryParams.get('type') === 'recovery';

        if (!isRecovery) {
          setIsProcessingToken(false);
          return;
        }

        // Exchange the token for a session
        const { error } = await supabase.auth.exchangeCodeForSession(
          hashParams.get('access_token') || queryParams.get('code') || ''
        );

        if (error) {
          console.error("Password reset link error:", error);
          toast({
            title: "Invalid or expired link",
            description: "Please request a new password reset link",
            variant: "destructive",
          });
          setError("This password reset link is invalid or has expired. Please request a new one.");
        }
        
        setIsProcessingToken(false);
      } catch (err) {
        console.error("Error processing reset token:", err);
        setError("An error occurred. Please try again or request a new password reset link.");
        setIsProcessingToken(false);
      }
    };

    handlePasswordReset();
  }, []);

  const validatePassword = (pass: string) => {
    if (pass.length < 6) {
      return "Password must be at least 6 characters";
    }
    
    // Check if password is either all numeric or all alphabetic
    const isNumeric = /^\d+$/.test(pass);
    const isAlphabetic = /^[a-zA-Z]+$/.test(pass);
    
    if (!isNumeric && !isAlphabetic) {
      return "Password must be either all numeric or all alphabetic";
    }
    
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate passwords
    if (!password || !confirmPassword) {
      setError("Please enter both password fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await updatePassword(password);
      
      if (success) {
        toast({
          title: "Password updated",
          description: "Your password has been reset successfully. You can now log in with your new password.",
        });
        navigate("/login");
      } else {
        setError("Failed to update password. Please try again.");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isProcessingToken) {
    return (
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Processing Reset Link</CardTitle>
            <CardDescription>
              Please wait while we verify your password reset link...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleResetPassword}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                New Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Password must be 6+ characters, either all numeric or all alphabetic
              </p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm New Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate("/login")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
            >
              {isLoading ? "Updating..." : "Reset Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
