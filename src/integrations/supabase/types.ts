export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_actions: {
        Row: {
          action_details: string
          action_id: string
          action_type: string
          admin_id: string
          target_id: string
          target_type: string
          timestamp: string
        }
        Insert: {
          action_details: string
          action_id?: string
          action_type: string
          admin_id: string
          target_id: string
          target_type: string
          timestamp?: string
        }
        Update: {
          action_details?: string
          action_id?: string
          action_type?: string
          admin_id?: string
          target_id?: string
          target_type?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_actions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      badges: {
        Row: {
          created_at: string | null
          description: string
          icon_locked_url: string
          icon_unlocked_url: string
          id: string
          name: string
          sort_order: number | null
          unlock_condition: Json
        }
        Insert: {
          created_at?: string | null
          description: string
          icon_locked_url: string
          icon_unlocked_url: string
          id?: string
          name: string
          sort_order?: number | null
          unlock_condition: Json
        }
        Update: {
          created_at?: string | null
          description?: string
          icon_locked_url?: string
          icon_unlocked_url?: string
          id?: string
          name?: string
          sort_order?: number | null
          unlock_condition?: Json
        }
        Relationships: []
      }
      banner_announcements: {
        Row: {
          badge_name: string
          banner_image_url: string | null
          created_at: string | null
          custom_message: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string | null
          user_name: string
        }
        Insert: {
          badge_name: string
          banner_image_url?: string | null
          created_at?: string | null
          custom_message?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          user_name: string
        }
        Update: {
          badge_name?: string
          banner_image_url?: string | null
          created_at?: string | null
          custom_message?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "banner_announcements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      blogs: {
        Row: {
          author_name: string
          blog_id: string
          category: string
          content: string
          created_at: string
          excerpt: string
          featured_image_url: string
          is_published: boolean
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          published_at: string
          read_time_minutes: number
          slug: string
          tagged_brands: string[] | null
          tags: string[] | null
          title: string
          updated_at: string
          youtube_video_url: string | null
        }
        Insert: {
          author_name: string
          blog_id?: string
          category: string
          content: string
          created_at?: string
          excerpt: string
          featured_image_url: string
          is_published?: boolean
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string
          read_time_minutes?: number
          slug: string
          tagged_brands?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string
          youtube_video_url?: string | null
        }
        Update: {
          author_name?: string
          blog_id?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string
          featured_image_url?: string
          is_published?: boolean
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string
          read_time_minutes?: number
          slug?: string
          tagged_brands?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          youtube_video_url?: string | null
        }
        Relationships: []
      }
      brand_products: {
        Row: {
          brand_id: string
          created_at: string | null
          display_order: number | null
          product_id: string
          product_image_url: string | null
          product_name: string
          product_url: string | null
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          created_at?: string | null
          display_order?: number | null
          product_id?: string
          product_image_url?: string | null
          product_name: string
          product_url?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          created_at?: string | null
          display_order?: number | null
          product_id?: string
          product_image_url?: string | null
          product_name?: string
          product_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brand_products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
        ]
      }
      brands: {
        Row: {
          additional_emails: string[] | null
          additional_phone_numbers: string[] | null
          brand_id: string
          brand_name: string
          canonical_url: string | null
          category: string
          chatbot_url: string | null
          company_notes: string | null
          complaint_page_url: string | null
          created_at: string
          created_by: string | null
          escalation_contact_name: string | null
          escalation_email: string | null
          escalation_levels: Json | null
          escalation_phone: string | null
          facebook_url: string | null
          grievance_portal_url: string | null
          head_office_address: Json | null
          holding_company_name: string | null
          instagram_url: string | null
          keywords: string[] | null
          legal_entity_name: string | null
          linkedin_url: string | null
          logo_alt: string | null
          logo_url: string
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          rating_avg: number
          slug: string | null
          special_tags: string | null
          subcategory: string | null
          support_email: string | null
          support_hours: Json | null
          toll_free_number: string | null
          top_products: string | null
          total_reviews: number
          twitter_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          additional_emails?: string[] | null
          additional_phone_numbers?: string[] | null
          brand_id?: string
          brand_name: string
          canonical_url?: string | null
          category: string
          chatbot_url?: string | null
          company_notes?: string | null
          complaint_page_url?: string | null
          created_at?: string
          created_by?: string | null
          escalation_contact_name?: string | null
          escalation_email?: string | null
          escalation_levels?: Json | null
          escalation_phone?: string | null
          facebook_url?: string | null
          grievance_portal_url?: string | null
          head_office_address?: Json | null
          holding_company_name?: string | null
          instagram_url?: string | null
          keywords?: string[] | null
          legal_entity_name?: string | null
          linkedin_url?: string | null
          logo_alt?: string | null
          logo_url: string
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          rating_avg?: number
          slug?: string | null
          special_tags?: string | null
          subcategory?: string | null
          support_email?: string | null
          support_hours?: Json | null
          toll_free_number?: string | null
          top_products?: string | null
          total_reviews?: number
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          additional_emails?: string[] | null
          additional_phone_numbers?: string[] | null
          brand_id?: string
          brand_name?: string
          canonical_url?: string | null
          category?: string
          chatbot_url?: string | null
          company_notes?: string | null
          complaint_page_url?: string | null
          created_at?: string
          created_by?: string | null
          escalation_contact_name?: string | null
          escalation_email?: string | null
          escalation_levels?: Json | null
          escalation_phone?: string | null
          facebook_url?: string | null
          grievance_portal_url?: string | null
          head_office_address?: Json | null
          holding_company_name?: string | null
          instagram_url?: string | null
          keywords?: string[] | null
          legal_entity_name?: string | null
          linkedin_url?: string | null
          logo_alt?: string | null
          logo_url?: string
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          rating_avg?: number
          slug?: string | null
          special_tags?: string | null
          subcategory?: string | null
          support_email?: string | null
          support_hours?: Json | null
          toll_free_number?: string | null
          top_products?: string | null
          total_reviews?: number
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      otp_logs: {
        Row: {
          created_at: string
          email: string
          is_verified: boolean
          otp_code: string
          otp_id: string
        }
        Insert: {
          created_at?: string
          email: string
          is_verified?: boolean
          otp_code: string
          otp_id?: string
        }
        Update: {
          created_at?: string
          email?: string
          is_verified?: boolean
          otp_code?: string
          otp_id?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          created_at: string | null
          id: string
          page_url: string
          session_id: string | null
          visit_duration: number | null
          visited_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          page_url: string
          session_id?: string | null
          visit_duration?: number | null
          visited_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          page_url?: string
          session_id?: string | null
          visit_duration?: number | null
          visited_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          brand_id: string
          category: string
          created_at: string
          rating: number
          review_id: string
          review_text: string
          screenshot_url: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          brand_id: string
          category: string
          created_at?: string
          rating: number
          review_id?: string
          review_text: string
          screenshot_url?: string | null
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          brand_id?: string
          category?: string
          created_at?: string
          rating?: number
          review_id?: string
          review_text?: string
          screenshot_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["brand_id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      survey_questions: {
        Row: {
          created_at: string | null
          is_required: boolean | null
          options: Json
          question_id: string
          question_text: string
          sort_order: number
          survey_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          is_required?: boolean | null
          options?: Json
          question_id?: string
          question_text: string
          sort_order?: number
          survey_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          is_required?: boolean | null
          options?: Json
          question_id?: string
          question_text?: string
          sort_order?: number
          survey_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "survey_questions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["survey_id"]
          },
        ]
      }
      survey_responses: {
        Row: {
          created_at: string | null
          question_id: string
          response_id: string
          selected_option_ids: string[]
          session_id: string
          survey_id: string
          user_identifier: string
        }
        Insert: {
          created_at?: string | null
          question_id: string
          response_id?: string
          selected_option_ids?: string[]
          session_id: string
          survey_id: string
          user_identifier: string
        }
        Update: {
          created_at?: string | null
          question_id?: string
          response_id?: string
          selected_option_ids?: string[]
          session_id?: string
          survey_id?: string
          user_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "survey_questions"
            referencedColumns: ["question_id"]
          },
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["survey_id"]
          },
        ]
      }
      survey_sessions: {
        Row: {
          completed_at: string | null
          is_completed: boolean | null
          session_id: string
          started_at: string | null
          survey_id: string
          user_identifier: string
        }
        Insert: {
          completed_at?: string | null
          is_completed?: boolean | null
          session_id?: string
          started_at?: string | null
          survey_id: string
          user_identifier: string
        }
        Update: {
          completed_at?: string | null
          is_completed?: boolean | null
          session_id?: string
          started_at?: string | null
          survey_id?: string
          user_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_sessions_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["survey_id"]
          },
        ]
      }
      surveys: {
        Row: {
          created_at: string | null
          description: string | null
          is_active: boolean | null
          survey_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          is_active?: boolean | null
          survey_id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          is_active?: boolean | null
          survey_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          badge_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_points: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          points: number
          reference_id: string | null
          user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          points: number
          reference_id?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          points?: number
          reference_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          current_badge_id: string | null
          email: string
          is_verified: boolean
          name: string
          role: string
          total_points: number | null
          updated_at: string
          user_id: string
          weekly_actions: number | null
          weekly_reset_date: string | null
        }
        Insert: {
          created_at?: string
          current_badge_id?: string | null
          email: string
          is_verified?: boolean
          name: string
          role: string
          total_points?: number | null
          updated_at?: string
          user_id?: string
          weekly_actions?: number | null
          weekly_reset_date?: string | null
        }
        Update: {
          created_at?: string
          current_badge_id?: string | null
          email?: string
          is_verified?: boolean
          name?: string
          role?: string
          total_points?: number | null
          updated_at?: string
          user_id?: string
          weekly_actions?: number | null
          weekly_reset_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_current_badge_id_fkey"
            columns: ["current_badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      visitor_analytics: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          last_activity: string | null
          operating_system: string | null
          page_url: string | null
          referrer: string | null
          region: string | null
          session_id: string | null
          session_start: string | null
          user_agent: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          operating_system?: string | null
          page_url?: string | null
          referrer?: string | null
          region?: string | null
          session_id?: string | null
          session_start?: string | null
          user_agent?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          operating_system?: string | null
          page_url?: string | null
          referrer?: string | null
          region?: string | null
          session_id?: string | null
          session_start?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      blog_categories: {
        Row: {
          blog_count: number | null
          category: string | null
        }
        Relationships: []
      }
      brand_categories: {
        Row: {
          brand_count: number | null
          category: string | null
        }
        Relationships: []
      }
      brand_subcategories: {
        Row: {
          brand_count: number | null
          category: string | null
          subcategory: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_points_and_check_badges: {
        Args: {
          p_user_id: string
          p_action_type: string
          p_points: number
          p_reference_id?: string
        }
        Returns: Json
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
