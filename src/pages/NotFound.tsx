
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { EnhancedSEOHead } from "@/components/seo/enhanced-seo-head";
import { PageHeader } from "@/components/seo/page-header";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const path = location.pathname;

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Handle review paths automatically
    if (path.includes("/brand/") && path.includes("/review")) {
      const brandId = path.split("/brand/")[1]?.split("/review")[0];
      if (brandId) {
        navigate(`/write-review/${brandId}`, { replace: true });
      }
    }
  }, [location.pathname, navigate, path]);

  // Check if the path contains "review" to provide better guidance
  const isReviewRelated = path.includes("review");
  const isWriteReviewPath = path.includes("write-review");
  
  // Extract brand ID from the path if it's a review-related path
  const brandId = isWriteReviewPath ? 
    path.split("/").pop() : 
    path.includes("/brand/") ? path.split("/brand/")[1]?.split("/")[0] : null;

  return (
    <>
      <EnhancedSEOHead
        title="Page Not Found - 404 | Brandthropic"
        description="The page you're looking for doesn't exist. Find customer service information and reviews for thousands of brands on Brandthropic."
        noIndex={true}
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <PageHeader 
            title="404"
            description="Page not found"
            className="mb-6"
          />
          
          {isReviewRelated && (
            <div className="mb-6 text-left bg-blue-50 p-4 rounded-md">
              {!isAuthenticated ? (
                <>
                  <p className="text-sm text-blue-800 mb-2">
                    Looking to write a review? You need to be logged in first.
                  </p>
                  <div className="flex justify-center mt-2 space-x-4">
                    <Button asChild size="sm">
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
                </>
              ) : brandId ? (
                <>
                  <p className="text-sm text-blue-800 mb-2">
                    Ready to write a review?
                  </p>
                  <div className="flex justify-center mt-2">
                    <Button asChild size="sm">
                      <Link to={`/write-review/${brandId}`}>Write Review</Link>
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-blue-800">
                  There was an issue with this review link. Please try accessing the brand page first.
                </p>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link to="/">Return to Home</Link>
            </Button>
            
            <Button 
              type="button"
              variant="outline" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
