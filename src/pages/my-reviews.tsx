
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Clock, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Review {
  review_id: string;
  brand_id: string;
  rating: number;
  category: string;
  review_text: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  brands: {
    brand_name: string;
    logo_url: string;
  };
}

export default function MyReviewsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchReviews();
  }, [isAuthenticated, user, navigate]);

  const fetchReviews = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          review_id,
          brand_id,
          rating,
          category,
          review_text,
          status,
          created_at,
          brands!inner (
            brand_name,
            logo_url
          )
        `)
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching reviews:', error);
        return;
      }

      // Transform the data to match our interface
      const transformedReviews = data?.map((review: any) => ({
        review_id: review.review_id,
        brand_id: review.brand_id,
        rating: review.rating,
        category: review.category,
        review_text: review.review_text,
        status: review.status,
        created_at: review.created_at,
        brands: Array.isArray(review.brands) ? review.brands[0] : review.brands
      })) || [];

      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Reviews</h1>
              <p className="text-gray-600 mt-2">
                Track and manage all your brand reviews
              </p>
            </div>
            <Button 
              onClick={() => navigate('/brands')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Write New Review
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-lg text-gray-500 mt-4">Loading your reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="max-w-md mx-auto">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Star className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Start sharing your experiences with brands and help other consumers make informed decisions.
                  </p>
                  <Button onClick={() => navigate('/brands')}>
                    Write Your First Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.review_id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <img
                          src={review.brands.logo_url}
                          alt={review.brands.brand_name}
                          className="w-12 h-12 rounded-lg object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <div>
                          <CardTitle className="text-lg">{review.brands.brand_name}</CardTitle>
                          <div className="flex items-center gap-4 mt-1">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="text-sm font-medium ml-1">
                                {review.rating}/5
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {review.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(review.status)} text-xs`}>
                        {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {review.review_text}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(review.created_at), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(new Date(review.created_at), 'HH:mm')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
