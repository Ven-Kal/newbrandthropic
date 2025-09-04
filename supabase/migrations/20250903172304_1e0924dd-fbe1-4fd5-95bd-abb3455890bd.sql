-- Fix RLS on brand_products table
ALTER TABLE public.brand_products ENABLE ROW LEVEL SECURITY;

-- Create policies for brand_products
CREATE POLICY "Anyone can view brand products" 
ON public.brand_products 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage brand products" 
ON public.brand_products 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.award_points_and_check_badges(p_user_id uuid, p_action_type text, p_points integer, p_reference_id uuid DEFAULT NULL::uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  new_total_points INTEGER;
  new_weekly_actions INTEGER;
  earned_badges JSONB := '[]'::jsonb;
  badge_record RECORD;
  action_count INTEGER;
  review_count INTEGER;
  rating_count INTEGER;
  help_resolve_count INTEGER;
  comment_count INTEGER;
  unique_rating_count INTEGER;
BEGIN
  -- Reset weekly actions if needed
  UPDATE public.users 
  SET weekly_actions = 0, weekly_reset_date = date_trunc('week', now())
  WHERE user_id = p_user_id AND weekly_reset_date < date_trunc('week', now());

  -- Insert points record
  INSERT INTO public.user_points (user_id, action_type, points, reference_id)
  VALUES (p_user_id, p_action_type, p_points, p_reference_id);

  -- Update user totals
  UPDATE public.users 
  SET 
    total_points = total_points + p_points,
    weekly_actions = weekly_actions + 1
  WHERE user_id = p_user_id
  RETURNING total_points, weekly_actions INTO new_total_points, new_weekly_actions;

  -- Get current counts for badge checking
  SELECT COUNT(*) INTO action_count FROM public.user_points WHERE user_id = p_user_id;
  SELECT COUNT(*) INTO review_count FROM public.user_points WHERE user_id = p_user_id AND action_type = 'review';
  SELECT COUNT(*) INTO rating_count FROM public.user_points WHERE user_id = p_user_id AND action_type = 'rating';
  SELECT COUNT(*) INTO help_resolve_count FROM public.user_points WHERE user_id = p_user_id AND action_type = 'help_resolve';
  SELECT COUNT(*) INTO comment_count FROM public.user_points WHERE user_id = p_user_id AND action_type = 'comment';
  SELECT COUNT(DISTINCT reference_id) INTO unique_rating_count FROM public.user_points WHERE user_id = p_user_id AND action_type = 'rating';

  -- Check for new badges
  FOR badge_record IN 
    SELECT b.* FROM public.badges b
    WHERE b.id NOT IN (SELECT badge_id FROM public.user_badges WHERE user_id = p_user_id)
  LOOP
    DECLARE
      should_award BOOLEAN := false;
      condition_type TEXT := badge_record.unlock_condition->>'type';
      condition_value INTEGER := (badge_record.unlock_condition->>'value')::INTEGER;
    BEGIN
      CASE condition_type
        WHEN 'points' THEN
          should_award := new_total_points >= condition_value;
        WHEN 'actions' THEN
          should_award := action_count >= condition_value;
        WHEN 'reviews' THEN
          should_award := review_count >= condition_value;
        WHEN 'ratings' THEN
          should_award := rating_count >= condition_value;
        WHEN 'unique_ratings' THEN
          should_award := unique_rating_count >= condition_value;
        WHEN 'help_resolve' THEN
          should_award := help_resolve_count >= condition_value;
        WHEN 'comments' THEN
          should_award := comment_count >= condition_value;
        WHEN 'weekly_actions' THEN
          should_award := new_weekly_actions >= condition_value;
      END CASE;

      IF should_award THEN
        INSERT INTO public.user_badges (user_id, badge_id) VALUES (p_user_id, badge_record.id);
        earned_badges := earned_badges || jsonb_build_object(
          'id', badge_record.id,
          'name', badge_record.name,
          'description', badge_record.description,
          'icon_unlocked_url', badge_record.icon_unlocked_url
        );
      END IF;
    END;
  END LOOP;

  -- Update current badge to highest earned
  UPDATE public.users 
  SET current_badge_id = (
    SELECT b.id FROM public.badges b
    JOIN public.user_badges ub ON b.id = ub.badge_id
    WHERE ub.user_id = p_user_id
    ORDER BY b.sort_order DESC
    LIMIT 1
  )
  WHERE user_id = p_user_id;

  RETURN jsonb_build_object(
    'new_total_points', new_total_points,
    'earned_badges', earned_badges
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_review_points()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Award points for new review
  IF TG_OP = 'INSERT' THEN
    PERFORM public.award_points_and_check_badges(NEW.user_id, 'review', 10, NEW.review_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  user_role TEXT;
BEGIN
  -- Select the role from the public.users table for the currently authenticated user
  SELECT role INTO user_role FROM public.users WHERE user_id = auth.uid();
  -- Return true if the role is 'admin', otherwise false
  RETURN user_role = 'admin';
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;