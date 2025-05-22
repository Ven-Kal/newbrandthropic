
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

export default function LoginPage() {
  const { login, loginWithOTP, sendOTP, resetPassword, isAuthenticated, isLoading: authLoading, user } = useAuth();
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

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>
            Welcome back! Sign in to access your account
          </CardDescription>
        </CardHeader>
        
        <Tabs 
          defaultValue="password" 
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "password" | "otp")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
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
                    disabled={loading}
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
                      disabled={loading}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
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
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
                
                <p className="text-sm text-center text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-brandblue-600 hover:underline">
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
                    disabled={otpSent && loading}
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
                      disabled={loading}
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
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </Button>
                ) : (
                  <div className="w-full space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Verify OTP"}
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
                  <Link to="/register" className="text-brandblue-600 hover:underline">
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
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
