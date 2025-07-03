
-- Create visitor analytics table
CREATE TABLE public.visitor_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID DEFAULT gen_random_uuid(),
  ip_address TEXT,
  user_agent TEXT,
  device_type TEXT,
  browser TEXT,
  operating_system TEXT,
  country TEXT,
  city TEXT,
  region TEXT,
  page_url TEXT,
  referrer TEXT,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create page views table
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID,
  page_url TEXT NOT NULL,
  visit_duration INTEGER DEFAULT 0,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_visitor_analytics_session_id ON public.visitor_analytics(session_id);
CREATE INDEX idx_visitor_analytics_ip_address ON public.visitor_analytics(ip_address);
CREATE INDEX idx_visitor_analytics_created_at ON public.visitor_analytics(created_at);
CREATE INDEX idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX idx_page_views_page_url ON public.page_views(page_url);
CREATE INDEX idx_page_views_visited_at ON public.page_views(visited_at);

-- Enable RLS (Row Level Security)
ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Create policies for visitor analytics (allow public insert, admin read)
CREATE POLICY "Allow public to insert visitor analytics" 
  ON public.visitor_analytics 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow admins to read visitor analytics" 
  ON public.visitor_analytics 
  FOR SELECT 
  USING (is_admin());

-- Create policies for page views (allow public insert, admin read)
CREATE POLICY "Allow public to insert page views" 
  ON public.page_views 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow admins to read page views" 
  ON public.page_views 
  FOR SELECT 
  USING (is_admin());
