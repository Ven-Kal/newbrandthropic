
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import RegisterForm from "@/components/auth/RegisterForm";
import OtpVerificationForm from "@/components/auth/OtpVerificationForm";
import { usePasswordValidation } from "@/hooks/usePasswordValidation";

export default function RegisterPage() {
  const { register, sendOTP } = useAuth();
  const navigate = useNavigate();
  const { validatePassword } = usePasswordValidation();
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  // UI states
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStepOne = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
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
    
    // Send OTP with forRegistration=true
    setIsLoading(true);
    try {
      const success = await sendOTP(email, true);
      
      if (success) {
        setStep(2);
        toast({
          title: "Verification code sent",
          description: `A verification code has been sent to ${email}`,
        });
      } else {
        setError("Failed to send verification code. Please try again.");
      }
    } catch (err) {
      console.error("OTP error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!otp) {
      setError("Please enter the verification code");
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await register(name, email, password);
      
      if (success) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully",
        });
        navigate("/");
      } else {
        setError("Registration failed. Email may already be in use.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>
            Join Brandthropic to share your experiences with brands
          </CardDescription>
        </CardHeader>
        
        {step === 1 ? (
          <RegisterForm 
            name={name}
            setName={setName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            onSubmit={handleStepOne}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <OtpVerificationForm 
            email={email}
            otp={otp}
            setOtp={setOtp}
            onSubmit={handleRegistration}
            onBack={() => setStep(1)}
            isLoading={isLoading}
            error={error}
          />
        )}
      </Card>
    </div>
  );
}
