
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: {
    review_id: string;
    rating: number;
    review_text: string;
    created_at: string;
    status: string;
    user_id: string;
    users?: {
      name: string;
    } | null;
    brands?: {
      brand_name: string;
      logo_url: string;
    } | null;
  };
  showBrand?: boolean;
}

export function ReviewCard({ review, showBrand = false }: ReviewCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const userName = review.users?.name || 'Anonymous User';
  const timeAgo = formatDistanceToNow(new Date(review.created_at), { addSuffix: true });

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{userName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {timeAgo}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <Badge className={`text-xs ${getStatusColor(review.status)}`}>
              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
            </Badge>
          </div>
        </div>
        
        {showBrand && review.brands && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t">
            <img
              src={review.brands.logo_url}
              alt={review.brands.brand_name}
              className="w-6 h-6 object-contain"
            />
            <span className="text-sm font-medium text-gray-700">
              {review.brands.brand_name}
            </span>
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-700 leading-relaxed">
          {review.review_text}
        </p>
      </CardContent>
    </Card>
  );
}
