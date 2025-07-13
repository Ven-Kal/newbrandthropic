
-- Create user_points table to track user actions and points
CREATE TABLE public.user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE,
  action_type TEXT NOT NULL, -- 'rating', 'review', 'brand_add', 'brand_update', 'help_resolve'
  points INTEGER NOT NULL,
  reference_id UUID, -- ID of the related entity (review_id, brand_id, etc.)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create badges table to define available badges
CREATE TABLE public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon_locked_url TEXT NOT NULL,
  icon_unlocked_url TEXT NOT NULL,
  unlock_condition JSONB NOT NULL, -- {type: 'points', value: 100} or {type: 'actions', value: 5}
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user_badges table to track earned badges
CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE,
  badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create banner_announcements table for admin winner announcements
CREATE TABLE public.banner_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(user_id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  custom_message TEXT,
  banner_image_url TEXT,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add points tracking columns to users table
ALTER TABLE public.users 
ADD COLUMN total_points INTEGER DEFAULT 0,
ADD COLUMN current_badge_id UUID REFERENCES public.badges(id),
ADD COLUMN weekly_actions INTEGER DEFAULT 0,
ADD COLUMN weekly_reset_date TIMESTAMP WITH TIME ZONE DEFAULT date_trunc('week', now());

-- Enable RLS on new tables
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_announcements ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_points
CREATE POLICY "Users can view their own points" ON public.user_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert points" ON public.user_points
  FOR INSERT WITH CHECK (true);

-- RLS policies for badges
CREATE POLICY "Everyone can view badges" ON public.badges
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage badges" ON public.badges
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- RLS policies for user_badges
CREATE POLICY "Users can view their own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view others' badges" ON public.user_badges
  FOR SELECT USING (true);

CREATE POLICY "System can insert badges" ON public.user_badges
  FOR INSERT WITH CHECK (true);

-- RLS policies for banner_announcements
CREATE POLICY "Everyone can view active announcements" ON public.banner_announcements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage announcements" ON public.banner_announcements
  FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Insert initial badge data
INSERT INTO public.badges (name, description, icon_locked_url, icon_unlocked_url, unlock_condition, sort_order) VALUES
('First Footprint', 'Take your first action on BrandTropic', '/badges/first-footprint-locked.png', '/badges/first-footprint-unlocked.png', '{"type": "actions", "value": 1}', 1),
('Early Explorer', 'Complete 5 total actions', '/badges/early-explorer-locked.png', '/badges/early-explorer-unlocked.png', '{"type": "actions", "value": 5}', 2),
('Brand Spotter', 'Rate 3 different brands', '/badges/brand-spotter-locked.png', '/badges/brand-spotter-unlocked.png', '{"type": "unique_ratings", "value": 3}', 3),
('Clarity Climber', 'Complete 10 actions', '/badges/clarity-climber-locked.png', '/badges/clarity-climber-unlocked.png', '{"type": "actions", "value": 10}', 4),
('Review Ranger', 'Write 10 reviews', '/badges/review-ranger-locked.png', '/badges/review-ranger-unlocked.png', '{"type": "reviews", "value": 10}', 5),
('Trust Builder', 'Complete 25 actions', '/badges/trust-builder-locked.png', '/badges/trust-builder-unlocked.png', '{"type": "actions", "value": 25}', 6),
('Insight Seeker', 'Leave 20 comments', '/badges/insight-seeker-locked.png', '/badges/insight-seeker-unlocked.png', '{"type": "comments", "value": 20}', 7),
('Tropic Guide', 'Help resolve a complaint', '/badges/tropic-guide-locked.png', '/badges/tropic-guide-unlocked.png', '{"type": "help_resolve", "value": 1}', 8),
('Community Torchbearer', 'Complete 5+ actions in a week', '/badges/community-torchbearer-locked.png', '/badges/community-torchbearer-unlocked.png', '{"type": "weekly_actions", "value": 5}', 9),
('Peak Truth Finder', 'Reach 100+ total points', '/badges/peak-truth-finder-locked.png', '/badges/peak-truth-finder-unlocked.png', '{"type": "points", "value": 100}', 10);

-- Create function to award points and check for badge unlocks
CREATE OR REPLACE FUNCTION public.award_points_and_check_badges(
  p_user_id UUID,
  p_action_type TEXT,
  p_points INTEGER,
  p_reference_id UUID DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Create trigger to automatically award points for reviews
CREATE OR REPLACE FUNCTION public.handle_review_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Award points for new review
  IF TG_OP = 'INSERT' THEN
    PERFORM public.award_points_and_check_badges(NEW.user_id, 'review', 10, NEW.review_id);
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER review_points_trigger
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_review_points();

-- Create indexes for performance
CREATE INDEX idx_user_points_user_id ON public.user_points(user_id);
CREATE INDEX idx_user_points_action_type ON public.user_points(action_type);
CREATE INDEX idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX idx_badges_sort_order ON public.badges(sort_order);
