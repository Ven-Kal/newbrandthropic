
// User types
export type UserRole = 'consumer' | 'admin';

export interface User {
  user_id: string;
  name: string;
  email: string;
  is_verified: boolean;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Brand types
export type BrandCategory = 
  | 'Telecom' 
  | 'Broadband' 
  | 'Appliances' 
  | 'Utilities' 
  | 'Govt IDs' 
  | 'Automobiles' 
  | 'Fuel';

export interface Brand {
  brand_id: string;
  brand_name: string;
  category: BrandCategory;
  logo_url: string;
  toll_free_number?: string;
  support_email?: string;
  website_url?: string;
  complaint_page_url?: string;
  chatbot_url?: string;
  grievance_portal_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  rating_avg: number;
  total_reviews: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Review types
export type ReviewCategory = 'broadband' | 'billing' | 'delivery' | 'customer service' | 'product quality';
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  review_id: string;
  user_id: string;
  brand_id: string;
  rating: number;
  category: ReviewCategory;
  review_text: string;
  screenshot_url?: string;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
}

// Auth types
export interface OTPLog {
  otp_id: string;
  email: string;
  otp_code: string; // This would be hashed in real implementation
  is_verified: boolean;
  created_at: string;
}

// Admin action types
export type ActionType = 'edit' | 'delete';
export type TargetType = 'brand' | 'review' | 'field';

export interface AdminAction {
  action_id: string;
  admin_id: string;
  action_type: ActionType;
  target_type: TargetType;
  target_id: string;
  action_details: string;
  timestamp: string;
}

// Auth context types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
