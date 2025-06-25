import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Check,
  X,
  EyeIcon 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReviewWithBrand {
  review_id: string;
  rating: number;
  review_text: string;
  status: string;
  created_at: string;
  category: string;
  brand_name: string;
  brand_logo: string;
  user_name: string;
}

export default function AdminReviewsPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [reviews, setReviews] = useState<ReviewWithBrand[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch reviews from database
  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          review_id,
          rating,
          review_text,
          status,
          created_at,
          category,
          brands(brand_name, logo_url),
          users(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reviews:', error);
        toast({
          title: "Error fetching reviews",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      // Transform data
      const transformedReviews: ReviewWithBrand[] = (data || []).map(review => ({
        review_id: review.review_id,
        rating: review.rating,
        review_text: review.review_text,
        status: review.status,
        created_at: review.created_at,
        category: review.category,
        brand_name: (review.brands as any)?.brand_name || "Unknown Brand",
        brand_logo: (review.brands as any)?.logo_url || "/placeholder.svg",
        user_name: (review.users as any)?.name || "Anonymous"
      }));
      
      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchReviews();
    }
  }, [isAuthenticated, user]);
  
  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.review_text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      review.brand_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.user_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle review status update
  const updateReviewStatus = async (reviewId: string, newStatus: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('review_id', reviewId);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setReviews(reviews.map(review => 
        review.review_id === reviewId 
          ? { ...review, status: newStatus }
          : review
      ));
      
      toast({
        title: "Review updated",
        description: `Review has been ${newStatus}`,
      });
      
    } catch (error: any) {
      toast({
        title: "Error updating review",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // If not admin, don't render
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
        <p className="text-gray-600 mt-2">
          Moderate and manage user reviews across all brands.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search reviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Reviews Table */}
      <div className="bg-white border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">Loading reviews...</div>
                </TableCell>
              </TableRow>
            ) : filteredReviews.length > 0 ? (
              filteredReviews.map((review) => (
                <TableRow key={review.review_id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={review.brand_logo}
                        alt={review.brand_name}
                        className="w-6 h-6 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                      <span className="text-sm">{review.brand_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{review.user_name}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate text-sm">
                      {review.review_text}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{review.rating}/5</TableCell>
                  <TableCell className="text-sm capitalize">{review.category}</TableCell>
                  <TableCell>
                    <div className={cn(
                      "px-2 py-1 text-xs rounded-full font-medium inline-block",
                      {
                        "bg-white text-gray-800 border border-gray-200": review.status === "pending",
                        "bg-green-100 text-green-800": review.status === "approved",
                        "bg-red-100 text-red-800": review.status === "rejected",
                      }
                    )}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(review.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {review.status === "pending" && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-green-600 hover:text-green-700" 
                            onClick={() => updateReviewStatus(review.review_id, "approved")}
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700" 
                            onClick={() => updateReviewStatus(review.review_id, "rejected")}
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  No reviews found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
