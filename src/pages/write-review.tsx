
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { mockBrands } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Review, ReviewCategory } from "@/types";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";

export default function WriteReviewPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form states
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [category, setCategory] = useState<ReviewCategory | "">("");
  const [reviewText, setReviewText] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  // Fetch brand details
  const { data: brand, isLoading: isBrandLoading } = useQuery({
    queryKey: ['brand', brandId],
    queryFn: async () => {
      if (!brandId) return null;
      
      console.log("Fetching brand with ID:", brandId);
      
      // Try to get brand from Supabase
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('brand_id', brandId)
        .single();
      
      if (error) {
        console.error("Error fetching brand:", error);
        // Fallback to mock data for development
        const mockBrand = mockBrands.find((b) => b.brand_id === brandId);
        console.log("Fallback to mock brand:", mockBrand);
        return mockBrand;
      }
      
      console.log("Brand data from Supabase:", data);
      return data;
    },
    enabled: !!brandId,
  });
  
  // Category options
  const categories: ReviewCategory[] = [
    "customer service",
    "broadband",
    "billing",
    "delivery",
    "product quality"
  ];
  
  // Handle rating change
  const handleRatingChange = (value: number) => {
    setRating(value);
  };
  
  // Handle screenshot upload
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setScreenshot(e.target.files[0]);
    }
  };
  
  // Submit review
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Validation
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    if (!rating) {
      setError("Please select a rating");
      return;
    }
    
    if (!category) {
      setError("Please select a category");
      return;
    }
    
    if (!reviewText.trim()) {
      setError("Please write a review");
      return;
    }
    
    // Submit the review
    setIsSubmitting(true);
    
    try {
      let screenshotUrl: string | undefined = undefined;
      
      // If there's a screenshot, upload it to Supabase Storage
      if (screenshot) {
        // First check if storage bucket exists, if not create it
        const { data: buckets } = await supabase.storage.listBuckets();
        const reviewBucket = buckets?.find(b => b.name === 'review-screenshots');
        
        if (!reviewBucket) {
          console.log("Creating review-screenshots bucket");
          const { error: bucketError } = await supabase.storage.createBucket('review-screenshots', {
            public: true
          });
          
          if (bucketError) {
            console.error("Error creating bucket:", bucketError);
          }
        }
        
        const fileName = `${user!.user_id}/${Date.now()}-${screenshot.name}`;
        const { data: fileData, error: fileError } = await supabase.storage
          .from('review-screenshots')
          .upload(fileName, screenshot);
          
        if (fileError) {
          throw new Error(`Screenshot upload failed: ${fileError.message}`);
        }
        
        // Get public URL
        const { data: urlData } = supabase.storage
          .from('review-screenshots')
          .getPublicUrl(fileName);
          
        screenshotUrl = urlData.publicUrl;
      }
      
      console.log("Submitting review with brandId:", brandId);
      
      // Insert review into the database
      const { data, error } = await supabase.from('reviews').insert({
        user_id: user!.user_id,
        brand_id: brandId,
        rating,
        category: category as ReviewCategory,
        review_text: reviewText,
        screenshot_url: screenshotUrl,
        status: "pending", // New reviews are pending by default
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }).select();
      
      if (error) {
        console.error("Review submission error:", error);
        throw new Error(`Review submission failed: ${error.message}`);
      }
      
      // Update brand rating average and total reviews
      // In a real app this would be handled by a database trigger or function
      // For now, we'll update it manually
      if (brand) {
        const newTotalReviews = (brand.total_reviews || 0) + 1;
        const newAvgRating = ((brand.rating_avg || 0) * (newTotalReviews - 1) + rating) / newTotalReviews;
        
        const { error: brandError } = await supabase
          .from('brands')
          .update({
            rating_avg: newAvgRating,
            total_reviews: newTotalReviews,
            updated_at: new Date().toISOString()
          })
          .eq('brand_id', brandId);
          
        if (brandError) {
          console.error('Failed to update brand rating:', brandError);
        }
      }
      
      // Show success toast
      toast({
        title: "Review submitted",
        description: "Your review has been submitted and is pending approval.",
      });
      
      // Navigate back to the brand page
      navigate(`/brand/${brandId}`);
    } catch (err: any) {
      setError(err.message || "Failed to submit review. Please try again.");
      toast({
        title: "Error",
        description: err.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If brand not found
  if (isBrandLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Brand not found</h1>
        <p className="mb-6">The brand you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <a href="/">Return to Home</a>
        </Button>
      </div>
    );
  }

  // If user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Login Required</CardTitle>
            <CardDescription>
              You need to be logged in to write a review
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button 
              onClick={() => navigate("/login")}
              className="w-full"
            >
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Write a Review</CardTitle>
          <CardDescription>
            Share your experience with {brand.brand_name}
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Brand Info */}
            <div className="flex items-center gap-4">
              <img
                src={brand.logo_url}
                alt={brand.brand_name}
                className="w-16 h-16 object-contain"
              />
              <div>
                <h3 className="font-medium">{brand.brand_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {brand.category}
                </p>
              </div>
            </div>
            
            {/* Rating */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRatingChange(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        (hoverRating !== null
                          ? value <= hoverRating
                          : value <= rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as ReviewCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Review Text */}
            <div className="space-y-2">
              <label htmlFor="reviewText" className="text-sm font-medium">
                Your Review
              </label>
              <Textarea
                id="reviewText"
                placeholder="Write about your experience..."
                rows={5}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
            
            {/* Screenshot Upload */}
            <div className="space-y-2">
              <label htmlFor="screenshot" className="text-sm font-medium">
                Screenshot (optional)
              </label>
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleScreenshotChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-muted-foreground">
                You can upload a screenshot of your interaction with the brand
              </p>
            </div>
            
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/brand/${brandId}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !rating || !category || !reviewText.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
