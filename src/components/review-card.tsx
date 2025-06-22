
import { Rating } from "./ui/rating";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Review } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "./ui/badge";

interface ReviewCardProps {
  review: Review;
  showActions?: boolean;
  onDelete?: (id: string) => void;
  onUpdate?: () => void;
}

export function ReviewCard({ review, showActions = false, onDelete, onUpdate }: ReviewCardProps) {
  const formattedDate = formatDistanceToNow(new Date(review.created_at), { addSuffix: true });
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Rating value={review.rating} size="md" />
              <Badge variant="outline" className="text-xs">
                {review.category}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formattedDate}
            </p>
          </div>
          
          {review.status === "pending" && (
            <Badge variant="secondary">Pending</Badge>
          )}
        </div>
        
        <p className="mt-4 text-sm">{review.review_text}</p>
        
        {review.screenshot_url && (
          <div className="mt-4">
            <img 
              src={review.screenshot_url} 
              alt="Review screenshot" 
              className="max-h-48 rounded border"
            />
          </div>
        )}
      </CardContent>
      
      {showActions && (
        <CardFooter className="flex justify-end gap-2 pt-2 pb-4">
          <button
            onClick={() => onDelete?.(review.review_id)}
            className="text-sm text-destructive hover:underline"
          >
            Delete
          </button>
        </CardFooter>
      )}
    </Card>
  );
}
