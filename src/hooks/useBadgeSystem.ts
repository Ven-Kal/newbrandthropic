
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon_locked_url: string;
  icon_unlocked_url: string;
  unlock_condition: any;
  sort_order: number;
}

interface UserStats {
  total_points: number;
  total_actions: number;
  review_count: number;
  rating_count: number;
  unique_rating_count: number;
  weekly_actions: number;
}

export function useBadgeSystem() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [userStats, setUserStats] = useState<UserStats>({
    total_points: 0,
    total_actions: 0,
    review_count: 0,
    rating_count: 0,
    unique_rating_count: 0,
    weekly_actions: 0
  });
  const [celebrationBadge, setCelebrationBadge] = useState<Badge | null>(null);

  // Fetch all badges
  useEffect(() => {
    const fetchBadges = async () => {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('sort_order');
      
      if (error) {
        console.error('Error fetching badges:', error);
        return;
      }
      
      setBadges(data || []);
    };

    fetchBadges();
  }, []);

  // Fetch user badges and stats
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      // Fetch user badges
      const { data: userBadgesData, error: badgesError } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', user.user_id);

      if (badgesError) {
        console.error('Error fetching user badges:', badgesError);
      } else {
        setUserBadges(userBadgesData?.map(b => b.badge_id) || []);
      }

      // Fetch user stats
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('total_points, weekly_actions')
        .eq('user_id', user.user_id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
      }

      // Fetch detailed stats from user_points
      const { data: pointsData, error: pointsError } = await supabase
        .from('user_points')
        .select('action_type, reference_id')
        .eq('user_id', user.user_id);

      if (pointsError) {
        console.error('Error fetching user points:', pointsError);
      } else {
        const total_actions = pointsData?.length || 0;
        const review_count = pointsData?.filter(p => p.action_type === 'review').length || 0;
        const rating_count = pointsData?.filter(p => p.action_type === 'rating').length || 0;
        const unique_rating_count = new Set(
          pointsData?.filter(p => p.action_type === 'rating').map(p => p.reference_id)
        ).size;

        setUserStats({
          total_points: userData?.total_points || 0,
          weekly_actions: userData?.weekly_actions || 0,
          total_actions,
          review_count,
          rating_count,
          unique_rating_count
        });
      }
    };

    fetchUserData();
  }, [user]);

  // Award points function
  const awardPoints = async (actionType: string, points: number, referenceId?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('award_points_and_check_badges', {
        p_user_id: user.user_id,
        p_action_type: actionType,
        p_points: points,
        p_reference_id: referenceId || null
      });

      if (error) {
        console.error('Error awarding points:', error);
        return;
      }

      // Update user stats
      setUserStats(prev => ({
        ...prev,
        total_points: data.new_total_points,
        total_actions: prev.total_actions + 1,
        weekly_actions: prev.weekly_actions + 1,
        review_count: actionType === 'review' ? prev.review_count + 1 : prev.review_count,
        rating_count: actionType === 'rating' ? prev.rating_count + 1 : prev.rating_count,
        unique_rating_count: actionType === 'rating' ? prev.unique_rating_count + 1 : prev.unique_rating_count
      }));

      // Check for new badges
      if (data.earned_badges && data.earned_badges.length > 0) {
        const newBadgeIds = data.earned_badges.map((b: any) => b.id);
        setUserBadges(prev => [...prev, ...newBadgeIds]);
        
        // Show celebration for first new badge
        const newBadge = badges.find(b => b.id === data.earned_badges[0].id);
        if (newBadge) {
          setCelebrationBadge(newBadge);
        }
        
        toast.success(`🎉 Badge earned: ${data.earned_badges[0].name}!`);
      }

      toast.success(`+${points} points earned!`);
    } catch (error) {
      console.error('Error in awardPoints:', error);
    }
  };

  const closeCelebration = () => {
    setCelebrationBadge(null);
  };

  return {
    badges,
    userBadges,
    userStats,
    awardPoints,
    celebrationBadge,
    closeCelebration
  };
}
