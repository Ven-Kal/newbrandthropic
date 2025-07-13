
import { useBadgeSystem } from "@/hooks/useBadgeSystem";
import { BadgeDisplay } from "@/components/badges/badge-display";
import { BadgeProgress } from "@/components/badges/badge-progress";
import { BadgeCelebration } from "@/components/badges/badge-celebration";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Target, Zap } from "lucide-react";

export function UserDashboard() {
  const { badges, userBadges, userStats, celebrationBadge, closeCelebration } = useBadgeSystem();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{userStats.total_points}</p>
                <p className="text-sm text-gray-600">Total Points</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{userBadges.length}</p>
                <p className="text-sm text-gray-600">Badges Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{userStats.total_actions}</p>
                <p className="text-sm text-gray-600">Total Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-4">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{userStats.weekly_actions}</p>
                <p className="text-sm text-gray-600">This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BadgeProgress 
        userStats={userStats} 
        badges={badges} 
        userBadges={userBadges} 
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Tropic Trail - Your Badge Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {badges.map((badge) => (
              <BadgeDisplay
                key={badge.id}
                badge={badge}
                isUnlocked={userBadges.includes(badge.id)}
                size="md"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {celebrationBadge && (
        <BadgeCelebration
          badge={celebrationBadge}
          isOpen={true}
          onClose={closeCelebration}
        />
      )}
    </div>
  );
}
