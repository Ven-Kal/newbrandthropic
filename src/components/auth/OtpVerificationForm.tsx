
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface OtpVerificationFormProps {
  email: string;
  otp: string;
  setOtp: (otp: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error: string;
}

export default function OtpVerificationForm({
  email,
  otp,
  setOtp,
  onSubmit,
  onBack,
  isLoading,
  error,
}: OtpVerificationFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <CardContent className="space-y-4 pt-6">
        <p className="text-sm text-center mb-2">
          A verification code has been sent to <strong>{email}</strong>
        </p>
        
        <div className="space-y-2">
          <label htmlFor="otp" className="text-sm font-medium">
            Verification Code
          </label>
          <Input
            id="otp"
            placeholder="Enter 4-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={isLoading}
            maxLength={4}
          />
        </div>
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <Button 
          type="submit" 
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          disabled={isLoading}
          onClick={onBack}
        >
          Back
        </Button>
      </CardFooter>
    </form>
  );
}
