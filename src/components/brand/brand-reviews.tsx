
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";
import { Brand } from "@/types";

interface BrandReviewsProps {
  brand: Brand;
}

export function BrandReviews({ brand }: BrandReviewsProps) {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['brand-reviews', brand.brand_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users!inner(name)
        `)
        .eq('brand_id', brand.brand_id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }
      
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-900">Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-center py-8">No reviews yet. Be the first to review!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-900">Customer Reviews</CardTitle>
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center">
            <div className="flex items-center mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(brand.rating_avg)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium text-gray-900">{brand.rating_avg.toFixed(1)}</span>
          </div>
          <span className="text-sm text-gray-600">({brand.total_reviews} reviews)</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {reviews.map((review) => (
          <div key={review.review_id} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-sm text-gray-900">{review.users?.name || 'Anonymous'}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {review.category}
                    </Badge>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">{review.review_text}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
