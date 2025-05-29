
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SurveyCompletionScreenProps {
  surveyTitle: string;
}

export const SurveyCompletionScreen = ({ surveyTitle }: SurveyCompletionScreenProps) => {
  const navigate = useNavigate();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: surveyTitle,
        text: 'I just completed this survey on Brandthropic!',
        url: window.location.href
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>

          {/* Thank You Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Thank You!
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Your responses have been successfully submitted.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            We appreciate you taking the time to complete "{surveyTitle}". 
            Your feedback helps us understand preferences better.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={() => navigate('/')}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={handleShare}
              className="w-full h-12 border-2 border-gray-200 hover:border-primary hover:text-primary rounded-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share Survey</span>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Want to share your brand experiences? 
              <button 
                onClick={() => navigate('/')}
                className="text-primary hover:underline ml-1"
              >
                Explore Brandthropic
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
