export interface FAQ {
  faq_id: string;
  question: string;
  answer: string;
  category: string;
  subcategory?: string;
  is_active: boolean;
  display_order: number;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
}

export interface FAQCategory {
  category: string;
  faq_count: number;
}