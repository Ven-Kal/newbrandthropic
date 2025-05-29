
export interface SurveyOption {
  option_id: string;
  option_title: string;
  option_description: string;
  icon_reference: string;
}

export interface SurveyQuestion {
  question_id: string;
  survey_id: string;
  question_text: string;
  sort_order: number;
  options: SurveyOption[];
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface Survey {
  survey_id: string;
  title: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SurveySession {
  session_id: string;
  survey_id: string;
  user_identifier: string;
  is_completed: boolean;
  started_at: string;
  completed_at?: string;
}

export interface SurveyResponse {
  response_id: string;
  survey_id: string;
  question_id: string;
  selected_option_ids: string[];
  user_identifier: string;
  session_id: string;
  created_at: string;
}
