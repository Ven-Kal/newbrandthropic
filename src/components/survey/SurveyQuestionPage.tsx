
import { useState, useEffect } from 'react';
import { SurveyQuestion } from '@/types/survey';
import { SurveyOptionCard } from './SurveyOptionCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SurveyQuestionPageProps {
  question: SurveyQuestion;
  selectedOptions: string[];
  onSelectionChange: (selectedOptions: string[]) => void;
  onNext: () => void;
  onPrevious: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
}

export const SurveyQuestionPage = ({
  question,
  selectedOptions,
  onSelectionChange,
  onNext,
  onPrevious,
  isFirstQuestion,
  isLastQuestion,
  isSubmitting
}: SurveyQuestionPageProps) => {
  const [localSelectedOptions, setLocalSelectedOptions] = useState<string[]>(selectedOptions);

  useEffect(() => {
    setLocalSelectedOptions(selectedOptions);
  }, [selectedOptions]);

  const handleOptionToggle = (optionId: string) => {
    const newSelection = localSelectedOptions.includes(optionId)
      ? localSelectedOptions.filter(id => id !== optionId)
      : [...localSelectedOptions, optionId];
    
    setLocalSelectedOptions(newSelection);
    onSelectionChange(newSelection);
  };

  const canProceed = question.is_required ? localSelectedOptions.length > 0 : true;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Question Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {question.question_text}
          </h1>
          <p className="text-gray-600 text-base">
            {question.is_required 
              ? 'Please select at least one option to continue' 
              : 'Select all that apply (optional)'
            }
          </p>
        </div>

        {/* Options Grid - 5x2 layout */}
        <div className="grid grid-cols-5 gap-4 mb-12 max-w-6xl mx-auto">
          {question.options.map((option) => (
            <SurveyOptionCard
              key={option.option_id}
              option={option}
              isSelected={localSelectedOptions.includes(option.option_id)}
              onSelect={handleOptionToggle}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isFirstQuestion}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl border-2 transition-all duration-300
              ${isFirstQuestion 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:border-primary hover:text-primary'
              }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </Button>

          <div className="text-center">
            {localSelectedOptions.length > 0 && (
              <p className="text-sm text-gray-600">
                {localSelectedOptions.length} option{localSelectedOptions.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          <Button
            onClick={onNext}
            disabled={!canProceed || isSubmitting}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300
              ${canProceed 
                ? 'bg-primary hover:bg-primary/90 text-white' 
                : 'opacity-50 cursor-not-allowed'
              }`}
          >
            <span>{isLastQuestion ? (isSubmitting ? 'Submitting...' : 'Complete Survey') : 'Next'}</span>
            {!isLastQuestion && <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
