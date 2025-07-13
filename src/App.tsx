
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import Index from "@/pages/Index";
import HomePage from "@/pages/home";
import BrandPage from "@/pages/brand";
import BrandsPage from "@/pages/brands";
import AboutPage from "@/pages/about";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ResetPasswordPage from "@/pages/reset-password";
import WriteReviewPage from "@/pages/write-review";
import MyReviewsPage from "@/pages/my-reviews";
import SurveyPage from "@/pages/survey";
import SubcategoryPage from "@/pages/subcategory";
import BlogPage from "@/pages/blog";
import BlogsPage from "@/pages/blogs";
import NotFoundPage from "@/pages/NotFound";
import AdminLayout from "@/components/admin/layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminBrands from "@/pages/admin/brands";
import AdminReviews from "@/pages/admin/reviews";
import AdminUsers from "@/pages/admin/users";
import AdminBlogs from "@/pages/admin/blogs";
import AdminSEO from "@/pages/admin/seo";
import AdminAnnouncements from "@/pages/admin/announcements";
import SitemapPage from "@/pages/sitemap";
import { UserDashboard } from "@/components/user-dashboard";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import { VisitorTracker } from "@/components/analytics/visitor-tracker";
import { PageLayout } from "@/components/layout/page-layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  console.log('App component rendering...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <GoogleAnalytics />
            <GoogleTagManager />
            <VisitorTracker />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/brands" element={<PageLayout><BrandsPage /></PageLayout>} />
              <Route path="/brand/:brandId" element={<PageLayout><BrandPage /></PageLayout>} />
              <Route path="/about" element={<PageLayout><AboutPage /></PageLayout>} />
              <Route path="/login" element={<PageLayout><LoginPage /></PageLayout>} />
              <Route path="/register" element={<PageLayout><RegisterPage /></PageLayout>} />
              <Route path="/reset-password" element={<PageLayout><ResetPasswordPage /></PageLayout>} />
              <Route path="/write-review/:brandId" element={<PageLayout><WriteReviewPage /></PageLayout>} />
              <Route path="/my-reviews" element={<PageLayout><MyReviewsPage /></PageLayout>} />
              <Route path="/dashboard" element={<PageLayout><UserDashboard /></PageLayout>} />
              <Route path="/survey" element={<PageLayout><SurveyPage /></PageLayout>} />
              <Route path="/category/:category" element={<PageLayout><SubcategoryPage /></PageLayout>} />
              <Route path="/blog/:slug" element={<PageLayout><BlogPage /></PageLayout>} />
              <Route path="/blogs" element={<PageLayout><BlogsPage /></PageLayout>} />
              <Route path="/sitemap" element={<PageLayout><SitemapPage /></PageLayout>} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="brands" element={<AdminBrands />} />
                <Route path="reviews" element={<AdminReviews />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="blogs" element={<AdminBlogs />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
                <Route path="seo" element={<AdminSEO />} />
              </Route>
              <Route path="*" element={<PageLayout><NotFoundPage /></PageLayout>} />
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
