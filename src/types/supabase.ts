
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: string;
          name: string;
          email: string;
          is_verified: boolean;
          role: "consumer" | "admin";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id?: string;
          name: string;
          email: string;
          is_verified?: boolean;
          role?: "consumer" | "admin";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          name?: string;
          email?: string;
          is_verified?: boolean;
          role?: "consumer" | "admin";
          updated_at?: string;
        };
      };
      brands: {
        Row: {
          brand_id: string;
          brand_name: string;
          category: string;
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
          support_hours?: Json;
          escalation_phone?: string;
          escalation_email?: string;
          escalation_contact_name?: string;
          head_office_address?: Json;
        };
        Insert: {
          brand_id?: string;
          brand_name: string;
          category: string;
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
          legal_entity_name?: string;
          holding_company_name?: string;
          top_products?: string;
          company_notes?: string;
          special_tags?: string;
          rating_avg?: number;
          total_reviews?: number;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
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
          support_hours?: Json;
          escalation_phone?: string;
          escalation_email?: string;
          escalation_contact_name?: string;
          head_office_address?: Json;
        };
        Update: {
          brand_id?: string;
          brand_name?: string;
          category?: string;
          logo_url?: string;
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
          rating_avg?: number;
          total_reviews?: number;
          updated_at?: string;
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
          support_hours?: Json;
          escalation_phone?: string;
          escalation_email?: string;
          escalation_contact_name?: string;
          head_office_address?: Json;
        };
      };
      reviews: {
        Row: {
          review_id: string;
          user_id: string;
          brand_id: string;
          rating: number;
          category: string;
          review_text: string;
          screenshot_url?: string;
          status: "pending" | "approved" | "rejected";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          review_id?: string;
          user_id: string;
          brand_id: string;
          rating: number;
          category: string;
          review_text: string;
          screenshot_url?: string;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          review_id?: string;
          user_id?: string;
          brand_id?: string;
          rating?: number;
          category?: string;
          review_text?: string;
          screenshot_url?: string;
          status?: "pending" | "approved" | "rejected";
          updated_at?: string;
        };
      };
      otp_logs: {
        Row: {
          otp_id: string;
          email: string;
          otp_code: string;
          is_verified: boolean;
          created_at: string;
        };
        Insert: {
          otp_id?: string;
          email: string;
          otp_code: string;
          is_verified?: boolean;
          created_at?: string;
        };
        Update: {
          otp_id?: string;
          email?: string;
          otp_code?: string;
          is_verified?: boolean;
        };
      };
      admin_actions: {
        Row: {
          action_id: string;
          admin_id: string;
          action_type: "edit" | "delete";
          target_type: "brand" | "review" | "field";
          target_id: string;
          action_details: string;
          timestamp: string;
        };
        Insert: {
          action_id?: string;
          admin_id: string;
          action_type: "edit" | "delete";
          target_type: "brand" | "review" | "field";
          target_id: string;
          action_details: string;
          timestamp?: string;
        };
        Update: {
          action_id?: string;
          admin_id?: string;
          action_type?: "edit" | "delete";
          target_type?: "brand" | "review" | "field";
          target_id?: string;
          action_details?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
