-- Create FAQs table
CREATE TABLE public.faqs (
  faq_id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 1,
  meta_title VARCHAR(60),
  meta_description VARCHAR(160),
  keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for FAQs
CREATE POLICY "Anyone can view active FAQs" 
ON public.faqs 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage FAQs" 
ON public.faqs 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Create index for better performance
CREATE INDEX idx_faqs_category ON public.faqs(category);
CREATE INDEX idx_faqs_subcategory ON public.faqs(category, subcategory);
CREATE INDEX idx_faqs_active ON public.faqs(is_active);
CREATE INDEX idx_faqs_display_order ON public.faqs(display_order);

-- Create trigger for updated_at
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create FAQ categories view
CREATE VIEW public.faq_categories AS
SELECT 
  category,
  COUNT(*) as faq_count
FROM public.faqs 
WHERE is_active = true
GROUP BY category
ORDER BY category;

-- Insert some sample FAQs for airlines category
INSERT INTO public.faqs (question, answer, category, display_order) VALUES
('How can I cancel my flight booking?', 'Flight cancellation policies vary by airline. Generally, you can cancel through the airline''s website, mobile app, or customer service. Check the specific airline''s cancellation policy for fees and refund eligibility.', 'Airlines', 1),
('What are the baggage allowance rules?', 'Baggage allowance depends on your ticket type and destination. Most domestic flights allow 15kg checked baggage and 7kg cabin baggage. International flights may have different limits. Always check with your specific airline.', 'Airlines', 2),
('How do I check in for my flight?', 'You can check in online through the airline''s website or mobile app, usually 24-48 hours before departure. You can also check in at the airport counter or self-service kiosks.', 'Airlines', 3),
('What should I do if my flight is delayed or cancelled?', 'Contact the airline immediately for rebooking options. You may be entitled to compensation depending on the delay duration and circumstances. Keep all receipts for additional expenses.', 'Airlines', 4),
('How can I upgrade my seat or class?', 'Seat upgrades can usually be done during online check-in, at the airport, or by contacting customer service. Availability and fees vary by airline and flight occupancy.', 'Airlines', 5);

-- Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);

-- Create storage policies for blog images
CREATE POLICY "Admins can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog-images' AND is_admin());

CREATE POLICY "Admins can update blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog-images' AND is_admin());

CREATE POLICY "Admins can delete blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog-images' AND is_admin());

CREATE POLICY "Public can view blog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog-images');