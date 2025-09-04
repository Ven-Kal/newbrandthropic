
-- First, let's update the brands table structure
-- Convert rating_avg and total_reviews to proper numeric types with defaults
ALTER TABLE public.brands 
ALTER COLUMN rating_avg TYPE NUMERIC(3,2) USING COALESCE(rating_avg::numeric, 0),
ALTER COLUMN rating_avg SET DEFAULT 0;

ALTER TABLE public.brands 
ALTER COLUMN total_reviews TYPE INTEGER USING COALESCE(total_reviews::integer, 0),
ALTER COLUMN total_reviews SET DEFAULT 0;

-- Add max length constraint to company_notes
ALTER TABLE public.brands 
ALTER COLUMN company_notes TYPE VARCHAR(500);

-- Ensure datetime columns have proper defaults
ALTER TABLE public.brands 
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN updated_at SET DEFAULT now();

-- Create function to automatically update brand ratings based on reviews
CREATE OR REPLACE FUNCTION update_brand_ratings()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the brand's rating and review count
  UPDATE public.brands 
  SET 
    rating_avg = COALESCE((
      SELECT ROUND(AVG(rating::numeric), 2)
      FROM public.reviews 
      WHERE brand_id = COALESCE(NEW.brand_id, OLD.brand_id) 
      AND status = 'approved'
    ), 0),
    total_reviews = COALESCE((
      SELECT COUNT(*)
      FROM public.reviews 
      WHERE brand_id = COALESCE(NEW.brand_id, OLD.brand_id)
      AND status = 'approved'
    ), 0),
    updated_at = now()
  WHERE brand_id = COALESCE(NEW.brand_id, OLD.brand_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update ratings when reviews change
DROP TRIGGER IF EXISTS update_brand_ratings_on_insert ON public.reviews;
CREATE TRIGGER update_brand_ratings_on_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_ratings();

DROP TRIGGER IF EXISTS update_brand_ratings_on_update ON public.reviews;
CREATE TRIGGER update_brand_ratings_on_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_ratings();

DROP TRIGGER IF EXISTS update_brand_ratings_on_delete ON public.reviews;
CREATE TRIGGER update_brand_ratings_on_delete
  AFTER DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_ratings();

-- Initialize existing brand ratings based on current reviews
UPDATE public.brands 
SET 
  rating_avg = COALESCE((
    SELECT ROUND(AVG(rating::numeric), 2)
    FROM public.reviews 
    WHERE reviews.brand_id = brands.brand_id 
    AND status = 'approved'
  ), 0),
  total_reviews = COALESCE((
    SELECT COUNT(*)
    FROM public.reviews 
    WHERE reviews.brand_id = brands.brand_id
    AND status = 'approved'
  ), 0);
