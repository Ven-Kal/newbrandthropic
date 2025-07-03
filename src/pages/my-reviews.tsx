
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ReviewCard } from "@/components/review-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { mockReviews } from "@/data/mockData";

export default function MyReviewsPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
  
  // Fetch user's reviews
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['myReviews', user?.user_id],
    queryFn: async () => {
      if (!user) return [];
      
      // Try to get reviews from Supabase
      const { data, error } = await supabase
        .from('reviews')
        .select('*, brands(brand_name, logo_url)')
        .eq('user_id', user.user_id)
        .order('created_at', { ascending: false });
      
      if (error || !data) {
        // Fallback to mock data for development
        return mockReviews.filter(review => review.user_id === user.user_id);
      }
      
      return data;
    },
    enabled: isAuthenticated,
  });
  
  // Filter reviews by status
  const filteredReviews = activeTab === "all"
    ? reviews
    : reviews?.filter(review => review.status === activeTab);
  
  // If user is not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-md">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h1 className="text-2xl font-bold mb-4">Login Required</h1>
          <p className="mb-6 text-muted-foreground">
            You need to be logged in to view your reviews
          </p>
          <Button onClick={() => navigate("/login")}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Reviews</h1>
      
      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "all" | "pending" | "approved" | "rejected")}
        className="mb-6"
      >
        <TabsList>
          <TabsTrigger value="all">All Reviews</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {isLoading ? (
        <div className="text-center py-12">
          <p>Loading your reviews...</p>
        </div>
      ) : filteredReviews && filteredReviews.length > 0 ? (
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <div key={review.review_id} className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img
                    src={review.brands?.logo_url || "/placeholder.svg"}
                    alt={review.brands?.brand_name || "Brand"}
                    className="w-10 h-10 object-contain"
                  />
                  <span className="font-medium">{review.brands?.brand_name}</span>
                </div>
                
                <div className="px-2 py-1 text-xs rounded-full font-medium 
                  ${review.status === 'approved' ? 'bg-green-100 text-green-800' : 
                    review.status === 'rejected' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'}">
                  {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                </div>
              </div>
              
              <ReviewCard review={review} />
              
              {review.status === 'rejected' && (
                <div className="mt-4 p-3 bg-red-50 text-red-800 rounded-md text-sm">
                  <p className="font-medium">Rejection reason:</p>
                  <p>This review violates our community guidelines.</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">No reviews found</h2>
          <p className="text-muted-foreground mb-6">
            You haven't submitted any {activeTab !== "all" ? activeTab : ""} reviews yet.
          </p>
          <Button asChild>
            <a href="/">Explore Brands</a>
          </Button>
        </div>
      )}
    </div>
  );
}
