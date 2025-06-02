export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          brand_id: string
          brand_name: string
          category: string
          chatbot_url: string | null
          company_notes: string | null
          complaint_page_url: string | null
          created_at: string
          created_by: string | null
          facebook_url: string | null
          grievance_portal_url: string | null
          holding_company_name: string | null
          instagram_url: string | null
          keywords: string[] | null
          legal_entity_name: string | null
          linkedin_url: string | null
          logo_url: string
          meta_description: string | null
          meta_title: string | null
          rating_avg: number
          slug: string | null
          special_tags: string | null
          subcategory: string | null
          support_email: string | null
          toll_free_number: string | null
          top_products: string | null
          total_reviews: number
          twitter_url: string | null
          updated_at: string
          website_url: string | null
        }
        Insert: {
          brand_id?: string
          brand_name: string
          category: string
          chatbot_url?: string | null
          company_notes?: string | null
          complaint_page_url?: string | null
          created_at?: string
          created_by?: string | null
          facebook_url?: string | null
          grievance_portal_url?: string | null
          holding_company_name?: string | null
          instagram_url?: string | null
          keywords?: string[] | null
          legal_entity_name?: string | null
          linkedin_url?: string | null
          logo_url: string
          meta_description?: string | null
          meta_title?: string | null
          rating_avg?: number
          slug?: string | null
          special_tags?: string | null
          subcategory?: string | null
          support_email?: string | null
          toll_free_number?: string | null
          top_products?: string | null
          total_reviews?: number
          twitter_url?: string | null
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          brand_id?: string
          brand_name?: string
          category?: string
          chatbot_url?: string | null
          company_notes?: string | null
          complaint_page_url?: string | null
          created_at?: string
          created_by?: string | null
          facebook_url?: string | null
          grievance_portal_url?: string | null
          holding_company_name?: string | null
          instagram_url?: string | null
          keywords?: string[] | null
          legal_entity_name?: string | null
          linkedin_url?: string | null
          logo_url?: string
          meta_description?: string | null
          meta_title?: string | null
          rating_avg?: number
          slug?: string | null
          special_tags?: string | null
          subcategory?: string | null
          support_email?: string | null
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
      users: {
        Row: {
          created_at: string
          email: string
          is_verified: boolean
          name: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          is_verified?: boolean
          name: string
          role: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          email?: string
          is_verified?: boolean
          name?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
