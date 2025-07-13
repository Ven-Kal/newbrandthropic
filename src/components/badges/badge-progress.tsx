
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface BadgeProgressProps {
  userStats: {
    total_points: number;
    total_actions: number;
    review_count: number;
    rating_count: number;
    unique_rating_count: number;
    weekly_actions: number;
  };
  badges: Array<{
    id: string;
    name: string;
    description: string;
    unlock_condition: any;
    sort_order: number;
    icon_locked_url: string;
    icon_unlocked_url: string;
  }>;
  userBadges: string[];
}

export function BadgeProgress({ userStats, badges, userBadges }: BadgeProgressProps) {
  const nextBadge = badges
    .filter(badge => !userBadges.includes(badge.id))
    .sort((a, b) => a.sort_order - b.sort_order)[0];

  if (!nextBadge) {
    return (
      <div className="p-4 bg-yellow-50 rounded-lg border">
        <h3 className="font-semibold text-yellow-800 mb-2">🎉 All Badges Earned!</h3>
        <p className="text-yellow-700 text-sm">
          Congratulations! You've earned all available badges on the Tropic Trail!
        </p>
      </div>
    );
  }

  const condition = nextBadge.unlock_condition;
  const conditionType = condition.type;
  const conditionValue = condition.value;

  let currentValue = 0;
  let progressText = "";

  switch (conditionType) {
    case 'points':
      currentValue = userStats.total_points;
      progressText = `${currentValue}/${conditionValue} points`;
      break;
    case 'actions':
      currentValue = userStats.total_actions;
      progressText = `${currentValue}/${conditionValue} actions`;
      break;
    case 'reviews':
      currentValue = userStats.review_count;
      progressText = `${currentValue}/${conditionValue} reviews`;
      break;
    case 'ratings':
      currentValue = userStats.rating_count;
      progressText = `${currentValue}/${conditionValue} ratings`;
      break;
    case 'unique_ratings':
      currentValue = userStats.unique_rating_count;
      progressText = `${currentValue}/${conditionValue} brands rated`;
      break;
    case 'weekly_actions':
      currentValue = userStats.weekly_actions;
      progressText = `${currentValue}/${conditionValue} weekly actions`;
      break;
    default:
      progressText = "Progress unknown";
  }

  const progress = Math.min((currentValue / conditionValue) * 100, 100);
  const remaining = Math.max(conditionValue - currentValue, 0);

  return (
    <div className="p-4 bg-blue-50 rounded-lg border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-blue-800">Next Badge: {nextBadge.name}</h3>
        <Badge variant="outline" className="text-blue-700">
          {remaining > 0 ? `${remaining} to go` : 'Ready to claim!'}
        </Badge>
      </div>
      
      <p className="text-blue-700 text-sm mb-3">{nextBadge.description}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-blue-600">Progress</span>
          <span className="text-blue-600">{progressText}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}
