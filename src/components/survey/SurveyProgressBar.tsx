
interface SurveyProgressBarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
}

export const SurveyProgressBar = ({ currentStep, totalSteps, progress }: SurveyProgressBarProps) => {
  return (
    <div className="w-full bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-600">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-medium text-primary">
            {Math.round(progress)}% Complete
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
