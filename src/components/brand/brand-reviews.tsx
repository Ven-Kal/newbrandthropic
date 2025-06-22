
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReviewCard } from "@/components/review-card";
import { Star, Edit, MessageSquare } from "lucide-react";
import { Brand } from "@/types";

interface BrandReviewsProps {
  brand: Brand;
  onRatingUpdate?: () => void;
}

export function BrandReviews({ brand, onRatingUpdate }: BrandReviewsProps) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 6;

  // Fetch reviews for this brand
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['brand-reviews', brand.brand_id, currentPage],
    queryFn: async () => {
      const offset = (currentPage - 1) * reviewsPerPage;
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users:user_id (
            name,
            email
          )
        `)
        .eq('brand_id', brand.brand_id)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .range(offset, offset + reviewsPerPage - 1);

      if (error) {
        console.error('Error fetching reviews:', error);
        return [];
      }

      return data || [];
    },
  });

  // Get total count for pagination
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['brand-reviews-count', brand.brand_id],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('reviews')
        .select('*', { count: 'exact', head: true })
        .eq('brand_id', brand.brand_id)
        .eq('status', 'approved');

      if (error) {
        console.error('Error fetching review count:', error);
        return 0;
      }

      return count || 0;
    },
  });

  const totalPages = Math.ceil(totalCount / reviewsPerPage);

  const handleWriteReview = () => {
    navigate(`/write-review/${brand.brand_id}`);
  };

  // Call onRatingUpdate when a new review might affect the rating
  const handleReviewUpdate = () => {
    if (onRatingUpdate) {
      onRatingUpdate();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Customer Reviews
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(brand.rating_avg)
                          ? "text-orange-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-lg ml-2">
                  {brand.rating_avg > 0 ? brand.rating_avg.toFixed(1) : 'No ratings yet'}
                </span>
              </div>
              <Badge variant="secondary">
                {brand.total_reviews} {brand.total_reviews === 1 ? 'review' : 'reviews'}
              </Badge>
            </div>
          </div>
          
          <Button onClick={handleWriteReview} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Write Review
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-gray-500 mt-2">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No reviews yet</h3>
            <p className="text-gray-500 mb-4">
              Be the first to share your experience with {brand.brand_name}
            </p>
            <Button onClick={handleWriteReview}>
              Write the First Review
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 mb-6">
              {reviews.map((review) => (
                <ReviewCard 
                  key={review.review_id} 
                  review={review} 
                  onUpdate={handleReviewUpdate}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
