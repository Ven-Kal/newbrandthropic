
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const POINT_VALUES = {
  RATING: 5,
  REVIEW: 10,
  BRAND_ADD: 20,
  BRAND_UPDATE: 20,
  HELP_RESOLVE: 100,
  COMMENT: 2
} as const;

export async function awardPoints(
  userId: string,
  actionType: keyof typeof POINT_VALUES,
  referenceId?: string
) {
  try {
    const points = POINT_VALUES[actionType];
    
    const { data, error } = await supabase.rpc('award_points_and_check_badges', {
      p_user_id: userId,
      p_action_type: actionType.toLowerCase(),
      p_points: points,
      p_reference_id: referenceId || null
    });

    if (error) {
      console.error('Error awarding points:', error);
      return { error };
    }

    // Show success message
    toast.success(`+${points} points earned!`);
    
    // Show badge notifications
    if (data.earned_badges && data.earned_badges.length > 0) {
      data.earned_badges.forEach((badge: any) => {
        toast.success(`🎉 Badge earned: ${badge.name}!`);
      });
    }

    return { data };
  } catch (error) {
    console.error('Error in awardPoints:', error);
    return { error };
  }
}

export async function getUserStats(userId: string) {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('total_points, weekly_actions')
      .eq('user_id', userId)
      .single();

    if (userError) {
      console.error('Error fetching user stats:', userError);
      return null;
    }

    const { data: pointsData, error: pointsError } = await supabase
      .from('user_points')
      .select('action_type, reference_id')
      .eq('user_id', userId);

    if (pointsError) {
      console.error('Error fetching points data:', pointsError);
      return null;
    }

    const total_actions = pointsData?.length || 0;
    const review_count = pointsData?.filter(p => p.action_type === 'review').length || 0;
    const rating_count = pointsData?.filter(p => p.action_type === 'rating').length || 0;
    const unique_rating_count = new Set(
      pointsData?.filter(p => p.action_type === 'rating').map(p => p.reference_id)
    ).size;

    return {
      total_points: userData?.total_points || 0,
      weekly_actions: userData?.weekly_actions || 0,
      total_actions,
      review_count,
      rating_count,
      unique_rating_count
    };
  } catch (error) {
    console.error('Error getting user stats:', error);
    return null;
  }
}
