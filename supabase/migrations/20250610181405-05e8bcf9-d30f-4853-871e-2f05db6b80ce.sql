
-- Create blogs table
CREATE TABLE public.blogs (
  blog_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image_url TEXT NOT NULL,
  youtube_video_url TEXT,
  category TEXT NOT NULL,
  read_time_minutes INTEGER NOT NULL DEFAULT 5,
  tags TEXT[] DEFAULT '{}',
  tagged_brands TEXT[] DEFAULT '{}',
  author_name TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_published BOOLEAN NOT NULL DEFAULT false,
  meta_title VARCHAR(255),
  meta_description VARCHAR(500),
  keywords TEXT[] DEFAULT '{}'
);

-- Create blog categories view
CREATE VIEW public.blog_categories AS
SELECT 
  category,
  COUNT(*) as blog_count
FROM public.blogs 
WHERE is_published = true
GROUP BY category
ORDER BY category;

-- Enable RLS on blogs table
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to published blogs
CREATE POLICY "Allow public read access to published blogs"
  ON public.blogs
  FOR SELECT
  USING (is_published = true);

-- Create indexes for better performance
CREATE INDEX idx_blogs_slug ON public.blogs(slug);
CREATE INDEX idx_blogs_category ON public.blogs(category);
CREATE INDEX idx_blogs_published_at ON public.blogs(published_at DESC);
CREATE INDEX idx_blogs_is_published ON public.blogs(is_published);

-- Add trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blogs_updated_at 
    BEFORE UPDATE ON public.blogs
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
