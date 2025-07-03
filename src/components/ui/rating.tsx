
import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Rating({ value, max = 5, size = "md", className }: RatingProps) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;
  const emptyStars = max - fullStars - (hasHalfStar ? 1 : 0);
  
  const starSizes = {
    sm: { width: 16, height: 16 },
    md: { width: 20, height: 20 },
    lg: { width: 24, height: 24 },
  };
  
  const { width, height } = starSizes[size];
  
  return (
    <div className={cn("flex items-center", className)}>
      {[...Array(fullStars)].map((_, i) => (
        <Star
          key={`full-star-${i}`}
          className="text-yellow-400 fill-yellow-400"
          width={width}
          height={height}
        />
      ))}
      
      {hasHalfStar && (
        <StarHalf
          className="text-yellow-400 fill-yellow-400"
          width={width}
          height={height}
        />
      )}
      
      {[...Array(emptyStars)].map((_, i) => (
        <Star
          key={`empty-star-${i}`}
          className="text-gray-300"
          width={width}
          height={height}
        />
      ))}
    </div>
  );
}
