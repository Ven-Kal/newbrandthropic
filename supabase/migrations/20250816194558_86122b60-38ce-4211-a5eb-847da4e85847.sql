
-- Create a table for brand relationships
CREATE TABLE public.brand_relationships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_id UUID NOT NULL REFERENCES public.brands(brand_id) ON DELETE CASCADE,
  related_brand_id UUID NOT NULL REFERENCES public.brands(brand_id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('subsidiary', 'parent_company', 'sister_concern', 'affiliate', 'partner', 'competitor', 'other')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_brand_relationship UNIQUE(brand_id, related_brand_id, relationship_type)
);

-- Enable RLS on brand_relationships table
ALTER TABLE public.brand_relationships ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to brand relationships
CREATE POLICY "Anyone can read brand relationships" 
  ON public.brand_relationships 
  FOR SELECT 
  USING (true);

-- Create policy for admin insert/update access
CREATE POLICY "Admin can manage brand relationships" 
  ON public.brand_relationships 
  FOR ALL 
  USING (is_admin())
  WITH CHECK (is_admin());

-- Add trigger for updating updated_at timestamp
CREATE TRIGGER update_brand_relationships_updated_at
  BEFORE UPDATE ON public.brand_relationships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
