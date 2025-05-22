
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AdminLayout } from "@/components/admin/layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Check,
  X,
  AlertTriangle,
  MoreHorizontal,
  EyeIcon 
} from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { mockReviews, mockBrands } from "@/data/mockData";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
  const { user, isAuthenticated } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  
  // Join reviews with brands
  const reviews = mockReviews.map(review => {
    const brand = mockBrands.find(b => b.brand_id === review.brand_id);
    return {
      ...review,
      brand_name: brand?.brand_name || "Unknown Brand",
      brand_logo: brand?.logo_url
    };
  });
  
  // Filter reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.review_text.toLowerCase().includes(searchQuery.toLowerCase()) || 
      review.brand_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // If not admin, don't render
  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }
  
  return (
    <AdminLayout title="Review Moderation" active="reviews">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
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
      <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="py-3 px-4 text-left">Brand</th>
                <th className="py-3 px-4 text-left">Review</th>
                <th className="py-3 px-4 text-left">Rating</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr key={review.review_id} className="border-b last:border-0">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={review.brand_logo || "/placeholder.svg"}
                        alt={review.brand_name}
                        className="w-6 h-6 object-contain"
                      />
                      <span>{review.brand_name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="max-w-xs truncate">
                      {review.review_text}
                    </div>
                  </td>
                  <td className="py-3 px-4">{review.rating}/5</td>
                  <td className="py-3 px-4">
                    <div className={cn(
                      "px-2 py-1 text-xs rounded-full font-medium inline-block",
                      {
                        "bg-yellow-100 text-yellow-800": review.status === "pending",
                        "bg-green-100 text-green-800": review.status === "approved",
                        "bg-red-100 text-red-800": review.status === "rejected",
                      }
                    )}>
                      {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(review.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" title="View">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      
                      {review.status === "pending" && (
                        <>
                          <Button variant="ghost" size="icon" className="text-green-600" title="Approve">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600" title="Reject">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {review.status !== "pending" && (
                        <Button variant="ghost" size="icon" title="More">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-500">
                    No reviews found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
