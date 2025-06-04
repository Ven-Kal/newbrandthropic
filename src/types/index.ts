
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
export type BrandCategory = string; // Made flexible to accept any category

export interface Brand {
  brand_id: string;
  brand_name: string;
  category: string; // Made flexible
  subcategory?: string; // Added subcategory field
  logo_url: string;
  logo_alt?: string; // Added logo_alt field
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
  legal_entity_name?: string;
  holding_company_name?: string;
  top_products?: string;
  company_notes?: string;
  special_tags?: string;
  rating_avg: number;
  total_reviews: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  slug?: string;
  keywords?: string[];
  alt_text?: string;
  og_image_url?: string;
  canonical_url?: string;
  // Enhanced contact information
  additional_phone_numbers?: string[];
  additional_emails?: string[];
  support_hours?: {
    [key: string]: { open: string; close: string; timezone?: string } | 'closed';
  };
  escalation_phone?: string;
  escalation_email?: string;
  escalation_contact_name?: string;
  head_office_address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    lat?: number;
    lng?: number;
  };
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
