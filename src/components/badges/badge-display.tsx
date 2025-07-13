
import { Badge } from "@/components/ui/badge";
import { Trophy, Lock } from "lucide-react";

interface BadgeDisplayProps {
  badge: {
    id: string;
    name: string;
    description: string;
    icon_locked_url: string;
    icon_unlocked_url: string;
    sort_order: number;
  };
  isUnlocked: boolean;
  size?: "sm" | "md" | "lg";
}

export function BadgeDisplay({ badge, isUnlocked, size = "md" }: BadgeDisplayProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };

  const containerClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4"
  };

  return (
    <div className={`flex flex-col items-center ${containerClasses[size]} transition-all duration-300`}>
      <div className={`relative ${sizeClasses[size]} mb-2`}>
        <img
          src={isUnlocked ? badge.icon_unlocked_url : badge.icon_locked_url}
          alt={badge.name}
          className={`w-full h-full object-contain transition-all duration-300 ${
            isUnlocked ? '' : 'grayscale opacity-50'
          }`}
          onError={(e) => {
            // Fallback to icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              const icon = document.createElement('div');
              icon.className = `w-full h-full flex items-center justify-center ${
                isUnlocked ? 'text-yellow-500' : 'text-gray-400'
              }`;
              icon.innerHTML = isUnlocked ? '<Trophy />' : '<Lock />';
              parent.appendChild(icon);
            }
          }}
        />
        {!isUnlocked && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Lock className="w-4 h-4 text-gray-600" />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className={`font-medium ${isUnlocked ? 'text-gray-900' : 'text-gray-500'} text-sm`}>
          {badge.name}
        </p>
        <p className={`text-xs ${isUnlocked ? 'text-gray-600' : 'text-gray-400'} mt-1`}>
          {badge.description}
        </p>
      </div>
    </div>
  );
}
