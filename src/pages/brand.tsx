
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { mockBrands, mockReviews } from "@/data/mockData";
import { Rating } from "@/components/ui/rating";
import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { Review, ReviewCategory } from "@/types";
import { Globe, Mail, Phone, MessageSquare, BadgeHelp, Instagram, Facebook, Twitter, Linkedin } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export default function BrandPage() {
  const { brandId } = useParams<{ brandId: string }>();
  const { isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ReviewCategory | "all">("all");
  
  // Fetch brand data
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
  
  // Fetch reviews for this brand
  const { data: reviews = [], isLoading: isReviewsLoading } = useQuery({
    queryKey: ['brand-reviews', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      
      console.log("Fetching reviews for brand ID:", brandId);
      
      // Try to get reviews from Supabase
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('brand_id', brandId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching reviews:", error);
        // Fallback to mock data for development
        const mockBrandReviews = mockReviews.filter(
          (review) => review.brand_id === brandId && review.status === "approved"
        );
        console.log("Fallback to mock reviews:", mockBrandReviews);
        return mockBrandReviews;
      }
      
      console.log("Reviews data from Supabase:", data);
      return data;
    },
    enabled: !!brandId,
  });
  
  // Filter reviews by category
  const filteredReviews = selectedCategory === "all"
    ? reviews
    : reviews.filter((review) => review.category === selectedCategory);
    
  // Get unique review categories for this brand
  const reviewCategories = Array.from(
    new Set(reviews.map((review) => review.category))
  );
  
  // If brand is loading
  if (isBrandLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      </div>
    );
  }
  
  // If brand not found
  if (!brand) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Brand not found</h1>
        <p className="mb-6">The brand you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Brand Header */}
      <section className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="grid md:grid-cols-[200px_1fr] gap-6">
          <div className="flex items-center justify-center">
            <img
              src={brand.logo_url}
              alt={brand.brand_name}
              className="max-w-full max-h-[150px] object-contain"
            />
          </div>
          
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold">{brand.brand_name}</h1>
              <div className="flex items-center gap-2">
                <Rating value={brand.rating_avg} size="lg" />
                <span className="text-sm font-medium">({brand.rating_avg.toFixed(1)})</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Category: <span className="font-medium">{brand.category}</span> · 
              <span className="ml-2">{brand.total_reviews} reviews</span>
            </p>
            
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="default" size="sm" className="gap-2">
                <Link to={`/write-review/${brandId}`}>
                  <MessageSquare className="h-4 w-4" />
                  Write a Review
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Service Info Section */}
      <section className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Customer Service Information</h2>
        
        <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
          {brand.toll_free_number && (
            <div className="flex items-center gap-3">
              <div className="bg-brandblue-100 p-2 rounded-full">
                <Phone className="h-5 w-5 text-brandblue-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Toll-Free Number</p>
                <p className="font-medium">{brand.toll_free_number}</p>
              </div>
            </div>
          )}
          
          {brand.support_email && (
            <div className="flex items-center gap-3">
              <div className="bg-brandblue-100 p-2 rounded-full">
                <Mail className="h-5 w-5 text-brandblue-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Support</p>
                <p className="font-medium">{brand.support_email}</p>
              </div>
            </div>
          )}
          
          {brand.website_url && (
            <div className="flex items-center gap-3">
              <div className="bg-brandblue-100 p-2 rounded-full">
                <Globe className="h-5 w-5 text-brandblue-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Official Website</p>
                <a 
                  href={brand.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-brandblue-600 hover:underline"
                >
                  {brand.website_url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
          
          {brand.complaint_page_url && (
            <div className="flex items-center gap-3">
              <div className="bg-brandblue-100 p-2 rounded-full">
                <BadgeHelp className="h-5 w-5 text-brandblue-700" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Complaint Portal</p>
                <a 
                  href={brand.complaint_page_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-medium text-brandblue-600 hover:underline"
                >
                  {brand.complaint_page_url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            </div>
          )}
        </div>
        
        {/* Social Media Links */}
        {(brand.facebook_url || brand.twitter_url || brand.instagram_url || brand.linkedin_url) && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Social Media Support
            </h3>
            
            <div className="flex flex-wrap gap-3">
              {brand.facebook_url && (
                <a 
                  href={brand.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              
              {brand.twitter_url && (
                <a 
                  href={brand.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              
              {brand.instagram_url && (
                <a 
                  href={brand.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              
              {brand.linkedin_url && (
                <a 
                  href={brand.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Reviews Section */}
      <section className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl font-bold">Reviews</h2>
          
          <Button asChild variant="default" size="sm" className="gap-2">
            <Link to={`/write-review/${brandId}`}>
              <MessageSquare className="h-4 w-4" />
              Write a Review
            </Link>
          </Button>
        </div>
        
        {/* Category Filter */}
        {reviewCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <Button 
              variant={selectedCategory === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All Reviews
            </Button>
            
            {reviewCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        )}
        
        {/* Reviews List */}
        {isReviewsLoading ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              {reviews.length === 0
                ? "No reviews yet. Be the first to write one!"
                : "No reviews found for this category."}
            </p>
            
            {reviews.length === 0 && (
              <Button asChild variant="outline" className="mt-4">
                <Link to={`/write-review/${brandId}`}>Write a Review</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.review_id} review={review} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
