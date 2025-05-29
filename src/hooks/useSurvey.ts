
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Survey, SurveyQuestion, SurveySession, SurveyResponse } from '@/types/survey';
import { v4 as uuidv4 } from 'uuid';

export const useSurvey = (surveyId: string) => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [sessionId, setSessionId] = useState<string>('');
  const [userIdentifier, setUserIdentifier] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (surveyId) {
      fetchSurveyData();
    }
  }, [surveyId]);

  const fetchSurveyData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch survey details
      const { data: surveyData, error: surveyError } = await supabase
        .from('surveys')
        .select('*')
        .eq('survey_id', surveyId)
        .eq('is_active', true)
        .maybeSingle();

      if (surveyError) {
        console.error('Error fetching survey:', surveyError);
        throw surveyError;
      }
      
      if (!surveyData) {
        console.error('Survey not found or inactive');
        return;
      }
      
      setSurvey(surveyData);

      // Fetch survey questions with options
      const { data: questionsData, error: questionsError } = await supabase
        .from('survey_questions')
        .select('*')
        .eq('survey_id', surveyId)
        .order('sort_order');

      if (questionsError) {
        console.error('Error fetching questions:', questionsError);
        throw questionsError;
      }
      
      console.log('Survey questions fetched:', questionsData);
      setQuestions(questionsData || []);
      
    } catch (error) {
      console.error('Error fetching survey data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSession = async (identifier: string) => {
    try {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      setUserIdentifier(identifier);

      const { error } = await supabase
        .from('survey_sessions')
        .insert({
          session_id: newSessionId,
          survey_id: surveyId,
          user_identifier: identifier
        });

      if (error) {
        console.error('Error starting session:', error);
        throw error;
      }
      
      console.log('Session started successfully:', newSessionId);
      return newSessionId;
    } catch (error) {
      console.error('Error starting session:', error);
      throw error;
    }
  };

  const saveResponse = (questionId: string, selectedOptions: string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: selectedOptions
    }));
  };

  const submitResponse = async (questionId: string, selectedOptions: string[]) => {
    try {
      console.log('Submitting response:', { questionId, selectedOptions, sessionId, userIdentifier });
      
      if (!sessionId || !userIdentifier) {
        throw new Error('Session not initialized');
      }
      
      const { error } = await supabase
        .from('survey_responses')
        .upsert({
          survey_id: surveyId,
          question_id: questionId,
          selected_option_ids: selectedOptions,
          user_identifier: userIdentifier,
          session_id: sessionId
        }, { 
          onConflict: 'survey_id,question_id,session_id' 
        });

      if (error) {
        console.error('Error submitting response:', error);
        throw error;
      }
      
      console.log('Response submitted successfully');
      saveResponse(questionId, selectedOptions);
      return true;
    } catch (error) {
      console.error('Error submitting response:', error);
      throw error;
    }
  };

  const completeSurvey = async () => {
    try {
      setIsSubmitting(true);
      
      if (!sessionId) {
        throw new Error('Session not initialized');
      }
      
      const { error } = await supabase
        .from('survey_sessions')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString()
        })
        .eq('session_id', sessionId);

      if (error) {
        console.error('Error completing survey:', error);
        throw error;
      }
      
      console.log('Survey completed successfully');
      return true;
    } catch (error) {
      console.error('Error completing survey:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const getCurrentQuestion = () => questions[currentQuestionIndex];
  const getProgress = () => ((currentQuestionIndex + 1) / questions.length) * 100;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return {
    survey,
    questions,
    currentQuestion: getCurrentQuestion(),
    currentQuestionIndex,
    responses,
    sessionId,
    userIdentifier,
    isLoading,
    isSubmitting,
    isFirstQuestion,
    isLastQuestion,
    progress: getProgress(),
    startSession,
    saveResponse,
    submitResponse,
    completeSurvey,
    nextQuestion,
    previousQuestion
  };
};
