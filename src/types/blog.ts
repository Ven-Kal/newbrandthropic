
export interface Blog {
  blog_id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image_url: string;
  youtube_video_url?: string;
  category: string;
  read_time_minutes: number;
  tags: string[];
  tagged_brands?: string[];
  author_name: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
}

export interface BlogCategory {
  category: string;
  blog_count: number;
}
