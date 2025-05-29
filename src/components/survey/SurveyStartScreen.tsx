
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Survey } from '@/types/survey';
import { User } from 'lucide-react';

interface SurveyStartScreenProps {
  survey: Survey;
  onStart: (identifier: string) => void;
}

export const SurveyStartScreen = ({ survey, onStart }: SurveyStartScreenProps) => {
  const [name, setName] = useState('');

  const handleStart = () => {
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-primary p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {survey.title}
            </h1>
            {survey.description && (
              <p className="text-white/90 text-sm">
                {survey.description}
              </p>
            )}
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">
                Let's Get Started
              </h2>
              <p className="text-gray-600 text-sm">
                Please provide your name to begin the survey.
              </p>
            </div>

            {/* Name Input */}
            <div className="mb-6">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                Your Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-11 h-12 border-2 border-gray-200 focus:border-primary rounded-xl bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStart}
              disabled={!name.trim()}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Survey
            </Button>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Your information is kept private and secure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
