
-- Add multiple escalation levels to brands table
ALTER TABLE public.brands 
ADD COLUMN escalation_levels JSONB DEFAULT '[]'::jsonb;

-- Add index for better performance on escalation_levels queries
CREATE INDEX idx_brands_escalation_levels ON public.brands USING GIN (escalation_levels);

-- Update existing brands to have empty escalation array
UPDATE public.brands SET escalation_levels = '[]'::jsonb WHERE escalation_levels IS NULL;
