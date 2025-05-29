
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSurvey } from '@/hooks/useSurvey';
import { SurveyStartScreen } from '@/components/survey/SurveyStartScreen';
import { SurveyProgressBar } from '@/components/survey/SurveyProgressBar';
import { SurveyQuestionPage } from '@/components/survey/SurveyQuestionPage';
import { SurveyCompletionScreen } from '@/components/survey/SurveyCompletionScreen';
import { useToast } from '@/hooks/use-toast';

type SurveyState = 'start' | 'questions' | 'completed';

const SurveyPage = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const { toast } = useToast();
  const [surveyState, setSurveyState] = useState<SurveyState>('start');
  
  const {
    survey,
    questions,
    currentQuestion,
    currentQuestionIndex,
    responses,
    isLoading,
    isSubmitting,
    isFirstQuestion,
    isLastQuestion,
    progress,
    startSession,
    submitResponse,
    completeSurvey,
    nextQuestion,
    previousQuestion
  } = useSurvey(surveyId || '');

  useEffect(() => {
    if (!surveyId) {
      toast({
        title: "Error",
        description: "Survey ID is required",
        variant: "destructive"
      });
    }
  }, [surveyId, toast]);

  const handleStartSurvey = async (identifier: string) => {
    try {
      await startSession(identifier);
      setSurveyState('questions');
      toast({
        title: "Survey Started",
        description: "Let's begin with the first question!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start survey. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSelectionChange = async (selectedOptions: string[]) => {
    if (currentQuestion) {
      try {
        await submitResponse(currentQuestion.question_id, selectedOptions);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to save response. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleNext = async () => {
    if (isLastQuestion) {
      try {
        await completeSurvey();
        setSurveyState('completed');
        toast({
          title: "Survey Completed!",
          description: "Thank you for your responses.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to complete survey. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      nextQuestion();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Survey Not Found</h1>
          <p className="text-gray-600">The survey you're looking for doesn't exist or is no longer active.</p>
        </div>
      </div>
    );
  }

  if (surveyState === 'start') {
    return <SurveyStartScreen survey={survey} onStart={handleStartSurvey} />;
  }

  if (surveyState === 'completed') {
    return <SurveyCompletionScreen surveyTitle={survey.title} />;
  }

  if (surveyState === 'questions' && currentQuestion) {
    return (
      <div>
        <SurveyProgressBar
          currentStep={currentQuestionIndex + 1}
          totalSteps={questions.length}
          progress={progress}
        />
        <SurveyQuestionPage
          question={currentQuestion}
          selectedOptions={responses[currentQuestion.question_id] || []}
          onSelectionChange={handleSelectionChange}
          onNext={handleNext}
          onPrevious={previousQuestion}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          isSubmitting={isSubmitting}
        />
      </div>
    );
  }

  return null;
};

export default SurveyPage;
