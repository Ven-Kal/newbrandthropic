import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { configureAuthRedirects } from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const { login, loginWithOTP, sendOTP, resetPassword, signInWithGoogle, isAuthenticated, isLoading: authLoading, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"password" | "otp">("password");
  
  // Password login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  // OTP login states
  const [otpEmail, setOtpEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  
  // Forgot password states
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // Combined loading state
  const loading = isLoading || authLoading;

  // Configure auth redirects on page load
  useEffect(() => {
    configureAuthRedirects();
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    console.log("Authentication state in login:", isAuthenticated, "User:", user?.name);
    
    if (isAuthenticated) {
      // Check if there's a redirect path stored
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      console.log("Redirect path:", redirectPath);
      
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin'); // Clear it after use
        navigate(redirectPath);
      } else {
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate, user]);

  // Handle tab switching - clear errors
  useEffect(() => {
    setPasswordError("");
    setOtpError("");
  }, [activeTab]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleGoogleSignIn = async () => {
    setPasswordError("");
    setOtpError("");
    setIsGoogleLoading(true);
    
    try {
      console.log("Attempting Google Sign-In");
      const success = await signInWithGoogle();
      if (success) {
        toast({
          title: "Success!",
          description: "Redirecting to Google Sign-In...",
        });
      } else {
        setPasswordError("Google Sign-In failed. Please try again.");
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      setPasswordError("Google Sign-In failed. Please try again.");
      toast({
        title: "Error",
        description: "Google Sign-In failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    
    if (!email || !password) {
      setPasswordError("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting login with email and password");
      const success = await login(email, password);
      
      if (success) {
        console.log("Login successful, navigation should happen via useEffect");
        toast({ 
          title: "Welcome back!", 
          description: "You've successfully signed in." 
        });
      } else {
        setPasswordError("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      setPasswordError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    
    if (!otpEmail) {
      setOtpError("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    // For login, use forRegistration=false (default)
    const success = await sendOTP(otpEmail);
    setIsLoading(false);
    
    if (success) {
      setOtpSent(true);
      setCountdown(30); // Start 30 second countdown for resend
    } else {
      setOtpError("Failed to send OTP. Please check your email and try again.");
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    
    setOtpError("");
    
    if (!otpEmail) {
      setOtpError("Please enter your email address");
      return;
    }
    
    setIsResendingOtp(true);
    // For login, use forRegistration=false (default)
    const success = await sendOTP(otpEmail);
    setIsResendingOtp(false);
    
    if (success) {
      setOtp(""); // Clear the previous OTP input
      setCountdown(30); // Start 30 second countdown for resend
    } else {
      setOtpError("Failed to resend OTP. Please try again.");
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    
    if (!otpEmail || !otp) {
      setOtpError("Please enter both email and OTP");
      return;
    }
    
    setIsLoading(true);
    console.log("Attempting login with OTP");
    const success = await loginWithOTP(otpEmail, otp);
    setIsLoading(false);
    
    if (!success) {
      setOtpError("Invalid or expired OTP. Please try again.");
    }
    // Navigation will be handled by the useEffect when isAuthenticated changes
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    const success = await resetPassword(resetEmail);
    setIsLoading(false);
    
    if (success) {
      setForgotPasswordOpen(false);
      setResetEmail("");
    }
  };

  const isAnyLoading = loading || isGoogleLoading;

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Welcome back! Sign in to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-2">
          {/* Google Sign-In Button */}
          <Button 
            variant="outline" 
            className="w-full hover:bg-gray-50 transition-colors"
            onClick={handleGoogleSignIn}
            disabled={isAnyLoading}
          >
            <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {isGoogleLoading ? "Connecting..." : "Continue with Google"}
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
        </CardContent>
        
        <Tabs 
          defaultValue="password" 
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "password" | "otp")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mx-6">
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="otp">OTP</TabsTrigger>
          </TabsList>
          
          <TabsContent value="password">
            <form onSubmit={handlePasswordLogin}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isAnyLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <Button 
                      type="button" 
                      variant="link" 
                      className="text-xs p-0 h-auto"
                      onClick={() => setForgotPasswordOpen(true)}
                      disabled={isAnyLoading}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isAnyLoading}
                  />
                </div>
                
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isAnyLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
                
                <p className="text-sm text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Register
                  </Link>
                </p>
              </CardFooter>
            </form>
          </TabsContent>
          
          <TabsContent value="otp">
            <form onSubmit={otpSent ? handleOTPLogin : handleSendOTP}>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <label htmlFor="otpEmail" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="otpEmail"
                    type="email"
                    placeholder="example@email.com"
                    value={otpEmail}
                    onChange={(e) => setOtpEmail(e.target.value)}
                    disabled={otpSent && isAnyLoading}
                  />
                </div>
                
                {otpSent && (
                  <div className="space-y-2">
                    <label htmlFor="otp" className="text-sm font-medium">
                      Enter 4-digit OTP
                    </label>
                    <Input
                      id="otp"
                      type="text"
                      maxLength={4}
                      placeholder="1234"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={isAnyLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the 4-digit code sent to your email
                    </p>
                  </div>
                )}
                
                {otpError && (
                  <p className="text-sm text-destructive">{otpError}</p>
                )}
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                {!otpSent ? (
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isAnyLoading}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </Button>
                ) : (
                  <div className="w-full space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isAnyLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={handleResendOTP}
                      disabled={isResendingOtp || countdown > 0}
                    >
                      {isResendingOtp ? "Sending..." : 
                       countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                    </Button>
                  </div>
                )}
                
                <p className="text-sm text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-primary hover:underline">
                    Register
                  </Link>
                </p>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleForgotPassword}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="resetEmail" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="resetEmail"
                  type="email"
                  placeholder="example@email.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setForgotPasswordOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isAnyLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
