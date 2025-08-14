
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface BrandReviewsProps {
  brand: {
    brand_id: string;
    brand_name: string;
    rating_avg: number;
    total_reviews: number;
  };
}

export function BrandReviews({ brand }: BrandReviewsProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest" | "lowest">("newest");

  // Fetch actual reviews from database ONLY
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['brand-reviews', brand.brand_id, sortBy],
    queryFn: async () => {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          users!inner(name)
        `)
        .eq('brand_id', brand.brand_id)
        .eq('status', 'approved');

      // Apply sorting
      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'highest':
          query = query.order('rating', { ascending: false });
          break;
        case 'lowest':
          query = query.order('rating', { ascending: true });
          break;
      }

      const { data, error } = await query;
      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      return data || [];
    },
  });

  // Calculate actual rating summary from database ONLY
  const { data: ratingSummary } = useQuery({
    queryKey: ['rating-summary', brand.brand_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('brand_id', brand.brand_id)
        .eq('status', 'approved');

      if (error) {
        console.error('Error fetching rating summary:', error);
        throw error;
      }

      const ratings = data || [];
      const distribution = [0, 0, 0, 0, 0]; // [1-star, 2-star, 3-star, 4-star, 5-star]
      
      ratings.forEach(review => {
        if (review.rating >= 1 && review.rating <= 5) {
          distribution[review.rating - 1]++;
        }
      });

      const totalRatings = ratings.length;
      const averageRating = totalRatings > 0 
        ? ratings.reduce((sum, review) => sum + review.rating, 0) / totalRatings 
        : 0;

      return {
        distribution: distribution.map((count, index) => ({
          rating: index + 1,
          count,
          percentage: totalRatings > 0 ? (count / totalRatings) * 100 : 0
        })).reverse(), // Show 5-star first
        totalRatings,
        averageRating
      };
    },
  });

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/write-review/${brand.brand_id}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const actualRatingAvg = ratingSummary?.averageRating || 0;
  const actualTotalReviews = ratingSummary?.totalRatings || 0;
  const ratingDistribution = ratingSummary?.distribution || [];

  return (
    <div className="space-y-6">
      {/* Rating Summary - Only show actual data */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Reviews & Ratings
            </CardTitle>
            <Button onClick={handleWriteReview} className="gap-2">
              <Plus className="w-4 h-4" />
              Write Review
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {actualTotalReviews > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Overall Rating */}
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">
                  {actualRatingAvg.toFixed(1)}
                </div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(actualRatingAvg)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600">
                  Based on {actualTotalReviews} {actualTotalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>

              {/* Rating Distribution */}
              <div className="space-y-2">
                {ratingDistribution.map((item) => (
                  <div key={item.rating} className="flex items-center gap-2">
                    <span className="text-sm w-8 flex-shrink-0">{item.rating}★</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right flex-shrink-0">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600 mb-4">
                Be the first to share your experience with {brand.brand_name}
              </p>
              <Button onClick={handleWriteReview} className="gap-2">
                <Plus className="w-4 h-4" />
                Write First Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List - Only show if there are actual reviews */}
      {actualTotalReviews > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle>All Reviews ({reviews?.length || 0})</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-sm border rounded px-2 py-1 bg-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <ReviewCard key={review.review_id} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No reviews available
                </h3>
                <p className="text-gray-600 mb-4">
                  Reviews are being moderated or none have been submitted yet.
                </p>
                <Button onClick={handleWriteReview} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Write First Review
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
