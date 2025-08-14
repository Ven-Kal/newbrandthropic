
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { PageLayout } from "@/components/layout/page-layout";

interface Brand {
  brand_id: string;
  brand_name: string;
  logo_url: string;
  category: string;
}

export default function WriteReviewPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (brandId) {
      fetchBrand();
    }
  }, [brandId, isAuthenticated, navigate]);

  const fetchBrand = async () => {
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('brand_id, brand_name, logo_url, category')
        .eq('brand_id', brandId)
        .single();

      if (error) {
        console.error('Error fetching brand:', error);
        toast.error('Brand not found');
        navigate('/brands');
        return;
      }

      setBrand(data);
    } catch (error) {
      console.error('Error fetching brand:', error);
      toast.error('Failed to load brand information');
      navigate('/brands');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !brand) return;

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!reviewText.trim()) {
      toast.error('Please write your review');
      return;
    }

    setSubmitting(true);

    try {
      let screenshotUrl = null;

      // Upload screenshot if provided
      if (screenshot) {
        const fileName = `${Date.now()}-${screenshot.name}`;
        const { error: uploadError } = await supabase.storage
          .from('review-screenshots')
          .upload(fileName, screenshot);

        if (uploadError) {
          console.error('Error uploading screenshot:', uploadError);
          toast.error('Failed to upload screenshot');
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('review-screenshots')
          .getPublicUrl(fileName);

        screenshotUrl = publicUrl;
      }

      // Create review
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          user_id: user.user_id,
          brand_id: brand.brand_id,
          rating,
          category: brand.category,
          review_text: reviewText.trim(),
          screenshot_url: screenshotUrl,
          status: 'pending'
        });

      if (reviewError) {
        console.error('Error creating review:', reviewError);
        toast.error('Failed to submit review');
        return;
      }

      toast.success('Review submitted successfully! It will be reviewed before being published.');
      navigate('/my-reviews');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-lg text-gray-500 mt-4">Loading brand information...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!brand) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Brand not found</h1>
            <p className="text-gray-600 mb-4">The brand you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/brands')}>
              Browse Brands
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a Review</h1>
              <p className="text-gray-600">Share your experience with {brand.brand_name}</p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <img
                    src={brand.logo_url}
                    alt={brand.brand_name}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <div>
                    <CardTitle className="text-xl">{brand.brand_name}</CardTitle>
                    <p className="text-gray-600">{brand.category}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Rating *</Label>
                    <div className="flex items-center gap-2 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="p-1 hover:scale-110 transition-transform"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= (hoverRating || rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="text-sm text-gray-600 ml-2">
                          {rating} out of 5 stars
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="review-text" className="text-base font-medium">
                      Your Review *
                    </Label>
                    <Textarea
                      id="review-text"
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with this brand's customer service..."
                      className="mt-2 min-h-[120px]"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-base font-medium">
                      Screenshot (Optional)
                    </Label>
                    <p className="text-sm text-gray-600 mt-1 mb-3">
                      Upload a screenshot to support your review
                    </p>
                    
                    {previewUrl ? (
                      <div className="relative inline-block">
                        <img
                          src={previewUrl}
                          alt="Screenshot preview"
                          className="max-w-full h-48 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={removeScreenshot}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, GIF up to 10MB
                        </p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleScreenshotChange}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/brands')}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || rating === 0 || !reviewText.trim()}
                    >
                      {submitting ? 'Submitting...' : 'Submit Review'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
