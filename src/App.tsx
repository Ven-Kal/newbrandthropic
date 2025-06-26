import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/AuthContext";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { GoogleTagManager } from "@/components/analytics/google-tag-manager";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import BrandsPage from "@/pages/brands";
import BrandPage from "@/pages/brand";
import WriteReviewPage from "@/pages/write-review";
import HomePage from "@/pages/home";
import AboutPage from "@/pages/about";
import { AdminLayout } from "@/components/admin/layout";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminBrands from "@/pages/admin/brands";
import AdminReviews from "@/pages/admin/reviews";
import AdminUsers from "@/pages/admin/users";
import AdminBlogs from "@/pages/admin/blogs";
import AdminSEOPage from "@/pages/admin/seo";
import { PageLayout } from "@/components/layout/page-layout"; // ✅ Added this import

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* Analytics Components - Replace with your actual IDs */}
        <GoogleAnalytics measurementId="GA_MEASUREMENT_ID" />
        <GoogleTagManager gtmId="GTM_CONTAINER_ID" />

        <div className="min-h-screen bg-background font-sans antialiased">
          <Routes>
            {/* Public Routes inside layout with Navbar + Footer */}
            <Route element={<PageLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/brands" element={<BrandsPage />} />
              <Route path="/brand/:brandId" element={<BrandPage />} />
              <Route path="/write-review/:brandId" element={<WriteReviewPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<HomePage />} />
            </Route>

            {/* Admin Routes (no navbar/footer) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="brands" element={<AdminBrands />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="seo" element={<AdminSEOPage />} />
            </Route>
          </Routes>
        </div>

        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
