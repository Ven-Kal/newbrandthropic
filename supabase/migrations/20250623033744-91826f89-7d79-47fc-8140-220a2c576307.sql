
-- First, let's identify and remove duplicate reviews, keeping only the most recent one for each user-brand combination
WITH duplicate_reviews AS (
  SELECT review_id,
         ROW_NUMBER() OVER (
           PARTITION BY user_id, brand_id 
           ORDER BY created_at DESC
         ) as rn
  FROM public.reviews
)
DELETE FROM public.reviews 
WHERE review_id IN (
  SELECT review_id 
  FROM duplicate_reviews 
  WHERE rn > 1
);

-- Now add the unique constraint to prevent future duplicates
ALTER TABLE public.reviews 
ADD CONSTRAINT unique_user_brand_review 
UNIQUE (user_id, brand_id);

-- Create index for better performance on user-brand lookups
CREATE INDEX IF NOT EXISTS idx_reviews_user_brand 
ON public.reviews(user_id, brand_id);
